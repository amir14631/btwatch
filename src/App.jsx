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
  { id: "finance", label: "Marchés financiers", color: COLORS.green },
  { id: "immo", label: "Immobilier logistique", color: COLORS.blue },
  { id: "esg", label: "ESG & Durabilité", color: COLORS.teal },
];

const ARTICLES = [
  { id: 1, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "Prologis acquiert un portefeuille européen de 2,1 Mds€", summary: "Le géant américain de l'immobilier logistique renforce sa présence en Europe du Nord avec l'acquisition de 18 actifs en Allemagne, Pays-Bas et Belgique. Une opération qui redessine les équilibres du marché continental.", source: "Le Moniteur", date: "Il y a 2h", readTime: "4 min", tag: "Exclusif", tagColor: COLORS.purple, trend: "up", score: 95 },
  { id: 2, category: "immo", categoryLabel: "Immobilier logistique", title: "Les entrepôts classe A atteignent un taux d'occupation record de 97% en Île-de-France", summary: "La pression sur le foncier logistique francilien ne faiblit pas. Le taux de vacance historiquement bas tire les valeurs locatives vers le haut, avec des loyers prime dépassant les 80€/m²/an.", source: "Voxlog", date: "Il y a 5h", readTime: "3 min", tag: "Marché", tagColor: COLORS.blue, trend: "up", score: 88 },
  { id: 3, category: "esg", categoryLabel: "ESG & Durabilité", title: "La taxonomie verte européenne : nouvelles contraintes pour les fonds immobiliers en 2025", summary: "Brookfield, Blackstone et les grands gestionnaires alternatifs accélèrent leur mise en conformité avec la taxonomie EU. Les actifs non certifiés risquent une décote significative dès 2026.", source: "Les Echos", date: "Il y a 8h", readTime: "6 min", tag: "Réglementation", tagColor: COLORS.teal, trend: "neutral", score: 72 },
  { id: 4, category: "finance", categoryLabel: "Marchés financiers", title: "Taux directeurs BCE : le pivot attendu soulage les SCPI et SIIC", summary: "La décision de la BCE de maintenir sa trajectoire baissière redonne de l'air aux véhicules immobiliers cotés. Les rendements logistiques se resserrent, signe d'une revalorisation progressive.", source: "Boursorama", date: "Il y a 12h", readTime: "5 min", tag: "Analyse", tagColor: COLORS.green, trend: "up", score: 65 },
  { id: 5, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "Goodman Group entre en négociations exclusives pour racheter un opérateur logistique français", summary: "L'australien Goodman confirme son appétit pour le marché français. Les discussions portent sur plusieurs plateformes dans le corridor Paris-Lyon, pour un montant estimé entre 400 et 600 M€.", source: "Reuters", date: "Il y a 1j", readTime: "4 min", tag: "Breaking", tagColor: COLORS.danger, trend: "up", score: 91 },
  { id: 6, category: "immo", categoryLabel: "Immobilier logistique", title: "Canal Seine-Nord Europe : les actifs logistiques du corridor nord valorisés 15% de plus", summary: "L'avancement du chantier du canal Seine-Nord génère un effet d'anticipation fort sur les valorisations immobilières des zones de Cambrai, Marquion et Dunkerque.", source: "Le Moniteur", date: "Il y a 1j", readTime: "5 min", tag: "Infrastructure", tagColor: COLORS.blue, trend: "up", score: 97 },
  { id: 7, category: "esg", categoryLabel: "ESG & Durabilité", title: "Certification BREEAM Outstanding : seuls 12 entrepôts en France atteignent le plus haut niveau", summary: "La course à la certification environnementale s'intensifie dans le secteur logistique. Les bâtiments BREEAM Outstanding commandent une prime locative de 8 à 12%.", source: "CBRE Research", date: "Il y a 2j", readTime: "7 min", tag: "Etude", tagColor: COLORS.teal, trend: "neutral", score: 78 },
  { id: 8, category: "finance", categoryLabel: "Marchés financiers", title: "Immobilier alternatif : les fonds de dette logistique lèvent 8 Mds€ en Europe au T1 2025", summary: "La dette privée immobilière s'impose comme classe d'actifs incontournable. Les fonds spécialisés logistique affichent des rendements cibles de 7 à 9%.", source: "IPE Real Assets", date: "Il y a 2j", readTime: "6 min", tag: "Capital", tagColor: COLORS.green, trend: "up", score: 60 },
  { id: 9, category: "ma", categoryLabel: "Fusions & Acquisitions", title: "Panattoni cède un parc logistique à Marseille à un fonds souverain du Golfe", summary: "La transaction à 180 M€ illustre l'appétit croissant des fonds souverains moyen-orientaux pour l'immobilier logistique européen. Taux de cap retenu : 4,75%.", source: "Business Immo", date: "Il y a 3j", readTime: "3 min", tag: "Transaction", tagColor: COLORS.purple, trend: "neutral", score: 82 },
];

