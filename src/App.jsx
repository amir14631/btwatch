import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

const COLORS = {
  navyDeep: "#0f2440", navyMid: "#1a3a5c", blue: "#2a7de1", blueLight: "#4a9eff",
  bluePale: "#e8f2ff", cyan: "#00b4d8", white: "#ffffff", gray50: "#f8fafc",
  gray100: "#f1f5f9", gray200: "#e2e8f0", gray400: "#94a3b8", gray600: "#475569",
  gray800: "#1e293b", success: "#10b981", warning: "#f59e0b", danger: "#ef4444",
  purple: "#7c3aed", teal: "#0d9488", green: "#059669", orange: "#ea580c",
};

// ─── DATA LOGISTIQUE ───────────────────────────────────────────────────────────

const CATEGORIES_LOG = [
  { id: "all", label: "Toutes", color: COLORS.blue },
  { id: "ma", label: "Fusions & Acquisitions", color: COLORS.purple },
  { id: "finance", label: "Marches financiers", color: COLORS.green },
  { id: "immo", label: "Immobilier logistique", color: COLORS.blue },
  { id: "esg", label: "ESG & Durabilite", color: COLORS.teal },
];

const ARTICLES_LOG = [
  { id: 1, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "Prologis rachete un portefeuille logistique d'Union Investment pour 160 M EUR", summary: "Le leader mondial de l'immobilier logistique realise une acquisition majeure en France sur la dorsale logistique. Les actifs sont principalement loues a des grands utilisateurs e-commerce et 3PL.", source: "Business Immo", date: "Il y a 2h", readTime: "4 min", tag: "Exclusif", tagColor: COLORS.purple, score: 95, url: "https://www.businessimmo.com/actualites/article/139286302/ab-sagax-cloture-lannee-par-une-nouvelle-acquisition-en-france" },
  { id: 2, category: "immo", categoryLabel: "Immobilier logistique", title: "Marche francais des entrepots : 3 millions de m2 places en 2025, annee chautee", summary: "Arthur Loyd Logistique dresse un bilan 2025 contenu. La demande placee accuse une baisse de 3% par rapport a 2024. Les 3PL representent 45% des surfaces louees. Amazon reste le principal moteur e-commerce.", source: "Voxlog", date: "Il y a 5h", readTime: "5 min", tag: "Bilan annuel", tagColor: COLORS.blue, score: 92, url: "https://www.voxlog.fr/actualite/10609/marche-francais-des-entrepots-arthur-loyd-logistique-dresse-le-bilan-d-une-annee-2025-chahutee" },
  { id: 3, category: "immo", categoryLabel: "Immobilier logistique", title: "JLL : 3,2 millions de m2 echanges en France en 2025, marche en normalisation", summary: "JLL qualifie le marche logistique francais de secteur en plein cycle de normalisation. La dorsale concentre 53% des volumes. Les grandes surfaces de 20 000 a 40 000 m2 bondissent de 20%.", source: "Voxlog", date: "Il y a 8h", readTime: "4 min", tag: "Marche", tagColor: COLORS.blue, score: 88, url: "https://www.voxlog.fr/actualite/10522/immobilier-logistique-jll-constate-une-baisse-de-la-demande-placee-francaise-en-2025" },
  { id: 4, category: "finance", categoryLabel: "Marches financiers", title: "13,7 Mds EUR investis en immobilier d'entreprise en France en 2025 selon ImmoStat", summary: "L'immobilier logistique capte une part croissante des volumes investis. Les Americains (33%), Britanniques (12%) et Canadiens (12%) dominent les acquisitions logistiques françaises.", source: "Business Immo", date: "Il y a 10h", readTime: "5 min", tag: "Analyse", tagColor: COLORS.green, score: 75, url: "https://www.businessimmo.com/thematiques/logistique" },
  { id: 5, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "AEW acquiert 5 actifs de logistique urbaine en France pour environ 120 M EUR", summary: "AEW confirme l'acquisition d'un portefeuille de 97 000 m2 comprenant cinq actifs de logistique urbaine en France pour un investisseur institutionnel francais, aupres de PFA Logistics.", source: "Business Immo", date: "Il y a 1j", readTime: "3 min", tag: "Transaction", tagColor: COLORS.purple, score: 90, url: "https://www.businessimmo.com/actualites/article/891361275/aew-confirme-lacquisition-de-cinq-actifs-de-logistique-urbaine" },
  { id: 6, category: "immo", categoryLabel: "Immobilier logistique", title: "Canal Seine-Nord : les actifs logistiques du corridor nord valorises 15% de plus", summary: "L'avancement du chantier du canal Seine-Nord genere un fort effet d'anticipation. Les zones de Cambrai, Marquion et Dunkerque concentrent les demandes. Le parc e-Valley est en premiere ligne.", source: "Le Moniteur", date: "Il y a 1j", readTime: "5 min", tag: "Infrastructure", tagColor: COLORS.blue, score: 97, url: "https://www.lemoniteur.fr/article/les-entrepots-de-e-valley-et-du-nord-en-plein-essor.2310862" },
  { id: 7, category: "esg", categoryLabel: "ESG & Durabilite", title: "Toitures d'entrepots et ombrieres photovoltaiques : une manne energetique pour la logistique", summary: "La reglementation pousse a la solarisation des entrepots francais. Obligation d'installation solaire sur les entrepots de plus de 5 000 m2. L'autoconsommation est en plein essor.", source: "Voxlog", date: "Il y a 2j", readTime: "6 min", tag: "Reglementation", tagColor: COLORS.teal, score: 82, url: "https://www.voxlog.fr/actualite/10273/regard-dexpert-les-marches-de-limmobilier-logistique-resistent-en-depit-du-contexte" },
  { id: 8, category: "finance", categoryLabel: "Marches financiers", title: "Marche investissement lillois : 367 M EUR au S1 2025, en hausse de 62%", summary: "Le marche d'investissement lillois enregistre une performance solide portee par la logistique. Les Hauts-de-France representent 21% de la demande placee nationale.", source: "Business Immo", date: "Il y a 2j", readTime: "4 min", tag: "Regions", tagColor: COLORS.green, score: 70, url: "https://www.businessimmo.com/actualites/article/316424374/un-marche-de-linvestissement-lillois-porte-par-la-logistique" },
  { id: 9, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "P3 Logistic Parks s'empare d'une plateforme de 56 000 m2 pres d'Avignon", summary: "Le gestionnaire d'actifs logistiques europeen realise une nouvelle acquisition dans le sud de la France, renforçant sa presence sur l'axe Rhone-Mediterranee.", source: "Business Immo", date: "Il y a 3j", readTime: "3 min", tag: "Transaction", tagColor: COLORS.purple, score: 85, url: "https://www.businessimmo.com/actualites/liste/fil-dactus" },
];

