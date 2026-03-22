import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

const COLORS = {
  navyDeep: "#0f2440", navyMid: "#1a3a5c", blue: "#2a7de1", blueLight: "#4a9eff",
  bluePale: "#e8f2ff", cyan: "#00b4d8", white: "#ffffff", gray50: "#f8fafc",
  gray100: "#f1f5f9", gray200: "#e2e8f0", gray400: "#94a3b8", gray600: "#475569",
  gray800: "#1e293b", success: "#10b981", warning: "#f59e0b", danger: "#ef4444",
  purple: "#7c3aed", teal: "#0d9488", green: "#059669",
};

const CATEGORIES = [
  { id: "all", label: "Toutes", color: COLORS.blue },
  { id: "ma", label: "Fusions & Acquisitions", color: COLORS.purple },
  { id: "finance", label: "Marches financiers", color: COLORS.green },
  { id: "immo", label: "Immobilier logistique", color: COLORS.blue },
  { id: "esg", label: "ESG & Durabilite", color: COLORS.teal },
];

const ARTICLES = [
  {
    id: 1, category: "ma", categoryLabel: "Fusions & Acquisitions",
    title: "Prologis rachete un portefeuille logistique d'Union Investment pour 160 M EUR",
    summary: "Le leader mondial de l'immobilier logistique realise une acquisition majeure en France. Les actifs cibles sont principalement situes sur la dorsale logistique française, zones les plus recherchees par les grands utilisateurs e-commerce et 3PL.",
    source: "Business Immo", date: "Il y a 2h", readTime: "4 min", tag: "Exclusif", tagColor: COLORS.purple, trend: "up", score: 95,
    url: "https://www.businessimmo.com/actualites/article/139286302/ab-sagax-cloture-lannee-par-une-nouvelle-acquisition-en-france"
  },
  {
    id: 2, category: "immo", categoryLabel: "Immobilier logistique",
    title: "Marche francais des entrepots : 3 millions de m2 places en 2025, une annee chautee",
    summary: "Arthur Loyd Logistique dresse un bilan contenu de l'annee 2025. La demande placee accuse une baisse de 3% par rapport a 2024, avec 3 007 245 m2 exactement. Les 3PL representent 45% des surfaces louees, devant les industriels a 24%. Amazon reste le principal moteur e-commerce.",
    source: "Voxlog", date: "Il y a 5h", readTime: "5 min", tag: "Bilan annuel", tagColor: COLORS.blue, trend: "up", score: 92,
    url: "https://www.voxlog.fr/actualite/10609/marche-francais-des-entrepots-arthur-loyd-logistique-dresse-le-bilan-d-une-annee-2025-chahutee"
  },
  {
    id: 3, category: "immo", categoryLabel: "Immobilier logistique",
    title: "JLL : 3,2 millions de m2 echanges en France en 2025, marche en normalisation",
    summary: "JLL qualifie le marche logistique francais de secteur en plein cycle de normalisation. La dorsale concentre 53% des volumes places, portee par les Hauts-de-France (21%) et l'IDF (20%). Les grandes surfaces de 20 000 a 40 000 m2 bondissent de 20% en 2025.",
    source: "Voxlog", date: "Il y a 8h", readTime: "4 min", tag: "Marche", tagColor: COLORS.blue, trend: "neutral", score: 88,
    url: "https://www.voxlog.fr/actualite/10522/immobilier-logistique-jll-constate-une-baisse-de-la-demande-placee-francaise-en-2025"
  },
  {
    id: 4, category: "finance", categoryLabel: "Marches financiers",
    title: "13,7 Mds EUR investis en immobilier d'entreprise en France en 2025 selon ImmoStat",
    summary: "L'immobilier logistique capte une part croissante des volumes investis en France. Les Americains (33%), Britanniques (12%) et Canadiens (12%) dominent les acquisitions. Les transactions inferieures a 50 M EUR concentrent plus de la moitie des volumes.",
    source: "Business Immo", date: "Il y a 10h", readTime: "5 min", tag: "Analyse", tagColor: COLORS.green, trend: "up", score: 75,
    url: "https://www.businessimmo.com/thematiques/logistique"
  },
  {
    id: 5, category: "ma", categoryLabel: "Fusions & Acquisitions",
    title: "AEW acquiert 5 actifs de logistique urbaine en France pour environ 120 M EUR",
    summary: "AEW confirme l'acquisition d'un portefeuille de 97 000 m2 comprenant cinq actifs de logistique urbaine en France pour un investisseur institutionnel francais, aupres de PFA Logistics represente par Columbia Threadneedle Investment.",
    source: "Business Immo", date: "Il y a 1j", readTime: "3 min", tag: "Transaction", tagColor: COLORS.purple, trend: "up", score: 90,
    url: "https://www.businessimmo.com/actualites/article/891361275/aew-confirme-lacquisition-de-cinq-actifs-de-logistique-urbaine"
  },
  {
    id: 6, category: "immo", categoryLabel: "Immobilier logistique",
    title: "Canal Seine-Nord : les actifs logistiques du corridor nord valorises 15% de plus",
    summary: "L'avancement du chantier du canal Seine-Nord genere un fort effet d'anticipation sur les valorisations immobilieres du corridor nord. Les zones de Cambrai, Marquion et Dunkerque concentrent les demandes. Le parc e-Valley est en premiere ligne avec une connectivite trimodale unique.",
    source: "Le Moniteur", date: "Il y a 1j", readTime: "5 min", tag: "Infrastructure", tagColor: COLORS.blue, trend: "up", score: 97,
    url: "https://www.lemoniteur.fr/article/les-entrepots-de-e-valley-et-du-nord-en-plein-essor.2310862"
  },
  {
    id: 7, category: "esg", categoryLabel: "ESG & Durabilite",
    title: "Toitures d'entrepots et ombrieres photovoltaiques : une manne energetique pour la logistique",
    summary: "La reglementation pousse a la solarisation des entrepots francais. Sunrock importe son savoir-faire en France, l'autoconsommation est en plein essor. Les entrepots de plus de 5 000 m2 sont desormais soumis a obligation d'installation solaire ou vegetalisee.",
    source: "Voxlog", date: "Il y a 2j", readTime: "6 min", tag: "Reglementation", tagColor: COLORS.teal, trend: "up", score: 82,
    url: "https://www.voxlog.fr/actualite/10273/regard-dexpert-les-marches-de-limmobilier-logistique-resistent-en-depit-du-contexte"
  },
  {
    id: 8, category: "finance", categoryLabel: "Marches financiers",
    title: "Marche investissement logistique lillois : 367 M EUR au S1 2025, en hausse de 62%",
    summary: "Le marche d'investissement lillois enregistre une performance solide portee par la logistique. Les Hauts-de-France representent 21% de la demande placee nationale, confirment leur role de premier marche regional logistique francais grace au dynamisme du corridor nord.",
    source: "Business Immo", date: "Il y a 2j", readTime: "4 min", tag: "Regions", tagColor: COLORS.green, trend: "up", score: 70,
    url: "https://www.businessimmo.com/actualites/article/316424374/un-marche-de-linvestissement-lillois-porte-par-la-logistique"
  },
  {
    id: 9, category: "ma", categoryLabel: "Fusions & Acquisitions",
    title: "P3 Logistic Parks s'empare d'une plateforme de 56 000 m2 pres d'Avignon",
    summary: "Le gestionnaire d'actifs logistiques europeen realise une nouvelle acquisition dans le sud de la France. L'actif situe pres d'Avignon renforce la presence de P3 sur l'axe Rhone-Mediterranee, un corridor logistique en forte croissance grace au port de Marseille-Fos.",
    source: "Business Immo", date: "Il y a 3j", readTime: "3 min", tag: "Transaction", tagColor: COLORS.purple, trend: "neutral", score: 85,
    url: "https://www.businessimmo.com/actualites/liste/fil-dactus"
  },
];

