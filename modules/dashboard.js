/* Dashboard — KPIs réels Supabase */
window.kraDashboard = (function(){
  let loaded = false;

  async function refresh(){
    const sb = window.KRA_SUPABASE_CLIENT; if(!sb) return;
    setKpi('kpi-dossiers', '…');
    setKpi('kpi-groupages', '…');
    setKpi('kpi-clients', '…');
    setKpi('kpi-factures', '…');

    const tasks = [
      kra.countRows('transport_files', {col:'status', in:['open','in_progress']}).then(n=>setKpi('kpi-dossiers', n)),
      kra.countRows('groupage_file_lines').then(n=>setKpi('kpi-groupages', n)),
      kra.countRows('parties', {col:'status', eq:'active'}).then(n=>setKpi('kpi-clients', n)),
      kra.countRows('invoices', {col:'status', in:['draft','sent','partial','overdue']}).then(n=>setKpi('kpi-factures', n)),
    ];
    await Promise.allSettled(tasks);
    await loadRecent();
  }

  function setKpi(id, val){
    const el = document.getElementById(id); if(!el) return;
    if(val === null || val === undefined){ el.textContent = '—'; el.classList.add('loading'); return; }
    if(val === '…'){ el.textContent = '…'; el.classList.add('loading'); return; }
    el.classList.remove('loading');
    el.textContent = typeof val === 'number' ? val.toLocaleString('fr-FR') : String(val);
  }

  async function loadRecent(){
    const sb = window.KRA_SUPABASE_CLIENT;
    const tbody = document.getElementById('recent-rows'); if(!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" class="muted">Chargement...</td></tr>';
    try{
      const {data, error} = await sb.from('transport_files')
        .select('file_number,file_type,status,direction,updated_at')
        .order('updated_at', {ascending:false}).limit(8);
      if(error) throw error;
      if(!data || data.length === 0){
        tbody.innerHTML = '<tr><td colspan="3" class="muted">Aucun dossier récent</td></tr>';
        return;
      }
      tbody.innerHTML = data.map(r => {
        const lbl = kra.esc(r.file_number || '(sans numéro)');
        const type = r.file_type ? `<span class="tag neutral">${kra.esc(r.file_type)}</span>` : '';
        const dir = r.direction ? `<span class="tag info">${kra.esc(r.direction)}</span>` : '';
        const stat = r.status === 'closed' ? `<span class="tag neutral">${kra.esc(r.status)}</span>` :
                     r.status === 'blocked' ? `<span class="tag err">${kra.esc(r.status)}</span>` :
                     r.status ? `<span class="tag">${kra.esc(r.status)}</span>` : '';
        return `<tr><td><strong>${lbl}</strong> ${type} ${dir}<div class="muted" style="font-size:12px">${kra.fmtDateTime(r.updated_at)}</div></td><td>Dossiers</td><td>${stat}</td></tr>`;
      }).join('');
    }catch(e){
      console.warn('recent', e);
      tbody.innerHTML = `<tr><td colspan="3" class="muted">Indisponible : ${kra.esc(e.message||e)}</td></tr>`;
    }
  }

  return { refresh, loadRecent };
})();