const COMPETITORS_LOG = [
  { name: "Prologis France", hq: "Paris 8e", frenchAssets: "3,8M m2", presence: ["Ile-de-France", "Lyon", "Marseille", "Lille", "Bordeaux"], strategy: "Leader du marche francais. Retention des grands locataires e-commerce. Restructuration d'actifs existants faute de foncier en IDF.", recentMoves: ["Rachat portefeuille Union Investment pour 160 M EUR", "Renouvellement bail Amazon sur Sénart (85 000 m2)", "Programme renovation energetique sur 12 actifs"], threat: "high", color: "#e63946" },
  { name: "Panattoni France", hq: "Paris 17e", frenchAssets: "1,2M m2", presence: ["Axe A10", "PACA", "Grand Est", "Bordeaux"], strategy: "Developpeur pur, specialiste du build-to-suit. Actif sur les marches regionaux et les friches industrielles pour contourner la loi ZAN.", recentMoves: ["BTS pour Geodis et XPO sur l'axe A10", "Developpement urbain en Ile-de-France", "Acquisition friche industrielle a Mulhouse"], threat: "high", color: "#f4a261" },
  { name: "Goodman France", hq: "Paris 9e", frenchAssets: "920K m2", presence: ["Grand Paris", "Lyon", "Rouen", "Toulouse"], strategy: "Premium urban logistics. Cession selective d'actifs matures pour reinvestir. Net Zero sur l'ensemble du parc francais.", recentMoves: ["Livraison entrepot last-mile 18 000 m2 a Saint-Denis", "Certification Net Zero portefeuille francais", "Partenariat operateur last-mile"], threat: "medium", color: "#e76f51" },
  { name: "Segro France", hq: "Paris 8e", frenchAssets: "650K m2", presence: ["Grand Paris", "Lyon Metropole", "Aix-Marseille"], strategy: "Leader europeen de l'urban logistics en France. Petites et moyennes surfaces proches des centres-villes. Partenariat Urby.", recentMoves: ["Acquisition 3 actifs last-mile en Seine-Saint-Denis", "Segro Urban Warehouse Paris 8 000 m2", "Partenariat Urby dernier kilometre"], threat: "medium", color: "#457b9d" },
  { name: "MG Real Estate France", hq: "Lyon", frenchAssets: "380K m2", presence: ["Lyon", "Grenoble", "Dijon"], strategy: "Fonds belge actif sur le marche regional français. Strategie value-add : actifs classe B repositionnes en classe A apres renovation.", recentMoves: ["Acquisition 45 000 m2 a Corbas (Lyon Sud)", "Renovation actif Grenoble (certification HQE)", "Etude faisabilite terrain 12 ha a Dijon"], threat: "low", color: "#6a994e" },
];

const RADAR_LOG = [
  { label: "Demande placee France 2025", value: "3,2", unit: "M m2", delta: "Normalisation post-Covid", up: false },
  { label: "Taux de vacance logistique", value: "5,8", unit: "%", delta: "Stabilisation en cours", up: false },
  { label: "Loyer prime IDF classe A", value: "82", unit: "EUR/m2/an", delta: "+6% sur 1 an", up: true },
  { label: "Volume investi France 2025", value: "3", unit: "Mds EUR", delta: "Actifs unitaires dominants", up: true },
  { label: "Taux de capi prime", value: "4,7", unit: "%", delta: "Stable ce trimestre", up: false },
  { label: "Part dorsale dans les volumes", value: "53", unit: "%", delta: "Lille + IDF en tete", up: true },
];

const ZONES_LOG = [
  { zone: "Hauts-de-France (Cambrai, Lille, Calais)", activity: 9, deals: "21% du national", highlight: "1er marche regional, Canal Seine-Nord catalyseur, e-Valley en plein essor" },
  { zone: "Ile-de-France (Roissy, Orly, Sénart)", activity: 9, deals: "20% du national", highlight: "Loyers les plus eleves, rarete fonciere, vacance tres basse" },
  { zone: "Centre-Val de Loire (Orleans, Tours)", activity: 8, deals: "Record historique", highlight: "Hub barycentrique national, foncier competitif, Unilever 60 000 m2" },
  { zone: "Auvergne-Rhone-Alpes (Lyon, Corbas)", activity: 7, deals: "2e marche national", highlight: "Corridor rhodanien strategique, forte demande 3PL et industriels" },
  { zone: "Sud-Ouest (Bordeaux, Toulouse)", activity: 4, deals: "En croissance", highlight: "Croissance demographique, marche emergent a surveiller" },
  { zone: "PACA (Marseille, Avignon, Fos)", activity: 5, deals: "Port en moteur", highlight: "Port Marseille-Fos attire les investisseurs, P3 recemment actif" },
];

