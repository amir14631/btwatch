import { useState } from "react";

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
};

const CATEGORIES = [
  { id: "all", label: "Toutes", color: COLORS.blue },
  { id: "ma", label: "Fusions & Acquisitions", color: "#7c3aed" },
  { id: "finance", label: "Marchés financiers", color: "#059669" },
  { id: "immo", label: "Immobilier logistique", color: "#2a7de1" },
  { id: "esg", label: "ESG & Durabilité", color: "#0d9488" },
];

const ARTICLES = [
  {
    id: 1,
    category: "ma",
    categoryLabel: "Fusions & Acquisitions",
    title: "Prologis acquiert un portefeuille européen de 2,1 Mds€",
    summary: "Le géant américain de l'immobilier logistique renforce sa présence en Europe du Nord avec l'acquisition de 18 actifs en Allemagne, Pays-Bas et Belgique. Une opération qui redessine les équilibres du marché continental.",
    source: "Le Moniteur",
    date: "Il y a 2h",
    readTime: "4 min",
    tag: "Exclusif",
    tagColor: "#7c3aed",
    trend: "up",
  },
  {
    id: 2,
    category: "immo",
    categoryLabel: "Immobilier logistique",
    title: "Les entrepôts classe A atteignent un taux d'occupation record de 97% en Île-de-France",
    summary: "La pression sur le foncier logistique francilien ne faiblit pas. Le taux de vacance historiquement bas tire les valeurs locatives vers le haut, avec des loyers prime dépassant les 80€/m²/an sur certains axes.",
    source: "Voxlog",
    date: "Il y a 5h",
    readTime: "3 min",
    tag: "Marché",
    tagColor: COLORS.blue,
    trend: "up",
  },
  {
    id: 3,
    category: "esg",
    categoryLabel: "ESG & Durabilité",
    title: "La taxonomie verte européenne : nouvelles contraintes pour les fonds immobiliers en 2025",
    summary: "Brookfield, Blackstone et les grands gestionnaires alternatifs accélèrent leur mise en conformité avec la taxonomie EU. Les actifs non certifiés risquent une décote significative dès 2026.",
    source: "Les Echos",
    date: "Il y a 8h",
    readTime: "6 min",
    tag: "Réglementation",
    tagColor: "#0d9488",
    trend: "neutral",
  },
  {
    id: 4,
    category: "finance",
    categoryLabel: "Marchés financiers",
    title: "Taux directeurs BCE : le pivot attendu soulage les SCPI et SIIC",
    summary: "La décision de la BCE de maintenir sa trajectoire baissière redonne de l'air aux véhicules immobiliers cotés. Les rendements logistiques se resserrent, signe d'une revalorisation progressive des portefeuilles.",
    source: "Boursorama",
    date: "Il y a 12h",
    readTime: "5 min",
    tag: "Analyse",
    tagColor: "#059669",
    trend: "up",
  },
  {
    id: 5,
    category: "ma",
    categoryLabel: "Fusions & Acquisitions",
    title: "Goodman Group entre en négociations exclusives pour racheter un opérateur logistique français",
    summary: "L'australien Goodman confirme son appétit pour le marché français. Les discussions portent sur plusieurs plateformes dans le corridor Paris-Lyon, pour un montant estimé entre 400 et 600 M€.",
    source: "Reuters",
    date: "Il y a 1j",
    readTime: "4 min",
    tag: "Breaking",
    tagColor: "#dc2626",
    trend: "up",
  },
  {
    id: 6,
    category: "immo",
    categoryLabel: "Immobilier logistique",
    title: "Canal Seine-Nord Europe : les actifs logistiques du corridor nord valorisés 15% de plus",
    summary: "L'avancement du chantier du canal Seine-Nord génère un effet d'anticipation fort sur les valorisations immobilières des zones de Cambrai, Marquion et Dunkerque. Les investisseurs se positionnent en amont.",
    source: "Le Moniteur",
    date: "Il y a 1j",
    readTime: "5 min",
    tag: "Infrastructure",
    tagColor: COLORS.blue,
    trend: "up",
  },
  {
    id: 7,
    category: "esg",
    categoryLabel: "ESG & Durabilité",
    title: "Certification BREEAM Outstanding : seuls 12 entrepôts en France atteignent le plus haut niveau",
    summary: "La course à la certification environnementale s'intensifie dans le secteur logistique. Les bâtiments BREEAM Outstanding commandent une prime locative de 8 à 12% par rapport aux actifs standards.",
    source: "CBRE Research",
    date: "Il y a 2j",
    readTime: "7 min",
    tag: "Etude",
    tagColor: "#0d9488",
    trend: "neutral",
  },
  {
    id: 8,
    category: "finance",
    categoryLabel: "Marchés financiers",
    title: "Immobilier alternatif : les fonds de dette logistique lèvent 8 Mds€ en Europe au T1 2025",
    summary: "La dette privée immobilière s'impose comme classe d'actifs incontournable. Les fonds spécialisés logistique affichent des rendements cibles de 7 à 9%, attirant massivement les institutionnels.",
    source: "IPE Real Assets",
    date: "Il y a 2j",
    readTime: "6 min",
    tag: "Capital",
    tagColor: "#059669",
    trend: "up",
  },
  {
    id: 9,
    category: "ma",
    categoryLabel: "Fusions & Acquisitions",
    title: "Panattoni cède un parc logistique à Marseille à un fonds souverain du Golfe",
    summary: "La transaction à 180 M€ illustre l'appétit croissant des fonds souverains moyen-orientaux pour l'immobilier logistique européen. Le taux de capitalisation retenu est de 4,75%, un signal fort sur les valuations.",
    source: "Business Immo",
    date: "Il y a 3j",
    readTime: "3 min",
    tag: "Transaction",
    tagColor: "#7c3aed",
    trend: "neutral",
  },
];

