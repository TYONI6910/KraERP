/* Module Administration — table public.app_users (1 ligne) */
kra.registerModule('admin', {
  table: 'app_users',
  title: 'Administration / Utilisateurs',
  searchCols: ['email','full_name','role'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'email', label:'Email'},
    {key:'full_name', label:'Nom complet'},
    {key:'role', label:'Rôle', width:'140px', fmt:(v)=> v ? `<span class="tag info">${kra.esc(v)}</span>` : ''},
    {key:'is_active', label:'Actif', width:'80px', fmt:'bool', cls:'num'},
    {key:'last_login_at', label:'Dernière connexion', width:'160px', fmt:'datetime'},
    {key:'failed_login_count', label:'Échecs', cls:'num', width:'90px', fmt:'num'},
  ],
  fields: [
    {name:'email', label:'Email', type:'email', required:true},
    {name:'full_name', label:'Nom complet', type:'text'},
    {name:'role', label:'Rôle', type:'select', required:true, default:'user', opts:[
      {value:'super_admin',label:'Super administrateur'},
      {value:'admin',label:'Administrateur'},
      {value:'manager',label:'Manager'},
      {value:'user',label:'Utilisateur'},
      {value:'viewer',label:'Lecteur'},
      {value:'accountant',label:'Comptable'},
      {value:'operator',label:'Opérateur'},
    ]},
    {name:'is_active', label:'Compte actif', type:'checkbox', default:true},
  ]
});