// ─── DATA SELF STORAGE ─────────────────────────────────────────────────────────

const CATEGORIES_SS = [
  { id: "all", label: "Toutes", color: COLORS.orange },
  { id: "marche", label: "Marche & tendances", color: COLORS.orange },
  { id: "btob", label: "B2B & entreprises", color: COLORS.blue },
  { id: "implantation", label: "Implantation & foncier", color: COLORS.green },
  { id: "tech", label: "Tech & digitalisation", color: COLORS.purple },
];

const ARTICLES_SS = [
  { id: 1, category: "marche", categoryLabel: "Marche & tendances", title: "Le marche français du self storage depasse 1,5 million de m2 en 2025", summary: "La France reste l'un des marches europeens les plus dynamiques du self storage avec une croissance de 8% par an. Le taux d'occupation moyen atteint 85% sur les grandes agglomerations. L'offre reste insuffisante face a une demande portee par les TPE/PME.", source: "SSA France", date: "Il y a 1j", readTime: "5 min", tag: "Marche", tagColor: COLORS.orange, score: 92, url: "https://www.self-stockage.org" },
  { id: 2, category: "btob", categoryLabel: "B2B & entreprises", title: "Les TPE/PME representent desormais 40% de la clientele du self storage en France", summary: "Le segment B2B est le plus porteur du secteur. Les petites entreprises utilisent le self storage pour stocker leurs stocks, archives et materiel. Le besoin de flexibilite et l'absence de bail commercial sont les principaux facteurs d'adoption.", source: "Observatoire du Self Storage", date: "Il y a 2j", readTime: "4 min", tag: "B2B", tagColor: COLORS.blue, score: 95, url: "https://www.self-stockage.org" },
  { id: 3, category: "implantation", categoryLabel: "Implantation & foncier", title: "Zones d'activites periurbaines : le nouvel eldorado du self storage B2B en France", summary: "Les operateurs de self storage se detournent des centres-villes trop chers pour les zones d'activites. La proximite des PME, l'accessibilite et le foncier disponible font de ces zones le format ideal pour le B2B.", source: "Le Moniteur", date: "Il y a 3j", readTime: "6 min", tag: "Foncier", tagColor: COLORS.green, score: 88, url: "https://www.lemoniteur.fr" },
  { id: 4, category: "tech", categoryLabel: "Tech & digitalisation", title: "Le self storage 2.0 : acces 24h/24 et gestion 100% digitale s'imposent en France", summary: "Les nouveaux entrants du secteur misent tout sur la digitalisation : reservation en ligne, acces par badge ou code, gestion de compte via app mobile, facturation automatique. Cette approche reduit les couts d'exploitation de 30% et attire les clients B2B.", source: "LSA Conso", date: "Il y a 3j", readTime: "5 min", tag: "Innovation", tagColor: COLORS.purple, score: 85, url: "https://www.lsa-conso.fr" },
  { id: 5, category: "marche", categoryLabel: "Marche & tendances", title: "Self storage : les loyers parisiens atteignent 45 EUR/m2/mois, Lyon et Bordeaux en forte hausse", summary: "La tension sur l'offre de self storage dans les grandes villes françaises pousse les tarifs a la hausse. Paris affiche les loyers les plus eleves d'Europe apres Londres. Lyon et Bordeaux voient leurs prix progresser de 12% en un an.", source: "SSA France", date: "Il y a 4j", readTime: "3 min", tag: "Prix", tagColor: COLORS.orange, score: 80, url: "https://www.self-stockage.org" },
  { id: 6, category: "btob", categoryLabel: "B2B & entreprises", title: "E-commerce et self storage : les micro-entrepots pour independants en plein boom", summary: "Les vendeurs e-commerce independants (Etsy, Amazon FBA, Vinted Pro) sont une nouvelle clientele cle pour les operateurs de self storage B2B. Des boxes de 15 a 50 m2 avec acces quai sont tres recherches. Shurgard et Homebox ont deja cree des offres dediees.", source: "E-commerce Mag", date: "Il y a 5j", readTime: "4 min", tag: "E-commerce", tagColor: COLORS.blue, score: 87, url: "https://www.ecommercemag.fr" },
  { id: 7, category: "implantation", categoryLabel: "Implantation & foncier", title: "Conversion de friches commerciales en self storage : une tendance de fond en France", summary: "D'anciens hypermarchés, entrepots et locaux commerciaux vides sont reconvertis en centres de self storage. Ce modele permet de reduire les couts d'acquisition fonciere de 40% et d'accelerer la mise sur le marche.", source: "Business Immo", date: "Il y a 6j", readTime: "5 min", tag: "Reconversion", tagColor: COLORS.green, score: 83, url: "https://www.businessimmo.com/thematiques/logistique" },
  { id: 8, category: "marche", categoryLabel: "Marche & tendances", title: "Shurgard ouvre 4 nouveaux sites en France et vise 100 implantations d'ici 2027", summary: "Le leader europeen du self storage accelere son expansion française. 4 nouveaux centres ouverts en 2025 dont deux en region parisienne. L'objectif de 100 sites en France d'ici 2027 confirme le potentiel inexploite du marche hexagonal.", source: "Les Echos", date: "Il y a 1j", readTime: "4 min", tag: "Expansion", tagColor: COLORS.orange, score: 90, url: "https://www.lesechos.fr" },
];

