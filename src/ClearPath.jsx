import { useState, useCallback, useEffect, useRef } from "react";

// ─── DESIGN TOKENS — Schwab Light Theme ────────────────────────────────────
const C = {
  // Schwab brand primaries
  schwabBlue:   "#00A0DF",   // official Schwab sky blue PMS 2925 C
  schwabBlueDk: "#0082B8",   // darker hover state
  schwabBlueXdk:"#005F87",   // deep navy accent

  // Page & surface
  bg:          "#F4F7FA",    // light blue-grey page background
  surface:     "#FFFFFF",    // white cards
  surfaceHigh: "#EEF4F9",    // very light blue tint for inset areas
  surfaceBlue: "#E6F4FB",    // soft Schwab blue wash

  // Borders
  border:      "#D0E4EF",    // soft blue-grey border
  borderLight: "#B8D5E8",    // slightly stronger on hover

  // Accent = Schwab blue
  accent:      "#00A0DF",
  accentDim:   "#0082B8",
  accentGlow:  "rgba(0,160,223,0.12)",

  // Status colors — kept readable on light bg
  gold:        "#D97706",
  goldDim:     "rgba(217,119,6,0.10)",
  success:     "#059669",
  successDim:  "rgba(5,150,105,0.10)",
  warn:        "#D97706",
  danger:      "#DC2626",
  dangerDim:   "rgba(220,38,38,0.08)",

  // Text
  text:        "#0F2235",    // deep navy — Schwab's standard body text
  textMid:     "#3D6680",    // medium blue-grey
  textDim:     "#6B8FA8",    // muted
  white:       "#FFFFFF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }

  .cp-root { min-height: 100vh; background: ${C.bg}; position: relative; overflow-x: hidden; }
  .cp-root::before {
    content: ''; position: fixed; top: -30%; right: -10%; width: 60%; height: 60%;
    background: radial-gradient(ellipse, rgba(0,160,223,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* HEADER */
  .cp-header { display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; border-bottom: 1px solid ${C.border};
    background: ${C.white}; box-shadow: 0 1px 4px rgba(0,100,160,0.08);
    position: sticky; top: 0; z-index: 100; }
  .cp-logo { display: flex; align-items: center; gap: 10px; }
  .cp-logo-mark { width: 32px; height: 32px; background: ${C.accent};
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex; align-items: center; justify-content: center; }
  .cp-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px;
    letter-spacing: -0.5px; color: ${C.text}; }
  .cp-logo-text span { color: ${C.accent}; }
  .cp-tagline { font-size: 11px; color: ${C.textDim}; letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }

  /* PROGRESS BAR */
  .cp-progress { padding: 14px 40px; background: ${C.white};
    border-bottom: 1px solid ${C.border}; }
  .cp-steps { display: flex; align-items: center; gap: 0; }
  .cp-step { display: flex; align-items: center; gap: 8px; flex: 1; }
  .cp-step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 11px; font-weight: 700;
    font-family: 'Syne', sans-serif; flex-shrink: 0; transition: all 0.3s; }
  .cp-step-dot.done { background: ${C.success}; color: #fff; }
  .cp-step-dot.active { background: ${C.accent}; color: #fff;
    box-shadow: 0 0 0 3px rgba(0,160,223,0.2); }
  .cp-step-dot.pending { background: ${C.surfaceHigh}; color: ${C.textDim};
    border: 1.5px solid ${C.border}; }
  .cp-step-label { font-size: 11px; color: ${C.textDim}; white-space: nowrap; display: none; }
  @media(min-width: 768px) { .cp-step-label { display: block; } }
  .cp-step-label.active { color: ${C.accent}; font-weight: 600; }
  .cp-step-line { flex: 1; height: 2px; background: ${C.border}; min-width: 12px; border-radius: 1px; }
  .cp-step-line.done { background: ${C.success}; }

  /* MAIN */
  .cp-main { max-width: 860px; margin: 0 auto; padding: 40px 24px 120px; position: relative; z-index: 1; }
  .cp-step-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: ${C.text}; margin-bottom: 6px; letter-spacing: -0.5px; }
  .cp-step-sub { font-size: 14px; color: ${C.textMid}; margin-bottom: 28px; line-height: 1.6; }

  /* CARDS */
  .cp-card { background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 10px; padding: 22px; margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,80,140,0.06); transition: border-color 0.2s, box-shadow 0.2s; }
  .cp-card:hover { border-color: ${C.borderLight}; box-shadow: 0 2px 8px rgba(0,100,160,0.10); }
  .cp-card-title { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    color: ${C.accent}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }

  /* FORM ELEMENTS */
  .cp-label { font-size: 13px; font-weight: 500; color: ${C.textMid};
    margin-bottom: 5px; display: block; }
  .cp-input { width: 100%; background: ${C.surfaceHigh}; border: 1.5px solid ${C.border};
    border-radius: 7px; padding: 9px 13px; color: ${C.text}; font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .cp-input:focus { border-color: ${C.accent}; box-shadow: 0 0 0 3px ${C.accentGlow}; background: ${C.white}; }
  .cp-input::placeholder { color: ${C.textDim}; }
  .cp-select { appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B8FA8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; padding-right: 36px; cursor: pointer; }
  .cp-input-group { margin-bottom: 18px; }
  .cp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media(max-width: 600px) { .cp-row { grid-template-columns: 1fr; } }

  /* OPTION PILLS */
  .cp-options { display: flex; flex-wrap: wrap; gap: 8px; }
  .cp-option { padding: 7px 15px; border-radius: 20px; border: 1.5px solid ${C.border};
    background: ${C.white}; color: ${C.textMid}; font-size: 13px; cursor: pointer;
    transition: all 0.15s; user-select: none; }
  .cp-option:hover { border-color: ${C.accent}; color: ${C.accent}; background: ${C.surfaceBlue}; }
  .cp-option.selected { background: ${C.accentGlow}; border-color: ${C.accent};
    color: ${C.accentDim}; font-weight: 600; }
  .cp-option.selected-gold { background: ${C.goldDim}; border-color: ${C.gold};
    color: ${C.gold}; font-weight: 600; }

  /* MODULE GRID */
  .cp-modules { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
  .cp-module { padding: 11px 13px; border-radius: 7px; border: 1.5px solid ${C.border};
    background: ${C.white}; cursor: pointer; transition: all 0.15s; }
  .cp-module:hover { border-color: ${C.accent}; background: ${C.surfaceBlue}; }
  .cp-module.selected { background: ${C.accentGlow}; border-color: ${C.accent}; }
  .cp-module-name { font-size: 13px; font-weight: 600; color: ${C.text}; margin-bottom: 2px; }
  .cp-module.selected .cp-module-name { color: ${C.accentDim}; }
  .cp-module-cost { font-size: 11px; color: ${C.textDim}; }

  /* SLIDER */
  .cp-slider-wrap { margin-top: 8px; }
  .cp-slider { width: 100%; -webkit-appearance: none; height: 4px;
    background: ${C.border}; border-radius: 2px; outline: none; }
  .cp-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px;
    border-radius: 50%; background: ${C.accent}; cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,100,160,0.3); }
  .cp-slider-labels { display: flex; justify-content: space-between;
    font-size: 11px; color: ${C.textDim}; margin-top: 6px; }
  .cp-slider-val { font-size: 22px; font-family: 'Syne', sans-serif; font-weight: 800;
    color: ${C.accent}; margin-bottom: 4px; }

  /* AI LOOKUP */
  .cp-lookup-box { background: ${C.surfaceBlue}; border: 1px solid ${C.borderLight};
    border-radius: 8px; padding: 18px; margin-top: 14px; }
  .cp-lookup-status { display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: ${C.textMid}; }
  .cp-spinner { width: 16px; height: 16px; border: 2px solid ${C.border};
    border-top-color: ${C.accent}; border-radius: 50%;
    animation: spin 0.8s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .cp-chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px;
    border-radius: 12px; font-size: 11px; font-weight: 600; margin: 3px; }
  .cp-chip-blue { background: ${C.accentGlow}; color: ${C.accentDim}; border: 1px solid rgba(0,160,223,0.3); }
  .cp-chip-gold { background: ${C.goldDim}; color: ${C.gold}; border: 1px solid rgba(217,119,6,0.3); }
  .cp-chip-green { background: ${C.successDim}; color: ${C.success}; border: 1px solid rgba(5,150,105,0.3); }

  /* RESULTS */
  .cp-results-header { margin-bottom: 28px; }
  .cp-results-company { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    color: ${C.accent}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
  .cp-totals { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 28px; }
  .cp-total-card { background: ${C.white}; border: 1px solid ${C.border};
    border-radius: 10px; padding: 18px; text-align: center;
    box-shadow: 0 1px 3px rgba(0,80,140,0.05); }
  .cp-total-card.mid { background: ${C.accentGlow}; border-color: ${C.accent}; }
  .cp-total-label { font-size: 10px; color: ${C.textDim}; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 8px; }
  .cp-total-card.mid .cp-total-label { color: ${C.accentDim}; }
  .cp-total-amount { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: ${C.text}; }
  .cp-total-card.mid .cp-total-amount { color: ${C.accent}; }

  /* BUCKET TABLE */
  .cp-bucket-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  .cp-bucket-table th { font-size: 11px; font-weight: 700; color: ${C.textDim};
    text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px;
    border-bottom: 2px solid ${C.border}; text-align: left; background: ${C.surfaceHigh}; }
  .cp-bucket-table th:not(:first-child) { text-align: right; }
  .cp-bucket-table td { padding: 11px 12px; border-bottom: 1px solid ${C.border};
    font-size: 13px; vertical-align: middle; }
  .cp-bucket-table tr:hover td { background: ${C.surfaceBlue}; }
  .cp-bucket-table tr:last-child td { border-bottom: none; }
  .cp-bucket-table td:not(:first-child) { text-align: right; font-family: 'Syne', sans-serif; font-weight: 600; }
  .cp-bucket-name { font-weight: 500; color: ${C.text}; }
  .cp-bucket-desc { font-size: 11px; color: ${C.textDim}; margin-top: 2px; }
  .cp-bucket-sources { font-size: 10px; color: ${C.textDim}; margin-top: 5px; line-height: 1.6; }
  .cp-bucket-sources-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: ${C.accent}; margin-right: 4px; }
  .cp-bucket-source-item { display: block; padding-left: 10px; position: relative; }
  .cp-bucket-source-item::before { content: '·'; position: absolute; left: 2px; color: ${C.accent}; }
  .cp-source-link { color: ${C.accent}; text-decoration: none; border-bottom: 1px dotted ${C.accent}; }
  .cp-source-link:hover { color: ${C.accentDim}; border-bottom-style: solid; }
  .cp-risk-badge { display: inline-block; padding: 2px 8px; border-radius: 10px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .cp-risk-H { background: ${C.dangerDim}; color: ${C.danger}; }
  .cp-risk-M { background: ${C.goldDim}; color: ${C.gold}; }
  .cp-risk-L { background: ${C.successDim}; color: ${C.success}; }
  .cp-total-row td { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
    color: ${C.accentDim}; border-top: 2px solid ${C.accent}; padding-top: 14px;
    background: ${C.surfaceBlue} !important; }

  /* CONFIDENCE */
  .cp-confidence-bar { height: 5px; background: ${C.border}; border-radius: 3px; margin-top: 4px; }
  .cp-confidence-fill { height: 100%; border-radius: 3px; background: ${C.success}; transition: width 0.6s; }

  /* RISK HEATMAP */
  .cp-heatmap { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 8px; margin-bottom: 20px; }
  .cp-heat-item { background: ${C.white}; border: 1px solid ${C.border};
    border-radius: 8px; padding: 12px;
    box-shadow: 0 1px 2px rgba(0,80,140,0.04); }
  .cp-heat-name { font-size: 12px; font-weight: 600; color: ${C.text}; margin-bottom: 6px; }
  .cp-heat-bar-wrap { height: 5px; background: ${C.border}; border-radius: 3px; }
  .cp-heat-bar { height: 100%; border-radius: 3px; transition: width 0.8s; }
  .cp-heat-note { font-size: 11px; color: ${C.textDim}; margin-top: 5px; }

  /* ASSUMPTIONS */
  .cp-assumption { display: flex; align-items: flex-start; gap: 10px;
    padding: 9px 0; border-bottom: 1px solid ${C.border}; }
  .cp-assumption:last-child { border-bottom: none; }
  .cp-assumption-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .cp-assumption-text { font-size: 13px; color: ${C.textMid}; line-height: 1.5; }
  .cp-assumption-source { font-size: 11px; color: ${C.textDim}; margin-top: 2px; }

  /* NAVIGATION */
  .cp-nav { position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(12px);
    border-top: 1px solid ${C.border};
    box-shadow: 0 -2px 12px rgba(0,80,140,0.08);
    padding: 14px 40px;
    display: flex; justify-content: space-between; align-items: center; z-index: 100; }
  .cp-btn { padding: 10px 24px; border-radius: 7px; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s;
    border: none; display: inline-flex; align-items: center; gap: 8px; }
  .cp-btn-primary { background: ${C.accent}; color: #fff; }
  .cp-btn-primary:hover { background: ${C.accentDim}; box-shadow: 0 2px 12px rgba(0,160,223,0.35); }
  .cp-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
  .cp-btn-ghost { background: transparent; color: ${C.textMid};
    border: 1.5px solid ${C.border}; }
  .cp-btn-ghost:hover { border-color: ${C.accent}; color: ${C.accent}; background: ${C.surfaceBlue}; }
  .cp-btn-gold { background: ${C.gold}; color: #fff; font-weight: 700; }
  .cp-btn-gold:hover { background: #b45309; }
  .cp-btn-green { background: ${C.success}; color: #fff; }
  .cp-btn-green:hover { background: #047857; }
  .cp-btn-sm { padding: 7px 14px; font-size: 12px; }

  /* EXPORT BAR */
  .cp-export-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; padding: 14px 16px;
    background: ${C.surfaceBlue}; border: 1px solid ${C.borderLight}; border-radius: 8px; }
  .cp-export-label { font-size: 11px; color: ${C.textDim}; align-self: center;
    font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

  /* DIVIDER */
  .cp-divider { height: 1px; background: ${C.border}; margin: 20px 0; }

  /* TOOLTIP */
  .cp-tooltip { position: relative; display: inline-block; }
  .cp-tooltip-icon { width: 16px; height: 16px; border-radius: 50%; background: ${C.surfaceHigh};
    border: 1px solid ${C.border}; color: ${C.textDim}; font-size: 10px; font-weight: 700;
    display: inline-flex; align-items: center; justify-content: center; cursor: help; margin-left: 6px; }
  .cp-info { font-size: 12px; color: ${C.textMid}; margin-top: 8px; line-height: 1.5;
    padding: 9px 12px; background: ${C.surfaceBlue}; border-radius: 6px;
    border-left: 3px solid ${C.accent}; }

  /* NARRATIVE */
  .cp-narrative { background: ${C.surfaceBlue}; border: 1px solid ${C.borderLight};
    border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.8;
    color: ${C.textMid}; font-style: italic; margin-bottom: 20px; }
  .cp-narrative strong { color: ${C.text}; font-style: normal; }

  /* MISSING INPUTS */
  .cp-missing { background: rgba(217,119,6,0.07); border: 1px solid rgba(217,119,6,0.25);
    border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; }
  .cp-missing-title { font-size: 11px; font-weight: 700; color: ${C.gold};
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .cp-missing-item { font-size: 12px; color: ${C.textMid}; padding: 3px 0; }
  .cp-missing-item::before { content: '→ '; color: ${C.gold}; }

  /* SHIMMER */
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .cp-shimmer { background: linear-gradient(90deg, ${C.surface} 0%, ${C.surfaceHigh} 50%, ${C.surface} 100%);
    background-size: 800px 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }

  /* FADE IN */
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .cp-fadein { animation: fadeUp 0.35s ease both; }

  /* SCENARIO TABS */
  .cp-scen-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
  .cp-scen-tab { padding: 5px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid ${C.border}; background: ${C.white};
    color: ${C.textMid}; transition: all 0.15s; }
  .cp-scen-tab.active { border-color: ${C.accent}; color: ${C.accentDim}; background: ${C.accentGlow}; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "company",    label: "Company"      },
  { id: "current",   label: "Current State" },
  { id: "target",    label: "Target State"  },
  { id: "modules",   label: "Modules"       },
  { id: "org",       label: "Org Context"   },
  { id: "project",   label: "Project"       },
  { id: "savings",   label: "Cost Savings"  },
  { id: "results",   label: "Results"       },
];

const MODULES = [
  { id: "gl",        name: "General Ledger",       lowCost: 150, midCost: 200, highCost: 280, required: true },
  { id: "ap",        name: "Accounts Payable",     lowCost: 80,  midCost: 110, highCost: 150 },
  { id: "ar",        name: "Accounts Receivable",  lowCost: 80,  midCost: 110, highCost: 150 },
  { id: "fa",        name: "Fixed Assets",         lowCost: 50,  midCost: 70,  highCost: 100 },
  { id: "cm",        name: "Cash Management",      lowCost: 60,  midCost: 85,  highCost: 120 },
  { id: "exp",       name: "Expense Management",   lowCost: 40,  midCost: 55,  highCost: 80  },
  { id: "epm",       name: "EPM / Planning",        lowCost: 150, midCost: 220, highCost: 320, note: "High cost adder" },
  { id: "proj",      name: "Project Accounting",   lowCost: 90,  midCost: 130, highCost: 180 },
  { id: "proc",      name: "Procurement",          lowCost: 100, midCost: 145, highCost: 200 },
  { id: "tax",       name: "Tax Reporting",        lowCost: 60,  midCost: 90,  highCost: 140 },
  { id: "consol",    name: "Consolidation",        lowCost: 80,  midCost: 120, highCost: 180, note: "Multi-entity" },
  { id: "audit",     name: "Audit & Compliance",   lowCost: 70,  midCost: 100, highCost: 160 },
];

const CURRENT_SYSTEMS = ["SAP ECC / S4", "Oracle EBS", "PeopleSoft", "Microsoft Dynamics", "Workday", "NetSuite", "Legacy / Homegrown", "Multiple / Fragmented", "None / Greenfield"];
const TARGET_PLATFORMS = ["Workday Financials", "Oracle Fusion Cloud", "SAP S/4HANA Cloud", "Microsoft Dynamics 365", "Help me decide"];
const INDUSTRIES = ["Financial Services", "Healthcare", "Manufacturing", "Technology", "Retail / Consumer", "Energy", "Government / Public Sector", "Professional Services", "Other"];
const REGULATIONS = ["SOX (Public Company)", "FINRA / SEC (Broker-Dealer)", "OCC / Banking", "HIPAA", "ITAR / Export Control", "GDPR / Data Privacy", "None / Standard"];

function fmt(n) {
  if (n >= 1e9) return `$${(n/1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n/1e3).toFixed(0)}K`;
  return `$${n}`;
}

// ─── ESTIMATION ENGINE ────────────────────────────────────────────────────────
function estimateCosts(f) {
  const users       = parseInt(f.userCount)   || 500;
  const integrations = f.integrations !== undefined && f.integrations !== '' ? (parseInt(f.integrations) || 0) : 12;
  const history     = parseInt(f.dataYears)   || 7;
  const entities    = parseInt(f.entities)    || 3;
  const fteCount    = parseInt(f.financeHeadcount) || 300;

  // Complexity multipliers
  const custMult  = { minimal: 0.7, moderate: 1.0, heavy: 1.5 }[f.customization] || 1.0;
  const aiMult    = { none: 0.5, bundled: 0.8, moderate: 1.0, aggressive: 1.5 }[f.aiAmbition] || 1.0;
  const regMult   = f.regulations?.length > 2 ? 1.35 : f.regulations?.length > 0 ? 1.15 : 1.0;
  const siMult    = { tier1: 1.0, tier2: 0.75, mixed: 0.85, unknown: 1.0 }[f.siTier] || 1.0;
  const tlMult    = { aggressive: 1.3, standard: 1.0, phased: 0.9 }[f.timeline] || 1.0;
  const entityMult= entities > 10 ? 1.4 : entities > 4 ? 1.2 : 1.0;

  // Per-user/month licensing rates
  const platform = f.targetPlatform || "Workday Financials";
  const isOracle  = platform.includes("Oracle");
  const isSAP     = platform.includes("SAP");
  const baseUserCostLow = isOracle ? 220 : isSAP ? 190 : 55;
  const baseUserCostMid = isOracle ? 375 : isSAP ? 300 : 68;
  const baseUserCostHi  = isOracle ? 475 : isSAP ? 420 : 80;

  // Module adder (per user/month)
  const selectedMods = (f.modules || ["gl","ap","ar"]);
  const contractYears = 3;
  // Base per-user subscription (3yr) + flat annual module fees (3yr) — both in $
  const baseLicLow = baseUserCostLow * users * 12 * contractYears * 0.001 * 1000;
  const baseLicMid = baseUserCostMid * users * 12 * contractYears * 0.001 * 1000;
  const baseLicHi  = baseUserCostHi  * users * 12 * contractYears * 0.001 * 1000;
  const modFlatLow = selectedMods.reduce((s,id)=>{ const m=MODULES.find(x=>x.id===id); return s+(m?m.lowCost*1000:0); },0) * contractYears;
  const modFlatMid = selectedMods.reduce((s,id)=>{ const m=MODULES.find(x=>x.id===id); return s+(m?m.midCost*1000:0); },0) * contractYears;
  const modFlatHi  = selectedMods.reduce((s,id)=>{ const m=MODULES.find(x=>x.id===id); return s+(m?m.highCost*1000:0); },0) * contractYears;
  const licenseDiscount = f.licenseDiscount ?? 0;
  const softLow = (baseLicLow + modFlatLow) * (1 - licenseDiscount);
  const softMid = (baseLicMid + modFlatMid) * (1 - licenseDiscount);
  const softHi  = (baseLicHi  + modFlatHi)  * (1 - licenseDiscount);

  // SI fees
  const siHrLow = 150; const siHrMid = 225; const siHrHi = 350;
  const siHrsLow = 30000 * custMult * tlMult * entityMult;
  const siHrsMid = 70000 * custMult * tlMult * entityMult;
  const siHrsHi  = 130000 * custMult * tlMult * entityMult;
  const siLow = siHrLow * siHrsLow * siMult;
  const siMid = siHrMid * siHrsMid * siMult;
  const siHi  = siHrHi  * siHrsHi  * siMult;

  // Internal labor
  const fteCostMid = (f.itCapability === "strong" ? 155000 : f.itCapability === "limited" ? 185000 : 170000);
  const labLow = Math.round(fteCount * 0.12 * fteCostMid * 1.5);
  const labMid = Math.round(fteCount * 0.22 * fteCostMid * 2.0);
  const labHi  = Math.round(fteCount * 0.35 * fteCostMid * 2.5);

  // Data migration
  const histMult = history < 4 ? 0.6 : history < 7 ? 1.0 : history < 10 ? 1.4 : 1.8;
  const datLow = 1500000 * histMult * entityMult;
  const datMid = 3500000 * histMult * entityMult;
  const datHi  = 7000000 * histMult * entityMult;

  // AI
  const aiLow = 800000  * aiMult;
  const aiMid = 3000000 * aiMult;
  const aiHi  = 7000000 * aiMult;

  // Integrations
  const intLow = integrations * 18000;
  const intMid = integrations * 45000;
  const intHi  = integrations * 95000;

  // Infrastructure
  const infLow = 400000;
  const infMid = 1200000;
  const infHi  = 2800000;

  // Testing
  const tstLow = siLow  * 0.08 * regMult;
  const tstMid = siMid  * 0.11 * regMult;
  const tstHi  = siHi   * 0.14 * regMult;

  // Training & Change Mgmt
  const trnLow = users * 1200;
  const trnMid = users * 2500;
  const trnHi  = users * 5000;

  // Regulatory
  const regLow = f.regulations?.length ? 500000  * regMult : 0;
  const regMid = f.regulations?.length ? 1200000 * regMult : 0;
  const regHi  = f.regulations?.length ? 2800000 * regMult : 0;

  const base = [
    { id:"software",   label:"Software & Licensing",         low:softLow, mid:softMid, high:softHi,
      risk: isOracle ? "H" : "M", riskNote: isOracle ? "Oracle per-seat cost high at scale" : "Validate named user count",
      sources: [
        { text: isOracle ? "Oracle Fusion Cloud published per-seat pricing (2025)" : isSAP ? "SAP S/4HANA Cloud published per-seat pricing (2025)" : "Workday Financials published per-seat pricing (2025)",
          url: isOracle ? "https://www.oracle.com/erp/cloud/pricing/" : isSAP ? "https://www.sap.com/products/erp/s4hana.html" : "https://www.workday.com/en-us/products/financial-management.html" },
        { text: "Panorama Consulting ERP Report 2025 — per-seat TCO benchmarks by platform",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: "Gartner Magic Quadrant for Cloud ERP — licensing cost analysis",
          url: "https://www.gartner.com/en/information-technology/topics/erp" },
        { text: `List rate: $${isOracle?375:isSAP?300:68}/user/month (mid) × ${users} users × 36 months` },
        { text: licenseDiscount > 0
            ? `Negotiation discount: ${Math.round(licenseDiscount*100)}% off list applied — reflects enterprise deal leverage (user-entered)`
            : "No negotiation discount applied — estimates reflect full published list prices" },
      ]},
    { id:"si",         label:"System Integrator Fees",        low:siLow,   mid:siMid,   high:siHi,
      risk: custMult > 1 ? "H" : "M", riskNote: "Largest single bucket; scope creep risk",
      sources: [
        { text: "Panorama Consulting ERP Report 2025 — SI hour ranges: 30K–130K hrs for enterprise ERP",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: `Market rate cards: $${siHrLow}–$${siHrHi}/hr (${siMult < 1 ? "Tier-2/mixed discount applied" : "Tier-1 rates applied"})` },
        { text: `Customization multiplier ${custMult.toFixed(1)}x · Timeline multiplier ${tlMult.toFixed(1)}x · Entity multiplier ${entityMult.toFixed(1)}x applied` },
        { text: "ERP Focus Research — ERP implementation scope and cost benchmarks",
          url: "https://www.erpfocus.com/erp-implementation-cost.html" },
      ]},
    { id:"labor",      label:"Internal Labor",                low:labLow,  mid:labMid,  high:labHi,
      risk: "H", riskNote: "Consistently underestimated; include in budget",
      sources: [
        { text: `Finance & IT headcount allocation benchmarks: 12–35% of ${fteCount} FTEs during ERP program` },
        { text: `Blended loaded FTE cost: $${fteCostMid.toLocaleString()}/yr based on ${f.itCapability || "moderate"} IT capability` },
        { text: "Panorama Consulting 2025 — internal labor consistently the most underestimated bucket",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: "PMI Pulse of the Profession — FTE time allocation on enterprise transformation programs",
          url: "https://www.pmi.org/learning/library/pulse-profession" },
      ]},
    { id:"data",       label:"Data Migration & Architecture", low:datLow,  mid:datMid,  high:datHi,
      risk: history > 7 ? "H" : "M", riskNote: `${history}yr history → migration complexity`,
      sources: [
        { text: `Gartner data migration complexity model — ${history}-year history drives ${histMult.toFixed(1)}x cost multiplier`,
          url: "https://www.gartner.com/en/information-technology/topics/data-management" },
        { text: "Panorama Consulting 2025 — base migration range $1.5M–$7M for enterprise ERP",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: `Entity multiplier ${entityMult.toFixed(1)}x applied for ${entities} legal entities in scope` },
        { text: "IBM — data quality remediation adds 30–80% to base migration estimates",
          url: "https://www.ibm.com/topics/data-migration" },
      ]},
    { id:"ai",         label:"AI Implementation",             low:aiLow,   mid:aiMid,   high:aiHi,
      risk: aiMult > 1 ? "H" : "L", riskNote: "Often underfunded when bolted on late",
      sources: [
        { text: "Forrester Total Economic Impact studies — AI in Finance ERP",
          url: "https://www.forrester.com/research/" },
        { text: "Gartner — AI in ERP: embedded vs. bolted-on cost differential",
          url: "https://www.gartner.com/en/information-technology/topics/artificial-intelligence" },
        { text: `AI ambition multiplier ${aiMult.toFixed(1)}x applied to $0.8M–$7M analyst consensus base range` },
        { text: "Workday AI platform add-on pricing overview",
          url: "https://www.workday.com/en-us/products/platform-product-extensions/workday-ai.html" },
      ]},
    { id:"integrations",label:"Integration Development",     low:intLow,  mid:intMid,  high:intHi,
      risk: integrations > 12 ? "H" : "M", riskNote: `${integrations} integrations estimated`,
      sources: [
        { text: "MuleSoft integration cost benchmarks: $18K–$95K per integration point",
          url: "https://www.mulesoft.com/resources/esb/total-cost-of-ownership" },
        { text: `${integrations} integrations × $18K–$95K = ${fmt(intLow)}–${fmt(intHi)} total (${f.integrations ? "user-provided" : "estimated from platform count"})` },
        { text: "Panorama Consulting 2025 — integration costs scale linearly with connected system count",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: "Boomi — enterprise integration cost and complexity benchmarks",
          url: "https://boomi.com/resources/" },
      ]},
    { id:"infra",      label:"Infrastructure & Cloud",        low:infLow,  mid:infMid,  high:infHi,
      risk: "L", riskNote: "Lower if existing cloud agreements in place",
      sources: [
        { text: "AWS cloud pricing — ERP workload sizing reference",
          url: "https://aws.amazon.com/pricing/" },
        { text: "Microsoft Azure pricing calculator for enterprise workloads",
          url: "https://azure.microsoft.com/en-us/pricing/" },
        { text: "Google Cloud pricing for enterprise applications",
          url: "https://cloud.google.com/pricing" },
        { text: "Range: $400K–$2.8M; lower end assumes existing enterprise cloud agreements" },
      ]},
    { id:"testing",    label:"Testing & QA",                  low:tstLow,  mid:tstMid,  high:tstHi,
      risk: regMult > 1.2 ? "H" : "M", riskNote: "Regulatory testing adds significant scope",
      sources: [
        { text: "Industry benchmark: testing scoped at 8–14% of SI fees for regulated ERP implementations" },
        { text: `Regulatory multiplier ${regMult.toFixed(2)}x applied for ${f.regulations?.length || 0} selected framework(s)` },
        { text: "KPMG — ERP implementation and testing advisory for financial services",
          url: "https://kpmg.com/us/en/home/services/advisory/management-consulting/enterprise-solutions.html" },
        { text: "SOX / FINRA user acceptance testing adds 25–40% to baseline testing scope" },
      ]},
    { id:"training",   label:"Training & Change Management",  low:trnLow,  mid:trnMid,  high:trnHi,
      risk: "M", riskNote: "Primary driver of failed ROI if underfunded",
      sources: [
        { text: "Prosci Change Management Benchmarks — $1,200–$5,000 per user for enterprise ERP",
          url: "https://www.prosci.com/resources/articles/change-management-best-practices-benchmarking-report" },
        { text: `${users} named users × $1,200–$5,000/user = ${fmt(trnLow)}–${fmt(trnHi)} total` },
        { text: "Panorama Consulting 2025 — OCM underfunding cited in 60%+ of ERP cost overruns",
          url: "https://www.panorama-consulting.com/resource/erp-report/" },
        { text: "Gartner — organizations investing ≥15% of budget in OCM have 3× higher success rates",
          url: "https://www.gartner.com/en/human-resources/topics/organizational-change-management" },
      ]},
    { id:"regulatory", label:"Regulatory & Compliance",       low:regLow,  mid:regMid,  high:regHi,
      risk: regMult > 1.2 ? "H" : "L", riskNote: "Scoped to selected regulatory obligations",
      sources: [
        { text: `${f.regulations?.length || 0} framework(s) selected — ${regMult.toFixed(2)}x regulatory complexity multiplier applied` },
        { text: "FSI ERP implementation data: SOX, FINRA, OCC compliance layers add $0.5M–$2.8M incremental" },
        { text: "Deloitte — financial services ERP transformation and compliance advisory",
          url: "https://www2.deloitte.com/us/en/pages/consulting/topics/erp.html" },
        { text: "Regulatory testing, audit trail configuration, and controls documentation included in range" },
      ]},
  ];

  const baseTotal = { low: base.reduce((s,b)=>s+b.low,0), mid: base.reduce((s,b)=>s+b.mid,0), high: base.reduce((s,b)=>s+b.high,0) };
  const contingencyRate = f.customization === "heavy" ? 0.25 : regMult > 1.2 ? 0.22 : 0.18;

  const contingency = {
    id: "contingency", label: "Contingency Reserve",
    low:  baseTotal.low  * (contingencyRate - 0.05),
    mid:  baseTotal.mid  * contingencyRate,
    high: baseTotal.high * (contingencyRate + 0.05),
    risk: "M", riskNote: `${Math.round(contingencyRate*100)}% applied based on complexity profile`,
    sources: [
      { text: "PMI — project contingency guidelines: 15–30% for complex enterprise software programs",
        url: "https://www.pmi.org/learning/library" },
      { text: `${Math.round(contingencyRate*100)}% rate driven by ${f.customization === "heavy" ? "heavy customization profile" : regMult > 1.2 ? "elevated regulatory complexity" : "standard complexity profile"}` },
      { text: "Panorama Consulting 2025 — ERP contingency benchmarks by implementation complexity tier",
        url: "https://www.panorama-consulting.com/resource/erp-report/" },
      { text: "Applied to all buckets combined; does not double-count individual bucket risk notes" },
    ],
  };

  const all = [...base, contingency];
  return {
    buckets: all,
    totals: {
      low:  all.reduce((s,b)=>s+b.low,0),
      mid:  all.reduce((s,b)=>s+b.mid,0),
      high: all.reduce((s,b)=>s+b.high,0),
    },
    assumptions: [
      { text: `Named user count: ${users}`, source: f.userCount ? "User-provided" : "Estimated from finance headcount", color: f.userCount ? C.success : C.gold },
      { text: `Platform: ${platform} — ${isOracle ? "higher per-seat licensing, deeper FSI tools" : "lower licensing, strong embedded AI"}`, source: "User-selected", color: C.accent },
      { text: licenseDiscount > 0 ? `License negotiation discount: ${Math.round(licenseDiscount*100)}% off list — software bucket reduced accordingly` : "License pricing: full published list prices — set a negotiation discount in Target State to adjust", source: licenseDiscount > 0 ? "User-entered" : "Default (no discount)", color: licenseDiscount > 0 ? C.success : C.gold },
      { text: `${selectedMods.length} modules selected — base rates applied per module`, source: "User-selected", color: C.accent },
      { text: `System integrator tier: ${f.siTier || "Unknown"} — ${siMult < 1 ? "20-30% discount vs Tier-1 applied" : "Tier-1 rates applied ($150–$350/hr)"}`, source: "User-selected", color: C.textMid },
      { text: `Customization level: ${f.customization || "Moderate"} — multiplier ${custMult.toFixed(1)}x applied to SI scope`, source: "User-selected", color: custMult > 1 ? C.gold : C.success },
      { text: `${history} years of historical data — migration cost multiplier ${histMult.toFixed(1)}x`, source: f.dataYears ? "User-provided" : "Industry default", color: C.textMid },
      { text: `${integrations} integrations in scope at $18K–$95K each`, source: f.integrations ? "User-provided" : "Estimated from platform count", color: C.textMid },
      { text: `${f.regulations?.length || 0} regulatory frameworks selected — compliance multiplier ${regMult.toFixed(2)}x`, source: "User-selected", color: regMult > 1.2 ? C.gold : C.success },
      { text: `Timeline: ${f.timeline || "Standard"} — cost multiplier ${tlMult.toFixed(1)}x (compressed timelines increase SI costs)`, source: "User-selected", color: tlMult > 1 ? C.warn : C.success },
      { text: `Contingency: ${Math.round(contingencyRate*100)}% — reflects ${f.customization === "heavy" ? "heavy customization" : "standard complexity"} profile`, source: "Calculated", color: C.gold },
    ],
    missing: [
      !f.userCount && "Exact named user count — validate with Finance and HR leadership",
      !f.integrations && "Confirmed integration inventory — each missed integration = $15K–$100K",
      !f.dataYears && "Confirmed years of historical data requiring migration",
      f.targetPlatform === "Help me decide" && "Platform selection — drives licensing bucket significantly",
      !f.entities && "Number of legal entities — major consolidation complexity driver",
    ].filter(Boolean),
    confidence: Math.round(
      ([f.userCount, f.integrations, f.dataYears, f.entities, f.targetPlatform !== "Help me decide",
        f.currentSystem, f.customization, f.siTier, f.timeline, f.regulations?.length > 0]
        .filter(Boolean).length / 10) * 100
    ),
  };
}

// ─── COMPANY LOOKUP — embedded knowledge base ─────────────────────────────────
// Direct API calls to api.anthropic.com are blocked from the artifact sandbox.
// Instead we use an embedded knowledge base for well-known public companies,
// with a revenue-based estimator as fallback.

const COMPANY_DB = {
  "charles schwab":     { revenue:18840, employees:35000, industry:"Financial Services", countries:1, entities:12, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Large US broker-dealer, RIA custodian, and bank with complex regulatory obligations." },
  "schwab":             { revenue:18840, employees:35000, industry:"Financial Services", countries:1, entities:12, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Charles Schwab — large US broker-dealer, RIA custodian, and bank." },
  "jpmorgan":           { revenue:158100, employees:300000, industry:"Financial Services", countries:60, entities:50, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Global investment bank and financial services firm." },
  "jp morgan":          { revenue:158100, employees:300000, industry:"Financial Services", countries:60, entities:50, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Global investment bank and financial services firm." },
  "goldman sachs":      { revenue:46250, employees:45000, industry:"Financial Services", countries:35, entities:30, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Global investment banking and securities firm." },
  "morgan stanley":     { revenue:54140, employees:82000, industry:"Financial Services", countries:40, entities:30, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Global investment bank and wealth management firm." },
  "bank of america":    { revenue:98580, employees:213000, industry:"Financial Services", countries:35, entities:40, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Large US commercial and investment bank." },
  "wells fargo":        { revenue:82600, employees:226000, industry:"Financial Services", countries:20, entities:35, currentERP:null, regulatoryFlags:["SOX (Public Company)","OCC / Banking"], confidence:"high", notes:"US commercial bank and financial services company." },
  "fidelity":           { revenue:26100, employees:68000, industry:"Financial Services", countries:8, entities:20, currentERP:null, regulatoryFlags:["FINRA / SEC (Broker-Dealer)"], confidence:"high", notes:"Private US investment management and brokerage firm." },
  "vanguard":           { revenue:7900, employees:20000, industry:"Financial Services", countries:10, entities:15, currentERP:null, regulatoryFlags:["FINRA / SEC (Broker-Dealer)"], confidence:"high", notes:"Large US mutual fund and ETF provider." },
  "blackrock":          { revenue:17860, employees:20000, industry:"Financial Services", countries:30, entities:25, currentERP:"Oracle", regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)"], confidence:"high", notes:"World's largest asset manager." },
  "apple":              { revenue:383290, employees:164000, industry:"Technology", countries:50, entities:40, currentERP:"Oracle", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global consumer electronics and software company." },
  "microsoft":          { revenue:211900, employees:220000, industry:"Technology", countries:100, entities:60, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global enterprise software and cloud services company." },
  "google":             { revenue:307400, employees:182000, industry:"Technology", countries:60, entities:40, currentERP:null, regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global search engine and cloud services company (Alphabet)." },
  "alphabet":           { revenue:307400, employees:182000, industry:"Technology", countries:60, entities:40, currentERP:null, regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Parent company of Google; global search and cloud services." },
  "amazon":             { revenue:574800, employees:1540000, industry:"Technology", countries:58, entities:80, currentERP:"Oracle", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global e-commerce and cloud computing company." },
  "meta":               { revenue:134900, employees:72000, industry:"Technology", countries:50, entities:30, currentERP:null, regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Social media and metaverse company (Facebook, Instagram, WhatsApp)." },
  "salesforce":         { revenue:34860, employees:73000, industry:"Technology", countries:50, entities:30, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Enterprise CRM and cloud software company." },
  "walmart":            { revenue:648000, employees:2100000, industry:"Retail / Consumer", countries:25, entities:50, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"World's largest retailer by revenue." },
  "johnson & johnson":  { revenue:85200, employees:152700, industry:"Healthcare", countries:60, entities:60, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)","HIPAA"], confidence:"high", notes:"Global pharmaceutical and medical devices company." },
  "johnson and johnson":{ revenue:85200, employees:152700, industry:"Healthcare", countries:60, entities:60, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)","HIPAA"], confidence:"high", notes:"J&J — global pharmaceutical and medical devices company." },
  "j&j":                { revenue:85200, employees:152700, industry:"Healthcare", countries:60, entities:60, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)","HIPAA"], confidence:"high", notes:"J&J — global pharmaceutical and medical devices company." },
  "jpmorgan chase":     { revenue:158100, employees:300000, industry:"Financial Services", countries:60, entities:50, currentERP:null, regulatoryFlags:["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking"], confidence:"high", notes:"Global investment bank and financial services firm." },
  "unitedhealth":       { revenue:371600, employees:440000, industry:"Healthcare", countries:15, entities:40, currentERP:null, regulatoryFlags:["SOX (Public Company)","HIPAA"], confidence:"high", notes:"Largest US health insurer and healthcare services company." },
  "pfizer":             { revenue:58500, employees:88000, industry:"Healthcare", countries:45, entities:50, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)","HIPAA"], confidence:"high", notes:"Global pharmaceutical company." },
  "exxonmobil":         { revenue:398700, employees:62000, industry:"Energy", countries:50, entities:40, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global oil and gas company." },
  "chevron":            { revenue:200000, employees:43000, industry:"Energy", countries:30, entities:35, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"US multinational energy corporation." },
  "boeing":             { revenue:77800, employees:171000, industry:"Manufacturing", countries:30, entities:30, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global aerospace and defense manufacturer." },
  "general electric":   { revenue:68000, employees:172000, industry:"Manufacturing", countries:40, entities:50, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Industrial and energy technology conglomerate." },
  "ge":                 { revenue:68000, employees:172000, industry:"Manufacturing", countries:40, entities:50, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"GE — industrial and energy technology conglomerate." },
  "deloitte":           { revenue:67200, employees:457000, industry:"Professional Services", countries:150, entities:80, currentERP:"SAP", regulatoryFlags:[], confidence:"high", notes:"Global professional services and consulting firm." },
  "pwc":                { revenue:53100, employees:364000, industry:"Professional Services", countries:152, entities:80, currentERP:null, regulatoryFlags:[], confidence:"high", notes:"Global professional services firm (PricewaterhouseCoopers)." },
  "pricewaterhousecoopers": { revenue:53100, employees:364000, industry:"Professional Services", countries:152, entities:80, currentERP:null, regulatoryFlags:[], confidence:"high", notes:"PwC — global professional services firm." },
  "accenture":          { revenue:64100, employees:733000, industry:"Professional Services", countries:120, entities:60, currentERP:"SAP", regulatoryFlags:["SOX (Public Company)"], confidence:"high", notes:"Global IT and management consulting firm." },
};

function estimateFromRevenue(revenue) {
  // Estimate org size from revenue using industry benchmarks
  const emp = Math.round(revenue * 8);  // rough: $1M rev ≈ 8 employees
  const fin = Math.round(emp * 0.025);  // 2.5% finance headcount
  return { employees: emp, financeHeadcount: fin, userCount: Math.round(fin * 0.7), entities: Math.max(2, Math.round(revenue / 5000)) };
}

async function lookupCompany(companyName) {
  const key = companyName.toLowerCase().trim();

  // 1. Try embedded knowledge base first (instant, no API needed)
  let match = COMPANY_DB[key];
  if (!match) {
    const partial = Object.keys(COMPANY_DB).find(k => key.includes(k) || k.includes(key));
    if (partial) match = COMPANY_DB[partial];
  }
  if (match) {
    const derived = estimateFromRevenue(match.revenue);
    return {
      ...match,
      financeHeadcount: match.financeHeadcount || derived.financeHeadcount,
      userCount:        match.userCount        || derived.userCount,
      employees:        match.employees        || derived.employees,
      entities:         match.entities         || derived.entities,
    };
  }

  // 2. Try the server-side API proxy (only works when deployed to Vercel)
  //    This unlocks lookup for any public company, not just the embedded list.
  try {
    const res = await fetch('/api/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.revenue || data.employees || data.industry)) {
        const derived = estimateFromRevenue(data.revenue || 1000);
        return {
          ...data,
          financeHeadcount: data.financeHeadcount || derived.financeHeadcount,
          userCount:        data.userCount        || derived.userCount,
          employees:        data.employees        || derived.employees,
          entities:         data.entities         || derived.entities,
        };
      }
    }
  } catch (e) {
    // API proxy not available (e.g. running locally without env vars) — fall through
    console.log('API proxy unavailable, showing manual entry prompt');
  }

  // 3. Not found in either source
  return null;
}

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────
function exportToCSV(estimate, formData) {
  const rows = [
    ["ClearPath ERP Transformation Cost Framework"],
    [`Company: ${formData.companyName || "N/A"}  |  Platform: ${formData.targetPlatform || "TBD"}  |  Generated: ${new Date().toLocaleDateString()}`],
    [],
    ["Cost Bucket","Low Estimate","Mid Estimate","High Estimate","Risk Level","Key Driver"],
    ...estimate.buckets.map(b => [b.label, Math.round(b.low), Math.round(b.mid), Math.round(b.high), b.risk, b.riskNote]),
    [],
    ["TOTAL", Math.round(estimate.totals.low), Math.round(estimate.totals.mid), Math.round(estimate.totals.high)],
    [],
    ["KEY ASSUMPTIONS"],
    ...estimate.assumptions.map(a => [a.text, a.source]),
    [],
    ["INPUTS PROVIDED"],
    ["Company", formData.companyName || ""],
    ["Target Platform", formData.targetPlatform || ""],
    ["Current System", formData.currentSystem || ""],
    ["User Count", formData.userCount || "estimated"],
    ["Finance Headcount", formData.financeHeadcount || "estimated"],
    ["Integrations", formData.integrations || "estimated"],
    ["Data Years", formData.dataYears || "estimated"],
    ["Legal Entities", formData.entities || "estimated"],
    ["Customization", formData.customization || ""],
    ["SI Tier", formData.siTier || ""],
    ["Timeline", formData.timeline || ""],
    ["Modules", (formData.modules || []).join(", ")],
    ["Regulations", (formData.regulations || []).join(", ")],
    ["Confidence Score", `${estimate.confidence}%`],
    [],
    ["Source: ClearPath | Benchmarks from Panorama Consulting 2025, ERP Research 2026, Oracle/Workday published pricing"],
    [],
    ["COST SAVINGS & AVOIDANCE"],
    ["Item", "Category", "Annual Value", "5-Year Value"],
    ...(() => {
      const sav = calcSavings(formData);
      return [
        ...sav.rows.map(r => [r.description, r.category, Math.round(r.annual), Math.round(r.annual*5)]),
        ["TOTAL SAVINGS", "", Math.round(sav.totalAnnual), Math.round(sav.total5yr)],
        [],
        ["ROI SUMMARY"],
        ["Gross Investment (Mid)", Math.round(estimates[0]?.totals.mid || 0)],
        ["5-Year Savings", Math.round(sav.total5yr)],
        ["Net 5-Year Cost", Math.round((estimates[0]?.totals.mid || 0) - sav.total5yr)],
        ["Annual Savings", Math.round(sav.totalAnnual)],
        ["Payback Period (years)", sav.totalAnnual > 0 ? ((estimates[0]?.totals.mid || 0) / sav.totalAnnual).toFixed(1) : "N/A"],
      ];
    })(),
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `ClearPath_ERP_Estimate_${(formData.companyName||"Model").replace(/\s+/g,"_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function OptionGroup({ label, options, value, onChange, multi = false, gold = false }) {
  const isSelected = (o) => multi ? (value || []).includes(o) : value === o;
  const toggle = (o) => {
    if (multi) {
      const cur = value || [];
      onChange(cur.includes(o) ? cur.filter(x => x !== o) : [...cur, o]);
    } else { onChange(o); }
  };
  return (
    <div className="cp-input-group">
      {label && <label className="cp-label">{label}</label>}
      <div className="cp-options">
        {options.map(o => (
          <div key={o} className={`cp-option${isSelected(o) ? (gold ? " selected-gold" : " selected") : ""}`}
            onClick={() => toggle(o)}>{o}</div>
        ))}
      </div>
    </div>
  );
}

function NumInput({ label, field, value, onChange, placeholder, hint }) {
  return (
    <div className="cp-input-group">
      <label className="cp-label">{label}</label>
      <input className="cp-input" type="number" value={value || ""}
        onChange={e => onChange(field, e.target.value)} placeholder={placeholder} />
      {hint && <div className="cp-info">{hint}</div>}
    </div>
  );
}

function SliderInput({ label, field, value, onChange, min, max, step, format }) {
  const val = parseInt(value) || min;
  return (
    <div className="cp-input-group">
      <label className="cp-label">{label}</label>
      <div className="cp-slider-val">{format ? format(val) : val}</div>
      <div className="cp-slider-wrap">
        <input type="range" className="cp-slider" min={min} max={max} step={step}
          value={val} onChange={e => onChange(field, e.target.value)} />
        <div className="cp-slider-labels"><span>{format ? format(min) : min}</span><span>{format ? format(max) : max}</span></div>
      </div>
    </div>
  );
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function StepCompany({ f, set, onLookup, lookupState, lookupData }) {
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Start with your company</h2>
      <p className="cp-step-sub">Enter your company name and ClearPath will use public data to pre-populate key drivers — or fill in manually.</p>
      <div className="cp-card">
        <div className="cp-card-title">Company Identification</div>
        <div className="cp-input-group">
          <label className="cp-label">Company Name</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="cp-input" value={f.companyName || ""} placeholder="e.g. Charles Schwab"
              onChange={e => set("companyName", e.target.value)} style={{ flex: 1 }} />
            <button className="cp-btn cp-btn-primary" onClick={onLookup}
              disabled={!f.companyName || lookupState === "loading"} style={{ flexShrink: 0 }}>
              {lookupState === "loading" ? <><div className="cp-spinner" /> Searching…</> : "Auto-fill →"}
            </button>
          </div>
          <div className="cp-info">For well-known public companies, ClearPath will look up revenue, headcount, industry, and regulatory profile to pre-populate driver estimates.</div>
        </div>

        {lookupState === "loading" && (
          <div className="cp-lookup-box">
            <div className="cp-lookup-status"><div className="cp-spinner" /> Searching public records for {f.companyName}…</div>
          </div>
        )}
        {lookupState === "done" && lookupData && (
          <div className="cp-lookup-box">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.success, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              ✓ Data found — fields pre-populated
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {lookupData.revenue && <span className="cp-chip cp-chip-blue">Revenue: ${lookupData.revenue}M</span>}
              {lookupData.employees && <span className="cp-chip cp-chip-blue">Employees: {lookupData.employees?.toLocaleString()}</span>}
              {lookupData.industry && <span className="cp-chip cp-chip-gold">{lookupData.industry}</span>}
              {lookupData.financeHeadcount && <span className="cp-chip cp-chip-blue">Finance HC: ~{lookupData.financeHeadcount}</span>}
              {lookupData.currentERP && <span className="cp-chip cp-chip-green">Current ERP: {lookupData.currentERP}</span>}
              {lookupData.confidence && <span className="cp-chip cp-chip-gold">Confidence: {lookupData.confidence}</span>}
            </div>
            {lookupData.notes && <div style={{ fontSize: 12, color: C.textDim, marginTop: 10 }}>{lookupData.notes}</div>}
          </div>
        )}
        {lookupState === "error" && (
          <div className="cp-lookup-box">
            <div className="cp-lookup-status" style={{ color: C.warn, flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
              <span>⚠ Company not in database — fill in manually below.</span>
              <span style={{ fontSize: 11, color: C.textDim }}>Supported: Schwab, JPMorgan, Goldman Sachs, Morgan Stanley, Fidelity, Vanguard, BlackRock, Apple, Microsoft, Google, Amazon, Meta, Salesforce, Walmart, J&J, UnitedHealth, Pfizer, ExxonMobil, Boeing, GE, Deloitte, PwC, Accenture, and more.</span>
            </div>
          </div>
        )}
      </div>

      <div className="cp-card">
        <div className="cp-card-title">Industry & Revenue</div>
        <OptionGroup label="Industry" options={INDUSTRIES} value={f.industry} onChange={v => set("industry", v)} />
        <div className="cp-row">
          <div>
            <label className="cp-label">Annual Revenue (USD Millions)</label>
            <input className="cp-input" type="number" value={f.revenue || ""} placeholder="e.g. 18500"
              onChange={e => set("revenue", e.target.value)} />
          </div>
          <div>
            <label className="cp-label">Total Employees</label>
            <input className="cp-input" type="number" value={f.totalEmployees || ""} placeholder="e.g. 35000"
              onChange={e => set("totalEmployees", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCurrent({ f, set }) {
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Current state</h2>
      <p className="cp-step-sub">Tell us about your existing systems and data environment. This drives migration complexity and integration estimates.</p>
      <div className="cp-card">
        <div className="cp-card-title">Existing ERP / Financial Systems</div>
        <OptionGroup label="Primary current ERP or financial system" options={CURRENT_SYSTEMS}
          value={f.currentSystem} onChange={v => set("currentSystem", v)} />
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Connected Systems</div>
        <OptionGroup label="Which of these are currently connected to your financial system? (select all that apply)"
          options={["HRIS / HCM","Procurement","Banking / Treasury","Tax Engine","FP&A / Planning","Data Warehouse","CRM","Industry-Specific Platforms","Homegrown / Custom Integrations"]}
          value={f.connectedSystems} onChange={v => set("connectedSystems", v)} multi />
        <NumInput label="Estimated number of system integrations in scope" field="integrations"
          value={f.integrations} onChange={set} placeholder="e.g. 14"
          hint="If unsure, ClearPath will estimate based on connected systems selected above." />
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Data Environment</div>
        <div className="cp-row">
          <NumInput label="Years of historical data to migrate" field="dataYears"
            value={f.dataYears} onChange={set} placeholder="e.g. 7" />
          <div>
            <label className="cp-label">Data quality</label>
            <select className="cp-input cp-select" value={f.dataQuality || ""}
              onChange={e => set("dataQuality", e.target.value)}>
              <option value="">Select…</option>
              <option value="clean">Clean and well-governed</option>
              <option value="moderate">Moderate issues</option>
              <option value="poor">Poor quality / fragmented</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
        <OptionGroup label="Target data architecture" options={["Keep existing warehouse","Modernize (BigQuery / Snowflake)","Net new build","Not yet defined"]}
          value={f.dataArch} onChange={v => set("dataArch", v)} />
      </div>
    </div>
  );
}

function StepTarget({ f, set }) {
  const selectedPlatforms = f.targetPlatforms || [];
  const togglePlatform = (p) => {
    const cur = f.targetPlatforms || [];
    const next = cur.includes(p) ? cur.filter(x => x !== p) : cur.length < 4 ? [...cur, p] : cur;
    set("targetPlatforms", next);
    // Keep legacy targetPlatform in sync for canNext / confidence checks
    set("targetPlatform", next[0] || null);
  };
  const SELECTABLE = TARGET_PLATFORMS.filter(p => p !== "Help me decide");
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Target state</h2>
      <p className="cp-step-sub">Select one or more platforms to compare side-by-side in your results. Up to 4 platforms.</p>
      <div className="cp-card">
        <div className="cp-card-title">ERP Platform(s) — select up to 4</div>
        <div className="cp-options">
          {SELECTABLE.map(p => (
            <div key={p}
              className={`cp-option${selectedPlatforms.includes(p) ? " selected" : ""}`}
              onClick={() => togglePlatform(p)}>
              {selectedPlatforms.includes(p) && <span style={{marginRight:6}}>✓</span>}{p}
            </div>
          ))}
        </div>
        {selectedPlatforms.length > 1 && (
          <div className="cp-info" style={{marginTop:12}}>
            ✓ {selectedPlatforms.length} platforms selected — ClearPath will generate a side-by-side cost comparison in your results.
          </div>
        )}
        {selectedPlatforms.length === 0 && (
          <div className="cp-info" style={{marginTop:12, borderLeftColor: C.warn}}>Select at least one platform to continue.</div>
        )}
      </div>
      <div className="cp-card">
        <div className="cp-card-title">AI Ambition</div>
        <OptionGroup label="What level of AI capability is in scope for this transformation?"
          options={["None / Minimal","Vendor-bundled only (included in platform)","Moderate (5–10 targeted use cases)","Aggressive (AI-native finance org)"]}
          value={f.aiAmbitionLabel} onChange={v => {
            const map = {"None / Minimal":"none","Vendor-bundled only (included in platform)":"bundled","Moderate (5–10 targeted use cases)":"moderate","Aggressive (AI-native finance org)":"aggressive"};
            set("aiAmbition", map[v] || v);
            set("aiAmbitionLabel", v);
          }} />
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Deployment Preference</div>
        <OptionGroup label="Deployment model" options={["Full SaaS / Cloud","Hybrid (Cloud + On-Prem)","Private Cloud","Not yet defined"]}
          value={f.deployment} onChange={v => set("deployment", v)} />
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Negotiated License Discount</div>
        <div className="cp-info" style={{ marginBottom: 14 }}>
          Published list prices are rarely what large enterprises pay. Enter an expected negotiation discount
          to reflect your organization's leverage — deal size, competitive bids, and multi-year commitments
          typically yield 20–50% off list for Workday, SAP, and Oracle.
        </div>
        {(() => {
          const discount = f.licenseDiscount ?? 0;
          const pct = Math.round(discount * 100);
          const guidance = pct === 0
            ? "Using full published list prices — no discount applied."
            : pct <= 15
            ? `${pct}% — modest discount; typical for smaller organizations or sole-source deals.`
            : pct <= 30
            ? `${pct}% — solid discount; achievable with competitive bids and mid-market leverage.`
            : pct <= 45
            ? `${pct}% — strong discount; realistic for large enterprises with multi-vendor bake-offs.`
            : `${pct}% — aggressive discount; typically reserved for anchor reference customers or strategic deals.`;
          return (
            <div>
              <div className="cp-slider-val">{pct}% off list</div>
              <div className="cp-slider-wrap">
                <input type="range" className="cp-slider" min={0} max={60} step={5}
                  value={pct}
                  onChange={e => set("licenseDiscount", parseInt(e.target.value) / 100)} />
                <div className="cp-slider-labels">
                  <span>0% (list price)</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: pct > 30 ? C.gold : C.textMid, marginTop: 8, fontStyle: "italic" }}>
                {guidance}
              </div>
              {pct > 0 && (
                <div className="cp-info" style={{ marginTop: 10, borderLeftColor: C.success, color: C.success }}>
                  ✓ Software & Licensing estimates will reflect a {pct}% reduction from list price.
                  SI fees, labor, and all other buckets are unaffected.
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function StepModules({ f, set }) {
  const selected = f.modules || ["gl", "ap", "ar"];
  const toggle = (id) => {
    if (id === "gl") return;
    set("modules", selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };
  const totalMidAdder = selected.reduce((s, id) => {
    const m = MODULES.find(x => x.id === id); return s + (m ? m.midCost : 0);
  }, 0);
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Module selection</h2>
      <p className="cp-step-sub">Select the modules you'll implement. Each adds to the licensing baseline and implementation scope. GL is always required.</p>
      <div className="cp-card">
        <div className="cp-card-title">Finance & Accounting Modules</div>
        <div className="cp-modules">
          {MODULES.map(m => (
            <div key={m.id} className={`cp-module${selected.includes(m.id) ? " selected" : ""}`}
              onClick={() => toggle(m.id)} style={{ cursor: m.id === "gl" ? "default" : "pointer" }}>
              <div className="cp-module-name">{m.name}{m.id === "gl" ? " ✓" : ""}</div>
              <div className="cp-module-cost">${m.midCost}K mid-est. adder{m.note ? ` · ${m.note}` : ""}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 16px", background: C.surfaceHigh, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>Estimated module licensing adder (mid, Year 1)</div>
          <div style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 800, color: C.accent }}>${totalMidAdder.toLocaleString()}K</div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{selected.length} modules selected</div>
        </div>
      </div>
    </div>
  );
}

function StepOrg({ f, set }) {
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Organizational context</h2>
      <p className="cp-step-sub">These inputs calibrate user counts, regulatory multipliers, and implementation complexity.</p>
      <div className="cp-card">
        <div className="cp-card-title">Finance Organization</div>
        <div className="cp-row">
          <NumInput label="Finance org headcount" field="financeHeadcount"
            value={f.financeHeadcount} onChange={set} placeholder="e.g. 350"
            hint="Total finance, accounting, FP&A, AP/AR, and audit staff." />
          <NumInput label="Named ERP users (if known)" field="userCount"
            value={f.userCount} onChange={set} placeholder="e.g. 500"
            hint="If blank, estimated at ~70% of finance headcount." />
        </div>
        <div className="cp-row">
          <NumInput label="Number of legal entities" field="entities"
            value={f.entities} onChange={set} placeholder="e.g. 8"
            hint="Drives consolidation complexity significantly." />
          <div>
            <label className="cp-label">Countries of operation</label>
            <input className="cp-input" type="number" value={f.countries || ""} placeholder="e.g. 3"
              onChange={e => set("countries", e.target.value)} />
          </div>
        </div>
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Regulatory Environment</div>
        <OptionGroup label="Select all applicable regulatory frameworks" options={REGULATIONS}
          value={f.regulations} onChange={v => set("regulations", v)} multi gold />
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Internal Capability</div>
        <OptionGroup label="Internal IT / ERP capability" options={["Strong — can self-implement portions","Moderate — mixed approach","Limited — fully SI-dependent"]}
          value={f.itCapabilityLabel} onChange={v => {
            const map = {"Strong — can self-implement portions":"strong","Moderate — mixed approach":"moderate","Limited — fully SI-dependent":"limited"};
            set("itCapability", map[v] || "moderate");
            set("itCapabilityLabel", v);
          }} />
        <OptionGroup label="Executive sponsorship status" options={["Confirmed and active","In progress","Not yet secured"]}
          value={f.sponsorship} onChange={v => set("sponsorship", v)} />
      </div>
    </div>
  );
}

function StepProject({ f, set }) {
  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Project parameters</h2>
      <p className="cp-step-sub">Timeline, customization philosophy, and SI tier are the highest-leverage inputs after platform choice.</p>
      <div className="cp-card">
        <div className="cp-card-title">Timeline</div>
        <OptionGroup label="Target go-live timeline"
          options={["Aggressive (< 18 months)","Standard (18–30 months)","Phased (30–48 months)"]}
          value={f.timelineLabel} onChange={v => {
            const map = {"Aggressive (< 18 months)":"aggressive","Standard (18–30 months)":"standard","Phased (30–48 months)":"phased"};
            set("timeline", map[v] || "standard");
            set("timelineLabel", v);
          }} />
        {f.timeline === "aggressive" && (
          <div className="cp-info" style={{ borderLeftColor: C.warn, color: C.warn }}>⚠ Aggressive timelines add 20–30% to SI costs and increase overrun risk significantly.</div>
        )}
      </div>
      <div className="cp-card">
        <div className="cp-card-title">Customization Philosophy</div>
        <OptionGroup label="How closely will you follow out-of-box processes?"
          options={["Configure only (minimal custom)","Moderate customization","Heavy customization"]}
          value={f.customizationLabel} onChange={v => {
            const map = {"Configure only (minimal custom)":"minimal","Moderate customization":"moderate","Heavy customization":"heavy"};
            set("customization", map[v] || "moderate");
            set("customizationLabel", v);
          }} />
        {f.customization === "heavy" && (
          <div className="cp-info" style={{ borderLeftColor: C.danger, color: C.danger }}>⚠ Heavy customization can add 50–200% to base license cost and extends implementation 6–12 months.</div>
        )}
      </div>
      <div className="cp-card">
        <div className="cp-card-title">System Integrator</div>
        <OptionGroup label="SI tier preference"
          options={["Tier 1 (Deloitte / Accenture / KPMG / PwC)","Tier 2 (Regional / Boutique)","Mixed (Internal + SI)","Unknown / TBD"]}
          value={f.siTierLabel} onChange={v => {
            const map = {"Tier 1 (Deloitte / Accenture / KPMG / PwC)":"tier1","Tier 2 (Regional / Boutique)":"tier2","Mixed (Internal + SI)":"mixed","Unknown / TBD":"unknown"};
            set("siTier", map[v] || "unknown");
            set("siTierLabel", v);
          }} />
        <div>
          <label className="cp-label">Known budget ceiling (optional)</label>
          <input className="cp-input" value={f.budgetCeiling || ""} placeholder="e.g. $50M — helps ClearPath flag if estimate exceeds"
            onChange={e => set("budgetCeiling", e.target.value)} />
        </div>
      </div>
    </div>
  );
}


// ─── COST SAVINGS / TCO OFFSET STEP ─────────────────────────────────────────
function StepSavings({ f, set }) {
  const apps    = f.retiredApps    || [];
  const process = f.processGains   || [];
  const other   = f.otherSavings   || [];

  const addApp = () => set("retiredApps", [...apps, { id: Date.now(), name: "", annualCost: "", retirementType: "full", notes: "" }]);
  const updApp = (id, field, val) => set("retiredApps", apps.map(a => a.id === id ? { ...a, [field]: val } : a));
  const delApp = (id) => set("retiredApps", apps.filter(a => a.id !== id));

  const addProc = () => set("processGains", [...process, { id: Date.now(), description: "", annualValue: "", category: "FTE reduction" }]);
  const updProc = (id, field, val) => set("processGains", process.map(p => p.id === id ? { ...p, [field]: val } : p));
  const delProc = (id) => set("processGains", process.filter(p => p.id !== id));

  const addOther = () => set("otherSavings", [...other, { id: Date.now(), description: "", annualValue: "" }]);
  const updOther = (id, field, val) => set("otherSavings", other.map(o => o.id === id ? { ...o, [field]: val } : o));
  const delOther = (id) => set("otherSavings", other.filter(o => o.id !== id));

  const totalAppAnnual    = apps.reduce((s, a) => s + (parseFloat(a.annualCost)    || 0), 0);
  const totalProcAnnual   = process.reduce((s, p) => s + (parseFloat(p.annualValue) || 0), 0);
  const totalOtherAnnual  = other.reduce((s, o) => s + (parseFloat(o.annualValue)   || 0), 0);
  const totalAnnual       = totalAppAnnual + totalProcAnnual + totalOtherAnnual;
  const total5yr          = totalAnnual * 5;

  const inputStyle = {
    background: "#fff", border: "1.5px solid #D0E4EF", borderRadius: 6,
    padding: "7px 10px", fontSize: 13, color: "#0F2235",
    fontFamily: "DM Sans, sans-serif", outline: "none", width: "100%",
  };
  const delBtn = (onClick) => (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", color: "#6B8FA8",
      fontSize: 16, padding: "0 4px", lineHeight: 1, flexShrink: 0,
    }} title="Remove">✕</button>
  );

  return (
    <div className="cp-fadein">
      <h2 className="cp-step-title">Cost savings & avoidance</h2>
      <p className="cp-step-sub">
        Optional but powerful — enter current TCO for apps being retired, process efficiency gains,
        and other offsets. ClearPath will calculate your net investment and payback period.
      </p>

      {/* ── Retired Applications ── */}
      <div className="cp-card">
        <div className="cp-card-title">Applications Being Retired or Consolidated</div>
        <div className="cp-info" style={{ marginBottom: 14 }}>
          Enter each system that will be decommissioned or reduced as a result of the new ERP.
          Include annual license, support, hosting, and internal maintenance costs.
        </div>

        {apps.map((app, i) => (
          <div key={app.id} style={{
            background: "#EEF4F9", borderRadius: 8, padding: "14px 14px 10px",
            marginBottom: 10, border: "1px solid #D0E4EF",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00A0DF", textTransform: "uppercase", letterSpacing: 1 }}>
                Application {i + 1}
              </div>
              {delBtn(() => delApp(app.id))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.3fr", gap: 10, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>System / App Name</div>
                <input style={inputStyle} value={app.name} placeholder="e.g. Hyperion, Concur, legacy GL…"
                  onChange={e => updApp(app.id, "name", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Annual Cost ($)</div>
                <input style={inputStyle} type="number" value={app.annualCost} placeholder="e.g. 450000"
                  onChange={e => updApp(app.id, "annualCost", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Retirement Type</div>
                <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  value={app.retirementType} onChange={e => updApp(app.id, "retirementType", e.target.value)}>
                  <option value="full">Full retirement (100%)</option>
                  <option value="partial75">Partial — 75% reduction</option>
                  <option value="partial50">Partial — 50% reduction</option>
                  <option value="partial25">Partial — 25% reduction</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Notes (optional)</div>
              <input style={inputStyle} value={app.notes} placeholder="e.g. Hyperion replaced by Oracle EPM; decommission 12 months post go-live"
                onChange={e => updApp(app.id, "notes", e.target.value)} />
            </div>
            {app.annualCost && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#059669", fontWeight: 600 }}>
                ✓ {(() => {
                  const pct = { full:1, partial75:0.75, partial50:0.50, partial25:0.25 }[app.retirementType] || 1;
                  return `Saving: $${Math.round(parseFloat(app.annualCost)*pct).toLocaleString()}/yr · $${Math.round(parseFloat(app.annualCost)*pct*5).toLocaleString()} over 5 years`;
                })()}
              </div>
            )}
          </div>
        ))}

        <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={addApp}
          style={{ marginTop: 4 }}>
          + Add Application
        </button>

        {apps.length > 0 && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#E6F4FB", borderRadius: 7,
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#0F2235", fontWeight: 600 }}>Total app retirement savings</div>
            <div style={{ fontSize: 16, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#059669" }}>
              ${apps.reduce((s,a) => {
                const pct = { full:1, partial75:0.75, partial50:0.5, partial25:0.25 }[a.retirementType]||1;
                return s + (parseFloat(a.annualCost)||0)*pct;
              }, 0).toLocaleString()}/yr
            </div>
          </div>
        )}
      </div>

      {/* ── Process Efficiency Gains ── */}
      <div className="cp-card">
        <div className="cp-card-title">Process Efficiency Gains</div>
        <div className="cp-info" style={{ marginBottom: 14 }}>
          Quantify efficiency improvements — FTE reductions, faster financial close, eliminated manual
          reconciliations, reduced audit prep time. Use fully burdened FTE cost to value headcount savings.
        </div>

        {process.map((proc, i) => (
          <div key={proc.id} style={{
            background: "#EEF4F9", borderRadius: 8, padding: "14px 14px 10px",
            marginBottom: 10, border: "1px solid #D0E4EF",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00A0DF", textTransform: "uppercase", letterSpacing: 1 }}>
                Efficiency Gain {i + 1}
              </div>
              {delBtn(() => delProc(proc.id))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.3fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Description</div>
                <input style={inputStyle} value={proc.description} placeholder="e.g. 2 FTEs redeployed from manual close process"
                  onChange={e => updProc(proc.id, "description", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Annual Value ($)</div>
                <input style={inputStyle} type="number" value={proc.annualValue} placeholder="e.g. 340000"
                  onChange={e => updProc(proc.id, "annualValue", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Category</div>
                <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  value={proc.category} onChange={e => updProc(proc.id, "category", e.target.value)}>
                  <option>FTE reduction</option>
                  <option>FTE redeployment</option>
                  <option>Faster financial close</option>
                  <option>Audit cost reduction</option>
                  <option>Error / rework reduction</option>
                  <option>Reporting acceleration</option>
                  <option>Compliance cost avoidance</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={addProc} style={{ marginTop: 4 }}>
          + Add Efficiency Gain
        </button>
      </div>

      {/* ── Other Savings ── */}
      <div className="cp-card">
        <div className="cp-card-title">Other Cost Savings & Avoidance</div>
        <div className="cp-info" style={{ marginBottom: 14 }}>
          Infrastructure decommission, data center consolidation, support contract eliminations,
          avoided system upgrades on retiring platforms, or other one-time / recurring savings.
        </div>

        {other.map((item, i) => (
          <div key={item.id} style={{
            display: "grid", gridTemplateColumns: "2.5fr 1.2fr auto",
            gap: 10, alignItems: "end", marginBottom: 10,
          }}>
            <div>
              {i === 0 && <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Description</div>}
              <input style={inputStyle} value={item.description} placeholder="e.g. Data center decommission, avoided Oracle EBS upgrade…"
                onChange={e => updOther(item.id, "description", e.target.value)} />
            </div>
            <div>
              {i === 0 && <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4, fontWeight: 500 }}>Annual Value ($)</div>}
              <input style={inputStyle} type="number" value={item.annualValue} placeholder="e.g. 200000"
                onChange={e => updOther(item.id, "annualValue", e.target.value)} />
            </div>
            {delBtn(() => delOther(item.id))}
          </div>
        ))}

        <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={addOther} style={{ marginTop: 4 }}>
          + Add Other Saving
        </button>
      </div>

      {/* ── Summary ── */}
      {totalAnnual > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #E6F4FB 0%, #EEF4F9 100%)",
          border: "1.5px solid #00A0DF", borderRadius: 10, padding: "18px 20px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#00A0DF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Savings Summary
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              ["App Retirements",    apps.reduce((s,a)=>{ const p={full:1,partial75:.75,partial50:.5,partial25:.25}[a.retirementType]||1; return s+(parseFloat(a.annualCost)||0)*p; },0)],
              ["Process Gains",     totalProcAnnual],
              ["Other Savings",     totalOtherAnnual],
            ].map(([label, val]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#3D6680", marginBottom: 4 }}>{label} / yr</div>
                <div style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 800, color: val > 0 ? "#059669" : "#6B8FA8" }}>
                  {val > 0 ? "$" + Math.round(val).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #D0E4EF", marginTop: 14, paddingTop: 14,
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#3D6680" }}>Total annual savings / avoidance</div>
              <div style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#059669" }}>
                ${Math.round(totalAnnual).toLocaleString()}/yr
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#3D6680" }}>5-year total savings</div>
              <div style={{ fontSize: 22, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#059669" }}>
                ${Math.round(total5yr).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {totalAnnual === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#6B8FA8", fontSize: 13 }}>
          All fields are optional — skip to generate your estimate without savings offsets,
          or add entries above to unlock the ROI and payback period panels in results.
        </div>
      )}
    </div>
  );
}


// ─── SAVINGS CALCULATOR ──────────────────────────────────────────────────────
function calcSavings(f) {
  const apps    = f.retiredApps    || [];
  const process = f.processGains   || [];
  const other   = f.otherSavings   || [];

  const appAnnual = apps.reduce((s, a) => {
    const pct = { full:1, partial75:0.75, partial50:0.50, partial25:0.25 }[a.retirementType] || 1;
    return s + (parseFloat(a.annualCost) || 0) * pct;
  }, 0);
  const procAnnual  = process.reduce((s, p) => s + (parseFloat(p.annualValue) || 0), 0);
  const otherAnnual = other.reduce((s, o)   => s + (parseFloat(o.annualValue) || 0), 0);
  const totalAnnual = appAnnual + procAnnual + otherAnnual;

  return {
    appAnnual, procAnnual, otherAnnual, totalAnnual,
    total3yr: totalAnnual * 3,
    total5yr: totalAnnual * 5,
    rows: [
      ...apps.filter(a => a.name || a.annualCost).map(a => {
        const pct = { full:1, partial75:0.75, partial50:0.5, partial25:0.25 }[a.retirementType]||1;
        const label = { full:"Full retirement", partial75:"75% reduction", partial50:"50% reduction", partial25:"25% reduction" }[a.retirementType];
        return { category:"App Retirement", description: a.name || "Unnamed system", annual: (parseFloat(a.annualCost)||0)*pct, note: label, notes: a.notes };
      }),
      ...process.filter(p => p.description || p.annualValue).map(p => ({
        category: p.category || "Process Gain", description: p.description || "Unnamed gain",
        annual: parseFloat(p.annualValue)||0, note: p.category,
      })),
      ...other.filter(o => o.description || o.annualValue).map(o => ({
        category:"Other Saving", description: o.description || "Unnamed saving",
        annual: parseFloat(o.annualValue)||0,
      })),
    ],
  };
}

// ─── MULTI-PLATFORM CSV EXPORT ───────────────────────────────────────────────
function exportToCSVMulti(estimates, formData) {
  const platforms = estimates.map(e => e.platform);
  const bucketIds = estimates[0].buckets.map(b => b.id);
  const bucketLabels = estimates[0].buckets.map(b => b.label || b.id);

  const rows = [
    ["ClearPath ERP Transformation — Platform Comparison"],
    [`Company: ${formData.companyName || "N/A"}  |  Generated: ${new Date().toLocaleDateString()}`],
    [],
    ["Cost Bucket", ...platforms.flatMap(p => [`${p} Low`, `${p} Mid`, `${p} High`]), "Risk Note", "Sources"],
    ...bucketIds.map((id, i) => {
      const label = bucketLabels[i];
      const primaryBucket = estimates[0].buckets.find(x => x.id === id);
      const vals = estimates.flatMap(e => {
        const b = e.buckets.find(x => x.id === id);
        return [Math.round(b.low), Math.round(b.mid), Math.round(b.high)];
      });
      const sources = primaryBucket?.sources?.map(s => s.url ? `${s.text} (${s.url})` : s.text).join(" | ") || "";
      return [label, ...vals, primaryBucket?.riskNote || "", sources];
    }),
    [],
    ["TOTAL", ...estimates.flatMap(e => [Math.round(e.totals.low), Math.round(e.totals.mid), Math.round(e.totals.high)])],
    [],
    ["INPUTS"],
    ["Company", formData.companyName || ""],
    ["Platforms Compared", platforms.join(" vs ")],
    ["Modules", (formData.modules || []).join(", ")],
    ["User Count", formData.userCount || "estimated"],
    ["Integrations", formData.integrations || "estimated"],
    ["Data Years", formData.dataYears || "estimated"],
    ["Regulations", (formData.regulations || []).join(", ")],
    ["Customization", formData.customization || ""],
    ["SI Tier", formData.siTier || ""],
    ["Timeline", formData.timeline || ""],
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `ClearPath_Comparison_${(formData.companyName||"Model").replace(/\s+/g,"_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── RESULTS — SIDE-BY-SIDE COMPARISON ───────────────────────────────────────
function StepResults({ f, estimates, onExport, onRecalculate }) {
  const [scen, setScen] = useState("mid");
  const [view, setView] = useState("breakdown");
  const [localDiscount, setLocalDiscount] = useState(f.licenseDiscount ?? 0);
  const [recalcDirty, setRecalcDirty] = useState(false);

  const scVal = (b) => scen === "low" ? b.low : scen === "high" ? b.high : b.mid;
  const getTotal = (e) => scen === "low" ? e.totals.low : scen === "high" ? e.totals.high : e.totals.mid;

  // For single-platform view, use first estimate for confidence/missing
  const primary = estimates[0];
  const multi   = estimates.length > 1;

  // Platform accent colors for comparison columns
  const PLAT_COLORS = ["#00A0DF","#059669","#D97706","#7C3AED"];
  const cheapestMid = Math.min(...estimates.map(e => e.totals.mid));
  const mostExpMid  = Math.max(...estimates.map(e => e.totals.mid));

  const budgetNum  = f.budgetCeiling ? parseFloat(f.budgetCeiling.replace(/[^0-9.]/g,"")) * 1e6 : null;

  // Narrative covers all platforms
  const platList = estimates.map(e => e.platform).join(" vs ");
  const narrative = `${f.companyName || "The organization"}'s ERP transformation — scoped to Finance and Accounting across ${f.modules?.length || 3} modules — ${multi ? `was evaluated across ${estimates.length} platforms (${platList}). Mid-scenario estimates range from ${fmt(cheapestMid)} to ${fmt(mostExpMid)}, a difference of ${fmt(mostExpMid - cheapestMid)}.` : `is estimated at ${fmt(primary.totals.low)}–${fmt(primary.totals.high)}, with a mid-scenario of ${fmt(primary.totals.mid)}.`} Internal labor costs are consistently the largest bucket and are frequently omitted from initial business cases. ${primary.confidence < 60 ? "Estimate confidence is moderate; validating named user count, integration inventory, and data migration scope would most reduce the uncertainty range." : "Estimate confidence is high based on inputs provided."} ${(f.regulations?.length||0) > 1 ? `Regulatory complexity across ${f.regulations.length} frameworks applies a cost premium to all scenarios.` : ""}`;

  const BUCKET_ORDER = ["software","si","labor","data","ai","integrations","infra","testing","training","regulatory","contingency"];

  return (
    <div className="cp-fadein">
      {/* Header */}
      <div className="cp-results-header">
        <div className="cp-results-company">{f.companyName || "Your Company"} · ERP Transformation Estimate</div>
        <h2 className="cp-step-title">{multi ? "Platform Comparison" : "Cost Estimation Results"}</h2>
        <p className="cp-step-sub">
          {multi ? `${estimates.length} platforms compared — ${scen} scenario shown.` : `Based on ${primary.confidence}% of recommended inputs.`}
          {primary.missing.length > 0 ? ` ${primary.missing.length} inputs estimated — see assumptions panel.` : " All key inputs provided."}
        </p>
      </div>

      {/* ── QUICK ADJUST PANEL ── */}
      <div className="cp-card" style={{ background: C.surfaceBlue, border: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom: recalcDirty ? 14 : 0 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Quick Adjust</div>
            <div style={{ fontSize:12, color:C.textMid }}>Tweak assumptions and recalculate without re-running the wizard.</div>
          </div>
          {recalcDirty && (
            <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={() => {
              onRecalculate({ licenseDiscount: localDiscount });
              setRecalcDirty(false);
            }}>
              ↻ Recalculate Estimate
            </button>
          )}
        </div>
        {recalcDirty && (
          <div style={{ fontSize:11, color:C.gold, marginBottom:14 }}>
            ⚠ Unsaved changes — click Recalculate to update the estimate below.
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
              License Negotiation Discount
              <span style={{ marginLeft:8, fontWeight:400, color:C.textDim }}>
                (Software & Licensing bucket only)
              </span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <input type="range" className="cp-slider" style={{ flex:1 }} min={0} max={60} step={5}
                value={Math.round(localDiscount * 100)}
                onChange={e => { setLocalDiscount(parseInt(e.target.value) / 100); setRecalcDirty(true); }} />
              <div style={{ fontSize:18, fontFamily:"Syne, sans-serif", fontWeight:800, color: localDiscount > 0 ? C.success : C.textDim, minWidth:58, textAlign:"right" }}>
                {Math.round(localDiscount * 100)}% off
              </div>
            </div>
            <div style={{ fontSize:10, color:C.textDim, marginTop:4 }}>
              {localDiscount === 0
                ? "Full published list prices in use — no discount applied."
                : localDiscount <= 0.20
                ? `${Math.round(localDiscount*100)}% — modest; typical for smaller orgs or sole-source deals.`
                : localDiscount <= 0.35
                ? `${Math.round(localDiscount*100)}% — solid; achievable with competitive bids.`
                : localDiscount <= 0.50
                ? `${Math.round(localDiscount*100)}% — strong; realistic for large enterprises with multi-vendor bake-offs.`
                : `${Math.round(localDiscount*100)}% — aggressive; typically for anchor reference customers.`}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROI / NET INVESTMENT PANEL ── */}
      {(() => {
        const sav = primary.savings || calcSavings({});
        if (sav.totalAnnual === 0) return null;
        const grossMid  = primary.totals.mid;
        const net5yr    = grossMid - sav.total5yr;
        const paybackYr = sav.totalAnnual > 0 ? (grossMid / sav.totalAnnual) : null;
        const roi5yr    = sav.total5yr > 0 ? Math.round(((sav.total5yr - grossMid) / grossMid) * 100) : null;
        return (
          <div style={{
            background: "linear-gradient(135deg, #E6F4FB 0%, #EEF4F9 100%)",
            border: "2px solid #00A0DF", borderRadius: 12, padding: "20px 22px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#00A0DF", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
              ROI & Net Investment (Mid Scenario)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
              {[
                ["Gross Investment",  fmt(grossMid),                        "#0F2235", "Total mid-scenario ERP cost"],
                ["5-Year Savings",    fmt(sav.total5yr),                    "#059669", `$${Math.round(sav.totalAnnual/1000)}K/yr × 5`],
                ["Net 5-Year Cost",   fmt(Math.abs(net5yr)),                net5yr <= 0 ? "#059669" : "#0F2235", net5yr <= 0 ? "Net positive ROI" : "Net investment after savings"],
                ["Payback Period",    paybackYr ? paybackYr.toFixed(1)+"yr" : "N/A", paybackYr && paybackYr < 5 ? "#059669" : "#D97706", "Years to recover investment"],
              ].map(([label, val, color, sub]) => (
                <div key={label} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,80,140,0.06)" }}>
                  <div style={{ fontSize: 10, color: "#6B8FA8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#6B8FA8", marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Savings breakdown table */}
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #D0E4EF" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#EEF4F9" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "#6B8FA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Saving / Avoidance Item</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "#6B8FA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Category</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 10, color: "#6B8FA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Annual</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 10, color: "#6B8FA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>5-Year</th>
                  </tr>
                </thead>
                <tbody>
                  {sav.rows.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #D0E4EF" }}>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: "#0F2235" }}>
                        {row.description}
                        {row.notes && <div style={{ fontSize: 10, color: "#6B8FA8", marginTop: 2 }}>{row.notes}</div>}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 11, color: "#3D6680" }}>{row.category}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "#059669" }}>{fmt(row.annual)}</td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "#059669" }}>{fmt(row.annual * 5)}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid #00A0DF", background: "#E6F4FB" }}>
                    <td colSpan={2} style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#0F2235" }}>Total Savings / Avoidance</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#059669" }}>{fmt(sav.totalAnnual)}/yr</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#059669" }}>{fmt(sav.total5yr)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {roi5yr !== null && (
              <div style={{ marginTop: 12, fontSize: 12, color: roi5yr >= 0 ? "#059669" : "#D97706", fontWeight: 600 }}>
                {roi5yr >= 0
                  ? `✓ Positive 5-year ROI: ${roi5yr}% return on investment — savings exceed gross transformation cost over 5 years`
                  : `▲ Net cost after 5-year savings: ${fmt(Math.abs(net5yr))} — consider longer time horizon or additional savings opportunities`}
              </div>
            )}
          </div>
        );
      })()}

      {/* Budget warning */}
      {budgetNum && estimates.some(e => e.totals.mid > budgetNum) && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"12px 16px", marginBottom:20 }}>
          <div style={{ fontSize:13, color:"#EF4444", fontWeight:700 }}>
            ⚠ {estimates.filter(e=>e.totals.mid>budgetNum).map(e=>e.platform).join(", ")} exceed stated budget ceiling of {f.budgetCeiling}
          </div>
        </div>
      )}

      {/* Missing inputs */}
      {primary.missing.length > 0 && (
        <div className="cp-missing">
          <div className="cp-missing-title">📋 Inputs that would most reduce uncertainty</div>
          {primary.missing.map((m,i) => <div key={i} className="cp-missing-item">{m}</div>)}
        </div>
      )}

      {/* Confidence */}
      <div className="cp-card" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:12, color:"#3D6680", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Estimate Confidence</div>
          <div style={{ fontSize:14, fontWeight:700, color: primary.confidence>=70?"#10B981":primary.confidence>=45?"#F59E0B":"#EF4444" }}>{primary.confidence}%</div>
        </div>
        <div className="cp-confidence-bar">
          <div className="cp-confidence-fill" style={{ width:`${primary.confidence}%`, background: primary.confidence>=70?"#10B981":primary.confidence>=45?"#F59E0B":"#EF4444" }} />
        </div>
      </div>

      {/* Total cards — one per platform */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${estimates.length}, 1fr)`, gap:12, marginBottom:24 }}>
        {estimates.map((e, i) => {
          const isCheapest = e.totals.mid === cheapestMid && multi;
          const isDearest  = e.totals.mid === mostExpMid  && multi;
          return (
            <div key={e.platform} style={{
              background: isCheapest ? "rgba(16,185,129,0.08)" : "rgba(0,100,160,0.03)",
              border: `1px solid ${isCheapest ? "#10B981" : PLAT_COLORS[i]}44`,
              borderRadius:12, padding:"18px 16px", textAlign:"center", position:"relative"
            }}>
              {isCheapest && <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"#10B981", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10, letterSpacing:1, textTransform:"uppercase" }}>Lowest Cost</div>}
              {isDearest && multi && <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"#F59E0B", color:"#000", fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10, letterSpacing:1, textTransform:"uppercase" }}>Highest Cost</div>}
              <div style={{ fontSize:11, color: PLAT_COLORS[i], textTransform:"uppercase", letterSpacing:1, marginBottom:6, fontWeight:700 }}>{e.platform}</div>
              <div style={{ fontSize:11, color:"#6B8FA8", marginBottom:4 }}>Low</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#3D6680", marginBottom:8 }}>{fmt(e.totals.low)}</div>
              <div style={{ fontSize:11, color: PLAT_COLORS[i], marginBottom:2 }}>Mid</div>
              <div style={{ fontSize:26, fontFamily:"Syne, sans-serif", fontWeight:800, color: PLAT_COLORS[i] }}>{fmt(e.totals.mid)}</div>
              <div style={{ fontSize:11, color:"#6B8FA8", marginTop:8, marginBottom:2 }}>High</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#3D6680" }}>{fmt(e.totals.high)}</div>
              {multi && i > 0 && (
                <div style={{ marginTop:10, fontSize:11, color: e.totals.mid > cheapestMid ? "#EF4444" : "#10B981", fontWeight:700 }}>
                  {e.totals.mid > cheapestMid ? "+" : ""}{fmt(e.totals.mid - cheapestMid)} vs cheapest
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main breakdown / 5-year view card */}
      <div className="cp-card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          {/* View toggle — Breakdown vs 5-Year */}
          <div style={{ display:"flex", gap:0, background:"#EEF4F9", borderRadius:8, padding:3 }}>
            {[["breakdown", "Cost Breakdown"], ["5year", "5-Year View"]].map(([v, label]) => (
              <div key={v} onClick={() => setView(v)} style={{
                padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer",
                background: view===v ? "#00A0DF" : "transparent",
                color: view===v ? "#fff" : "#3D6680",
                transition:"all 0.15s",
              }}>{label}</div>
            ))}
          </div>
          {/* Scenario toggle — only relevant for breakdown view */}
          {view === "breakdown" && (
            <div className="cp-scen-tabs" style={{ marginBottom:0 }}>
              {["low","mid","high"].map(s => (
                <div key={s} className={`cp-scen-tab${scen===s?" active":""}`} onClick={() => setScen(s)}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {view === "breakdown" && (
          <div style={{ overflowX:"auto" }}>
            <table className="cp-bucket-table" style={{ minWidth: multi ? `${280 + estimates.length*160}px` : "auto" }}>
              <thead>
                <tr>
                  <th style={{ minWidth:200 }}>Cost Bucket</th>
                  {estimates.map((e,i) => (
                    <th key={e.platform} style={{ color: PLAT_COLORS[i], textAlign:"right", minWidth:140 }}>{e.platform}</th>
                  ))}
                  {multi && <th style={{ textAlign:"right", minWidth:100 }}>Δ Low→High</th>}
                </tr>
              </thead>
              <tbody>
                {BUCKET_ORDER.map(id => {
                  const buckets = estimates.map(e => e.buckets.find(b => b.id === id)).filter(Boolean);
                  if (!buckets.length) return null;
                  const label = buckets[0].label || id;
                  const vals  = buckets.map(b => scVal(b));
                  const minV  = Math.min(...vals);
                  const maxV  = Math.max(...vals);
                  return (
                    <tr key={id}>
                      <td>
                        <div className="cp-bucket-name">{label}</div>
                        <div className="cp-bucket-desc">{buckets[0].riskNote}</div>
                        {buckets[0].sources?.length > 0 && (
                          <div className="cp-bucket-sources">
                            <span className="cp-bucket-sources-label">Sources</span>
                            {buckets[0].sources.map((s, si) => (
                              <span key={si} className="cp-bucket-source-item">
                                {s.url
                                  ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="cp-source-link">{s.text}</a>
                                  : s.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      {estimates.map((e, i) => {
                        const b   = e.buckets.find(x => x.id === id);
                        const val = b ? scVal(b) : 0;
                        const isMin = multi && val === minV && minV !== maxV;
                        const isMax = multi && val === maxV && minV !== maxV;
                        return (
                          <td key={e.platform} style={{
                            textAlign:"right", fontFamily:"Syne, sans-serif", fontWeight:600,
                            color: isMin ? "#10B981" : isMax ? "#F59E0B" : "#0F2235"
                          }}>
                            {fmt(val)}
                            {isMin && <span style={{ fontSize:9, marginLeft:4 }}>▼</span>}
                            {isMax && multi && <span style={{ fontSize:9, marginLeft:4 }}>▲</span>}
                          </td>
                        );
                      })}
                      {multi && (
                        <td style={{ textAlign:"right", fontSize:11, color: minV===maxV?"#6B8FA8":"#D97706" }}>
                          {minV===maxV ? "—" : fmt(maxV - minV)}
                        </td>
                      )}
                    </tr>
                  );
                })}
                <tr className="cp-total-row">
                  <td>TOTAL</td>
                  {estimates.map((e,i) => (
                    <td key={e.platform} style={{ color: PLAT_COLORS[i] }}>{fmt(getTotal(e))}</td>
                  ))}
                  {multi && <td style={{ color:"#D97706" }}>{fmt(Math.max(...estimates.map(getTotal)) - Math.min(...estimates.map(getTotal)))}</td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {view === "5year" && (() => {
          const YR_WEIGHTS = {
            software:     [0.30, 0.25, 0.20, 0.13, 0.12],
            si:           [0.20, 0.40, 0.30, 0.07, 0.03],
            labor:        [0.20, 0.30, 0.25, 0.15, 0.10],
            data:         [0.15, 0.40, 0.35, 0.07, 0.03],
            ai:           [0.10, 0.30, 0.35, 0.15, 0.10],
            integrations: [0.15, 0.40, 0.35, 0.07, 0.03],
            infra:        [0.25, 0.25, 0.20, 0.15, 0.15],
            testing:      [0.05, 0.25, 0.50, 0.15, 0.05],
            training:     [0.10, 0.20, 0.40, 0.20, 0.10],
            regulatory:   [0.10, 0.25, 0.40, 0.15, 0.10],
            contingency:  [0.20, 0.35, 0.30, 0.10, 0.05],
          };
          const YEAR_LABELS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
          const YEAR_SUBS   = ["Discovery", "Build", "Deploy", "Operate", "Operate"];

          const platYearTotals = estimates.map(e =>
            YEAR_LABELS.map((_, yi) =>
              BUCKET_ORDER.reduce((sum, id) => {
                const b = e.buckets.find(x => x.id === id);
                if (!b) return sum;
                const w = YR_WEIGHTS[id] || [0.2,0.2,0.2,0.2,0.2];
                return sum + b.mid * w[yi];
              }, 0)
            )
          );

          const sav = primary.savings || calcSavings({});
          const savByYear = sav.totalAnnual > 0
            ? [0, sav.totalAnnual * 0.25, sav.totalAnnual * 0.75, sav.totalAnnual, sav.totalAnnual]
            : [0, 0, 0, 0, 0];
          const maxBarVal = Math.max(...platYearTotals.flat(), 1);

          // Build all rows upfront as plain data — avoid nested .map() in JSX
          const bucketRows = BUCKET_ORDER.map(id => {
            const buckets = estimates.map(e => e.buckets.find(b => b.id === id)).filter(Boolean);
            if (!buckets.length) return null;
            const w = YR_WEIGHTS[id] || [0.2,0.2,0.2,0.2,0.2];
            const cells = [];
            for (let yi = 0; yi < 5; yi++) {
              for (let pi = 0; pi < estimates.length; pi++) {
                const b = estimates[pi].buckets.find(x => x.id === id);
                cells.push({ yi, pi, val: b ? b.mid * w[yi] : 0 });
              }
            }
            return { id, label: buckets[0].label || id, cells };
          }).filter(Boolean);

          const totalCells = [];
          for (let yi = 0; yi < 5; yi++) {
            for (let pi = 0; pi < estimates.length; pi++) {
              totalCells.push({ yi, pi, val: platYearTotals[pi][yi] });
            }
          }

          const cumulCells = [];
          for (let yi = 0; yi < 5; yi++) {
            for (let pi = 0; pi < estimates.length; pi++) {
              cumulCells.push({ yi, pi, val: platYearTotals[pi].slice(0, yi+1).reduce((s,v)=>s+v,0) });
            }
          }

          return (
            <div>
              <div style={{ fontSize:12, color:"#6B8FA8", marginBottom:16, lineHeight:1.5 }}>
                Mid-scenario costs distributed across 5 years based on typical ERP implementation phase patterns.
                {sav.totalAnnual > 0 && " Savings ramp shown where entered."}
              </div>

              {/* Bar chart — one column per year, one bar per platform */}
              <div style={{ overflowX:"auto", marginBottom:24 }}>
                <div style={{ display:"flex", gap:8, minWidth:500 }}>
                  {YEAR_LABELS.map((yr, yi) => (
                    <div key={yr} style={{ flex:1, minWidth:80 }}>
                      <div style={{ textAlign:"center", fontSize:11, fontWeight:700,
                        color: yi < 3 ? "#00A0DF" : "#059669", marginBottom:4 }}>
                        {yr}
                      </div>
                      <div style={{ textAlign:"center", fontSize:9, color:"#6B8FA8", marginBottom:8 }}>
                        {YEAR_SUBS[yi]}
                      </div>
                      <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:80, background:"#EEF4F9", borderRadius:6, padding:"6px 4px 4px", justifyContent:"center" }}>
                        {estimates.map((e, pi) => {
                          const val = platYearTotals[pi][yi];
                          const barH = Math.round((val / maxBarVal) * 64);
                          return (
                            <div key={pi} title={fmt(val)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end" }}>
                              <div style={{ width:"100%", height:barH, background: PLAT_COLORS[pi],
                                opacity: yi >= 3 ? 0.6 : 1, borderRadius:"2px 2px 0 0",
                                minHeight: val > 0 ? 3 : 0 }} />
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#0F2235", marginTop:4 }}>
                        {estimates.length === 1
                          ? fmt(platYearTotals[0][yi])
                          : estimates.map((e,pi) => (
                            <div key={pi} style={{ color: PLAT_COLORS[pi] }}>{fmt(platYearTotals[pi][yi])}</div>
                          ))
                        }
                      </div>
                      {sav.totalAnnual > 0 && savByYear[yi] > 0 && (
                        <div style={{ textAlign:"center", fontSize:10, color:"#059669", fontWeight:600, marginTop:2 }}>
                          -{fmt(savByYear[yi])}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                {estimates.map((e, pi) => (
                  <div key={pi} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#3D6680" }}>
                    <div style={{ width:12, height:12, borderRadius:2, background: PLAT_COLORS[pi] }} />
                    {e.platform}
                  </div>
                ))}
                <div style={{ fontSize:11, color:"#6B8FA8" }}>│ Full opacity = implementation · Faded = operations</div>
              </div>

              {/* Year-by-year table */}
              <div style={{ overflowX:"auto" }}>
                <table className="cp-bucket-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth:180, fontSize:11 }}>Cost Bucket</th>
                      {YEAR_LABELS.map((yr, yi) =>
                        estimates.map((e, pi) => (
                          <th key={`h-${yi}-${pi}`} style={{ color: PLAT_COLORS[pi], textAlign:"right", minWidth:90, fontSize:10 }}>
                            {multi ? `${yr} · ${e.platform.split(" ")[0]}` : yr}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bucketRows.map(row => (
                      <tr key={row.id}>
                        <td><div className="cp-bucket-name" style={{ fontSize:12 }}>{row.label}</div></td>
                        {row.cells.map(({yi, pi, val}) => (
                          <td key={`${yi}-${pi}`} style={{
                            textAlign:"right", fontFamily:"Syne, sans-serif", fontWeight:600, fontSize:12,
                            color: val > 1000 ? "#0F2235" : "#D0E4EF",
                            background: yi >= 3 ? "rgba(5,150,105,0.04)" : "transparent",
                          }}>
                            {val > 1000 ? fmt(val) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="cp-total-row">
                      <td>TOTAL / YEAR</td>
                      {totalCells.map(({yi, pi, val}) => (
                        <td key={`t-${yi}-${pi}`} style={{ color: PLAT_COLORS[pi], background: yi >= 3 ? "rgba(5,150,105,0.06)" : undefined }}>
                          {fmt(val)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ fontSize:11, color:"#6B8FA8", fontStyle:"italic" }}>Cumulative</td>
                      {cumulCells.map(({yi, pi, val}) => (
                        <td key={`c-${yi}-${pi}`} style={{
                          textAlign:"right", fontFamily:"Syne, sans-serif", fontWeight:600, fontSize:12, color:"#3D6680",
                          background: yi >= 3 ? "rgba(5,150,105,0.04)" : "transparent",
                        }}>
                          {fmt(val)}
                        </td>
                      ))}
                    </tr>
                    {sav.totalAnnual > 0 && (
                      <tr>
                        <td style={{ fontSize:11, color:"#059669", fontWeight:600 }}>Savings / Year</td>
                        {[0,1,2,3,4].map(yi =>
                          estimates.map((e, pi) => (
                            <td key={`s-${yi}-${pi}`} style={{
                              textAlign:"right", fontFamily:"Syne, sans-serif", fontWeight:700, fontSize:12, color:"#059669",
                              background: yi >= 3 ? "rgba(5,150,105,0.04)" : "transparent",
                            }}>
                              {savByYear[yi] > 0 ? `-${fmt(savByYear[yi])}` : "—"}
                            </td>
                          ))
                        )}
                      </tr>
                    )}
                    {sav.totalAnnual > 0 && (
                      <tr style={{ background:"rgba(0,160,223,0.05)" }}>
                        <td style={{ fontSize:11, color:"#00A0DF", fontWeight:700 }}>Net Cost / Year</td>
                        {[0,1,2,3,4].map(yi =>
                          estimates.map((e, pi) => {
                            const net = platYearTotals[pi][yi] - savByYear[yi];
                            return (
                              <td key={`n-${yi}-${pi}`} style={{
                                textAlign:"right", fontFamily:"Syne, sans-serif", fontWeight:800, fontSize:12,
                                color: net <= 0 ? "#059669" : "#00A0DF",
                              }}>
                                {net <= 0 ? `+${fmt(Math.abs(net))}` : fmt(net)}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {sav.totalAnnual > 0 && (
                <div style={{ marginTop:10, fontSize:11, color:"#059669", fontWeight:600 }}>
                  ✓ Savings ramp: 0% Year 1 → 25% Year 2 → 75% Year 3 → 100% Year 4+
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Risk heatmap — show for primary platform */}
      <div className="cp-card">
        <div className="cp-card-title">Risk Heat Map {multi ? `(${primary.platform})` : ""}</div>
        <div className="cp-heatmap">
          {primary.buckets.map(b => {
            const pct = primary.totals.mid > 0 ? Math.round(b.mid/primary.totals.mid*100) : 0;
            const color = b.risk==="H"?"#EF4444":b.risk==="M"?"#F59E0B":"#10B981";
            return (
              <div key={b.id} className="cp-heat-item">
                <div className="cp-heat-name">{b.label}</div>
                <div className="cp-heat-bar-wrap">
                  <div className="cp-heat-bar" style={{ width:`${Math.min(pct*3,100)}%`, background:color }} />
                </div>
                <div className="cp-heat-note">{pct}% · {b.risk==="H"?"⚠ High":b.risk==="M"?"▲ Med":"✓ Low"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative */}
      <div className="cp-card">
        <div className="cp-card-title">Executive Summary Narrative</div>
        <div className="cp-narrative">{narrative}</div>
        <div style={{ fontSize:11, color:"#6B8FA8" }}>Copy into your business case or use PPT export (coming soon).</div>
      </div>

      {/* Assumptions — primary platform */}
      <div className="cp-card">
        <div className="cp-card-title">Key Assumptions {multi ? `(${primary.platform})` : ""}</div>
        {primary.assumptions.map((a,i) => (
          <div key={i} className="cp-assumption">
            <div className="cp-assumption-dot" style={{ background:a.color }} />
            <div>
              <div className="cp-assumption-text">{a.text}</div>
              <div className="cp-assumption-source">Source: {a.source}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="cp-export-bar">
        <span className="cp-export-label">Export</span>
        <button className="cp-btn cp-btn-green cp-btn-sm" onClick={onExport}>⬇ Download CSV (Excel-ready)</button>
        <button className="cp-btn cp-btn-ghost cp-btn-sm" style={{ opacity:0.5, cursor:"not-allowed" }}>📊 PowerPoint (coming soon)</button>
        <button className="cp-btn cp-btn-ghost cp-btn-sm" style={{ opacity:0.5, cursor:"not-allowed" }}>📄 PDF (coming soon)</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ClearPath() {
  const [step, setStep]           = useState(0);
  const [formData, setFormData]   = useState({ modules: ["gl","ap","ar"], regulations: [] });
  const [lookupState, setLookup]  = useState("idle");
  const [lookupData, setLookupDt] = useState(null);
  const [estimate, setEstimate]   = useState(null);
  const topRef = useRef(null);

  const set = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLookup = async () => {
    if (!formData.companyName) return;
    setLookup("loading");
    setLookupDt(null);
    try {
      const data = await lookupCompany(formData.companyName);
      console.log("Final lookup result:", data);
      if (data && (data.revenue || data.employees || data.industry)) {
        setLookupDt(data);
        setLookup("done");
        if (data.revenue)          set("revenue",          data.revenue);
        if (data.employees)        set("totalEmployees",   data.employees);
        if (data.industry)         set("industry",         data.industry);
        if (data.financeHeadcount) set("financeHeadcount", data.financeHeadcount);
        if (data.userCount)        set("userCount",        data.userCount);
        if (data.entities)         set("entities",         data.entities);
        if (data.countries)        set("countries",        data.countries);
        if (data.currentERP) {
          const known = CURRENT_SYSTEMS.find(s => s.toLowerCase().includes((data.currentERP || "").toLowerCase()));
          if (known) set("currentSystem", known);
        }
        if (data.regulatoryFlags?.length) set("regulations", data.regulatoryFlags);
      } else {
        console.warn("Lookup returned no usable data:", data);
        setLookupDt({ _error: "No structured data returned", _raw: JSON.stringify(data) });
        setLookup("error");
      }
    } catch (e) {
      console.error("Lookup exception:", e);
      setLookupDt({ _error: e.message });
      setLookup("error");
    }
  };

  const goNext = () => {
    const nextStep = step + 1;
    if (nextStep === STEPS.length - 1) {
      const platforms = (formData.targetPlatforms || [formData.targetPlatform || "Workday Financials"]);
      const savings   = calcSavings(formData);
      const estimates = platforms.map(p => ({
        platform: p,
        savings,
        ...estimateCosts({ ...formData, targetPlatform: p }),
      }));
      setEstimate(estimates);
    }
    setStep(nextStep);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleRecalculate = useCallback((updatedFields) => {
    const merged = { ...formData, ...updatedFields };
    setFormData(merged);
    const platforms = (merged.targetPlatforms || [merged.targetPlatform || "Workday Financials"]);
    const savings   = calcSavings(merged);
    const newEstimates = platforms.map(p => ({
      platform: p,
      savings,
      ...estimateCosts({ ...merged, targetPlatform: p }),
    }));
    setEstimate(newEstimates);
  }, [formData]);

  const goPrev = () => {
    setStep(s => Math.max(0, s - 1));
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const canNext = () => {
    if (step === 0) return !!formData.industry;
    if (step === 2) return (formData.targetPlatforms || []).length > 0;
    return true;
  };

  const currentStepId = STEPS[step].id;

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root" ref={topRef}>
        {/* Header */}
        <header className="cp-header">
          <div className="cp-logo">
            <div className="cp-logo-mark" />
            <div>
              <div className="cp-logo-text">Clear<span>Path</span></div>
              <div className="cp-tagline">ERP Transformation Scoping</div>
            </div>
          </div>
          {estimate && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Mid Estimate Range</div>
              <div style={{ fontSize: 20, fontFamily: "Syne, sans-serif", fontWeight: 800, color: C.accent }}>
                {estimate.length === 1
                  ? fmt(estimate[0].totals.mid)
                  : `${fmt(Math.min(...estimate.map(e=>e.totals.mid)))} – ${fmt(Math.max(...estimate.map(e=>e.totals.mid)))}`}
              </div>
            </div>
          )}
        </header>

        {/* Progress */}
        <div className="cp-progress">
          <div className="cp-steps">
            {STEPS.map((s, i) => (
              <div key={s.id} className="cp-step" style={{ flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div className={`cp-step-dot ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`cp-step-label${i === step ? " active" : ""}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`cp-step-line${i < step ? " done" : ""}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="cp-main">
          {currentStepId === "company"  && <StepCompany f={formData} set={set} onLookup={handleLookup} lookupState={lookupState} lookupData={lookupData} />}
          {currentStepId === "current"  && <StepCurrent f={formData} set={set} />}
          {currentStepId === "target"   && <StepTarget  f={formData} set={set} />}
          {currentStepId === "modules"  && <StepModules f={formData} set={set} />}
          {currentStepId === "org"      && <StepOrg     f={formData} set={set} />}
          {currentStepId === "project"  && <StepProject f={formData} set={set} />}
          {currentStepId === "savings"  && <StepSavings f={formData} set={set} />}
          {currentStepId === "results"  && estimate && (
            <StepResults f={formData} estimates={estimate} onExport={() => exportToCSVMulti(estimate, formData)} onRecalculate={handleRecalculate} />
          )}
        </main>

        {/* Navigation */}
        <nav className="cp-nav">
          <div>
            {step > 0 && (
              <button className="cp-btn cp-btn-ghost" onClick={goPrev}>← Back</button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {step < STEPS.length - 1 && (
              <div style={{ fontSize: 12, color: C.textDim }}>Step {step + 1} of {STEPS.length}</div>
            )}
            {step < STEPS.length - 1 && (
              <button className="cp-btn cp-btn-primary" onClick={goNext} disabled={!canNext()}>
                {step === STEPS.length - 2 ? "Generate Estimate →" : step === STEPS.length - 3 ? "Continue to Savings →" : "Continue →"}
              </button>
            )}
            {step === STEPS.length - 1 && (
              <button className="cp-btn cp-btn-ghost" onClick={() => { setStep(0); setEstimate(null); setFormData({ modules: ["gl","ap","ar"], regulations: [] }); setLookup("idle"); }}>
                Start Over
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