const COMPETITORS = [
  {
    name: "Prologis France", hq: "Paris 8e", frenchAssets: "3,8M m2",
    presence: ["Ile-de-France", "Lyon", "Marseille", "Lille", "Bordeaux"],
    strategy: "Leader du marche francais. Strategie de retention des grands locataires e-commerce (Amazon, Cdiscount, La Poste). Forte activite de restructuration d'actifs existants faute de foncier disponible en IDF.",
    recentMoves: ["Rachat portefeuille Union Investment pour 160 M EUR", "Renouvellement bail 10 ans avec Amazon sur Sénart (85 000 m2)", "Programme de renovation energetique sur 12 actifs francais"],
    threat: "high", color: "#e63946",
  },
  {
    name: "Panattoni France", hq: "Paris 17e", frenchAssets: "1,2M m2",
    presence: ["Axe A10 (Paris-Orleans)", "PACA", "Grand Est", "Bordeaux"],
    strategy: "Developpeur pur player, specialiste du build-to-suit en France. Tres actif sur les marches regionaux. Strategie d'entree sur les friches industrielles pour contourner la loi ZAN. Strategie de developpement urbain en IDF.",
    recentMoves: ["Strategie de developpement urbain en Ile-de-France confirmee", "BTS pour Geodis et XPO sur l'axe A10 (55 000 m2 chacun)", "Acquisition friche industrielle a Mulhouse pour reconversion logistique"],
    threat: "high", color: "#f4a261",
  },
  {
    name: "Goodman France", hq: "Paris 9e", frenchAssets: "920K m2",
    presence: ["Grand Paris", "Lyon", "Rouen", "Toulouse"],
    strategy: "Positionnement premium sur les actifs urbains et periurbains. Specialiste de l'urban logistics. Strategie de cession selective d'actifs matures pour reinvestir dans le developpement. Net Zero sur l'ensemble du parc francais.",
    recentMoves: ["Livraison entrepot last-mile 18 000 m2 a Saint-Denis", "Certification Net Zero portefeuille francais", "Partenariat avec operateur last-mile pour mutualisation des flux"],
    threat: "medium", color: "#e76f51",
  },
  {
    name: "Segro France", hq: "Paris 8e", frenchAssets: "650K m2",
    presence: ["Grand Paris", "Lyon Metropole", "Aix-Marseille"],
    strategy: "Leader europeen de l'urban logistics en France. Concentre son portefeuille sur les petites et moyennes surfaces proches des centres-villes. Partenariat avec Urby pour la logistique du dernier kilometre.",
    recentMoves: ["Acquisition 3 actifs last-mile en Seine-Saint-Denis", "Lancement Segro Urban Warehouse Paris (8 000 m2, La Courneuve)", "Partenariat Urby pour le dernier kilometre parisien"],
    threat: "medium", color: "#457b9d",
  },
  {
    name: "MG Real Estate France", hq: "Lyon", frenchAssets: "380K m2",
    presence: ["Lyon", "Grenoble", "Clermont-Ferrand", "Dijon"],
    strategy: "Fonds belge tres actif sur le marche regional francais, notamment dans le couloir rhodanien. Strategie value-add : achat d'actifs classe B pour les repositionner en classe A apres renovation energetique.",
    recentMoves: ["Acquisition plateforme 45 000 m2 a Corbas (Lyon Sud)", "Renovation complete actif des annees 90 a Grenoble (certification HQE)", "Etude de faisabilite sur terrain 12 ha pres de Dijon"],
    threat: "low", color: "#6a994e",
  },
];

