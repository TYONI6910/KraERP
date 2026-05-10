/* Module Groupage — table public.groupage_file_lines (2 lignes) */
kra.registerModule('groupage', {
  table: 'groupage_file_lines',
  title: 'Groupage',
  searchCols: ['code','label','goods_description','line_type'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'code', label:'Code', width:'120px'},
    {key:'label', label:'Libellé'},
    {key:'line_type', label:'Type ligne', width:'120px', fmt:(v)=> v ? `<span class="tag neutral">${kra.esc(v)}</span>` : ''},
    {key:'billing_mode', label:'Facturation', width:'130px'},
    {key:'declaration_mode', label:'Régime', width:'130px'},
    {key:'goods_description', label:'Marchandises'},
    {key:'real_weight', label:'Poids (kg)', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'packages_count', label:'Colis', cls:'num', width:'80px', fmt:'num'},
    {key:'customs_fees', label:'Douane', cls:'num', width:'110px', fmt:'num', dec:2},
  ],
  fields: [
    {name:'code', label:'Code ligne', type:'text'},
    {name:'label', label:'Libellé', type:'text'},
    {name:'line_type', label:'Type de ligne', type:'select', required:true, default:'sub_file', opts:[
      {value:'sub_file',label:'Sous-dossier'},{value:'pds',label:'PDS'},
      {value:'dsc',label:'DSC'},{value:'master',label:'Maître'},{value:'transit',label:'Transit'}
    ]},
    {name:'billing_mode', label:'Mode facturation', type:'select', required:true, default:'standard', opts:[
      'standard','forfait','prestation','horaire','marge'
    ]},
    {name:'declaration_mode', label:'Régime douanier', type:'select', required:true, default:'standard', opts:[
      'standard','franchise','transit','admission_temporaire','perfectionnement','reexport'
    ]},
    {name:'goods_description', label:'Description marchandises', type:'textarea', hint:'Articles séparés par point-virgule'},
    {name:'real_weight', label:'Poids réel (kg)', type:'number', step:'0.01'},
    {name:'packages_count', label:'Nombre de colis', type:'number'},
    {name:'articles_count', label:"Nombre d'articles", type:'number'},
    {name:'customs_fees', label:'Frais de douane', type:'number', step:'0.01'},
  ]
});
