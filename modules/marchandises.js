/* Module Marchandises — table public.cargo_items (0 ligne) */
kra.registerModule('marchandises', {
  table: 'cargo_items',
  title: 'Marchandises',
  searchCols: ['description','hs_code','origin_country'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'description', label:'Description'},
    {key:'hs_code', label:'Code SH', width:'120px'},
    {key:'origin_country', label:'Pays origine', width:'130px'},
    {key:'packages_count', label:'Colis', cls:'num', width:'80px', fmt:'num'},
    {key:'weight_kg', label:'Poids (kg)', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'volume_cbm', label:'Volume (m³)', cls:'num', width:'110px', fmt:'num', dec:3},
    {key:'value_fob', label:'Valeur FOB', cls:'num', width:'120px', fmt:'num', dec:2},
    {key:'freight', label:'Fret', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'insurance', label:'Assurance', cls:'num', width:'110px', fmt:'num', dec:2},
  ],
  fields: [
    {name:'description', label:'Description', type:'textarea', required:true, hint:'Articles séparés par point-virgule'},
    {name:'hs_code', label:'Code SH (nomenclature)', type:'text'},
    {name:'origin_country', label:'Pays d\'origine', type:'text'},
    {name:'packages_count', label:'Nombre de colis', type:'number'},
    {name:'weight_kg', label:'Poids (kg)', type:'number', step:'0.01'},
    {name:'volume_cbm', label:'Volume (m³)', type:'number', step:'0.001'},
    {name:'value_fob', label:'Valeur FOB', type:'number', step:'0.01'},
    {name:'freight', label:'Fret', type:'number', step:'0.01'},
    {name:'insurance', label:'Assurance', type:'number', step:'0.01'},
  ]
});
