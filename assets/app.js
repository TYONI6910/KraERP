/* =====================================================================
   KARA Portuaire V2.0.121 - Moteur central
   - sb : client Supabase (fourni par auth-guard)
   - kra.toast / kra.drawer / kra.fetch : utilitaires partagés
   - kra.registerModule(id, def) : enregistre un module CRUD générique
   - kra.activateModule(id) : (re)charge la liste à chaque clic onglet
   ===================================================================== */

window.kra = (function(){
  const sb = () => window.KRA_SUPABASE_CLIENT;

  // ---------- TOAST ----------
  function toast(msg, kind){
    let wrap = document.querySelector('.toast-wrap');
    if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind||'info');
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .2s'; setTimeout(()=>el.remove(),220); }, 3200);
  }

  // ---------- DRAWER ----------
  let drawerEl, overlayEl;
  function ensureDrawer(){
    if(drawerEl) return;
    overlayEl = document.createElement('div');
    overlayEl.className = 'drawer-overlay';
    overlayEl.onclick = closeDrawer;
    drawerEl = document.createElement('aside');
    drawerEl.className = 'drawer';
    drawerEl.innerHTML = `
      <div class="drawer-head"><h2 id="kra-drawer-title">Détail</h2>
        <button class="drawer-close" onclick="kra.closeDrawer()">×</button></div>
      <div class="drawer-body" id="kra-drawer-body"></div>
      <div class="drawer-foot" id="kra-drawer-foot"></div>`;
    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
  }
  function openDrawer(title, bodyHTML, footHTML){
    ensureDrawer();
    document.getElementById('kra-drawer-title').textContent = title || 'Détail';
    document.getElementById('kra-drawer-body').innerHTML = bodyHTML || '';
    document.getElementById('kra-drawer-foot').innerHTML = footHTML || '';
    overlayEl.classList.add('open');
    drawerEl.classList.add('open');
  }
  function closeDrawer(){
    if(!drawerEl) return;
    overlayEl.classList.remove('open');
    drawerEl.classList.remove('open');
  }

  // ---------- FORM HELPERS ----------
  function readForm(form){
    const out = {};
    form.querySelectorAll('[name]').forEach(el => {
      const name = el.getAttribute('name');
      if(el.type === 'checkbox'){ out[name] = el.checked; }
      else if(el.type === 'number'){ const v = el.value.trim(); out[name] = v === '' ? null : Number(v); }
      else { const v = el.value; out[name] = v === '' ? null : v; }
    });
    return out;
  }

  // Escape HTML
  function esc(v){
    if(v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  // Format
  function fmtNum(v, d){ if(v===null||v===undefined||v==='') return ''; const n = Number(v); if(isNaN(n)) return ''; return n.toLocaleString('fr-FR',{minimumFractionDigits:d??0,maximumFractionDigits:d??2}); }
  function fmtDate(v){ if(!v) return ''; try{ return new Date(v).toLocaleDateString('fr-FR'); }catch(e){ return v; } }
  function fmtDateTime(v){ if(!v) return ''; try{ return new Date(v).toLocaleString('fr-FR'); }catch(e){ return v; } }

  // ---------- GENERIC MODULE ----------
  // def: { table, title, columns:[{key,label,fmt?,cls?,width?}], searchCols:[col1,col2], orderBy, fields:[{name,label,type,required,opts?,hint?}], pageSize? }
  const modules = {};

  function registerModule(id, def){
    modules[id] = def;
    def.state = { page: 0, pageSize: def.pageSize || 25, search: '', total: 0, rows: [], loaded: false };
  }

  async function activateModule(id){
    const def = modules[id]; if(!def) return;
    const root = document.getElementById(id); if(!root) return;
    if(!def.state.loaded){
      root.querySelector('[data-role="container"]').innerHTML = renderShell(id, def);
      bindShell(id, def);
      def.state.loaded = true;
    }
    await reload(id);
  }

  function renderShell(id, def){
    return `
      <div class="panel">
        <div class="toolbar">
          <input type="search" class="grow" placeholder="Rechercher..." data-role="search">
          <button class="cmd primary" data-role="new">+ Nouveau</button>
          <button class="cmd" data-role="reload">↻ Actualiser</button>
          <span class="count" data-role="count">—</span>
        </div>
        <div class="table-wrap" data-role="tablewrap">
          <table>
            <thead><tr>${def.columns.map(c=>`<th class="${c.cls||''}" ${c.width?`style="width:${c.width}"`:''}>${esc(c.label)}</th>`).join('')}<th style="width:160px">Actions</th></tr></thead>
            <tbody data-role="tbody"><tr><td colspan="${def.columns.length+1}" class="empty">Chargement...</td></tr></tbody>
          </table>
        </div>
        <div class="pager">
          <button data-role="prev">← Précédent</button>
          <button data-role="next">Suivant →</button>
          <span data-role="pageinfo">Page 1</span>
          <span class="pp">Lignes par page : ${def.state.pageSize}</span>
        </div>
      </div>`;
  }

  function bindShell(id, def){
    const root = document.getElementById(id);
    const search = root.querySelector('[data-role="search"]');
    let to;
    search.oninput = ()=>{ clearTimeout(to); to = setTimeout(()=>{ def.state.search = search.value.trim(); def.state.page = 0; reload(id); }, 280); };
    root.querySelector('[data-role="new"]').onclick = ()=> openForm(id, null);
    root.querySelector('[data-role="reload"]').onclick = ()=> reload(id);
    root.querySelector('[data-role="prev"]').onclick = ()=>{ if(def.state.page>0){ def.state.page--; reload(id); } };
    root.querySelector('[data-role="next"]').onclick = ()=>{ const max = Math.ceil(def.state.total / def.state.pageSize)-1; if(def.state.page<max){ def.state.page++; reload(id); } };
  }

  async function reload(id){
    const def = modules[id]; if(!def) return;
    const root = document.getElementById(id);
    const tbody = root.querySelector('[data-role="tbody"]');
    const cntEl = root.querySelector('[data-role="count"]');
    const pageInfo = root.querySelector('[data-role="pageinfo"]');
    tbody.innerHTML = `<tr><td colspan="${def.columns.length+1}" class="empty">Chargement...</td></tr>`;
    try{
      const from = def.state.page * def.state.pageSize;
      const to = from + def.state.pageSize - 1;
      let q = sb().from(def.table).select('*', {count:'exact'});
      if(def.state.search && def.searchCols && def.searchCols.length){
        const s = def.state.search.replace(/[%_]/g, m => '\\'+m);
        const ors = def.searchCols.map(c => `${c}.ilike.%${s}%`).join(',');
        q = q.or(ors);
      }
      if(def.orderBy) q = q.order(def.orderBy.col, {ascending: !!def.orderBy.asc});
      else q = q.order('updated_at', {ascending:false});
      q = q.range(from, to);
      const {data, error, count} = await q;
      if(error) throw error;
      def.state.rows = data || [];
      def.state.total = count || 0;
      cntEl.textContent = `${count||0} ligne(s)`;
      const totalPages = Math.max(1, Math.ceil((count||0) / def.state.pageSize));
      pageInfo.textContent = `Page ${def.state.page+1} / ${totalPages}`;
      if(!data || data.length === 0){
        tbody.innerHTML = `<tr><td colspan="${def.columns.length+1}" class="empty"><h3>Aucun élément</h3><div class="muted">Cliquez sur "Nouveau" pour créer le premier enregistrement.</div></td></tr>`;
        return;
      }
      tbody.innerHTML = data.map(row => `
        <tr data-id="${esc(row.id)}">
          ${def.columns.map(c => {
            let v = row[c.key];
            if(c.fmt === 'num') v = fmtNum(v, c.dec);
            else if(c.fmt === 'date') v = fmtDate(v);
            else if(c.fmt === 'datetime') v = fmtDateTime(v);
            else if(c.fmt === 'bool') v = v ? '✓' : '';
            else if(typeof c.fmt === 'function') v = c.fmt(v, row);
            else v = esc(v);
            return `<td class="${c.cls||''}">${v}</td>`;
          }).join('')}
          <td class="actions">
            <button class="row-btn" onclick="kra.openForm('${id}','${esc(row.id)}')">Ouvrir</button>
            <button class="row-btn danger" onclick="kra.confirmDelete('${id}','${esc(row.id)}')">Suppr.</button>
          </td>
        </tr>
      `).join('');
    }catch(e){
      console.error(e);
      tbody.innerHTML = `<tr><td colspan="${def.columns.length+1}" class="empty err">Erreur : ${esc(e.message||e)}</td></tr>`;
      toast('Erreur Supabase : ' + (e.message||e), 'err');
    }
  }

  function fieldHTML(f, val){
    const v = (val === null || val === undefined) ? '' : val;
    const req = f.required ? '<span class="req">*</span>' : '';
    if(f.type === 'textarea'){
      return `<div class="field"><label>${esc(f.label)} ${req}</label><textarea name="${esc(f.name)}" ${f.required?'required':''}>${esc(v)}</textarea>${f.hint?`<div class="hint">${esc(f.hint)}</div>`:''}</div>`;
    }
    if(f.type === 'select'){
      const opts = (f.opts||[]).map(o=>{
        const ov = typeof o === 'string' ? o : o.value;
        const ol = typeof o === 'string' ? o : o.label;
        const sel = String(v) === String(ov) ? 'selected' : '';
        return `<option value="${esc(ov)}" ${sel}>${esc(ol)}</option>`;
      }).join('');
      const empty = f.required ? '' : '<option value=""></option>';
      return `<div class="field"><label>${esc(f.label)} ${req}</label><select name="${esc(f.name)}" ${f.required?'required':''}>${empty}${opts}</select>${f.hint?`<div class="hint">${esc(f.hint)}</div>`:''}</div>`;
    }
    if(f.type === 'checkbox'){
      return `<label style="display:inline-flex;gap:6px;align-items:center;font-size:13px;"><input type="checkbox" name="${esc(f.name)}" ${v?'checked':''}> ${esc(f.label)}</label>`;
    }
    const t = f.type || 'text';
    return `<div class="field"><label>${esc(f.label)} ${req}</label><input type="${t}" name="${esc(f.name)}" value="${esc(v)}" ${f.required?'required':''} ${f.step?`step="${f.step}"`:''}>${f.hint?`<div class="hint">${esc(f.hint)}</div>`:''}</div>`;
  }

  async function openForm(id, rowId){
    const def = modules[id]; if(!def) return;
    let row = null;
    if(rowId){
      const found = def.state.rows.find(r => String(r.id) === String(rowId));
      if(found) row = found;
      else {
        const {data, error} = await sb().from(def.table).select('*').eq('id', rowId).single();
        if(error){ toast('Lecture impossible : ' + error.message, 'err'); return; }
        row = data;
      }
    }
    const checkboxes = (def.fields||[]).filter(f => f.type === 'checkbox');
    const otherFields = (def.fields||[]).filter(f => f.type !== 'checkbox');
    const body = `
      <form id="kra-form" autocomplete="off">
        ${otherFields.map(f => fieldHTML(f, row?row[f.name]:f.default)).join('')}
        ${checkboxes.length?`<div class="checkrow">${checkboxes.map(f=>fieldHTML(f, row?row[f.name]:f.default)).join('')}</div>`:''}
        ${row?`<div class="hint muted">Créé le ${fmtDateTime(row.created_at)} • Modifié le ${fmtDateTime(row.updated_at)}</div>`:''}
      </form>`;
    const foot = `
      <button class="cmd" onclick="kra.closeDrawer()">Annuler</button>
      <button class="cmd primary" onclick="kra.saveForm('${id}','${rowId?esc(rowId):''}')">${rowId?'Enregistrer':'Créer'}</button>`;
    openDrawer(`${def.title} : ${rowId?'Modifier':'Nouveau'}`, body, foot);
  }

  async function saveForm(id, rowId){
    const def = modules[id]; if(!def) return;
    const form = document.getElementById('kra-form'); if(!form) return;
    if(!form.reportValidity()) return;
    const payload = readForm(form);
    // Champs réservés non éditables
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    // Org / company auto
    const orgId = await ensureOrgId();
    if(orgId && def.fields.some(f=>f.name==='organization_id')) payload.organization_id = payload.organization_id || orgId;
    if(window.KRA_SUPABASE.companyId && def.fields.some(f=>f.name==='company_id')) payload.company_id = payload.company_id || window.KRA_SUPABASE.companyId;

    try{
      let res;
      if(rowId){
        res = await sb().from(def.table).update(payload).eq('id', rowId).select().single();
      } else {
        res = await sb().from(def.table).insert(payload).select().single();
      }
      if(res.error) throw res.error;
      toast(rowId?'Enregistrement modifié':'Enregistrement créé', 'ok');
      closeDrawer();
      await reload(id);
      // Refresh dashboard counters silently
      if(window.kraDashboard) window.kraDashboard.refresh();
    }catch(e){
      console.error(e);
      toast('Erreur enregistrement : ' + (e.message||e), 'err');
    }
  }

  async function confirmDelete(id, rowId){
    if(!confirm('Supprimer cet enregistrement ? Cette action est définitive.')) return;
    const def = modules[id]; if(!def) return;
    try{
      const {error} = await sb().from(def.table).delete().eq('id', rowId);
      if(error) throw error;
      toast('Enregistrement supprimé', 'ok');
      await reload(id);
      if(window.kraDashboard) window.kraDashboard.refresh();
    }catch(e){
      console.error(e);
      toast('Suppression impossible : ' + (e.message||e), 'err');
    }
  }

  // ---------- ORG ID CACHE ----------
  let _orgId = null;
  async function ensureOrgId(){
    if(_orgId) return _orgId;
    try{
      const {data} = await sb().from('organizations').select('id').limit(1).single();
      _orgId = data?.id || null;
    }catch(e){ /* RLS or none */ }
    return _orgId;
  }

  // ---------- COUNT ----------
  async function countRows(table, filter){
    try{
      let q = sb().from(table).select('*', {count:'exact', head:true});
      if(filter && filter.col){
        if(filter.in) q = q.in(filter.col, filter.in);
        else if(filter.eq !== undefined) q = q.eq(filter.col, filter.eq);
        else if(filter.gte !== undefined) q = q.gte(filter.col, filter.gte);
      }
      const {count, error} = await q;
      if(error) throw error;
      return count || 0;
    }catch(e){ console.warn('count', table, e.message||e); return null; }
  }

  return {
    sb, toast, openDrawer, closeDrawer,
    registerModule, activateModule, openForm, saveForm, confirmDelete,
    countRows, ensureOrgId,
    fmtNum, fmtDate, fmtDateTime, esc
  };
})();
