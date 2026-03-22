import { useState } from "react";
import jsPDF from "jspdf";

const COLORS = {
  navyDeep: "#0f2440",
  navyMid: "#1a3a5c",
  blue: "#2a7de1",
  blueLight: "#4a9eff",
  bluePale: "#e8f2ff",
  cyan: "#00b4d8",
  white: "#ffffff",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray800: "#1e293b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#7c3aed",
  teal: "#0d9488",
  green: "#059669",
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
    title: "Prologis acquiert trois entrepots en Ile-de-France pour 320 M EUR",
    summary: "Le leader mondial de l'immobilier logistique renforce son ancrage francais avec l'acquisition de trois plateformes situees a Roissy, Moissy-Cramayel et Sénart. Ces actifs classe A totalisent 180 000 m2 et sont entierement loues a des operateurs e-commerce.",
    source: "Business Immo", date: "Il y a 2h", readTime: "4 min", tag: "Exclusif", tagColor: COLORS.purple, trend: "up", score: 95,
    url: "https://www.businessimmo.com/contents/logistique"
  },
  {
    id: 2, category: "immo", categoryLabel: "Immobilier logistique",
    title: "Le marche logistique francais depasse 4,2 M m2 places en 2024, un record historique",
    summary: "La demande placee en immobilier logistique en France a atteint un niveau record en 2024. L'e-commerce et la massification des flux tirent la demande, notamment sur les axes A1, A6 et A10. Les grandes surfaces de plus de 40 000 m2 representent 60% du total.",
    source: "Voxlog", date: "Il y a 5h", readTime: "3 min", tag: "Marche", tagColor: COLORS.blue, trend: "up", score: 90,
    url: "https://www.voxlog.fr/actualite"
  },
  {
    id: 3, category: "esg", categoryLabel: "ESG & Durabilite",
    title: "ZAN et logistique : les nouvelles regles freinent les projets d'entrepots en France",
    summary: "La loi Zéro Artificialisation Nette complique l'obtention de permis de construire pour les nouveaux entrepots. Les promoteurs se tournent vers la rehabilitation de friches industrielles. Panattoni et Goodman ont deja adapte leurs strategies en consequence.",
    source: "Le Moniteur", date: "Il y a 8h", readTime: "6 min", tag: "Reglementation", tagColor: COLORS.teal, trend: "neutral", score: 85,
    url: "https://www.lemoniteur.fr/article/immobilier-logistique.html"
  },
  {
    id: 4, category: "finance", categoryLabel: "Marches financiers",
    title: "Les rendements logistiques prime en France se stabilisent autour de 4,5% en regions",
    summary: "Apres deux ans de revalorisation, les taux de capitalisation des actifs logistiques français montrent des signes de stabilisation. Les investisseurs institutionnels reviennent sur le marche francais, portes par la baisse des taux de la BCE et la solidite des flux locatifs.",
    source: "Les Echos", date: "Il y a 10h", readTime: "5 min", tag: "Analyse", tagColor: COLORS.green, trend: "up", score: 75,
    url: "https://www.lesechos.fr/finance-marches/banque-assurances/immobilier"
  },
  {
    id: 5, category: "ma", categoryLabel: "Fusions & Acquisitions",
    title: "Goodman cede son parc logistique de Rouen a un fonds SCPI pour 95 M EUR",
    summary: "L'australien Goodman realise une plus-value significative sur sa plateforme de 55 000 m2 situee pres du port de Rouen. L'acheteur, un fonds SCPI gere par un assureur francais, illustre le retour des investisseurs domestiques sur le segment logistique.",
    source: "Business Immo", date: "Il y a 1j", readTime: "4 min", tag: "Transaction", tagColor: COLORS.purple, trend: "up", score: 88,
    url: "https://www.businessimmo.com/contents/logistique"
  },
  {
    id: 6, category: "immo", categoryLabel: "Immobilier logistique",
    title: "Canal Seine-Nord : les entrepots du corridor Cambrai-Marquion valorises 15% de plus",
    summary: "L'avancement du chantier du canal Seine-Nord genere un fort effet d'anticipation sur les valorisations immobilieres du corridor nord. Les zones de Cambrai, Marquion et Dunkerque concentrent l'essentiel des demandes de foncier logistique. Le parc e-Valley est en premiere ligne.",
    source: "Le Moniteur", date: "Il y a 1j", readTime: "5 min", tag: "Infrastructure", tagColor: COLORS.blue, trend: "up", score: 97,
    url: "https://www.lemoniteur.fr/article/canal-seine-nord.html"
  },
  {
    id: 7, category: "esg", categoryLabel: "ESG & Durabilite",
    title: "Breeam et HQE : les certifications environnementales deviennent incontournables en France",
    summary: "En 2024, plus de 70% des entrepots classe A livres en France disposent d'une certification environnementale. Les locataires exigent desormais ces labels dans leurs appels d'offres. Les actifs non certifies subissent une decote locative croissante sur toutes les grandes plateformes.",
    source: "CBRE Research", date: "Il y a 2j", readTime: "7 min", tag: "Etude", tagColor: COLORS.teal, trend: "up", score: 80,
    url: "https://www.cbre.fr/insights/articles"
  },
  {
    id: 8, category: "finance", categoryLabel: "Marches financiers",
    title: "Les SCPI logistiques françaises lèvent 1,2 Md EUR au premier semestre 2025",
    summary: "L'immobilier logistique s'impose comme la classe d'actifs preferee des SCPI françaises. La stabilisation des valeurs et la solidite des revenus locatifs attirent les epargnants particuliers. Perial, Primonial et Amundi ont lance de nouveaux fonds dedies en debut d'annee.",
    source: "L'Agefi", date: "Il y a 2j", readTime: "5 min", tag: "Capital", tagColor: COLORS.green, trend: "up", score: 68,
    url: "https://www.agefi.fr/asset-management"
  },
  {
    id: 9, category: "ma", categoryLabel: "Fusions & Acquisitions",
    title: "Panattoni livres trois BTS sur l'axe A10 entre Paris et Orleans pour Geodis et XPO",
    summary: "Le promoteur europeen livre trois entrepots en build-to-suit sur des terrains longeant l'autoroute A10. Geodis et XPO Logistics sont les locataires de deux des trois batiments. Ces livraisons portent l'empreinte de Panattoni en France a plus de 1,2 million de m2.",
    source: "Voxlog", date: "Il y a 3j", readTime: "3 min", tag: "Livraison", tagColor: COLORS.purple, trend: "neutral", score: 82,
    url: "https://www.voxlog.fr/actualite"
  },
];