const COMPETITORS = [
  { name: "Prologis", origin: "🇺🇸 Américain", aum: "220 Mds€", frenchAssets: "3,2M m²", strategy: "Leader mondial, focus grandes plateformes e-commerce et 3PL. Investissements massifs dans l'automatisation et la data center conversion.", recentMoves: ["Acquisition portefeuille 2,1 Mds€ Europe du Nord (mars 2025)", "JV avec Amazon sur 4 sites franciliens", "Lancement PLD Essentials (entrepôts mid-size)"], zones: ["Île-de-France", "Lyon", "Marseille", "Lille"], threat: "high", color: "#e63946" },
  { name: "Panattoni", origin: "🇪🇺 Européen", aum: "12 Mds€", frenchAssets: "1,1M m²", strategy: "Développeur pur, build-to-suit agressif. Très actif sur les marchés secondaires français délaissés par les grands fonds.", recentMoves: ["Cession parc Marseille à fonds du Golfe (180M€)", "Lancement 3 BTS en région PACA", "Entrée sur le marché de Bordeaux"], zones: ["PACA", "Bordeaux", "Nantes", "Strasbourg"], threat: "medium", color: "#f4a261" },
  { name: "Goodman", origin: "🇦🇺 Australien", aum: "80 Mds€", frenchAssets: "850K m²", strategy: "Focus qualité premium et ESG. Spécialiste des urban logistics et des actifs proches des centres-villes. En négociations pour une acquisition majeure en France.", recentMoves: ["Négociations exclusives opérateur logistique français (400-600M€)", "Certification Net Zero sur l'ensemble du parc", "Partenariat ENGIE pour autoconsommation solaire"], zones: ["Paris", "Lyon", "Toulouse"], threat: "high", color: "#e76f51" },
  { name: "Segro", origin: "🇬🇧 Britannique", aum: "21 Mds€", frenchAssets: "600K m²", strategy: "Spécialiste urban logistics et last-mile. Très fort sur les petites et moyennes surfaces proches des métropoles.", recentMoves: ["Acquisition 3 actifs last-mile en banlieue parisienne", "Programme de rénovation énergétique 150M€", "Nouveau fonds dédié France (500M€)"], zones: ["Grand Paris", "Lyon Métropole"], threat: "medium", color: "#457b9d" },
  { name: "Barings RE", origin: "🇺🇸 Américain", aum: "35 Mds€", frenchAssets: "400K m²", strategy: "Fund manager value-add. Achète des actifs sous-valorisés pour les repositionner. Cible les marchés régionaux.", recentMoves: ["Création JV avec promoteur local (200M€)", "Repositionnement 2 actifs classe B → classe A", "Recherche active de terrains sur axe A10"], zones: ["Orléans", "Tours", "Bordeaux"], threat: "low", color: "#6a994e" },
];