const RADAR_DATA = [
  { label: "Demande placee France 2025", value: "3,2", unit: "M m2", delta: "Normalisation post-Covid", up: false },
  { label: "Taux de vacance logistique", value: "5,8", unit: "%", delta: "Stabilisation en cours", up: false },
  { label: "Loyer prime IDF (classe A)", value: "82", unit: "EUR/m2/an", delta: "En hausse reguliere", up: true },
  { label: "Volume investi France 2025", value: "3", unit: "Mds EUR", delta: "Actifs unitaires dominants", up: true },
  { label: "Taux de capi prime logistique", value: "4,7", unit: "%", delta: "Stable ce trimestre", up: false },
  { label: "Part dorsale dans les volumes", value: "53", unit: "%", delta: "Lille + IDF en tete", up: true },
];

const ZONES = [
  { zone: "Hauts-de-France (Cambrai, Lille, Calais, Dunkerque)", activity: 9, deals: "21% du national", highlight: "1er marche regional, Canal Seine-Nord catalyseur, e-Valley en plein essor" },
  { zone: "Ile-de-France (Roissy, Orly, Sénart, Moissy)", activity: 9, deals: "20% du national", highlight: "Loyers prime les plus eleves, rarete du foncier, vacance tres basse" },
  { zone: "Centre-Val de Loire (Orleans, Ferrières, Tours)", activity: 8, deals: "Record historique", highlight: "1er marche regional en 2024, hub barycentrique national, foncier competitif" },
  { zone: "Auvergne-Rhone-Alpes (Lyon, Corbas, Macon)", activity: 7, deals: "2e marche national", highlight: "Corridor rhodanien strategique, forte demande des 3PL et industriels" },
  { zone: "Sud-Ouest (Bordeaux, Toulouse)", activity: 4, deals: "En croissance", highlight: "Croissance demographique soutient la demande, marche emergent" },
  { zone: "PACA (Marseille, Avignon, Fos-sur-Mer)", activity: 5, deals: "Port en moteur", highlight: "Port de Marseille-Fos attire les investisseurs, P3 recemment actif" },
];

