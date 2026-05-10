/* Module Tarifs / Calculateur — table public.supplier_tariff_catalog (29 lignes) */
kra.registerModule('tarifs', {
  table: 'supplier_tariff_catalog',
  title: 'Tarifs / Catalogue',
  searchCols: ['provider_code','module_code','charge_code','charge_label','family'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 50,
  columns: [
    {key:'provider_code', label:'Fournisseur', width:'120px'},
    {key:'module_code', label:'Module', width:'110px'},
    {key:'charge_code', label:'Code', width:'120px'},
    {key:'charge_label', label:'Libellé'},
    {key:'family', label:'Famille', width:'120px'},
    {key:'calculation_mode', label:'Calcul', width:'100px'},
    {key:'unit', label:'Unité', width:'80px'},
    {key:'currency', label:'Dev.', width:'60px'},
    {key:'amount', label:'Montant', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'rate', label:'Taux', cls:'num', width:'90px', fmt:'num', dec:4},
    {key:'is_active', label:'Actif', width:'70px', fmt:'bool', cls:'num'},
  ],
  fields: [
    {name:'provider_code', label:'Code fournisseur', type:'text', required:true},
    {name:'module_code', label:'Code module', type:'text'},
    {name:'charge_code', label:'Code charge', type:'text', required:true},
    {name:'charge_label', label:'Libellé charge', type:'text', required:true},
    {name:'family', label:'Famille', type:'select', required:true, opts:[
      'transport','customs','handling','documentation','storage','insurance','fees','other'
    ]},
    {name:'direction', label:'Sens', type:'select', opts:[
      {value:'import',label:'Import'},{value:'export',label:'Export'},{value:'both',label:'Les deux'}
    ]},
    {name:'transport_mode', label:'Mode transport', type:'select', opts:['sea','air','road','rail','multimodal']},
    {name:'equipment_type', label:'Type équipement', type:'text'},
    {name:'size_code', label:'Taille', type:'select', opts:['20','40','45','LCL','FCL']},
    {name:'cargo_type', label:'Type cargo', type:'text'},
    {name:'calculation_mode', label:'Mode de calcul', type:'select', required:true, default:'flat', opts:[
      {value:'flat',label:'Forfait'},{value:'per_unit',label:'Par unité'},
      {value:'percentage',label:'Pourcentage'},{value:'tiered',label:'Tranches'}
    ]},
    {name:'unit', label:'Unité', type:'select', opts:['unit','kg','cbm','teu','feu','hour','day','document']},
    {name:'currency', label:'Devise', type:'select', default:'EUR', opts:['EUR','USD','XPF','XOF','MGA','GBP']},
    {name:'amount', label:'Montant', type:'number', step:'0.01'},
    {name:'rate', label:'Taux', type:'number', step:'0.0001'},
    {name:'min_amount', label:'Montant minimum', type:'number', step:'0.01'},
    {name:'max_amount', label:'Montant maximum', type:'number', step:'0.01'},
    {name:'free_days', label:'Jours francs', type:'number'},
    {name:'from_day', label:'Jour début', type:'number'},
    {name:'to_day', label:'Jour fin', type:'number'},
    {name:'is_debours', label:'Débours', type:'checkbox'},
    {name:'is_marginable', label:'Marginable', type:'checkbox', default:true},
    {name:'is_active', label:'Actif', type:'checkbox', default:true},
  ]
});
