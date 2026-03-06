// Design 1: Dark Terminal / Cyberpunk
import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";
import KruskalWallisCalculator from "~/components/KruskalWallisCalculator";

export default function Design1() {
  return (
    <main style={{
      "min-height": "100vh",
      background: "#0D0D0D",
      color: "#00FF41",
      "font-family": "'Courier New', Courier, monospace",
      padding: "2rem",
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
    }}>
      <Title>MSB Calculator — Terminal</Title>

      {/* Header */}
      <div style={{ width: "100%", "max-width": "1100px", "margin-bottom": "2rem" }}>
        <div style={{
          "border-bottom": "1px solid #00FF41",
          "padding-bottom": "0.75rem",
          "margin-bottom": "1.5rem",
          display: "flex",
          "align-items": "baseline",
          gap: "1rem",
        }}>
          <span style={{ color: "#00FF41", "font-size": "0.7rem", opacity: 0.6 }}>$</span>
          <h1 style={{
            "font-size": "1.5rem",
            "font-weight": "bold",
            "letter-spacing": "0.15em",
            color: "#00FF41",
            margin: 0,
            "text-transform": "uppercase",
          }}>
            msb-calculator<span style={{ animation: "blink 1s step-end infinite", color: "#00FF41" }}>_</span>
          </h1>
          <span style={{ "font-size": "0.65rem", color: "#00FFFF", opacity: 0.7, "margin-left": "auto" }}>
            v2.0.0 :: STAT ENGINE ONLINE
          </span>
        </div>

        {/* Navigation table */}
        <div style={{
          border: "1px solid #1A3A1A",
          background: "#050505",
          padding: "1.25rem",
          "margin-bottom": "1.5rem",
        }}>
          <div style={{
            display: "grid",
            "grid-template-columns": "1fr 1fr 1fr",
            "padding-bottom": "0.5rem",
            "margin-bottom": "0.5rem",
            "border-bottom": "1px solid #1A3A1A",
            "font-size": "0.65rem",
            "letter-spacing": "0.2em",
            color: "#00FFFF",
            "text-transform": "uppercase",
          }}>
            <div>&gt; test_case</div>
            <div style={{ "text-align": "center" }}>parametric</div>
            <div style={{ "text-align": "center" }}>nonparametric</div>
          </div>
          {[
            { label: "standard_case", sub: "2 unmatched samples", p: { label: "two_sample_t", href: "#welch-t-test" }, np: { label: "mann_whitney", href: "#mann-whitney-u" } },
            { label: "matched_samples", sub: "2 groups", p: { label: "paired_t", href: "#paired-t-test" }, np: { label: "wilcoxon", href: null } },
            { label: "multi_group", sub: ">=3 groups", p: { label: "anova", href: "#anova" }, np: { label: "kruskal_wallis", href: "#kruskal-wallis" } },
          ].map((row) => (
            <div style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr 1fr",
              padding: "0.75rem 0",
              "border-bottom": "1px solid #0A1A0A",
              "align-items": "center",
              "font-size": "0.85rem",
            }}>
              <div>
                <div style={{ color: "#E0E0E0" }}>{row.label}</div>
                <div style={{ "font-size": "0.65rem", color: "#336633", "margin-top": "0.1rem" }}>{row.sub}</div>
              </div>
              <div style={{ "text-align": "center" }}>
                {row.p.href
                  ? <a href={row.p.href} style={{ color: "#00FF41", "text-decoration": "none", "border-bottom": "1px dashed #336633" }}>{row.p.label}</a>
                  : <span style={{ color: "#336633" }}>{row.p.label}</span>}
              </div>
              <div style={{ "text-align": "center" }}>
                {row.np.href
                  ? <a href={row.np.href} style={{ color: "#00FF41", "text-decoration": "none", "border-bottom": "1px dashed #336633" }}>{row.np.label}</a>
                  : <span style={{ color: "#336633" }}>{row.np.label}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Other tests */}
        <div style={{ "font-size": "0.75rem", "margin-bottom": "0.5rem", color: "#336633", "letter-spacing": "0.1em" }}>
          // other_modules:
        </div>
        <div style={{ display: "flex", gap: "1.5rem", "flex-wrap": "wrap", "font-size": "0.85rem" }}>
          <a href="#general-stats" style={{ color: "#00FFFF", "text-decoration": "none" }}>&gt; general_statistics</a>
          <a href="#welch-t-test" style={{ color: "#00FFFF", "text-decoration": "none" }}>&gt; confidence_intervals</a>
        </div>
      </div>

      {/* Sections */}
      {[
        { id: "general-stats", label: "general_statistics", sub: "descriptive stats :: raw dataset input", Component: DataInputEditor },
        { id: "welch-t-test", label: "welch_t_test", sub: "compare means :: unequal variance", Component: WelchTTestCalculator },
        { id: "mann-whitney-u", label: "mann_whitney_u", sub: "nonparametric :: two independent samples", Component: MannWhitneyUCalculator },
        { id: "paired-t-test", label: "paired_t_test", sub: "compare means :: related groups", Component: PairedTTestCalculator },
        { id: "anova", label: "one_way_anova", sub: "compare means :: 3+ independent samples", Component: AnovaCalculator },
        { id: "kruskal-wallis", label: "kruskal_wallis", sub: "nonparametric :: 3+ independent samples", Component: KruskalWallisCalculator },
      ].map(({ id, label, sub, Component }) => (
        <section id={id} style={{
          width: "100%",
          "max-width": "1100px",
          "margin-bottom": "3rem",
          "scroll-margin-top": "6rem",
        }}>
          <div style={{
            "border-left": "3px solid #00FF41",
            "padding-left": "1rem",
            "margin-bottom": "1rem",
          }}>
            <div style={{ "font-size": "1.1rem", "font-weight": "bold", color: "#00FF41", "letter-spacing": "0.1em" }}>
              &gt; {label}
            </div>
            <div style={{ "font-size": "0.7rem", color: "#336633", "margin-top": "0.2rem" }}>{sub}</div>
          </div>
          <Component />
        </section>
      ))}

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0D0D; }
        ::-webkit-scrollbar-thumb { background: #00FF41; }
      `}</style>
    </main>
  );
}
