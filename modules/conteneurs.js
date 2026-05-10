/* Module Conteneurs — table public.containers (1 ligne) */
kra.registerModule('conteneurs', {
  table: 'containers',
  title: 'Conteneurs',
  searchCols: ['container_number','bl_number','carrier_name','delivery_place','driver_name','seal_number'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'container_number', label:'N° Conteneur', width:'150px'},
    {key:'container_type', label:'Type', width:'100px'},
    {key:'equipment_type', label:'Équipement', width:'120px'},
    {key:'bl_number', label:'N° BL', width:'140px'},
    {key:'carrier_name', label:'Transporteur'},
    {key:'driver_name', label:'Chauffeur'},
    {key:'delivery_place', label:'Lieu livraison'},
    {key:'gross_weight', label:'Poids brut', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'status', label:'Statut', width:'100px', fmt:(v)=> v ? `<span class="tag neutral">${kra.esc(v)}</span>` : ''},
  ],
  fields: [
    {name:'container_number', label:'Numéro de conteneur', type:'text', required:true, hint:'Format ISO ex: ABCD1234567'},
    {name:'container_type', label:'Type', type:'select', opts:[
      '20DV','40DV','40HC','45HC','20RF','40RF','20OT','40OT','20FR','40FR','20TK'
    ]},
    {name:'equipment_type', label:'Équipement', type:'text'},
    {name:'seal_number', label:'N° de plomb', type:'text'},
    {name:'bl_number', label:'N° de BL', type:'text'},
    {name:'carrier_name', label:'Nom transporteur', type:'text'},
    {name:'driver_name', label:'Nom chauffeur', type:'text'},
    {name:'delivery_place', label:'Lieu de livraison', type:'text'},
    {name:'gross_weight', label:'Poids brut (kg)', type:'number', step:'0.01'},
    {name:'tare_weight', label:'Tare (kg)', type:'number', step:'0.01'},
    {name:'net_weight', label:'Poids net (kg)', type:'number', step:'0.01'},
    {name:'volume_cbm', label:'Volume (m³)', type:'number', step:'0.001'},
    {name:'packages_count', label:'Nombre de colis', type:'number'},
    {name:'status', label:'Statut', type:'select', required:true, default:'open', opts:[
      {value:'open',label:'Ouvert'},{value:'loading',label:'Chargement'},
      {value:'in_transit',label:'En transit'},{value:'delivered',label:'Livré'},
      {value:'closed',label:'Clôturé'},{value:'blocked',label:'Bloqué'}
    ]},
    {name:'validity_status', label:'Validation', type:'text'},
    {name:'import_mode_normalized', label:'Mode import (normalisé)', type:'text'},
  ]
});