const RADAR_DATA = [
  { label: "Transactions logistiques ce mois", value: "23", unit: "deals", delta: "+4 vs mois dernier", up: true, icon: "🏭" },
  { label: "Taux de vacance moyen France", value: "3,1", unit: "%", delta: "-0,4pt sur 3 mois", up: false, icon: "📊" },
  { label: "Loyer prime Île-de-France", value: "82", unit: "€/m²/an", delta: "+6% sur 1 an", up: true, icon: "💶" },
  { label: "Volume investi T1 2025", value: "1,8", unit: "Mds€", delta: "+22% vs T1 2024", up: true, icon: "📈" },
  { label: "Taux de capitalisation prime", value: "4,6", unit: "%", delta: "-20bps sur 6 mois", up: false, icon: "🎯" },
  { label: "M² en cours de développement", value: "2,4", unit: "M m²", delta: "France entière", up: true, icon: "🏗" },
];

function ScoreBadge({ score }) {
  const color = score >= 85 ? COLORS.success : score >= 65 ? COLORS.warning : COLORS.gray400;
  const label = score >= 85 ? "Haute pertinence" : score >= 65 ? "Pertinence moyenne" : "Info générale";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: color + "18", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color }}>{score}</div>
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function ThreatBadge({ level }) {
  const map = { high: { label: "Concurrent direct", color: COLORS.danger }, medium: { label: "À surveiller", color: COLORS.warning }, low: { label: "Veille passive", color: COLORS.success } };
  const { label, color } = map[level];
  return <span style={{ fontSize: 11, fontWeight: 700, background: color + "18", color, borderRadius: 5, padding: "2px 9px" }}>{label}</span>;
}

