// Design 5: Glassmorphism / Modern Gradient
import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";
import KruskalWallisCalculator from "~/components/KruskalWallisCalculator";

export default function Design5() {
  return (
    <main style={{
      "min-height": "100vh",
      background: "linear-gradient(135deg, #1e3a5f 0%, #6b21a8 50%, #be185d 100%)",
      color: "white",
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      padding: "0",
    }}>
      <Title>MSB Calculator — Glass</Title>

      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-10%", right: "-10%", width: "50vw", height: "50vw",
        background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
        "border-radius": "50%", "pointer-events": "none", "z-index": 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", left: "-10%", width: "40vw", height: "40vw",
        background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
        "border-radius": "50%", "pointer-events": "none", "z-index": 0,
      }} />

      <div style={{ position: "relative", "z-index": 1, padding: "2.5rem 1.5rem", "max-width": "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          "backdrop-filter": "blur(20px)",
          "-webkit-backdrop-filter": "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          "border-radius": "20px",
          padding: "2rem 2.5rem",
          "margin-bottom": "1.5rem",
          "box-shadow": "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <div style={{ display: "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ "font-size": "0.65rem", "letter-spacing": "0.25em", "text-transform": "uppercase", color: "rgba(255,255,255,0.6)", "margin-bottom": "0.5rem" }}>
                Unofficial Calculator
              </div>
              <h1 style={{
                "font-size": "clamp(2rem, 5vw, 3.5rem)",
                "font-weight": "800",
                margin: "0 0 0.25rem",
                "letter-spacing": "-0.02em",
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                "-webkit-background-clip": "text",
                "-webkit-text-fill-color": "transparent",
                "background-clip": "text",
              }}>
                MSB Calculator
              </h1>
              <p style={{ "font-size": "0.9rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>
                Statistical hypothesis testing, made simple
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              "border-radius": "12px",
              padding: "1rem 1.25rem",
              "font-size": "0.75rem",
              color: "rgba(255,255,255,0.7)",
              "line-height": "1.8",
            }}>
              <div>✦ Parametric tests</div>
              <div>✦ Non-parametric tests</div>
              <div>✦ Descriptive statistics</div>
            </div>
          </div>
        </div>

        {/* Test cards row */}
        <div style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          "margin-bottom": "1.5rem",
        }}>
          {[
            {
              label: "Standard Case",
              sub: "Two unmatched independent samples",
              p: { text: "Two-sample t-test", href: "#welch-t-test" },
              np: { text: "Mann-Whitney U", href: "#mann-whitney-u" },
              gradient: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.4) 100%)",
              accent: "#a78bfa",
            },
            {
              label: "Matched Samples",
              sub: "Two related or paired groups",
              p: { text: "Paired t-test", href: "#paired-t-test" },
              np: { text: "Wilcoxon", href: null },
              gradient: "linear-gradient(135deg, rgba(236,72,153,0.4) 0%, rgba(168,85,247,0.4) 100%)",
              accent: "#f472b6",
            },
            {
              label: "Multiple Groups",
              sub: "Three or more independent samples",
              p: { text: "One-way ANOVA", href: "#anova" },
              np: { text: "Kruskal-Wallis", href: "#kruskal-wallis" },
              gradient: "linear-gradient(135deg, rgba(14,165,233,0.4) 0%, rgba(99,102,241,0.4) 100%)",
              accent: "#38bdf8",
            },
          ].map((card) => (
            <div style={{
              background: card.gradient,
              "backdrop-filter": "blur(20px)",
              "-webkit-backdrop-filter": "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              "border-radius": "16px",
              padding: "1.5rem",
              "box-shadow": "0 4px 24px rgba(0,0,0,0.15)",
            }}>
              <div style={{ "font-size": "0.65rem", "letter-spacing": "0.2em", "text-transform": "uppercase", color: card.accent, "margin-bottom": "0.4rem", "font-weight": "600" }}>
                {card.sub}
              </div>
              <div style={{ "font-size": "1.1rem", "font-weight": "700", color: "white", "margin-bottom": "1.1rem", "letter-spacing": "-0.01em" }}>
                {card.label}
              </div>
              <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                {card.p.href
                  ? (
                    <a href={card.p.href} style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      "border-radius": "8px",
                      padding: "0.45rem 0.75rem",
                      "font-size": "0.8rem",
                      color: "white",
                      "text-decoration": "none",
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                    }}>
                      <span>{card.p.text}</span>
                      <span style={{ opacity: 0.5 }}>→</span>
                    </a>
                  ) : (
                    <div style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      "border-radius": "8px",
                      padding: "0.45rem 0.75rem",
                      "font-size": "0.8rem",
                      color: "rgba(255,255,255,0.35)",
                    }}>
                      {card.p.text} <span style={{ "font-size": "0.65rem" }}>(unavailable)</span>
                    </div>
                  )}
                {card.np.href
                  ? (
                    <a href={card.np.href} style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      "border-radius": "8px",
                      padding: "0.45rem 0.75rem",
                      "font-size": "0.8rem",
                      color: "rgba(255,255,255,0.8)",
                      "text-decoration": "none",
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                    }}>
                      <span>{card.np.text}</span>
                      <span style={{ opacity: 0.5 }}>→</span>
                    </a>
                  ) : (
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      "border-radius": "8px",
                      padding: "0.45rem 0.75rem",
                      "font-size": "0.8rem",
                      color: "rgba(255,255,255,0.25)",
                    }}>
                      {card.np.text} <span style={{ "font-size": "0.65rem" }}>(unavailable)</span>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Other tests pill */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
          "align-items": "center",
          "flex-wrap": "wrap",
          "margin-bottom": "2.5rem",
        }}>
          <span style={{ "font-size": "0.7rem", color: "rgba(255,255,255,0.45)", "letter-spacing": "0.15em", "text-transform": "uppercase" }}>More:</span>
          {[
            { text: "General Statistics", href: "#general-stats" },
            { text: "Confidence Intervals", href: "#welch-t-test" },
          ].map((link) => (
            <a href={link.href} style={{
              background: "rgba(255,255,255,0.12)",
              "backdrop-filter": "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              "border-radius": "20px",
              padding: "0.3rem 0.9rem",
              "font-size": "0.8rem",
              color: "white",
              "text-decoration": "none",
            }}>
              {link.text}
            </a>
          ))}
        </div>

        {/* Sections */}
        {[
          { id: "general-stats", label: "General Statistics", sub: "Calculate descriptive statistics from a raw dataset.", Component: DataInputEditor },
          { id: "welch-t-test", label: "Welch's t-test", sub: "Compare the means of two samples with unequal variances.", Component: WelchTTestCalculator },
          { id: "mann-whitney-u", label: "Mann-Whitney U-test", sub: "Non-parametric test to compare two independent samples.", Component: MannWhitneyUCalculator },
          { id: "paired-t-test", label: "Paired t-test", sub: "Compare the means of two related groups.", Component: PairedTTestCalculator },
          { id: "anova", label: "One-way ANOVA", sub: "Compare the means of three or more independent samples.", Component: AnovaCalculator },
          { id: "kruskal-wallis", label: "Kruskal-Wallis test", sub: "Non-parametric test to compare three or more independent samples.", Component: KruskalWallisCalculator },
        ].map(({ id, label, sub, Component }) => (
          <section id={id} style={{ "margin-bottom": "2.5rem", "scroll-margin-top": "2rem" }}>
            <div style={{
              background: "rgba(255,255,255,0.08)",
              "backdrop-filter": "blur(20px)",
              "-webkit-backdrop-filter": "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
              "border-radius": "16px",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "1.25rem 1.5rem",
                "border-bottom": "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
              }}>
                <h2 style={{ "font-size": "1.2rem", "font-weight": "700", margin: 0, "letter-spacing": "-0.01em" }}>{label}</h2>
                <p style={{ "font-size": "0.8rem", color: "rgba(255,255,255,0.55)", margin: "0.2rem 0 0" }}>{sub}</p>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <Component />
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