const STATS = [
  { label: "Articles aujourd'hui", value: "47", delta: "+12%", up: true },
  { label: "Transactions suivies", value: "3", delta: "Ce mois", up: true },
  { label: "Alertes actives", value: "8", delta: "2 nouvelles", up: false },
  { label: "Sources monitorées", value: "24", delta: "Sources", up: true },
];

function TrendIcon({ trend }) {
  if (trend === "up") return <span style={{ color: COLORS.success, fontSize: 12 }}>▲</span>;
  if (trend === "down") return <span style={{ color: COLORS.danger, fontSize: 12 }}>▼</span>;
  return <span style={{ color: COLORS.gray400, fontSize: 12 }}>●</span>;
}

function ArticleCard({ article, view }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === article.category);

  if (view === "list") {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          padding: "18px 24px",
          background: hovered ? COLORS.bluePale : COLORS.white,
          borderBottom: `1px solid ${COLORS.gray200}`,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <div style={{
          width: 4,
          minHeight: 60,
          borderRadius: 4,
          background: cat?.color || COLORS.blue,
          flexShrink: 0,
          marginTop: 2,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: cat?.color,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>{article.categoryLabel}</span>
            <span style={{
              fontSize: 11,
              background: article.tagColor + "18",
              color: article.tagColor,
              borderRadius: 4,
              padding: "1px 7px",
              fontWeight: 600,
            }}>{article.tag}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.gray800, marginBottom: 4, lineHeight: 1.4 }}>
            {article.title}
          </div>
          <div style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.5 }}>{article.summary}</div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right", minWidth: 90 }}>
          <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 4 }}>{article.date}</div>
          <div style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source}</div>
          <div style={{ marginTop: 6 }}><TrendIcon trend={article.trend} /></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.white,
        borderRadius: 14,
        border: `1px solid ${hovered ? COLORS.blue : COLORS.gray200}`,
        padding: 24,
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: hovered ? `0 8px 32px ${COLORS.blue}22` : "0 1px 4px #0001",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: cat?.color,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}>{article.categoryLabel}</span>
        </div>
        <span style={{
          fontSize: 11,
          background: article.tagColor + "18",
          color: article.tagColor,
          borderRadius: 5,
          padding: "2px 8px",
          fontWeight: 700,
          flexShrink: 0,
          marginLeft: 8,
        }}>{article.tag}</span>
      </div>

      <div style={{
        fontFamily: "'Georgia', serif",
        fontWeight: 700,
        fontSize: 16,
        color: COLORS.navyDeep,
        lineHeight: 1.45,
      }}>
        {article.title}
      </div>

      <div style={{ fontSize: 13.5, color: COLORS.gray600, lineHeight: 1.6, flex: 1 }}>
        {article.summary}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTop: `1px solid ${COLORS.gray100}`,
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.source}</span>
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>· {article.readTime} de lecture</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendIcon trend={article.trend} />
          <span style={{ fontSize: 12, color: COLORS.gray400 }}>{article.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: COLORS.gray50,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Nav */}
      <header style={{
        background: COLORS.navyDeep,
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px #0003",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo mark */}
          <div style={{
            width: 34,
            height: 34,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}>🏗</div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>
              BT<span style={{ color: COLORS.blueLight }}>Watch</span>
            </div>
            <div style={{ color: COLORS.gray400, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Intelligence Platform
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: COLORS.gray400, fontSize: 14, pointerEvents: "none",
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un sujet..."
              style={{
                background: "#ffffff14",
                border: "1px solid #ffffff22",
                borderRadius: 8,
                padding: "8px 14px 8px 34px",
                color: COLORS.white,
                fontSize: 13,
                width: 240,
                outline: "none",
              }}
            />
          </div>

          {/* Alert bell */}
          <div style={{
            position: "relative",
            width: 36, height: 36,
            background: "#ffffff12",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16,
          }}>
            🔔
            <div style={{
              position: "absolute", top: 6, right: 6,
              width: 8, height: 8,
              background: COLORS.danger,
              borderRadius: "50%",
              border: "2px solid " + COLORS.navyDeep,
            }} />
          </div>

          {/* Avatar */}
          <div style={{
            width: 34, height: 34,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navyMid})`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>A</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{
            width: 220,
            background: COLORS.white,
            borderRight: `1px solid ${COLORS.gray200}`,
            padding: "28px 0",
            flexShrink: 0,
            position: "sticky",
            top: 60,
            height: "calc(100vh - 60px)",
            overflowY: "auto",
          }}>
            <div style={{ padding: "0 20px 16px", fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Catégories
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 20px",
                  background: activeCategory === cat.id ? COLORS.bluePale : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRight: activeCategory === cat.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: cat.color, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 13.5,
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  color: activeCategory === cat.id ? COLORS.blue : COLORS.gray600,
                }}>
                  {cat.label}
                </span>
              </button>
            ))}

            <div style={{ margin: "24px 20px 0", paddingTop: 24, borderTop: `1px solid ${COLORS.gray200}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                Sources actives
              </div>
              {["Voxlog", "Le Moniteur", "Les Echos", "Business Immo", "CBRE Research", "Reuters", "IPE Real Assets"].map(s => (
                <div key={s} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 0", fontSize: 12.5, color: COLORS.gray600,
                }}>
                  <span style={{ color: COLORS.success, fontSize: 10 }}>●</span>
                  {s}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main content */}
        <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}>
            {STATS.map(stat => (
              <div key={stat.label} style={{
                background: COLORS.white,
                borderRadius: 12,
                border: `1px solid ${COLORS.gray200}`,
                padding: "18px 20px",
              }}>
                <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 6 }}>{stat.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: COLORS.navyDeep }}>{stat.value}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: stat.up ? COLORS.success : COLORS.warning,
                  }}>{stat.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navyDeep, margin: 0 }}>
                {activeCategory === "all" ? "Tous les articles" : CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h2>
              <p style={{ fontSize: 13, color: COLORS.gray400, margin: "4px 0 0" }}>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · Mis à jour il y a 14 min
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["grid", "list"].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: `1px solid ${view === v ? COLORS.blue : COLORS.gray200}`,
                    background: view === v ? COLORS.bluePale : COLORS.white,
                    color: view === v ? COLORS.blue : COLORS.gray600,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {v === "grid" ? "⊞ Grille" : "☰ Liste"}
                </button>
              ))}
            </div>
          </div>

          {/* Featured article */}
          {activeCategory === "all" && search === "" && (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navyDeep} 0%, ${COLORS.navyMid} 100%)`,
              borderRadius: 16,
              padding: "28px 32px",
              marginBottom: 24,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 200, height: 200,
                background: COLORS.blue + "22",
                borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute", bottom: -60, right: 80,
                width: 150, height: 150,
                background: COLORS.cyan + "15",
                borderRadius: "50%",
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span style={{
                    background: COLORS.blue,
                    color: COLORS.white,
                    fontSize: 11, fontWeight: 700,
                    borderRadius: 5, padding: "2px 10px",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                  }}>À la une</span>
                  <span style={{
                    background: "#ffffff20",
                    color: COLORS.blueLight,
                    fontSize: 11, fontWeight: 600,
                    borderRadius: 5, padding: "2px 10px",
                  }}>Fusions & Acquisitions</span>
                </div>
                <h3 style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 22, fontWeight: 700,
                  color: COLORS.white, margin: "0 0 10px",
                  lineHeight: 1.35, maxWidth: 600,
                }}>
                  Prologis acquiert un portefeuille européen de 2,1 Mds€ — le marché logistique français en alerte
                </h3>
                <p style={{ color: "#ffffffaa", fontSize: 14, lineHeight: 1.6, maxWidth: 560, margin: "0 0 16px" }}>
                  Le géant américain renforce massivement sa présence en Europe du Nord. Une opération qui redessine les équilibres du marché continental et pourrait impacter les valorisations des actifs français à court terme.
                </p>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ color: COLORS.blueLight, fontSize: 13 }}>Le Moniteur · Il y a 2h · 4 min</span>
                  <button style={{
                    background: COLORS.blue,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}>Lire l'article →</button>
                </div>
              </div>
            </div>
          )}

          {/* Articles */}
          {view === "grid" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 18,
            }}>
              {filtered.map(a => <ArticleCard key={a.id} article={a} view="grid" />)}
            </div>
          ) : (
            <div style={{
              background: COLORS.white,
              borderRadius: 14,
              border: `1px solid ${COLORS.gray200}`,
              overflow: "hidden",
            }}>
              {filtered.map(a => <ArticleCard key={a.id} article={a} view="list" />)}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.gray400 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Aucun résultat trouvé</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Essayez un autre terme de recherche</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
