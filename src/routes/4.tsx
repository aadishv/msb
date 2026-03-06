// Design 4: Synthwave / Retro 80s
import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";
import KruskalWallisCalculator from "~/components/KruskalWallisCalculator";

export default function Design4() {
  return (
    <main style={{
      "min-height": "100vh",
      background: "linear-gradient(180deg, #0D0221 0%, #1A0533 40%, #0D0221 100%)",
      color: "#E0D0FF",
      "font-family": "'Arial Narrow', Arial, sans-serif",
      padding: "0",
      "overflow-x": "hidden",
    }}>
      <Title>MSB Calculator — Synthwave</Title>

      {/* Grid perspective floor decoration */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35vh",
        background: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,0,220,0.08) 40px, rgba(255,0,220,0.08) 41px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,0,220,0.08) 80px, rgba(255,0,220,0.08) 81px)",
        "pointer-events": "none",
        "z-index": 0,
        transform: "perspective(300px) rotateX(60deg)",
        "transform-origin": "bottom center",
      }} />

      <div style={{ position: "relative", "z-index": 1, padding: "2.5rem 2rem", "max-width": "1100px", margin: "0 auto" }}>

        {/* Header / Hero */}
        <div style={{ "text-align": "center", "margin-bottom": "3rem" }}>
          <div style={{
            "font-size": "0.65rem",
            "letter-spacing": "0.4em",
            "text-transform": "uppercase",
            color: "#FF00DC",
            "margin-bottom": "0.75rem",
            "font-weight": "bold",
          }}>
            ◈ UNOFFICIAL ◈ CALCULATOR ◈
          </div>
          <h1 style={{
            "font-size": "clamp(3.5rem, 10vw, 7rem)",
            "font-weight": "900",
            margin: "0 0 0.25rem",
            "letter-spacing": "0.05em",
            "line-height": "1",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FF00DC 40%, #7B00FF 100%)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "background-clip": "text",
            "text-shadow": "none",
            filter: "drop-shadow(0 0 30px rgba(255,0,220,0.5))",
          }}>
            MSB
          </h1>
          <div style={{
            "font-size": "clamp(0.75rem, 2vw, 1rem)",
            "letter-spacing": "0.3em",
            "text-transform": "uppercase",
            color: "#00EEFF",
            "margin-bottom": "0.5rem",
            filter: "drop-shadow(0 0 8px rgba(0,238,255,0.6))",
          }}>
            Statistical Hypothesis Testing
          </div>
          <div style={{ "font-size": "0.65rem", color: "rgba(255,0,220,0.6)", "letter-spacing": "0.2em" }}>
            ▼ ▼ ▼
          </div>
        </div>

        {/* Test selector cards */}
        <div style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          "margin-bottom": "1.5rem",
        }}>
          {[
            { label: "Standard Case", sub: "2 unmatched samples", p: { text: "Two-sample t-test", href: "#welch-t-test" }, np: { text: "Mann-Whitney", href: "#mann-whitney-u" }, color: "#FF00DC" },
            { label: "Matched Samples", sub: "2 related groups", p: { text: "Paired t-test", href: "#paired-t-test" }, np: { text: "Wilcoxon", href: null }, color: "#7B00FF" },
            { label: "3+ Groups", sub: "Multiple comparison", p: { text: "ANOVA", href: "#anova" }, np: { text: "Kruskal-Wallis", href: "#kruskal-wallis" }, color: "#00EEFF" },
          ].map((card) => (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${card.color}44`,
              "border-top": `2px solid ${card.color}`,
              padding: "1.25rem",
              "border-radius": "2px",
              "box-shadow": `0 0 20px ${card.color}22, inset 0 0 20px rgba(0,0,0,0.2)`,
            }}>
              <div style={{ "font-size": "0.6rem", "letter-spacing": "0.25em", "text-transform": "uppercase", color: card.color, "margin-bottom": "0.5rem", "font-weight": "bold" }}>
                {card.sub}
              </div>
              <div style={{ "font-size": "1.1rem", "font-weight": "bold", color: "white", "margin-bottom": "1rem", "letter-spacing": "0.05em" }}>
                {card.label}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", "flex-wrap": "wrap" }}>
                {card.p.href
                  ? <a href={card.p.href} style={{ color: "#E0D0FF", "font-size": "0.8rem", background: `${card.color}22`, border: `1px solid ${card.color}66`, padding: "0.3rem 0.75rem", "text-decoration": "none", "border-radius": "1px", "white-space": "nowrap" }}>{card.p.text}</a>
                  : <span style={{ color: "#664488", "font-size": "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid #333", padding: "0.3rem 0.75rem", "border-radius": "1px" }}>{card.p.text}</span>}
                {card.np.href
                  ? <a href={card.np.href} style={{ color: "#E0D0FF", "font-size": "0.8rem", background: "rgba(0,238,255,0.08)", border: "1px solid rgba(0,238,255,0.3)", padding: "0.3rem 0.75rem", "text-decoration": "none", "border-radius": "1px", "white-space": "nowrap" }}>{card.np.text}</a>
                  : <span style={{ color: "#444466", "font-size": "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid #222", padding: "0.3rem 0.75rem", "border-radius": "1px" }}>{card.np.text}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Other tests */}
        <div style={{
          display: "flex",
          gap: "1.5rem",
          "align-items": "center",
          "flex-wrap": "wrap",
          "margin-bottom": "3rem",
          "padding": "0.75rem 1rem",
          background: "rgba(255,0,220,0.05)",
          "border-left": "2px solid rgba(255,0,220,0.4)",
        }}>
          <span style={{ "font-size": "0.6rem", "letter-spacing": "0.2em", "text-transform": "uppercase", color: "rgba(255,0,220,0.6)" }}>Also:</span>
          <a href="#general-stats" style={{ color: "#00EEFF", "font-size": "0.85rem", "text-decoration": "none", filter: "drop-shadow(0 0 4px rgba(0,238,255,0.4))" }}>General Statistics</a>
          <a href="#welch-t-test" style={{ color: "#00EEFF", "font-size": "0.85rem", "text-decoration": "none", filter: "drop-shadow(0 0 4px rgba(0,238,255,0.4))" }}>Confidence Intervals</a>
        </div>

        {/* Neon divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #FF00DC, #7B00FF, #00EEFF, transparent)", "margin-bottom": "3rem", "box-shadow": "0 0 10px rgba(255,0,220,0.5)" }} />

        {/* Sections */}
        {[
          { id: "general-stats", label: "General Statistics", sub: "Descriptive stats · raw dataset", Component: DataInputEditor, color: "#FF00DC" },
          { id: "welch-t-test", label: "Welch's t-test", sub: "Two-sample · unequal variance", Component: WelchTTestCalculator, color: "#7B00FF" },
          { id: "mann-whitney-u", label: "Mann-Whitney U", sub: "Nonparametric · two independent samples", Component: MannWhitneyUCalculator, color: "#00EEFF" },
          { id: "paired-t-test", label: "Paired t-test", sub: "Matched samples · two groups", Component: PairedTTestCalculator, color: "#FF00DC" },
          { id: "anova", label: "One-way ANOVA", sub: "3+ independent groups", Component: AnovaCalculator, color: "#7B00FF" },
          { id: "kruskal-wallis", label: "Kruskal-Wallis", sub: "Nonparametric · 3+ groups", Component: KruskalWallisCalculator, color: "#00EEFF" },
        ].map(({ id, label, sub, Component, color }) => (
          <section id={id} style={{ "margin-bottom": "3.5rem", "scroll-margin-top": "2rem" }}>
            <div style={{
              display: "flex",
              "align-items": "center",
              gap: "0.75rem",
              "margin-bottom": "1rem",
            }}>
              <div style={{ width: "3px", height: "2rem", background: color, "box-shadow": `0 0 8px ${color}` }} />
              <div>
                <h2 style={{
                  "font-size": "1.25rem",
                  "font-weight": "bold",
                  margin: 0,
                  color: "white",
                  "letter-spacing": "0.05em",
                  "text-shadow": `0 0 20px ${color}88`,
                }}>
                  {label}
                </h2>
                <div style={{ "font-size": "0.7rem", color: color, "letter-spacing": "0.15em", "text-transform": "uppercase", "margin-top": "0.1rem", opacity: 0.8 }}>{sub}</div>
              </div>
            </div>
            <Component />
          </section>
        ))}
      </div>
    </main>
  );
}
