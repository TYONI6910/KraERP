KARA PORTUAIRE - V2.0.121 OFFICE INTERFACE (Branchement Supabase complet)
==========================================================================

Cette version conserve l'interface Office/Outlook de la V2.0.120 et ajoute
le branchement Supabase reel sur l'ensemble des 10 modules.

NOUVEAUTES V2.0.121
-------------------
- Tableau de bord : compteurs en direct (dossiers ouverts, lignes de groupage,
  tiers actifs, factures non soldees) + liste des dossiers recents.
- Module Clients/Tiers : CRUD complet sur public.parties (112 lignes).
- Module Groupage : CRUD sur public.groupage_file_lines.
- Module Dossiers : CRUD sur public.transport_files (frais dossier/transit/FIP).
- Module Marchandises : CRUD sur public.cargo_items.
- Module Conteneurs : CRUD sur public.containers (BL, transporteur, chauffeur).
- Module Tarifs : CRUD sur public.supplier_tariff_catalog (29 lignes).
- Module Finance : CRUD sur public.invoices (HT, TTC, paye, reste).
- Module GED : CRUD sur public.production_document_files.
- Module Administration : CRUD sur public.app_users.

FONCTIONNALITES TECHNIQUES
--------------------------
- Listes paginees Supabase (25 ou 50 lignes par page selon module).
- Recherche multi-colonnes (ilike, debounced 280 ms).
- Drawer slide-in pour creation/edition (touche Echap = fermer).
- Toasts de feedback en haut a droite (succes, erreur, info).
- Suppression protegee par confirm() natif.
- Recherche globale qui filtre le module actif.
- Auto-injection de organization_id et company_id a la creation.
- Responsive mobile : menu hamburger sur ecrans < 900 px.

A HEBERGER SUR AZURE
--------------------
1. Dezipper ce fichier.
2. Ouvrir Azure Storage > conteneur $web.
3. Supprimer les anciens fichiers ou les ecraser.
4. Charger TOUT le contenu de ce dossier (fichiers + sous-dossiers
   assets/, config/, modules/).
5. Ouvrir https://kraprod.z28.web.core.windows.net/login.html

IMPORTANT - VERIFICATIONS APRES DEPLOIEMENT
-------------------------------------------
- L'arborescence du conteneur $web doit conserver les sous-dossiers :
  /assets/ (office.css, auth-guard.js, app.js)
  /config/ (supabase-config.js)
  /modules/ (dashboard.js, clients.js, ..., admin.js)
- Les MIME types doivent etre corrects (.js -> application/javascript,
  .css -> text/css, .html -> text/html).
- Si une table renvoie 401/403, verifier les RLS Supabase (les utilisateurs
  doivent avoir les policies SELECT/INSERT/UPDATE/DELETE necessaires sur
  les 10 tables citees ci-dessus pour leur organization_id).

DONNEES SUPABASE
----------------
Aucune donnee Supabase n'est supprimee ni modifiee par cette mise a jour.
Cette version remplace uniquement l'interface et ajoute le code client
qui lit/ecrit dans les tables existantes.

LIMITATIONS CONNUES
-------------------
- L'export CSV n'est pas encore implemente (placeholder).
- L'upload de fichiers GED reels via Supabase Storage est un chantier
  futur (V2.0.122) - actuellement seul le metadata est gere.
- Les liens entre dossiers/conteneurs/factures (FK) sont stockes mais
  pas encore traduits en selecteurs visuels (UUID en clair) - chantier V2.0.122.
- Le calculateur tarifaire n'effectue pas encore de calculs ; il liste
  seulement le catalogue.