const COMPETITORS_SS = [
  { name: "Shurgard France", hq: "Paris", sites: "62 sites", presence: ["Paris IDF", "Lyon", "Bordeaux", "Lille", "Marseille"], strategy: "Leader europeen du self storage, presente en France depuis 2000. Strategie d'expansion aggressive : 4 ouvertures en 2025, objectif 100 sites en France d'ici 2027. Positionnement premium avec acces 24h/24.", recentMoves: ["4 nouveaux sites en 2025 dont 2 en IDF", "Lancement app mobile client avec gestion totale", "Partenariat avec des agences immobilieres pour la clientele de demenagement"], threat: "high", color: "#e63946" },
  { name: "Homebox", hq: "Paris", sites: "45 sites", presence: ["IDF", "Lyon", "Nice", "Toulouse", "Nantes"], strategy: "Acteur 100% français, deuxieme du marche. Forte image de marque locale. Montee en gamme avec des offres B2B dediees aux TPE/PME. Presente dans 20 villes françaises.", recentMoves: ["Offre B2B Homebox Pro lancee en 2025", "3 ouvertures en zones d'activites periurbaines", "Partenariat La Poste pour la livraison des clients B2B"], threat: "high", color: "#f4a261" },
  { name: "Lok'nStore France", hq: "Paris", sites: "18 sites", presence: ["Paris", "Lyon", "Bordeaux"], strategy: "Operateur britannique en croissance rapide en France. Positionnement mid-market, cible prioritairement les entreprises et les artisans. Sites principalement en zones d'activites.", recentMoves: ["Acquisition 3 sites en zones d'activites en 2025", "Lancement offre dedie artisans et BTP", "Systeme de controle acces par smartphone"], threat: "medium", color: "#e76f51" },
  { name: "Box'n Go", hq: "Lyon", sites: "22 sites", presence: ["Lyon", "Grenoble", "Clermont-Ferrand", "Dijon"], strategy: "Operateur regional specialise sur le couloir rhodanien. Focus B2B PME/artisans. Prix agressifs et proximite des zones d'activites. Cible les marchés secondaires delaisses par Shurgard.", recentMoves: ["Extension site de Corbas (Lyon Sud) de 2 000 m2", "Nouveau site a Grenoble zone industrielle", "Offre domiciliation pour les micro-entreprises"], threat: "medium", color: "#457b9d" },
  { name: "Costockage", hq: "Paris", sites: "12 sites", presence: ["IDF", "Nantes", "Rennes"], strategy: "Pure player digital, modele 100% self-service. Acces autonome, gestion en ligne, prix transparents. Cible une clientele d'entrepreneurs et e-commercants. Croissance rapide via le digital.", recentMoves: ["Levee de fonds 8 M EUR pour acceleration France", "Partenariat Amazon FBA pour les vendeurs independants", "Lancement abonnement mensuel sans engagement"], threat: "low", color: "#6a994e" },
];

const RADAR_SS = [
  { label: "Surface totale self storage France", value: "1,5", unit: "M m2", delta: "+8% par an", up: true },
  { label: "Taux d'occupation moyen France", value: "85", unit: "%", delta: "Grandes agglomerations", up: true },
  { label: "Loyer moyen Paris", value: "45", unit: "EUR/m2/mois", delta: "+10% sur 1 an", up: true },
  { label: "Part clientele B2B en France", value: "40", unit: "%", delta: "En hausse continue", up: true },
  { label: "Nombre de sites en France", value: "650+", unit: "sites", delta: "+60 en 2025", up: true },
  { label: "Deficit d'offre estime", value: "30", unit: "%", delta: "vs marche UK", up: false },
];

const ZONES_SS = [
  { zone: "Ile-de-France (Paris + petite couronne)", activity: 10, deals: "Marche sature", highlight: "Loyers les plus eleves, taux d'occupation >90%, rarete des locaux adaptables" },
  { zone: "Auvergne-Rhone-Alpes (Lyon, Grenoble)", activity: 8, deals: "Fort potentiel", highlight: "2e marche national, forte presence PME et artisans, zones d'activites disponibles" },
  { zone: "Nouvelle-Aquitaine (Bordeaux)", activity: 7, deals: "En expansion", highlight: "Croissance demographique rapide, offre insuffisante face a la demande B2B" },
  { zone: "Grand Ouest (Nantes, Rennes)", activity: 6, deals: "Emergent", highlight: "Economies dynamiques, forte creation d'entreprises, peu d'operateurs etablis" },
  { zone: "Hauts-de-France (Lille, Amiens)", activity: 5, deals: "Sous-equipe", highlight: "Tissu industriel dense, demande PME/artisans non satisfaite, foncier accessible" },
  { zone: "PACA (Marseille, Nice, Toulon)", activity: 6, deals: "Actif", highlight: "Forte densite entrepreneuriale, tourisme professionnel, expansion Shurgard en cours" },
];

// ─── CHATBOT DATA ──────────────────────────────────────────────────────────────