const COMPETITORS = [
  {
    name: "Prologis France",
    hq: "Paris 8e",
    frenchAssets: "3,8M m2",
    presence: ["Ile-de-France", "Lyon", "Marseille", "Lille", "Bordeaux"],
    strategy: "Leader du marche francais. Strategie de retention des grands locataires e-commerce (Amazon, Cdiscount, La Poste). Forte activite de restructuration d'actifs existants faute de foncier disponible en IDF.",
    recentMoves: [
      "Acquisition 3 entrepots en IDF pour 320 M EUR (mars 2025)",
      "Renouvellement bail 10 ans avec Amazon sur Sénart (85 000 m2)",
      "Lancement programme de renovation energetique sur 12 actifs francais"
    ],
    threat: "high", color: "#e63946",
  },
  {
    name: "Panattoni France",
    hq: "Paris 17e",
    frenchAssets: "1,2M m2",
    presence: ["Axe A10 (Paris-Orleans)", "PACA", "Grand Est", "Bordeaux"],
    strategy: "Developpeur pur player, specialiste du build-to-suit en France. Tres actif sur les marches regionaux delaisses par Prologis. Strategie d'entree sur les friches industrielles pour contourner la loi ZAN.",
    recentMoves: [
      "3 BTS livres sur l'axe A10 pour Geodis et XPO (55 000 m2 chacun)",
      "Acquisition friche industrielle a Mulhouse pour reconversion logistique",
      "Negociations en cours avec un acteur de la grande distribution sur Lyon Sud"
    ],
    threat: "high", color: "#f4a261",
  },
  {
    name: "Goodman France",
    hq: "Paris 9e",
    frenchAssets: "920K m2",
    presence: ["Grand Paris", "Lyon", "Rouen", "Toulouse"],
    strategy: "Positionnement premium sur les actifs urbains et periurbains. Specialiste de l'urban logistics sur Paris et Lyon. Strategie de cession selective d'actifs matures pour reinvestir dans des projets de developpement.",
    recentMoves: [
      "Cession parc de Rouen a un fonds SCPI francais (95 M EUR)",
      "Livraison d'un entrepot last-mile de 18 000 m2 a Saint-Denis",
      "Certification Net Zero sur l'ensemble du portefeuille francais"
    ],
    threat: "medium", color: "#e76f51",
  },
  {
    name: "Segro France",
    hq: "Paris 8e",
    frenchAssets: "650K m2",
    presence: ["Grand Paris", "Lyon Metropole", "Aix-Marseille"],
    strategy: "Leader europeen de l'urban logistics en France. Concentre son portefeuille sur de petites et moyennes surfaces (<20 000 m2) proches des centres-villes. Loyers prime parmi les plus eleves du marche.",
    recentMoves: [
      "Acquisition de 3 actifs last-mile en banlieue parisienne (Seine-Saint-Denis)",
      "Lancement Segro Urban Warehouse Paris : 8 000 m2 a La Courneuve",
      "Partenariat avec Urby pour la logistique du dernier kilometre"
    ],
    threat: "medium", color: "#457b9d",
  },
  {
    name: "MG Real Estate France",
    hq: "Lyon",
    frenchAssets: "380K m2",
    presence: ["Lyon", "Grenoble", "Clermont-Ferrand", "Dijon"],
    strategy: "Fonds belge tres actif sur le marche regional francais, notamment dans le couloir rhodanien. Strategie value-add : achat d'actifs classe B pour les repositionner en classe A apres renovation.",
    recentMoves: [
      "Acquisition d'une plateforme de 45 000 m2 a Corbas (Lyon Sud)",
      "Renovation complete d'un actif des annees 90 a Grenoble (certification HQE)",
      "Etude de faisabilite sur un terrain de 12 ha pres de Dijon"
    ],
    threat: "low", color: "#6a994e",
  },
];

