/* Module GED — table public.production_document_files (0 ligne) */
kra.registerModule('ged', {
  table: 'production_document_files',
  title: 'GED / Documents',
  searchCols: ['document_code','document_label','document_family','storage_path','mime_type'],
  orderBy: {col:'created_at', asc:false},
  pageSize: 25,
  columns: [
    {key:'document_code', label:'Code', width:'130px'},
    {key:'document_label', label:'Libellé'},
    {key:'document_family', label:'Famille', width:'130px', fmt:(v)=> v ? `<span class="tag neutral">${kra.esc(v)}</span>` : ''},
    {key:'mime_type', label:'Type', width:'120px'},
    {key:'file_size_bytes', label:'Taille', cls:'num', width:'110px', fmt:(v)=>{
      if(!v) return '';
      const n = Number(v); if(isNaN(n)) return '';
      if(n<1024) return n+' o';
      if(n<1024*1024) return (n/1024).toFixed(1)+' Ko';
      if(n<1024*1024*1024) return (n/1024/1024).toFixed(1)+' Mo';
      return (n/1024/1024/1024).toFixed(2)+' Go';
    }},
    {key:'document_status', label:'Statut', width:'110px', fmt:(v)=> v ? `<span class="tag ${v==='archived'?'neutral':''}">${kra.esc(v)}</span>` : ''},
    {key:'legal_archive_status', label:'Archive légale', width:'130px'},
    {key:'created_at', label:'Créé', width:'140px', fmt:'datetime'},
  ],
  fields: [
    {name:'document_code', label:'Code document', type:'text'},
    {name:'document_label', label:'Libellé', type:'text', required:true},
    {name:'document_family', label:'Famille', type:'select', required:true, opts:[
      {value:'invoice',label:'Facture'},
      {value:'bl',label:'BL / Connaissement'},
      {value:'declaration',label:'Déclaration douanière'},
      {value:'contract',label:'Contrat'},
      {value:'cargo',label:'Document marchandises'},
      {value:'transport',label:'Document transport'},
      {value:'kyc',label:'KYC / Légal'},
      {value:'other',label:'Autre'},
    ]},
    {name:'storage_bucket', label:'Bucket stockage', type:'text'},
    {name:'storage_path', label:'Chemin de stockage', type:'text', hint:'Chemin du fichier dans Supabase Storage'},
    {name:'mime_type', label:'Type MIME', type:'text'},
    {name:'file_size_bytes', label:'Taille (octets)', type:'number'},
    {name:'document_status', label:'Statut document', type:'select', required:true, default:'active', opts:[
      {value:'active',label:'Actif'},
      {value:'archived',label:'Archivé'},
      {value:'deleted',label:'Supprimé'},
      {value:'draft',label:'Brouillon'}
    ]},
    {name:'legal_archive_status', label:'Statut archive légale', type:'select', required:true, default:'pending', opts:[
      {value:'pending',label:'En attente'},
      {value:'archived',label:'Archivé légalement'},
      {value:'expired',label:'Expiré'},
      {value:'released',label:'Relâché'}
    ]},
    {name:'legal_hold', label:'Hold légal', type:'checkbox'},
  ]
});
