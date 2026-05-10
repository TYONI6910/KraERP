/* Module Finance — table public.invoices (2 lignes) */
kra.registerModule('finance', {
  table: 'invoices',
  title: 'Finance / Factures',
  searchCols: ['invoice_number','invoice_type','status'],
  orderBy: {col:'updated_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'invoice_number', label:'N° Facture', width:'150px'},
    {key:'invoice_type', label:'Type', width:'120px', fmt:(v)=> v ? `<span class="tag info">${kra.esc(v)}</span>` : ''},
    {key:'created_at', label:'Date', width:'110px', fmt:'date'},
    {key:'total_ht', label:'Total HT', cls:'num', width:'120px', fmt:'num', dec:2},
    {key:'total_ttc', label:'Total TTC', cls:'num', width:'120px', fmt:'num', dec:2},
    {key:'paid_amount', label:'Payé', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'remaining_amount', label:'Reste', cls:'num', width:'110px', fmt:'num', dec:2},
    {key:'status', label:'Statut', width:'120px', fmt:(v)=>{
      if(!v) return '';
      const map = {'paid':'tag','overdue':'tag err','draft':'tag neutral','sent':'tag info','partial':'tag warn','cancelled':'tag err'};
      return `<span class="${map[v]||'tag neutral'}">${kra.esc(v)}</span>`;
    }},
  ],
  fields: [
    {name:'invoice_number', label:'Numéro de facture', type:'text', hint:'Laisser vide si auto-numérotation'},
    {name:'invoice_type', label:'Type de facture', type:'select', required:true, default:'standard', opts:[
      {value:'standard',label:'Standard'},
      {value:'proforma',label:'Proforma'},
      {value:'avoir',label:'Avoir'},
      {value:'acompte',label:'Acompte'},
      {value:'final',label:'Solde final'}
    ]},
    {name:'total_ht', label:'Total HT', type:'number', step:'0.01'},
    {name:'total_ttc', label:'Total TTC', type:'number', step:'0.01'},
    {name:'paid_amount', label:'Montant payé', type:'number', step:'0.01', default:0},
    {name:'remaining_amount', label:'Reste à payer', type:'number', step:'0.01'},
    {name:'status', label:'Statut', type:'select', required:true, default:'draft', opts:[
      {value:'draft',label:'Brouillon'},
      {value:'sent',label:'Envoyée'},
      {value:'partial',label:'Partiellement payée'},
      {value:'paid',label:'Payée'},
      {value:'overdue',label:'En retard'},
      {value:'cancelled',label:'Annulée'}
    ]},
  ]
});