function ArticleCard({ article, view }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === article.category);

  if (view === "list") {
    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "16px 24px", background: hovered ? COLORS.bluePale : COLORS.white, borderBottom: `1px solid ${COLORS.gray200}`, cursor: "pointer", transition: "background 0.15s" }}>
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
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${hovered ? COLORS.blue : COLORS.gray200}`, padding: 22, cursor: "pointer", transition: "all 0.18s", boxShadow: hovered ? `0 8px 32px ${COLORS.blue}22` : "0 1px 4px #0001", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: cat?.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{article.categoryLabel}</span>
        <span style={{ fontSize: 11, background: article.tagColor + "18", color: article.tagColor, borderRadius: 5, padding: "2px 8px", fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{article.tag}</span>
      </div>
      <div style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 15, color: COLORS.navyDeep, lineHeight: 1.45 }}>{article.title}</div>
      <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.6, flex: 1 }}>{article.summary}</div>
      <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.gray100}` }}>
        <ScoreBadge score={article.score} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source} · {article.readTime}</span>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.date}</span>
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
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>{comp.name}</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>{comp.origin}</span>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>·</span>
              <span style={{ fontSize: 12, color: COLORS.gray600, fontWeight: 600 }}>{comp.aum} AUM</span>
              <span style={{ fontSize: 12, color: COLORS.gray400 }}>·</span>
              <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>{comp.frenchAssets} en France</span>
            </div>
          </div>
          <ThreatBadge level={comp.threat} />
        </div>
        <p style={{ fontSize: 13.5, color: COLORS.gray600, lineHeight: 1.6, margin: "0 0 12px" }}>{comp.strategy}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {comp.zones.map(z => <span key={z} style={{ fontSize: 11, background: COLORS.bluePale, color: COLORS.blue, borderRadius: 5, padding: "2px 8px", fontWeight: 600 }}>📍 {z}</span>)}
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {expanded ? "▲ Masquer" : "▼ Dernières opérations"}
        </button>
      </div>
      {expanded && (
        <div style={{ background: COLORS.gray50, padding: "16px 24px", borderTop: `1px solid ${COLORS.gray200}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Dernières opérations</div>
          {comp.recentMoves.map((move, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: comp.color, fontSize: 14, flexShrink: 0 }}>→</span>
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

  const checkSpace = (needed) => { if (y + needed > 272) { doc.addPage(); y = 20; } };

  // Header
  doc.setFillColor(15, 36, 64);
  doc.rect(0, 0, 210, 44, "F");
  doc.setFillColor(42, 125, 225);
  doc.roundedRect(margin, 11, 22, 22, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("BT", margin + 4.5, 25);
  doc.setFontSize(20);
  doc.text("BTWatch — Brief Hebdomadaire", margin + 28, 20);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`Semaine du ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · Intelligence Platform`, margin + 28, 28);
  doc.text("BT Immo Group · Asset Management · Document confidentiel", margin + 28, 36);

  y = 56;

  // RADAR section
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("RADAR MARCHÉ", margin + 4, y + 5.5);
  y += 13;

  const radarCols = 3;
  const radarW = (contentW - 8) / radarCols;
  RADAR_DATA.forEach((item, i) => {
    const col = i % radarCols;
    const x = margin + col * (radarW + 4);
    if (col === 0 && i > 0) y += 19;
    checkSpace(19);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, radarW, 16, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, x + 3, y + 5);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    doc.text(`${item.value} ${item.unit}`, x + 3, y + 11.5);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    const dColor = item.up ? [16, 185, 129] : [245, 158, 11];
    doc.setTextColor(...dColor);
    doc.text(`${item.up ? "▲" : "▼"} ${item.delta}`, x + radarW - 3, y + 14.5, { align: "right" });
  });
  y += 25;

  // ARTICLES section
  checkSpace(12);
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("ARTICLES — HAUTE PERTINENCE (score ≥ 85)", margin + 4, y + 5.5);
  y += 13;

  ARTICLES.filter(a => a.score >= 85).slice(0, 5).forEach(article => {
    checkSpace(30);
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 5, y + 5, 5, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(String(article.score), margin + 5, y + 6.5, { align: "center" });
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(42, 125, 225);
    doc.text(article.categoryLabel.toUpperCase(), margin + 13, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`${article.source} · ${article.date}`, margin + 13, y + 9);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    const titleLines = doc.splitTextToSize(article.title, contentW - 18);
    doc.text(titleLines, margin + 13, y + 15);
    y += titleLines.length * 5;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const summaryLines = doc.splitTextToSize(article.summary, contentW - 13).slice(0, 2);
    doc.text(summaryLines, margin + 13, y + 3);
    y += summaryLines.length * 4 + 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentW, y);
    y += 5;
  });

  // CONCURRENTS section
  checkSpace(12);
  doc.setFillColor(232, 242, 255);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 36, 64);
  doc.text("VEILLE CONCURRENTS — MOUVEMENTS RÉCENTS", margin + 4, y + 5.5);
  y += 13;

  COMPETITORS.filter(c => c.threat === "high").forEach(comp => {
    checkSpace(28);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 36, 64);
    doc.text(comp.name, margin, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`${comp.origin} · ${comp.frenchAssets} France · ${comp.aum} AUM`, margin + 28, y);
    y += 6;
    comp.recentMoves.slice(0, 2).forEach(move => {
      checkSpace(8);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(`→ ${move}`, contentW - 6);
      doc.text(lines, margin + 4, y);
      y += lines.length * 4.5 + 2;
    });
    y += 5;
  });

  // Footer on every page
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 36, 64);
    doc.rect(0, 285, 210, 12, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("BT Immo Group · Asset Management — Document confidentiel", margin, 292);
    doc.text(`Page ${i} / ${total}`, 210 - margin, 292, { align: "right" });
  }

  const dateStr = now.toISOString().split("T")[0];
  doc.save(`BTWatch_Brief_${dateStr}.pdf`);
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

  const NAV = [
    { id: "veille", label: "Veille", icon: "📰" },
    { id: "radar", label: "Radar marché", icon: "📊" },
    { id: "concurrents", label: "Concurrents", icon: "🏢" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: COLORS.gray50, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: COLORS.navyDeep, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px #0003" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏗</div>
            <div>
              <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 16 }}>BT<span style={{ color: COLORS.blueLight }}>Watch</span></div>
              <div style={{ color: COLORS.gray400, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: activePage === item.id ? "#ffffff18" : "transparent", color: activePage === item.id ? COLORS.white : COLORS.gray400, fontWeight: activePage === item.id ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activePage === "veille" && (
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: COLORS.gray400, fontSize: 13, pointerEvents: "none" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ background: "#ffffff14", border: "1px solid #ffffff22", borderRadius: 8, padding: "7px 12px 7px 32px", color: COLORS.white, fontSize: 13, width: 190, outline: "none" }} />
            </div>
          )}
          <button onClick={generatePDF} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`, border: "none", borderRadius: 8, color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            📄 Exporter le brief PDF
          </button>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navyMid})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>A</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        {activePage === "veille" && (
          <aside style={{ width: 215, background: COLORS.white, borderRight: `1px solid ${COLORS.gray200}`, padding: "24px 0", flexShrink: 0, position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" }}>
            <div style={{ padding: "0 18px 12px", fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>Catégories</div>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 18px", background: activeCategory === cat.id ? COLORS.bluePale : "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRight: activeCategory === cat.id ? `3px solid ${COLORS.blue}` : "3px solid transparent", transition: "all 0.15s" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: activeCategory === cat.id ? 700 : 500, color: activeCategory === cat.id ? COLORS.blue : COLORS.gray600 }}>{cat.label}</span>
              </button>
            ))}
            <div style={{ margin: "20px 18px 0", paddingTop: 18, borderTop: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Sources actives</div>
              {["Voxlog", "Le Moniteur", "Les Echos", "Business Immo", "CBRE Research", "Reuters"].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", fontSize: 12, color: COLORS.gray600 }}>
                  <span style={{ color: COLORS.success, fontSize: 9 }}>●</span>{s}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main */}
        <main style={{ flex: 1, padding: "26px 28px", minWidth: 0 }}>

          {/* VEILLE */}
          {activePage === "veille" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
                {[
                  { label: "Articles aujourd'hui", value: "47", delta: "+12%", up: true },
                  { label: "Score moyen", value: "79", delta: "/ 100", up: true },
                  { label: "Haute pertinence", value: ARTICLES.filter(a => a.score >= 85).length, delta: "articles", up: true },
                  { label: "Sources actives", value: "24", delta: "en ligne", up: true },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.gray200}`, padding: "15px 18px" }}>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                      <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.navyDeep }}>{s.value}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.up ? COLORS.success : COLORS.warning }}>{s.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              {activeCategory === "all" && search === "" && (
                <div style={{ background: `linear-gradient(135deg, ${COLORS.navyDeep}, ${COLORS.navyMid})`, borderRadius: 16, padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: COLORS.blue + "22", borderRadius: "50%" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ background: COLORS.blue, color: COLORS.white, fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 9px", textTransform: "uppercase", letterSpacing: "0.07em" }}>À la une</span>
                      <span style={{ background: "#ffffff20", color: COLORS.blueLight, fontSize: 10, fontWeight: 600, borderRadius: 5, padding: "2px 9px" }}>Score 97 · Haute pertinence</span>
                    </div>
                    <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 700, color: COLORS.white, margin: "0 0 8px", lineHeight: 1.35, maxWidth: 560 }}>Canal Seine-Nord Europe : les actifs logistiques du corridor nord valorisés 15% de plus</h3>
                    <p style={{ color: "#ffffffaa", fontSize: 13, lineHeight: 1.6, maxWidth: 520, margin: "0 0 14px" }}>L'avancement du chantier génère un effet d'anticipation fort sur les valorisations de Cambrai, Marquion et Dunkerque — zones directement concernées par le portefeuille e-Valley.</p>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: COLORS.blueLight, fontSize: 12 }}>Le Moniteur · Il y a 1j · 5 min</span>
                      <button style={{ background: COLORS.blue, color: COLORS.white, border: "none", borderRadius: 8, padding: "7px 15px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Lire l'article →</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: COLORS.navyDeep, margin: 0 }}>{activeCategory === "all" ? "Tous les articles" : CATEGORIES.find(c => c.id === activeCategory)?.label}</h2>
                  <p style={{ fontSize: 12, color: COLORS.gray400, margin: "3px 0 0" }}>{filtered.length} résultat{filtered.length > 1 ? "s" : ""} · Mis à jour il y a 14 min</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["grid", "list"].map(v => (
                    <button key={v} onClick={() => setView(v)} style={{ padding: "6px 13px", borderRadius: 8, border: `1px solid ${view === v ? COLORS.blue : COLORS.gray200}`, background: view === v ? COLORS.bluePale : COLORS.white, color: view === v ? COLORS.blue : COLORS.gray600, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      {v === "grid" ? "⊞ Grille" : "☰ Liste"}
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

          {/* RADAR */}
          {activePage === "radar" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>Radar Marché</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Indicateurs clés du marché logistique français · Mise à jour hebdomadaire</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
                {RADAR_DATA.map(item => (
                  <div key={item.label} style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "20px 22px" }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400, marginBottom: 5 }}>{item.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 5 }}>
                      <span style={{ fontSize: 30, fontWeight: 800, color: COLORS.navyDeep, lineHeight: 1 }}>{item.value}</span>
                      <span style={{ fontSize: 13, color: COLORS.gray400, fontWeight: 600 }}>{item.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.up ? COLORS.success : COLORS.warning }}>{item.up ? "▲" : "▼"} {item.delta}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray200}`, padding: "22px 26px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Zones stratégiques — Activité du mois</div>
                {[
                  { zone: "Corridor Nord (Cambrai, Lille, Calais)", activity: 9, deals: "5 transactions", highlight: "Canal Seine-Nord catalyse les investissements" },
                  { zone: "Île-de-France (Roissy, Orly, Marne-la-Vallée)", activity: 7, deals: "4 transactions", highlight: "Vacance quasi-nulle, loyers en hausse" },
                  { zone: "Corridor Rhône (Lyon, Mâcon, Valence)", activity: 6, deals: "3 transactions", highlight: "Demande soutenue des 3PL et e-commerçants" },
                  { zone: "Axe Atlantique (Bordeaux, Nantes)", activity: 4, deals: "2 transactions", highlight: "Marchés émergents avec fort potentiel" },
                  { zone: "PACA (Marseille, Avignon, Fos)", activity: 3, deals: "2 transactions", highlight: "Intérêt croissant des fonds du Golfe" },
                ].map(row => (
                  <div key={row.zone} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: `1px solid ${COLORS.gray100}` }}>
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

          {/* CONCURRENTS */}
          {activePage === "concurrents" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.navyDeep, margin: "0 0 4px" }}>Veille Concurrents</h2>
                <p style={{ fontSize: 13, color: COLORS.gray400, margin: 0 }}>Suivi des principaux acteurs du marché logistique français</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Concurrents directs", value: COMPETITORS.filter(c => c.threat === "high").length, color: COLORS.danger },
                  { label: "À surveiller", value: COMPETITORS.filter(c => c.threat === "medium").length, color: COLORS.warning },
                  { label: "Veille passive", value: COMPETITORS.filter(c => c.threat === "low").length, color: COLORS.success },
                  { label: "Opérations tracées", value: COMPETITORS.reduce((acc, c) => acc + c.recentMoves.length, 0), color: COLORS.blue },
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
