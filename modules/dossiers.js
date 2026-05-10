/* Module Dossiers — table public.transport_files (3 lignes) */
kra.registerModule('dossiers', {
  table: 'transport_files',
  title: 'Dossiers',
  searchCols: ['file_number','forwarder_name','file_type','direction','excel_source_number'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'file_number', label:'N° Dossier', width:'140px'},
    {key:'file_type', label:'Type', width:'120px'},
    {key:'direction', label:'Sens', width:'90px', fmt:(v)=> v ? `<span class="tag info">${kra.esc(v)}</span>` : ''},
    {key:'declaration_mode', label:'Régime douanier', width:'140px'},
    {key:'billing_mode', label:'Mode facturation', width:'140px'},
    {key:'forwarder_name', label:'Transitaire'},
    {key:'dossier_fees', label:'Frais dossier', cls:'num', width:'120px', fmt:'num', dec:2},
    {key:'transit_fees', label:'Frais transit', cls:'num', width:'120px', fmt:'num', dec:2},
    {key:'status', label:'Statut', width:'110px', fmt:(v)=> v ? `<span class="tag ${v==='closed'?'neutral':(v==='blocked'?'err':'')}">${kra.esc(v)}</span>` : ''},
  ],
  fields: [
    {name:'file_number', label:'Numéro de dossier', type:'text', hint:'Laisser vide si auto-numérotation'},
    {name:'file_type', label:'Type', type:'select', required:true, opts:[
      {value:'standard',label:'Standard'},
      {value:'groupage',label:'Groupage'},
      {value:'sub',label:'Sous-dossier'},
      {value:'transit',label:'Transit'},
      {value:'declaration',label:'Déclaration'},
    ]},
    {name:'direction', label:'Sens', type:'select', opts:[
      {value:'import',label:'Import'},{value:'export',label:'Export'},{value:'transit',label:'Transit'}
    ]},
    {name:'service_scope', label:'Périmètre service', type:'select', required:true, default:'full', opts:[
      {value:'full',label:'Complet'},{value:'transit_only',label:'Transit seul'},
      {value:'declaration_only',label:'Déclaration seule'},{value:'consulting',label:'Consulting'}
    ]},
    {name:'declaration_mode', label:'Régime douanier', type:'select', required:true, default:'standard', opts:[
      'standard','franchise','transit','admission_temporaire','perfectionnement','reexport'
    ]},
    {name:'billing_mode', label:'Mode facturation', type:'select', required:true, default:'standard', opts:[
      'standard','forfait','prestation','horaire','marge'
    ]},
    {name:'forwarder_name', label:'Nom transitaire', type:'text'},
    {name:'customs_amount', label:'Montant douane', type:'number', step:'0.01'},
    {name:'dossier_fees', label:'Frais dossier', type:'number', step:'0.01'},
    {name:'transit_fees', label:'Frais transit', type:'number', step:'0.01'},
    {name:'fip_amount', label:'Montant FIP', type:'number', step:'0.01'},
    {name:'excel_source_number', label:'N° source Excel', type:'text', hint:'Si import depuis Excel'},
    {name:'status', label:'Statut', type:'select', required:true, default:'open', opts:[
      {value:'open',label:'Ouvert'},{value:'in_progress',label:'En cours'},
      {value:'closed',label:'Clôturé'},{value:'blocked',label:'Bloqué'},{value:'archived',label:'Archivé'}
    ]},
  ]
});