const RESPONSES = {
  resume: `Voici le brief de la semaine sur le marche logistique francais :

MARCHE LOCATIF
3,2 millions de m2 places en France en 2025 selon JLL — normalisation apres les records post-Covid. La dorsale (Lille-Paris-Lyon-Marseille) concentre 53% des volumes.

INVESTISSEMENT
3 milliards EUR investis en logistique France en 2025. Les Americains (33%), Britanniques (12%) et Canadiens (12%) dominent. Le marche lillois affiche +62% au S1 2025.

TRANSACTIONS MAJEURES
AEW acquiert 5 actifs de logistique urbaine en France (97 000 m2, ~120 M EUR). P3 Logistic Parks s'empare d'une plateforme 56 000 m2 pres d'Avignon. Prologis rachete un portefeuille Union Investment.

CORRIDOR NORD (E-VALLEY)
Le Canal Seine-Nord continue de valoriser les actifs de Cambrai et Marquion. Connectivite trimodale unique — tres favorable pour le portefeuille Castignac/Brookfield.

ESG
Obligation solaire sur les entrepots de +5 000 m2. Taux prime stable a 4,7%.`,

  loyers: `Loyers de l'immobilier logistique en France :

- Loyer prime classe A IDF : 82 EUR/m2/an, en hausse de +6% sur 1 an
- Valeurs locatives stables en regions avec disparites selon qualite des actifs
- Les actifs certifies BREEAM/HQE commandent une prime de 8 a 12%
- Croissance prevue des loyers : 1,5% a 2% par an sur les 2 prochaines annees
- La rarete du foncier en IDF continue de soutenir les loyers sur Roissy, Orly et Sénart.`,

  canal: `Canal Seine-Nord Europe et impacts logistiques :

- Chantier en cours, connectivite trimodale (route, fer, voie d'eau)
- Actifs du corridor Cambrai-Marquion-Dunkerque valorises +15% en anticipation
- Le parc e-Valley a Cambrai (Castignac/Brookfield) est en premiere ligne
- Connexion directe aux ports de Dunkerque, Le Havre, Anvers et Rotterdam
- 1 300+ emplois crees sur e-Valley, 550 000 m2 d'entrepots construits
- Hauts-de-France = 21% de la demande nationale logistique`,

  selfStorage: `Self Storage B2B France — points cles :

- Marche français : 1,5 M m2, croissance de 8% par an
- Taux d'occupation moyen : 85% sur les grandes agglomerations
- Les TPE/PME representent 40% de la clientele — segment le plus porteur
- Loyer moyen Paris : 45 EUR/m2/mois, +10% sur 1 an
- Deficit d'offre estime a 30% vs le marche britannique
- Opportunite : zones d'activites periurbaines, acces 24h/24, digitalisation totale
- Concurrents a surveiller : Shurgard (62 sites, objectif 100 en 2027) et Homebox (45 sites)`,

  default: `Je peux vous renseigner sur :

- Le resume de l'actualite de la semaine (logistique)
- Les loyers et indicateurs du marche logistique français
- Le Canal Seine-Nord et l'impact sur e-Valley
- Le marche du self storage B2B en France
- Les concurrents actifs en France

Que souhaitez-vous savoir ?`
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("resum") || m.includes("actuali") || m.includes("semaine") || m.includes("brief")) return RESPONSES.resume;
  if (m.includes("loyer") || m.includes("idf") || m.includes("prix") || m.includes("m2")) return RESPONSES.loyers;
  if (m.includes("canal") || m.includes("seine") || m.includes("cambrai") || m.includes("e-valley")) return RESPONSES.canal;
  if (m.includes("self") || m.includes("storage") || m.includes("stockage")) return RESPONSES.selfStorage;
  return RESPONSES.default;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const color = score >= 85 ? COLORS.success : score >= 65 ? COLORS.warning : COLORS.gray400;
  const label = score >= 85 ? "Haute pertinence" : score >= 65 ? "Pertinence moyenne" : "Info generale";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: color + "15", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color }}>{score}</div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function ThreatBadge({ level }) {
  const map = { high: { label: "Concurrent direct", color: COLORS.danger }, medium: { label: "A surveiller", color: COLORS.warning }, low: { label: "Veille passive", color: COLORS.success } };
  const { label, color } = map[level];
  return <span style={{ fontSize: 11, fontWeight: 600, background: color + "15", color, borderRadius: 4, padding: "2px 8px" }}>{label}</span>;
}

