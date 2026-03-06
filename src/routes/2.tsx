// Design 2: Swiss International Typographic Style
import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";
import KruskalWallisCalculator from "~/components/KruskalWallisCalculator";

export default function Design2() {
  return (
    <main style={{
      "min-height": "100vh",
      background: "#FFFFFF",
      color: "#000000",
      "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <Title>MSB Calculator — Swiss</Title>

      {/* Top bar */}
      <div style={{
        background: "#E8000D",
        padding: "0.4rem 2rem",
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
      }}>
        <span style={{ color: "white", "font-size": "0.65rem", "letter-spacing": "0.25em", "text-transform": "uppercase", "font-weight": "700" }}>
          Statistical Hypothesis Testing
        </span>
        <span style={{ color: "rgba(255,255,255,0.7)", "font-size": "0.6rem", "letter-spacing": "0.15em" }}>
          MSB / 2024
        </span>
      </div>

      {/* Hero */}
      <div style={{
        padding: "4rem 2rem 3rem",
        "max-width": "1100px",
        margin: "0 auto",
        "border-bottom": "2px solid #000",
      }}>
        <div style={{ display: "flex", "align-items": "flex-end", "justify-content": "space-between", "flex-wrap": "wrap", gap: "2rem" }}>
          <div>
            <div style={{ "font-size": "0.65rem", "letter-spacing": "0.3em", "text-transform": "uppercase", color: "#E8000D", "font-weight": "700", "margin-bottom": "0.75rem" }}>
              Unofficial Calculator
            </div>
            <h1 style={{
              "font-size": "clamp(3rem, 8vw, 6rem)",
              "font-weight": "900",
              "line-height": "0.9",
              margin: 0,
              "letter-spacing": "-0.02em",
              color: "#000",
            }}>
              MSB
            </h1>
          </div>
          <div style={{ "max-width": "320px" }}>
            <p style={{ "font-size": "0.85rem", "line-height": "1.6", color: "#333", margin: 0 }}>
              A systematic tool for parametric and non-parametric hypothesis testing. Select your test case based on sample structure and distribution assumptions.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation grid */}
      <div style={{ "max-width": "1100px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Column headers */}
        <div style={{
          display: "grid",
          "grid-template-columns": "2fr 1fr 1fr",
          padding: "1rem 0 0.5rem",
          "border-bottom": "1px solid #000",
        }}>
          <div style={{ "font-size": "0.6rem", "letter-spacing": "0.25em", "text-transform": "uppercase", "font-weight": "700" }}>Test Case</div>
          <div style={{ "font-size": "0.6rem", "letter-spacing": "0.25em", "text-transform": "uppercase", "font-weight": "700", "text-align": "center" }}>Parametric</div>
          <div style={{ "font-size": "0.6rem", "letter-spacing": "0.25em", "text-transform": "uppercase", "font-weight": "700", "text-align": "center" }}>Nonparametric</div>
        </div>

        {[
          { n: "01", label: "Standard Case", sub: "2 unmatched samples", p: { text: "Two-sample t-test", href: "#welch-t-test" }, np: { text: "Mann-Whitney", href: "#mann-whitney-u" } },
          { n: "02", label: "Matched Samples", sub: "2 groups", p: { text: "Paired t-test", href: "#paired-t-test" }, np: { text: "Wilcoxon", href: null } },
          { n: "03", label: "More than 2 Groups", sub: "Matched or unmatched", p: { text: "ANOVA", href: "#anova" }, np: { text: "Kruskal-Wallis", href: "#kruskal-wallis" } },
        ].map((row) => (
          <div style={{
            display: "grid",
            "grid-template-columns": "2fr 1fr 1fr",
            padding: "1.5rem 0",
            "border-bottom": "1px solid #E0E0E0",
            "align-items": "center",
          }}>
            <div style={{ display: "flex", "align-items": "baseline", gap: "1rem" }}>
              <span style={{ "font-size": "0.65rem", "font-weight": "700", color: "#E8000D", "min-width": "1.5rem" }}>{row.n}</span>
              <div>
                <div style={{ "font-size": "1.1rem", "font-weight": "700", "letter-spacing": "-0.01em" }}>{row.label}</div>
                <div style={{ "font-size": "0.75rem", color: "#666", "margin-top": "0.2rem" }}>{row.sub}</div>
              </div>
            </div>
            <div style={{ "text-align": "center" }}>
              {row.p.href
                ? <a href={row.p.href} style={{ color: "#000", "font-size": "0.85rem", "font-weight": "500", "text-decoration": "underline", "text-underline-offset": "3px" }}>{row.p.text}</a>
                : <span style={{ color: "#999", "font-size": "0.85rem" }}>{row.p.text}</span>}
            </div>
            <div style={{ "text-align": "center" }}>
              {row.np.href
                ? <a href={row.np.href} style={{ color: "#000", "font-size": "0.85rem", "font-weight": "500", "text-decoration": "underline", "text-underline-offset": "3px" }}>{row.np.text}</a>
                : <span style={{ color: "#999", "font-size": "0.85rem" }}>{row.np.text}</span>}
            </div>
          </div>
        ))}

        {/* Other tests */}
        <div style={{ padding: "1.5rem 0 3rem", display: "flex", gap: "2rem", "align-items": "center", "flex-wrap": "wrap" }}>
          <span style={{ "font-size": "0.6rem", "letter-spacing": "0.25em", "text-transform": "uppercase", "font-weight": "700", color: "#999" }}>Other</span>
          <a href="#general-stats" style={{ color: "#000", "font-size": "0.85rem", "font-weight": "500", "text-decoration": "underline", "text-underline-offset": "3px" }}>General Statistics</a>
          <a href="#welch-t-test" style={{ color: "#000", "font-size": "0.85rem", "font-weight": "500", "text-decoration": "underline", "text-underline-offset": "3px" }}>Confidence Intervals</a>
        </div>
      </div>

      {/* Red divider */}
      <div style={{ height: "4px", background: "#E8000D" }} />

      {/* Sections */}
      <div style={{ "max-width": "1100px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        {[
          { id: "general-stats", n: "01", label: "General Statistics", sub: "Descriptive statistics for a raw dataset.", Component: DataInputEditor },
          { id: "welch-t-test", n: "02", label: "Welch's t-test", sub: "Compare the means of two samples with unequal variances.", Component: WelchTTestCalculator },
          { id: "mann-whitney-u", n: "03", label: "Mann-Whitney U-test", sub: "Non-parametric test to compare two independent samples.", Component: MannWhitneyUCalculator },
          { id: "paired-t-test", n: "04", label: "Paired t-test", sub: "Compare the means of two related groups.", Component: PairedTTestCalculator },
          { id: "anova", n: "05", label: "One-way ANOVA", sub: "Compare the means of three or more independent samples.", Component: AnovaCalculator },
          { id: "kruskal-wallis", n: "06", label: "Kruskal-Wallis test", sub: "Non-parametric test to compare three or more independent samples.", Component: KruskalWallisCalculator },
        ].map(({ id, n, label, sub, Component }) => (
          <section id={id} style={{ "padding-top": "4rem", "scroll-margin-top": "2rem" }}>
            <div style={{
              display: "flex",
              "align-items": "baseline",
              gap: "1.5rem",
              "border-bottom": "2px solid #000",
              "padding-bottom": "0.75rem",
              "margin-bottom": "1.5rem",
            }}>
              <span style={{ "font-size": "0.65rem", "font-weight": "700", color: "#E8000D" }}>{n}</span>
              <div>
                <h2 style={{ "font-size": "1.75rem", "font-weight": "900", margin: 0, "letter-spacing": "-0.02em" }}>{label}</h2>
                <p style={{ "font-size": "0.8rem", color: "#666", margin: "0.25rem 0 0" }}>{sub}</p>
              </div>
            </div>
            <Component />
          </section>
        ))}
      </div>
    </main>
  );
}