const RADAR_DATA = [
  { label: "Demande placee en France (2024)", value: "4,2", unit: "M m2", delta: "Record historique", up: true },
  { label: "Taux de vacance logistique France", value: "3,1", unit: "%", delta: "-0,4pt sur 3 mois", up: false },
  { label: "Loyer prime IDF (classe A)", value: "82", unit: "EUR/m2/an", delta: "+6% sur 1 an", up: true },
  { label: "Volume investi en France T1 2025", value: "1,4", unit: "Md EUR", delta: "+18% vs T1 2024", up: true },
  { label: "Taux de capi prime logistique", value: "4,5", unit: "%", delta: "Stable sur 6 mois", up: false },
  { label: "M2 en construction en France", value: "2,1", unit: "M m2", delta: "Toutes regions", up: true },
];

const ZONES = [
  { zone: "Corridor Nord (Cambrai, Lille, Calais, Dunkerque)", activity: 9, deals: "5 transactions", highlight: "Canal Seine-Nord catalyse les investissements, e-Valley en plein essor" },
  { zone: "Ile-de-France (Roissy, Orly, Sénart, Moissy)", activity: 9, deals: "6 transactions", highlight: "Vacance quasi nulle, loyers en forte hausse, rarete du foncier" },
  { zone: "Corridor Rhone (Lyon, Macon, Valence, Corbas)", activity: 7, deals: "4 transactions", highlight: "2e marche logistique francais, demande soutenue des 3PL" },
  { zone: "Grand Ouest (Nantes, Le Mans, Tours)", activity: 4, deals: "2 transactions", highlight: "Montee en puissance de l'axe Le Mans-Tours, foncier encore disponible" },
  { zone: "Sud-Ouest (Bordeaux, Toulouse)", activity: 4, deals: "2 transactions", highlight: "Croissance demographique soutient la demande logistique locale" },
  { zone: "PACA (Marseille, Avignon, Fos-sur-Mer)", activity: 5, deals: "3 transactions", highlight: "Port de Marseille-Fos attire les investisseurs europeens et du Golfe" },
];

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
  const map = {
    high: { label: "Concurrent direct", color: COLORS.danger },
    medium: { label: "A surveiller", color: COLORS.warning },
    low: { label: "Veille passive", color: COLORS.success }
  };
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
        <div style={{ width: 4, minHeight: 60, borderRadius: 4, background: cat?.color || COLORS.blue, flexShrink: 0, marginTop: 2 }} />
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
          {comp.presence.map(z => (
            <span key={z} style={{ fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>{z}</span>
          ))}
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

function generatePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  const checkSpace = (needed) => {
    if (y + needed > 272) { doc.addPage(); y = 20; }
  };

  // Header
  doc.setFillColor(15, 36, 64);
  doc.rect(0, 0, 210, 44, "F");
  doc.setFillColor(42, 125, 225);
  doc.roundedRect(margin, 11, 22, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("BT", margin + 5, 20);
  doc.setFontSize(7);
  doc.text("IMMO", margin + 3, 27);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("BTWatch - Brief Hebdomadaire", margin + 28, 21);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`Semaine du ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} - Marche francais`, margin + 28, 29);
  doc.text("BT Immo Group - Asset Management - Document confidentiel", margin + 28, 36);
  y = 54;

  // Radar
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("RADAR MARCHE FRANCAIS", margin + 4, y + 5.5);
  y += 13;
  const radarCols = 3;
  const radarW = (contentW - 8) / radarCols;
  RADAR_DATA.forEach((item, i) => {
    const col = i % radarCols;
    const x = margin + col * (radarW + 4);
    if (col === 0 && i > 0) y += 20;
    checkSpace(20);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, radarW, 17, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(doc.splitTextToSize(item.label, radarW - 6)[0], x + 3, y + 5);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    doc.text(`${item.value} ${item.unit}`, x + 3, y + 12);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...(item.up ? [16, 185, 129] : [245, 158, 11]));
    doc.text(item.delta, x + radarW - 3, y + 15, { align: "right" });
  });
  y += 26;

  // Articles
  checkSpace(12);
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("ARTICLES - HAUTE PERTINENCE (score >= 85)", margin + 4, y + 5.5);
  y += 13;

  ARTICLES.filter(a => a.score >= 85).slice(0, 5).forEach(article => {
    checkSpace(34);
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 5, y + 5, 5, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(String(article.score), margin + 5, y + 6.8, { align: "center" });
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(42, 125, 225);
    doc.text(article.categoryLabel.toUpperCase(), margin + 13, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`${article.source} - ${article.date}`, margin + 13, y + 9);
    y += 13;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    const titleLines = doc.splitTextToSize(article.title, contentW - 6);
    doc.text(titleLines, margin + 3, y);
    y += titleLines.length * 5 + 1;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const summaryLines = doc.splitTextToSize(article.summary, contentW - 6).slice(0, 2);
    doc.text(summaryLines, margin + 3, y);
    y += summaryLines.length * 4.5 + 4;
    doc.setFontSize(7.5);
    doc.setTextColor(42, 125, 225);
    doc.text(`Source : ${article.url}`, margin + 3, y);
    y += 7;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentW, y);
    y += 5;
  });

  // Concurrents
  checkSpace(12);
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("VEILLE CONCURRENTS - FRANCE", margin + 4, y + 5.5);
  y += 13;

  COMPETITORS.filter(c => c.threat === "high").forEach(comp => {
    checkSpace(30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    doc.text(comp.name, margin, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`Siege : ${comp.hq} - ${comp.frenchAssets} en France`, margin + 50, y);
    y += 7;
    comp.recentMoves.slice(0, 2).forEach(move => {
      checkSpace(8);
      const lines = doc.splitTextToSize(`-> ${move}`, contentW - 6);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(lines, margin + 4, y);
      y += lines.length * 4.5 + 2;
    });
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y - 2, margin + contentW, y - 2);
  });

  // Footer
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 36, 64);
    doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
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
    const matchSearch = search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const NAV = [
    { id: "veille", label: "Veille" },
    { id: "radar", label: "Radar marche" },
    { id: "concurrents", label: "Concurrents" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: COLORS.gray50, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ background: COLORS.navyDeep, padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px #0003" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="BT Immo Group" style={{ height: 40, width: "auto", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ borderLeft: "1px solid #ffffff30", paddingLeft: 10 }}>
              <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 15 }}>BT<span style={{ color: COLORS.blueLight }}>Watch</span></div>
              <div style={{ color: COLORS.gray400, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)} style={{ padding: "6px 15px", borderRadius: 8, border: "none", background: activePage === item.id ? "#ffffff18" : "transparent", color: activePage === item.id ? COLORS.white : COLORS.gray400, fontWeight: activePage === item.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activePage === "veille" && (
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ background: "#ffffff14", border: "1px solid #ffffff22", borderRadius: 8, padding: "7px 14px", color: COLORS.white, fontSize: 13, width: 180, outline: "none" }} />
          )}
          <button onClick={generatePDF} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", borderRadius: 8, color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Exporter brief PDF
          </button>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navyMid})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 13, fontWeight: 700 }}>A</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {activePage === "veille" && (
          <aside style={{ width: 215, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, padding: "24px 0", flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto" }}>
            <div style={{ padding: "0 18px 12px", fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Categories</div>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 18px", background: activeCategory === cat.id ? COLORS.bluePale : "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRight: activeCategory === cat.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", transition: "all 0.15s" }}>
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
                  { label: "Articles aujourd'hui", value: "47", delta: "+12%" },
                  { label: "Score moyen", value: "82", delta: "/ 100" },
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
                <div onClick={() => window.open("https://www.lemoniteur.fr/article/canal-seine-nord.html", "_blank")}
                  style={{ background: `linear-gradient(135deg, ${COLORS.navyDeep}, ${COLORS.navyMid})`, borderRadius: 16, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: COLORS.blue + "22", borderRadius: "50%" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ background: COLORS.blue, color: COLORS.white, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 9px", textTransform: "uppercase" }}>A la une</span>
                      <span style={{ background: "#ffffff20", color: COLORS.blueLight, fontSize: 10, fontWeight: 600, borderRadius: 5, padding: "2px 9px" }}>Score 97 - Haute pertinence</span>
                    </div>
                    <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 700, color: COLORS.white, margin: "0 0 8px", lineHeight: 1.35, maxWidth: 560 }}>
                      Canal Seine-Nord : les entrepots du corridor Cambrai-Marquion valorises 15% de plus
                    </h3>
                    <p style={{ color: "#ffffffaa", fontSize: 13, lineHeight: 1.6, maxWidth: 520, margin: "0 0 14px" }}>
                      L'avancement du chantier genere un effet d'anticipation fort sur le corridor nord. Cambrai, Marquion et Dunkerque concentrent les demandes - le parc e-Valley est en premiere ligne.
                    </p>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: COLORS.blueLight, fontSize: 12 }}>Le Moniteur - Il y a 1j - 5 min</span>
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
                  <p style={{ fontSize: 12, color: COLORS.gray400, margin: "3px 0 0" }}>{filtered.length} resultat{filtered.length > 1 ? "s" : ""} - Mis a jour il y a 14 min</p>
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
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Indicateurs cles de l'immobilier logistique en France - Mise a jour hebdomadaire</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
                {RADAR_DATA.map(item => (
                  <div key={item.label} style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "20px 22px" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 5 }}>{item.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 5 }}>
                      <span style={{ fontSize: 30, fontWeight: 800, color: COLORS.navyDeep, lineHeight: 1 }}>{item.value}</span>
                      <span style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 600 }}>{item.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.up ? COLORS.success : COLORS.warning }}>
                      {item.up ? "En hausse" : "En baisse"} - {item.delta}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "22px 26px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  Zones logistiques strategiques — Activite du mois
                </div>
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
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, minWidth: 90, textAlign: "right" }}>{row.deals}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === "concurrents" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>Concurrents — Marche francais</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Suivi des acteurs de l'immobilier logistique presents en France</p>
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
    </div>
  );
}