function ArticleCard({ article, categories, view }) {
  const [hovered, setHovered] = useState(false);
  const cat = categories.find(c => c.id === article.category);
  const handleClick = () => window.open(article.url, "_blank");

  if (view === "list") {
    return (
      <div onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 24px", background: hovered ? COLORS.bluePale : COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, cursor: "pointer", transition: "background 0.15s" }}>
        <div style={{ width: 3, minHeight: 60, borderRadius: 3, background: cat?.color || COLORS.blue, flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: cat?.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{article.categoryLabel}</span>
            <span style={{ fontSize: 11, background: article.tagColor + "15", color: article.tagColor, borderRadius: 4, padding: "1px 7px", fontWeight: 600 }}>{article.tag}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.gray800, marginBottom: 4, lineHeight: 1.45 }}>{article.title}</div>
          <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.55 }}>{article.summary}</div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right", minWidth: 130 }}>
          <ScoreBadge score={article.score} />
          <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 8 }}>{article.date}</div>
          <div style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${hovered ? COLORS.blue : COLORS.gray200}`, padding: 20, cursor: "pointer", transition: "all 0.15s", boxShadow: hovered ? `0 6px 24px ${COLORS.blue}18` : "0 1px 3px #0001", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: cat?.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{article.categoryLabel}</span>
        <span style={{ fontSize: 11, background: article.tagColor + "15", color: article.tagColor, borderRadius: 4, padding: "2px 8px", fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{article.tag}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navyDeep, lineHeight: 1.45 }}>{article.title}</div>
      <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.6, flex: 1 }}>{article.summary}</div>
      <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.gray100}` }}>
        <ScoreBadge score={article.score} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source} · {article.readTime}</span>
          <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>Lire l'article →</span>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ comp }) {
  const [expanded, setExpanded] = useState(false);
  const siteLabel = comp.sites || comp.frenchAssets;
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
      <div style={{ borderTop: `3px solid ${comp.color}`, padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navyDeep, margin: "0 0 3px" }}>{comp.name}</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>Siege : {comp.hq}</span>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>·</span>
              <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>{siteLabel}</span>
            </div>
          </div>
          <ThreatBadge level={comp.threat} />
        </div>
        <p style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.6, margin: "0 0 10px" }}>{comp.strategy}</p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          {comp.presence.map(z => <span key={z} style={{ fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, borderRadius: 4, padding: "2px 7px", fontWeight: 600 }}>{z}</span>)}
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {expanded ? "Masquer" : "Dernieres operations"}
        </button>
      </div>
      {expanded && (
        <div style={{ background: COLORS.gray50, padding: "14px 22px", borderTop: `1px solid ${COLORS.gray200}` }}>
          {comp.recentMoves.map((move, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
              <span style={{ color: comp.color, fontSize: 13, flexShrink: 0, fontWeight: 700 }}>→</span>
              <span style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.5 }}>{move}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VeilleSection({ articles, categories, accentColor, featuredTitle, featuredSub, featuredUrl }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <aside style={{ width: 210, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, padding: "22px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 16px 10px", fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em" }}>Categories</div>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 16px", background: activeCategory === cat.id ? COLORS.bluePale : "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRight: activeCategory === cat.id ? `3px solid ${accentColor}` : "3px solid transparent", transition: "all 0.15s" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: activeCategory === cat.id ? 700 : 400, color: activeCategory === cat.id ? accentColor : COLORS.gray600 }}>{cat.label}</span>
          </button>
        ))}
        <div style={{ margin: "18px 16px 0", paddingTop: 16, borderTop: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Sources</div>
          {["Voxlog", "Business Immo", "Le Moniteur", "Les Echos", "SSA France", "LSA Conso"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", fontSize: 12, color: COLORS.gray600 }}>
              <span style={{ color: COLORS.success, fontSize: 9 }}>●</span>{s}
            </div>
          ))}
        </div>
      </aside>
      <main style={{ flex: 1, padding: "24px 26px", minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Articles cette semaine", value: articles.length, delta: "France uniquement" },
            { label: "Score moyen", value: Math.round(articles.reduce((a, b) => a + b.score, 0) / articles.length), delta: "/ 100" },
            { label: "Haute pertinence", value: articles.filter(a => a.score >= 85).length, delta: "articles" },
            { label: "Sources actives", value: "6", delta: "en ligne" },
          ].map(s => (
            <div key={s.label} style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.navyDeep }}>{s.value}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.success }}>{s.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {activeCategory === "all" && search === "" && (
          <div onClick={() => window.open(featuredUrl, "_blank")}
            style={{ background: `linear-gradient(135deg, ${COLORS.navyDeep}, ${COLORS.navyMid})`, borderRadius: 14, padding: "22px 26px", marginBottom: 18, position: "relative", overflow: "hidden", cursor: "pointer" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: accentColor + "20", borderRadius: "50%" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ background: accentColor, color: COLORS.white, fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 8px", textTransform: "uppercase" }}>A la une</span>
                <span style={{ background: "#ffffff18", color: "#ffffffaa", fontSize: 10, fontWeight: 600, borderRadius: 4, padding: "2px 8px" }}>Haute pertinence</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.white, margin: "0 0 6px", lineHeight: 1.35, maxWidth: 520 }}>{featuredTitle}</h3>
              <p style={{ color: "#ffffffaa", fontSize: 13, lineHeight: 1.55, maxWidth: 480, margin: "0 0 12px" }}>{featuredSub}</p>
              <span style={{ background: accentColor, color: COLORS.white, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>Lire l'article →</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans les articles..." style={{ border: `1px solid ${COLORS.gray200}`, borderRadius: 8, padding: "6px 12px", fontSize: 13, outline: "none", color: COLORS.gray800, width: 240 }} />
            </div>
            <p style={{ fontSize: 11, color: COLORS.gray400, margin: "4px 0 0" }}>{filtered.length} resultat{filtered.length > 1 ? "s" : ""} · Sources françaises uniquement</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${view === v ? accentColor : COLORS.gray200}`, background: view === v ? COLORS.bluePale : COLORS.white, color: view === v ? accentColor : COLORS.gray600, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                {v === "grid" ? "Grille" : "Liste"}
              </button>
            ))}
          </div>
        </div>

        {view === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {filtered.map(a => <ArticleCard key={a.id} article={a} categories={categories} view="grid" />)}
          </div>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
            {filtered.map(a => <ArticleCard key={a.id} article={a} categories={categories} view="list" />)}
          </div>
        )}
      </main>
    </div>
  );
}

function RadarSection({ radarData, zones, title, subtitle }) {
  return (
    <main style={{ flex: 1, padding: "26px 28px" }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navyDeep, margin: "0 0 4px" }}>{title}</h2>
        <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 26 }}>
        {radarData.map(item => (
          <div key={item.label} style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 5 }}>{item.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 5 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.navyDeep, lineHeight: 1 }}>{item.value}</span>
              <span style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 500 }}>{item.unit}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: item.up ? COLORS.success : COLORS.warning }}>{item.up ? "En hausse" : "En baisse"} · {item.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>Zones strategiques — Activite 2025</div>
        {zones.map(row => (
          <div key={row.zone} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800, marginBottom: 2 }}>{row.zone}</div>
              <div style={{ fontSize: 11, color: COLORS.gray400 }}>{row.highlight}</div>
            </div>
            <div style={{ width: 130 }}>
              <div style={{ height: 5, background: COLORS.gray100, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${row.activity * 10}%`, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, minWidth: 110, textAlign: "right" }}>{row.deals}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

function ConcurrentsSection({ competitors, title, subtitle }) {
  return (
    <main style={{ flex: 1, padding: "26px 28px" }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navyDeep, margin: "0 0 4px" }}>{title}</h2>
        <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Concurrents directs", value: competitors.filter(c => c.threat === "high").length, color: COLORS.danger },
          { label: "A surveiller", value: competitors.filter(c => c.threat === "medium").length, color: COLORS.warning },
          { label: "Veille passive", value: competitors.filter(c => c.threat === "low").length, color: COLORS.success },
          { label: "Operations tracees", value: competitors.reduce((acc, c) => acc + c.recentMoves.length, 0), color: COLORS.blue },
        ].map(s => (
          <div key={s.label} style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {competitors.map(comp => <CompetitorCard key={comp.name} comp={comp} />)}
      </div>
    </main>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────────────────────

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Je suis votre assistant BTWatch.\n\nCliquez sur un raccourci ou posez votre question sur le marche logistique ou le self storage français." }
  ]);
  const [input, setInput] = useState("Resumé moi l'actualité de la semaine");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, open]);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getResponse(msg) }]);
      setLoading(false);
    }, 700);
  };

  const SHORTCUTS = ["Resumé l'actualite de la semaine", "Loyers logistique IDF", "Self storage B2B France", "Canal Seine-Nord"];

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", cursor: "pointer", boxShadow: "0 4px 16px #2a7de144", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={{ position: "fixed", bottom: 88, right: 24, zIndex: 999, width: 340, height: 460, background: COLORS.white, borderRadius: 16, boxShadow: "0 16px 48px #0f244040", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${COLORS.gray200}` }}>
          <div style={{ background: COLORS.navyDeep, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏗</div>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 13 }}>Assistant BTWatch</div>
              <div style={{ color: COLORS.blueLight, fontSize: 11 }}>Marche français</div>
            </div>
            <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: COLORS.success }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%", background: msg.role === "user" ? COLORS.blue : COLORS.gray100, color: msg.role === "user" ? COLORS.white : COLORS.gray800, borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ background: COLORS.gray100, borderRadius: "12px 12px 12px 3px", padding: "10px 14px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.gray400, animation: `bounce 1s infinite ${i * 0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "6px 10px", display: "flex", gap: 5, overflowX: "auto", borderTop: `1px solid ${COLORS.gray100}` }}>
            {SHORTCUTS.map(q => (
              <button key={q} onClick={() => send(q)} style={{ whiteSpace: "nowrap", fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, border: "none", borderRadius: 16, padding: "3px 9px", cursor: "pointer", fontWeight: 600 }}>{q}</button>
            ))}
          </div>

          <div style={{ padding: "8px 10px", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", gap: 7 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Posez votre question..." style={{ flex: 1, border: `1px solid ${COLORS.gray200}`, borderRadius: 8, padding: "7px 11px", fontSize: 13, outline: "none", color: COLORS.gray800 }} />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 34, height: 34, borderRadius: "50%", background: input.trim() ? COLORS.blue : COLORS.gray200, border: "none", cursor: input.trim() ? "pointer" : "default", color: COLORS.white, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </>
  );
}

// ─── PDF ──────────────────────────────────────────────────────────────────────

function generatePDF(section) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 18, contentW = 210 - margin * 2;
  let y = 0;
  const check = (n) => { if (y + n > 272) { doc.addPage(); y = 20; } };
  const heading = (text) => {
    check(12);
    doc.setFillColor(232, 242, 255);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    doc.text(text, margin + 4, y + 5.5); y += 13;
  };

  // Header
  doc.setFillColor(15, 36, 64); doc.rect(0, 0, 210, 44, "F");
  doc.setFillColor(42, 125, 225); doc.roundedRect(margin, 11, 22, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.text("BT", margin + 5, 20); doc.setFontSize(7); doc.text("IMMO", margin + 3, 27);
  doc.setFontSize(17); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text(`BTWatch - Brief ${section === "ss" ? "Self Storage" : "Logistique"}`, margin + 28, 21);
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`Semaine du ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} - Marche francais`, margin + 28, 29);
  doc.text("BT Immo Group - Asset Management - Document confidentiel", margin + 28, 36);
  y = 54;

  const radarData = section === "ss" ? RADAR_SS : RADAR_LOG;
  const articles = (section === "ss" ? ARTICLES_SS : ARTICLES_LOG).filter(a => a.score >= 85);
  const competitors = (section === "ss" ? COMPETITORS_SS : COMPETITORS_LOG).filter(c => c.threat === "high");

  // Radar
  heading(section === "ss" ? "RADAR MARCHE SELF STORAGE FRANCE" : "RADAR MARCHE LOGISTIQUE FRANCE");
  const rW = (contentW - 8) / 3;
  radarData.forEach((item, i) => {
    const col = i % 3, x = margin + col * (rW + 4);
    if (col === 0 && i > 0) y += 20;
    check(20);
    doc.setFillColor(248, 250, 252); doc.roundedRect(x, y, rW, 17, 2, 2, "F");
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
    doc.text(doc.splitTextToSize(item.label, rW - 6)[0], x + 3, y + 5);
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    doc.text(`${item.value} ${item.unit}`, x + 3, y + 12);
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.setTextColor(...(item.up ? [16, 185, 129] : [245, 158, 11]));
    doc.text(item.delta, x + rW - 3, y + 15, { align: "right" });
  });
  y += 26;

  // Articles
  heading("ARTICLES - HAUTE PERTINENCE (score >= 85)");
  articles.slice(0, 5).forEach(article => {
    check(34);
    doc.setFillColor(16, 185, 129); doc.circle(margin + 5, y + 5, 5, "F");
    doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text(String(article.score), margin + 5, y + 6.8, { align: "center" });
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(42, 125, 225);
    doc.text(article.categoryLabel.toUpperCase(), margin + 13, y + 4);
    doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    doc.text(`${article.source} - ${article.date}`, margin + 13, y + 9);
    y += 13;
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    const tL = doc.splitTextToSize(article.title, contentW - 6);
    doc.text(tL, margin + 3, y); y += tL.length * 5 + 1;
    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
    const sL = doc.splitTextToSize(article.summary, contentW - 6).slice(0, 2);
    doc.text(sL, margin + 3, y); y += sL.length * 4.5 + 4;
    doc.setFontSize(7.5); doc.setTextColor(42, 125, 225);
    doc.text(`Source : ${article.url}`, margin + 3, y); y += 7;
    doc.setDrawColor(226, 232, 240); doc.line(margin, y, margin + contentW, y); y += 5;
  });

  // Concurrents
  heading("VEILLE CONCURRENTS DIRECTS");
  competitors.forEach(comp => {
    check(30);
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    doc.text(comp.name, margin, y);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    const info = comp.sites ? `${comp.hq} - ${comp.sites}` : `${comp.hq} - ${comp.frenchAssets}`;
    doc.text(info, margin + 50, y); y += 7;
    comp.recentMoves.slice(0, 2).forEach(move => {
      check(8);
      const lines = doc.splitTextToSize(`-> ${move}`, contentW - 6);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
      doc.text(lines, margin + 4, y); y += lines.length * 4.5 + 2;
    });
    y += 4; doc.setDrawColor(226, 232, 240); doc.line(margin, y - 2, margin + contentW, y - 2);
  });

  // Footer
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 36, 64); doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    doc.text("BT Immo Group - Asset Management - Document confidentiel", margin, 292);
    doc.text(`Page ${i} / ${total}`, 210 - margin, 292, { align: "right" });
  }
  doc.save(`BTWatch_Brief_${section === "ss" ? "SelfStorage" : "Logistique"}_${now.toISOString().split("T")[0]}.pdf`);
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [sector, setSector] = useState("log");
  const [subPage, setSubPage] = useState("veille");

  const NAV_SECTORS = [
    { id: "log", label: "Logistique" },
    { id: "ss", label: "Self Storage" },
  ];
  const NAV_PAGES = [
    { id: "veille", label: "Veille" },
    { id: "radar", label: "Radar marche" },
    { id: "concurrents", label: "Concurrents" },
  ];

  const accentColor = sector === "ss" ? COLORS.orange : COLORS.blue;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", background: COLORS.gray50, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: COLORS.navyDeep, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px #0004" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="BT Immo Group" style={{ height: 46, width: "auto", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ borderLeft: "1px solid #ffffff25", paddingLeft: 10 }}>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15 }}>BT<span style={{ color: COLORS.blueLight }}>Watch</span></div>
              <div style={{ color: COLORS.gray400, fontSize: 9, letterSpacing: "0.09em", textTransform: "uppercase" }}>Intelligence Platform</div>
            </div>
          </div>

          {/* Sector tabs */}
          <div style={{ display: "flex", gap: 2, background: "#ffffff10", borderRadius: 8, padding: 3 }}>
            {NAV_SECTORS.map(s => (
              <button key={s.id} onClick={() => { setSector(s.id); setSubPage("veille"); }}
                style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: sector === s.id ? COLORS.white : "transparent", color: sector === s.id ? COLORS.navyDeep : COLORS.gray400, fontWeight: sector === s.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Page nav */}
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV_PAGES.map(p => (
              <button key={p.id} onClick={() => setSubPage(p.id)}
                style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: subPage === p.id ? "#ffffff18" : "transparent", color: subPage === p.id ? COLORS.white : COLORS.gray400, fontWeight: subPage === p.id ? 600 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {p.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => generatePDF(sector)}
            style={{ padding: "7px 15px", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", borderRadius: 8, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Exporter PDF
          </button>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navyMid})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 13, fontWeight: 700 }}>A</div>
        </div>
      </header>

      {/* Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {subPage === "veille" && sector === "log" && (
          <VeilleSection articles={ARTICLES_LOG} categories={CATEGORIES_LOG} accentColor={COLORS.blue}
            featuredTitle="Canal Seine-Nord : les actifs logistiques du corridor nord valorises 15% de plus"
            featuredSub="L'avancement du chantier genere un fort effet d'anticipation sur Cambrai, Marquion et Dunkerque. Le parc e-Valley est en premiere ligne."
            featuredUrl="https://www.voxlog.fr/actualite/10609/marche-francais-des-entrepots-arthur-loyd-logistique-dresse-le-bilan-d-une-annee-2025-chahutee" />
        )}
        {subPage === "veille" && sector === "ss" && (
          <VeilleSection articles={ARTICLES_SS} categories={CATEGORIES_SS} accentColor={COLORS.orange}
            featuredTitle="Les TPE/PME representent desormais 40% de la clientele du self storage en France"
            featuredSub="Le segment B2B est le plus porteur du secteur. Flexibilite, sans bail commercial, acces 24h/24 : les PME adoptent massivement le self storage."
            featuredUrl="https://www.self-stockage.org" />
        )}
        {subPage === "radar" && (
          <RadarSection
            radarData={sector === "log" ? RADAR_LOG : RADAR_SS}
            zones={sector === "log" ? ZONES_LOG : ZONES_SS}
            title={sector === "log" ? "Radar Marche Logistique Francais" : "Radar Marche Self Storage B2B France"}
            subtitle={sector === "log" ? "Indicateurs cles — Sources : JLL, Arthur Loyd, EOL, Voxlog" : "Indicateurs cles — Sources : SSA France, Observatoire du Self Storage, CBRE"} />
        )}
        {subPage === "concurrents" && (
          <ConcurrentsSection
            competitors={sector === "log" ? COMPETITORS_LOG : COMPETITORS_SS}
            title={sector === "log" ? "Concurrents — Marche logistique francais" : "Concurrents — Self Storage B2B France"}
            subtitle={sector === "log" ? "Acteurs de l'immobilier logistique actifs en France" : "Operateurs de self storage cibles B2B en France"} />
        )}
      </div>

      <Chatbot />
    </div>
  );
}