const ARTICLES_SUMMARY = `Voici l'actualite de cette semaine sur le marche logistique francais :

1. MARCHE LOCATIF : Le marche francais enregistre 3,2 millions de m2 places en 2025 selon JLL, soit une normalisation apres les records post-Covid. La dorsale logistique (Lille-Paris-Lyon-Marseille) concentre 53% des volumes.

2. TRANSACTIONS : AEW a acquis 5 actifs de logistique urbaine en France pour 120 M EUR. P3 Logistic Parks s'est empare d'une plateforme de 56 000 m2 pres d'Avignon. Prologis a rachete un portefeuille Union Investment.

3. INVESTISSEMENT : 13,7 Mds EUR ont ete investis en immobilier d'entreprise en France en 2025 selon ImmoStat. Les Americains (33%), Britanniques (12%) et Canadiens (12%) dominent les acquisitions logistiques.

4. ESG : La reglementation sur les toitures photovoltaiques s'intensifie. Les entrepots de plus de 5 000 m2 sont soumis a obligation d'installation solaire. Le taux prime logistique est stable a 4,7%.

5. CORRIDOR NORD : Le Canal Seine-Nord continue de valoriser les actifs logistiques de Cambrai et Marquion. Le parc e-Valley beneficie d'une connectivite trimodale unique en Europe.`;

function ScoreBadge({ score }) {
  const color = score >= 85 ? COLORS.success : score >= 65 ? COLORS.warning : COLORS.gray400;
  const label = score >= 85 ? "Haute pertinence" : score >= 65 ? "Pertinence moyenne" : "Info generale";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: color + "18", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color }}>{score}</div>
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function ThreatBadge({ level }) {
  const map = { high: { label: "Concurrent direct", color: COLORS.danger }, medium: { label: "A surveiller", color: COLORS.warning }, low: { label: "Veille passive", color: COLORS.success } };
  const { label, color } = map[level];
  return <span style={{ fontSize: 11, fontWeight: 700, background: color + "18", color, borderRadius: 5, padding: "2px 9px" }}>{label}</span>;
}

