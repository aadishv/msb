// Design 3: Academic Paper / Journal Style
import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";
import KruskalWallisCalculator from "~/components/KruskalWallisCalculator";

export default function Design3() {
  return (
    <main style={{
      "min-height": "100vh",
      background: "#FAFAF5",
      color: "#1A1A1A",
      "font-family": "Georgia, 'Times New Roman', Times, serif",
      padding: "0",
    }}>
      <Title>MSB Calculator — Academic</Title>

      {/* Journal header bar */}
      <div style={{
        background: "#2B4B8A",
        padding: "0.35rem 2rem",
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
      }}>
        <span style={{ color: "rgba(255,255,255,0.9)", "font-size": "0.6rem", "letter-spacing": "0.15em", "font-family": "Georgia, serif", "font-style": "italic" }}>
          Journal of Statistical Computing — Interactive Edition
        </span>
        <span style={{ color: "rgba(255,255,255,0.6)", "font-size": "0.6rem" }}>ISSN 0000-0000</span>
      </div>

      <div style={{ "max-width": "900px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Paper title block */}
        <div style={{ "text-align": "center", "margin-bottom": "2.5rem", "padding-bottom": "2rem", "border-bottom": "1px solid #C8C4B8" }}>
          <div style={{ "font-size": "0.65rem", "letter-spacing": "0.2em", "text-transform": "uppercase", color: "#666", "margin-bottom": "1rem", "font-family": "Georgia, serif" }}>
            Article · Tools &amp; Methods
          </div>
          <h1 style={{
            "font-size": "2rem",
            "font-weight": "normal",
            "line-height": "1.3",
            margin: "0 0 1rem",
            color: "#1A1A1A",
          }}>
            An Unofficial Interactive Calculator for<br />
            Statistical Hypothesis Testing
          </h1>
          <div style={{ "font-size": "0.85rem", color: "#555", "margin-bottom": "0.5rem", "font-style": "italic" }}>
            MSB Calculator Project · Open Source
          </div>
          <div style={{ "font-size": "0.75rem", color: "#888" }}>
            Received: 2024 · Published: 2024 · DOI: 10.0000/msb.2024
          </div>
        </div>

        {/* Abstract */}
        <div style={{
          background: "white",
          border: "1px solid #DDD9CC",
          padding: "1.25rem 1.5rem",
          "margin-bottom": "2.5rem",
          "border-left": "3px solid #2B4B8A",
        }}>
          <div style={{ "font-size": "0.7rem", "font-weight": "bold", "letter-spacing": "0.15em", "text-transform": "uppercase", "margin-bottom": "0.5rem", color: "#2B4B8A", "font-family": "'Helvetica Neue', sans-serif" }}>
            Abstract
          </div>
          <p style={{ "font-size": "0.85rem", "line-height": "1.7", margin: 0, color: "#333" }}>
            This tool provides interactive implementations of common hypothesis tests for two or more samples.
            Both parametric methods (Welch's t-test, Paired t-test, one-way ANOVA) and non-parametric alternatives
            (Mann-Whitney U, Kruskal-Wallis) are included. Users may input raw data or summary statistics where applicable.
          </p>
        </div>

        {/* Table of tests */}
        <div style={{ "margin-bottom": "2.5rem" }}>
          <div style={{ "font-size": "0.75rem", "font-weight": "bold", "letter-spacing": "0.1em", "text-transform": "uppercase", "margin-bottom": "0.75rem", "font-family": "'Helvetica Neue', sans-serif", color: "#444" }}>
            Table 1. Test Selection Guide
          </div>
          <table style={{ width: "100%", "border-collapse": "collapse", "font-size": "0.875rem" }}>
            <thead>
              <tr style={{ background: "#F0EDE4" }}>
                <th style={{ "text-align": "left", padding: "0.6rem 0.75rem", "border": "1px solid #C8C4B8", "font-weight": "bold", "font-size": "0.75rem" }}>Experimental Design</th>
                <th style={{ "text-align": "center", padding: "0.6rem 0.75rem", border: "1px solid #C8C4B8", "font-weight": "bold", "font-size": "0.75rem" }}>Parametric Test</th>
                <th style={{ "text-align": "center", padding: "0.6rem 0.75rem", border: "1px solid #C8C4B8", "font-weight": "bold", "font-size": "0.75rem" }}>Non-parametric Alternative</th>
              </tr>
            </thead>
            <tbody>
              {[
                { design: "Two unmatched independent samples", sub: "Normal distribution assumed", p: { text: "Welch's two-sample t-test", href: "#welch-t-test" }, np: { text: "Mann-Whitney U-test", href: "#mann-whitney-u" } },
                { design: "Two matched / paired samples", sub: "Pre-post or repeated measures", p: { text: "Paired samples t-test", href: "#paired-t-test" }, np: { text: "Wilcoxon signed-rank", href: null } },
                { design: "Three or more independent groups", sub: "Matched or unmatched", p: { text: "One-way ANOVA", href: "#anova" }, np: { text: "Kruskal-Wallis H-test", href: "#kruskal-wallis" } },
              ].map((row, i) => (
                <tr style={{ background: i % 2 === 0 ? "white" : "#FAFAF5" }}>
                  <td style={{ padding: "0.65rem 0.75rem", border: "1px solid #C8C4B8" }}>
                    <div style={{ "font-weight": "500" }}>{row.design}</div>
                    <div style={{ "font-size": "0.75rem", color: "#777", "font-style": "italic", "margin-top": "0.15rem" }}>{row.sub}</div>
                  </td>
                  <td style={{ "text-align": "center", padding: "0.65rem 0.75rem", border: "1px solid #C8C4B8" }}>
                    {row.p.href
                      ? <a href={row.p.href} style={{ color: "#2B4B8A" }}>{row.p.text}</a>
                      : <span style={{ color: "#999", "font-style": "italic" }}>{row.p.text}</span>}
                  </td>
                  <td style={{ "text-align": "center", padding: "0.65rem 0.75rem", border: "1px solid #C8C4B8" }}>
                    {row.np.href
                      ? <a href={row.np.href} style={{ color: "#2B4B8A" }}>{row.np.text}</a>
                      : <span style={{ color: "#999", "font-style": "italic" }}>{row.np.text}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ "font-size": "0.7rem", color: "#888", "margin-top": "0.4rem", "font-style": "italic" }}>
            * Interactive calculators available for linked tests.
          </div>
        </div>

        {/* Other tests */}
        <div style={{ "margin-bottom": "3rem", "font-size": "0.85rem" }}>
          <span style={{ color: "#666", "font-style": "italic" }}>See also: </span>
          <a href="#general-stats" style={{ color: "#2B4B8A" }}>General descriptive statistics</a>
          <span style={{ color: "#999", margin: "0 0.5rem" }}>·</span>
          <a href="#welch-t-test" style={{ color: "#2B4B8A" }}>Confidence intervals for mean difference</a>
        </div>

        {/* Divider */}
        <div style={{ "border-top": "2px solid #1A1A1A", "border-bottom": "1px solid #C8C4B8", "margin-bottom": "3rem", "padding": "0.3rem 0" }} />

        {/* Sections */}
        {[
          { id: "general-stats", n: "§1", label: "General Statistics", sub: "Enter a dataset to calculate descriptive statistics.", Component: DataInputEditor },
          { id: "welch-t-test", n: "§2", label: "Welch's t-test", sub: "Compare the means of two samples with unequal variances.", Component: WelchTTestCalculator },
          { id: "mann-whitney-u", n: "§3", label: "Mann-Whitney U-test", sub: "Non-parametric test to compare two independent samples.", Component: MannWhitneyUCalculator },
          { id: "paired-t-test", n: "§4", label: "Paired t-test", sub: "Compare the means of two related groups.", Component: PairedTTestCalculator },
          { id: "anova", n: "§5", label: "One-way ANOVA", sub: "Compare the means of three or more independent samples.", Component: AnovaCalculator },
          { id: "kruskal-wallis", n: "§6", label: "Kruskal-Wallis test", sub: "Non-parametric test to compare three or more independent samples.", Component: KruskalWallisCalculator },
        ].map(({ id, n, label, sub, Component }) => (
          <section id={id} style={{ "margin-bottom": "3.5rem", "scroll-margin-top": "2rem" }}>
            <h2 style={{
              "font-size": "1.3rem",
              "font-weight": "normal",
              "border-bottom": "1px solid #C8C4B8",
              "padding-bottom": "0.4rem",
              "margin-bottom": "0.5rem",
              color: "#1A1A1A",
            }}>
              <span style={{ color: "#2B4B8A", "margin-right": "0.5rem", "font-size": "0.9rem" }}>{n}</span>
              {label}
            </h2>
            <p style={{ "font-size": "0.85rem", "font-style": "italic", color: "#666", "margin-bottom": "1.25rem", "margin-top": "0" }}>{sub}</p>
            <Component />
          </section>
        ))}
      </div>
    </main>
  );
}