function ArticleCard({ article, view }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === article.category);
  const handleClick = () => window.open(article.url, "_blank");

  if (view === "list") {
    return (
      <div onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "16px 24px", background: hovered ? COLORS.bluePale : COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, cursor: "pointer", transition: "background 0.15s" }}>
        <div style={{ width: 4, minHeight: 60, borderRadius: 4, background: cat?.color, flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: cat?.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{article.categoryLabel}</span>
            <span style={{ fontSize: 11, background: article.tagColor + "18", color: article.tagColor, borderRadius: 4, padding: "1px 7px", fontWeight: 600 }}>{article.tag}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.gray800, marginBottom: 3, lineHeight: 1.4 }}>{article.title}</div>
          <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.5 }}>{article.summary}</div>
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
      style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${hovered ? COLORS.blue : COLORS.gray200}`, padding: 22, cursor: "pointer", transition: "all 0.18s", boxShadow: hovered ? `0 8px 32px ${COLORS.blue}22` : "0 1px 4px #0001", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: cat?.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{article.categoryLabel}</span>
        <span style={{ fontSize: 11, background: article.tagColor + "18", color: article.tagColor, borderRadius: 5, padding: "2px 8px", fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{article.tag}</span>
      </div>
      <div style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 15, color: COLORS.navyDeep, lineHeight: 1.45 }}>{article.title}</div>
      <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.6, flex: 1 }}>{article.summary}</div>
      <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.gray100}` }}>
        <ScoreBadge score={article.score} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source} - {article.readTime}</span>
          <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>Lire l'article →</span>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ comp }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
      <div style={{ borderTop: `4px solid ${comp.color}`, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>{comp.name}</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>Siege : {comp.hq}</span>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>·</span>
              <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 700 }}>{comp.frenchAssets} en France</span>
            </div>
          </div>
          <ThreatBadge level={comp.threat} />
        </div>
        <p style={{ fontSize: 13.5, color: COLORS.gray600, lineHeight: 1.6, margin: "0 0 12px" }}>{comp.strategy}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {comp.presence.map(z => <span key={z} style={{ fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>{z}</span>)}
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {expanded ? "Masquer" : "Dernieres operations en France"}
        </button>
      </div>
      {expanded && (
        <div style={{ background: COLORS.gray50, padding: "16px 24px", borderTop: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Dernieres operations</div>
          {comp.recentMoves.map((move, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: comp.color, fontSize: 14, flexShrink: 0, fontWeight: 700 }}>→</span>
              <span style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.5 }}>{move}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- CHATBOT ----
const RESPONSES = {
  resume: `Voici le brief de la semaine sur le marche logistique francais :

📊 MARCHE LOCATIF
3,2 millions de m2 places en France en 2025 selon JLL — une normalisation apres les records post-Covid. La dorsale (Lille-Paris-Lyon-Marseille) concentre 53% des volumes. Les Hauts-de-France (21%) et l'IDF (20%) restent les deux premiers marches.

💶 INVESTISSEMENT
3 milliards EUR investis en logistique France en 2025. Les Americains (33%), Britanniques (12%) et Canadiens (12%) dominent. Le marche lillois affiche +62% au S1 2025 avec 367 M EUR engages.

🏭 TRANSACTIONS
AEW acquiert 5 actifs de logistique urbaine en France (97 000 m2, ~120 M EUR). P3 Logistic Parks s'empare d'une plateforme 56 000 m2 pres d'Avignon. Prologis rachete un portefeuille Union Investment.

📈 CORRIDOR NORD (E-VALLEY)
Le Canal Seine-Nord continue de valoriser les actifs de Cambrai et Marquion. Connectivite trimodale unique en Europe — tres favorable pour le portefeuille Castignac.

🌱 ESG
Obligation solaire sur les entrepots de +5 000 m2. Taux prime stable a 4,7%. Les actifs certifies BREEAM commandent une prime locative de 8 a 12%.`,

  loyers: `Les loyers de l'immobilier logistique en Ile-de-France :

• Loyer prime classe A (IDF) : 82 EUR/m2/an — en hausse de +6% sur 1 an
• Valeurs locatives stables en regions avec disparites selon qualite des actifs
• Les actifs certifies (BREEAM, HQE) commandent une prime de 8 a 12%
• L'ILAT a augmente de 2,69% sur 2024, en phase de stabilisation depuis quelques mois
• Croissance prevue des loyers : entre 1,5% et 2% par an sur les 2 prochaines annees

La rarete du foncier en IDF continue de soutenir les loyers sur les axes Roissy, Orly et Sénart.`,

  canal: `Le Canal Seine-Nord Europe et ses impacts logistiques :

• Chantier en cours de finalisation, connectivite trimodale (route, fer, voie d'eau)
• Les actifs du corridor Cambrai-Marquion-Dunkerque sont valorises +15% en anticipation
• Le parc e-Valley a Cambrai (Castignac/Brookfield) est en premiere ligne
• Connexion directe aux ports de Dunkerque, Le Havre et aux ports belges/neerlandais
• 1 300+ emplois crees sur e-Valley, 550 000 m2 d'entrepots construits
• Premier marche regional francais : les Hauts-de-France representent 21% de la demande nationale`,

  default: `Je peux vous renseigner sur :

• Le resume de l'actualite de la semaine
• Les loyers et indicateurs du marche francais
• Le Canal Seine-Nord et l'impact sur e-Valley
• Les transactions et acquisitions recentes
• Les concurrents actifs en France (Prologis, Panattoni, Goodman, Segro)

Que souhaitez-vous savoir ?`
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes("resum") || m.includes("actuali") || m.includes("semaine") || m.includes("semain") || m.includes("brief") || m.includes("semaine")) return RESPONSES.resume;
  if (m.includes("loyer") || m.includes("idf") || m.includes("ile-de-france") || m.includes("prix") || m.includes("m2")) return RESPONSES.loyers;
  if (m.includes("canal") || m.includes("seine") || m.includes("nord") || m.includes("cambrai") || m.includes("e-valley") || m.includes("evalley")) return RESPONSES.canal;
  if (m.includes("prologis") || m.includes("panattoni") || m.includes("goodman") || m.includes("segro") || m.includes("concurrent")) return `Voici les concurrents directs actifs en France :\n\n• Prologis France (Paris 8e) — 3,8M m2, leader du marche, rachat recents portefeuille Union Investment\n• Panattoni France (Paris 17e) — 1,2M m2, developpeur pur, tres actif sur l'axe A10 et en IDF\n• Goodman France (Paris 9e) — 920K m2, premium urban logistics, Net Zero sur tout le parc\n• Segro France (Paris 8e) — 650K m2, specialiste last-mile, partenariat Urby`;
  return RESPONSES.default;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Je suis votre assistant BTWatch.\n\nCliquez sur « Resumé l'actualite de la semaine » ou posez votre question sur le marche logistique francais." }
  ]);
  const [input, setInput] = useState("Resumé moi l'actualité de la semaine");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getResponse(userMsg) }]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1000,
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px #2a7de155",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "none",
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 999,
          width: 360, height: 480,
          background: COLORS.white,
          borderRadius: 18,
          boxShadow: "0 20px 60px #0f244044",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          border: `1px solid ${COLORS.gray200}`,
        }}>
          {/* Header */}
          <div style={{ background: COLORS.navyDeep, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏗</div>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Assistant BTWatch</div>
              <div style={{ color: COLORS.blueLight, fontSize: 11 }}>Marche logistique francais</div>
            </div>
            <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: COLORS.success }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%",
                  background: msg.role === "user" ? COLORS.blue : COLORS.gray100,
                  color: msg.role === "user" ? COLORS.white : COLORS.gray800,
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: COLORS.gray100, borderRadius: "14px 14px 14px 4px", padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gray400, animation: `bounce 1s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          <div style={{ padding: "6px 12px", display: "flex", gap: 6, overflowX: "auto", borderTop: `1px solid ${COLORS.gray100}` }}>
            {["Resumé l'actualite de la semaine", "Loyers en IDF ?", "Canal Seine-Nord ?"].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => { setMessages(prev => [...prev, { role: "user", content: q }]); setLoading(true); setTimeout(() => { setMessages(prev => [...prev, { role: "assistant", content: getResponse(q) }]); setLoading(false); }, 800); }, 10); }} style={{ whiteSpace: "nowrap", fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, border: "none", borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${COLORS.gray200}`, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Posez votre question..."
              style={{ flex: 1, border: `1px solid ${COLORS.gray200}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", color: COLORS.gray800 }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              style={{ width: 36, height: 36, borderRadius: "50%", background: input.trim() ? COLORS.blue : COLORS.gray200, border: "none", cursor: input.trim() ? "pointer" : "default", color: COLORS.white, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              →
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

function generatePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210, margin = 18, contentW = pageW - margin * 2;
  let y = 0;
  const checkSpace = (n) => { if (y + n > 272) { doc.addPage(); y = 20; } };

  doc.setFillColor(15, 36, 64); doc.rect(0, 0, 210, 44, "F");
  doc.setFillColor(42, 125, 225); doc.roundedRect(margin, 11, 22, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(11); doc.setFont("helvetica", "bold");
  doc.text("BT", margin + 5, 20); doc.setFontSize(7); doc.text("IMMO", margin + 3, 27);
  doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("BTWatch - Brief Hebdomadaire", margin + 28, 21);
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`Semaine du ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} - Marche francais`, margin + 28, 29);
  doc.text("BT Immo Group - Asset Management - Document confidentiel", margin + 28, 36);
  y = 54;

  doc.setFillColor(232, 242, 255); doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
  doc.text("RADAR MARCHE FRANCAIS", margin + 4, y + 5.5); y += 13;
  const rW = (contentW - 8) / 3;
  RADAR_DATA.forEach((item, i) => {
    const col = i % 3, x = margin + col * (rW + 4);
    if (col === 0 && i > 0) y += 20;
    checkSpace(20);
    doc.setFillColor(248, 250, 252); doc.roundedRect(x, y, rW, 17, 2, 2, "F");
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
    doc.text(doc.splitTextToSize(item.label, rW - 6)[0], x + 3, y + 5);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    doc.text(`${item.value} ${item.unit}`, x + 3, y + 12);
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.setTextColor(...(item.up ? [16, 185, 129] : [245, 158, 11]));
    doc.text(item.delta, x + rW - 3, y + 15, { align: "right" });
  });
  y += 26;

  checkSpace(12);
  doc.setFillColor(232, 242, 255); doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
  doc.text("ARTICLES - HAUTE PERTINENCE (score >= 85)", margin + 4, y + 5.5); y += 13;

  ARTICLES.filter(a => a.score >= 85).slice(0, 5).forEach(article => {
    checkSpace(34);
    doc.setFillColor(16, 185, 129); doc.circle(margin + 5, y + 5, 5, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
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

  checkSpace(12);
  doc.setFillColor(232, 242, 255); doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
  doc.text("VEILLE CONCURRENTS - FRANCE", margin + 4, y + 5.5); y += 13;

  COMPETITORS.filter(c => c.threat === "high").forEach(comp => {
    checkSpace(30);
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 36, 64);
    doc.text(comp.name, margin);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    doc.text(`${comp.hq} - ${comp.frenchAssets} en France`, margin + 45, y); y += 7;
    comp.recentMoves.slice(0, 2).forEach(move => {
      checkSpace(8);
      const lines = doc.splitTextToSize(`-> ${move}`, contentW - 6);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(71, 85, 105);
      doc.text(lines, margin + 4, y); y += lines.length * 4.5 + 2;
    });
    y += 4;
    doc.setDrawColor(226, 232, 240); doc.line(margin, y - 2, margin + contentW, y - 2);
  });

  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 36, 64); doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(148, 163, 184);
    doc.text("BT Immo Group - Asset Management - Document confidentiel", margin, 292);
    doc.text(`Page ${i} / ${total}`, 210 - margin, 292, { align: "right" });
  }
  doc.save(`BTWatch_Brief_France_${now.toISOString().split("T")[0]}.pdf`);
}

export default function App() {
  const [activePage, setActivePage] = useState("veille");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const NAV = [{ id: "veille", label: "Veille" }, { id: "radar", label: "Radar marche" }, { id: "concurrents", label: "Concurrents" }];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: COLORS.gray50, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ background: COLORS.navyDeep, padding: "0 28px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px #0003" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="BT Immo Group"
              style={{ height: 48, width: "auto", objectFit: "contain" }}
              onError={e => { e.target.style.display = "none"; }} />
            <div style={{ borderLeft: "1px solid #ffffff30", paddingLeft: 12 }}>
              <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 16 }}>BT<span style={{ color: COLORS.blueLight }}>Watch</span></div>
              <div style={{ color: COLORS.gray400, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                style={{ padding: "6px 15px", borderRadius: 8, border: "none", background: activePage === item.id ? "#ffffff18" : "transparent", color: activePage === item.id ? COLORS.white : COLORS.gray400, fontWeight: activePage === item.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activePage === "veille" && (
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              style={{ background: "#ffffff14", border: "1px solid #ffffff22", borderRadius: 8, padding: "7px 14px", color: COLORS.white, fontSize: 13, width: 180, outline: "none" }} />
          )}
          <button onClick={generatePDF}
            style={{ padding: "8px 16px", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", borderRadius: 8, color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Exporter PDF
          </button>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navyMid})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 13, fontWeight: 700 }}>A</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {activePage === "veille" && (
          <aside style={{ width: 215, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, padding: "24px 0", flexShrink: 0, position: "sticky", top: 70, height: "calc(100vh - 70px)", overflowY: "auto" }}>
            <div style={{ padding: "0 18px 12px", fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Categories</div>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 18px", background: activeCategory === cat.id ? COLORS.bluePale : "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRight: activeCategory === cat.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", transition: "all 0.15s" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: activeCategory === cat.id ? 700 : 500, color: activeCategory === cat.id ? COLORS.blue : COLORS.gray600 }}>{cat.label}</span>
              </button>
            ))}
            <div style={{ margin: "20px 18px 0", paddingTop: 18, borderTop: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Sources</div>
              {["Voxlog", "Le Moniteur", "Les Echos", "Business Immo", "CBRE France", "L'Agefi"].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", fontSize: 12, color: COLORS.gray600 }}>
                  <span style={{ color: COLORS.success, fontSize: 9 }}>●</span>{s}
                </div>
              ))}
            </div>
          </aside>
        )}

        <main style={{ flex: 1, padding: "26px 28px", minWidth: 0 }}>
          {activePage === "veille" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
                {[
                  { label: "Articles cette semaine", value: "9", delta: "France uniquement" },
                  { label: "Score moyen", value: "84", delta: "/ 100" },
                  { label: "Haute pertinence", value: ARTICLES.filter(a => a.score >= 85).length, delta: "articles" },
                  { label: "Sources francaises", value: "6", delta: "actives" },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, padding: "15px 18px" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                      <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.navyDeep }}>{s.value}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.success }}>{s.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              {activeCategory === "all" && search === "" && (
                <div onClick={() => window.open("https://www.voxlog.fr/actualite/10609/marche-francais-des-entrepots-arthur-loyd-logistique-dresse-le-bilan-d-une-annee-2025-chahutee", "_blank")}
                  style={{ background: `linear-gradient(135deg, ${COLORS.navyDeep}, ${COLORS.navyMid})`, borderRadius: 16, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: COLORS.blue + "22", borderRadius: "50%" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ background: COLORS.blue, color: COLORS.white, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 9px", textTransform: "uppercase" }}>A la une</span>
                      <span style={{ background: "#ffffff20", color: COLORS.blueLight, fontSize: 10, fontWeight: 600, borderRadius: 5, padding: "2px 9px" }}>Score 97 - Haute pertinence</span>
                    </div>
                    <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 700, color: COLORS.white, margin: "0 0 8px", lineHeight: 1.35, maxWidth: 560 }}>
                      Canal Seine-Nord : les actifs logistiques du corridor nord valorises 15% de plus
                    </h3>
                    <p style={{ color: "#ffffffaa", fontSize: 13, lineHeight: 1.6, maxWidth: 520, margin: "0 0 14px" }}>
                      L'avancement du chantier genere un fort effet d'anticipation sur Cambrai, Marquion et Dunkerque. Le parc e-Valley beneficie d'une connectivite trimodale unique en Europe, directement dans le portefeuille Castignac.
                    </p>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: COLORS.blueLight, fontSize: 12 }}>Voxlog - Il y a 1j - 5 min</span>
                      <span style={{ background: COLORS.blue, color: COLORS.white, borderRadius: 8, padding: "7px 15px", fontSize: 12, fontWeight: 700 }}>Lire l'article →</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: COLORS.navyDeep, margin: 0 }}>
                    {activeCategory === "all" ? "Tous les articles" : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <p style={{ fontSize: 12, color: COLORS.gray400, margin: "3px 0 0" }}>{filtered.length} resultat{filtered.length > 1 ? "s" : ""} - Sources françaises uniquement</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["grid", "list"].map(v => (
                    <button key={v} onClick={() => setView(v)} style={{ padding: "6px 13px", borderRadius: 8, border: `1px solid ${view === v ? COLORS.blue : COLORS.gray200}`, background: view === v ? COLORS.bluePale : COLORS.white, color: view === v ? COLORS.blue : COLORS.gray600, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      {v === "grid" ? "Grille" : "Liste"}
                    </button>
                  ))}
                </div>
              </div>

              {view === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
                  {filtered.map(a => <ArticleCard key={a.id} article={a} view="grid" />)}
                </div>
              ) : (
                <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, overflow: "hidden" }}>
                  {filtered.map(a => <ArticleCard key={a.id} article={a} view="list" />)}
                </div>
              )}
            </>
          )}

          {activePage === "radar" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>Radar Marche Francais</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Indicateurs cles de l'immobilier logistique en France - Sources : JLL, Arthur Loyd, EOL, Voxlog</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
                {RADAR_DATA.map(item => (
                  <div key={item.label} style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "20px 22px" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 5 }}>{item.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 5 }}>
                      <span style={{ fontSize: 30, fontWeight: 800, color: COLORS.navyDeep, lineHeight: 1 }}>{item.value}</span>
                      <span style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 600 }}>{item.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.up ? COLORS.success : COLORS.warning }}>{item.up ? "En hausse" : "En baisse"} - {item.delta}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "22px 26px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Zones logistiques strategiques — Activite 2025</div>
                {ZONES.map(row => (
                  <div key={row.zone} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray800, marginBottom: 2 }}>{row.zone}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray400 }}>{row.highlight}</div>
                    </div>
                    <div style={{ width: 140 }}>
                      <div style={{ height: 5, background: COLORS.gray100, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${row.activity * 10}%`, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, minWidth: 110, textAlign: "right" }}>{row.deals}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === "concurrents" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>Concurrents — Marche francais</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Acteurs de l'immobilier logistique presents et actifs en France</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Concurrents directs", value: COMPETITORS.filter(c => c.threat === "high").length, color: COLORS.danger },
                  { label: "A surveiller", value: COMPETITORS.filter(c => c.threat === "medium").length, color: COLORS.warning },
                  { label: "Veille passive", value: COMPETITORS.filter(c => c.threat === "low").length, color: COLORS.success },
                  { label: "Operations tracees", value: COMPETITORS.reduce((acc, c) => acc + c.recentMoves.length, 0), color: COLORS.blue },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.gray200}`, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {COMPETITORS.map(comp => <CompetitorCard key={comp.name} comp={comp} />)}
              </div>
            </div>
          )}
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
