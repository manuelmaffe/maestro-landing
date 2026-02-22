"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   ENUNO — Landing Page (Warm Linen Edition)
   Palette: Amber / Honey / Cream / Espresso
   Fonts:  Instrument Serif (display) + DM Sans (body)
   ═══════════════════════════════════════════════════════ */

// ─── Design Tokens ───
const T = {
  amber:    "#C89520",
  amberDk:  "#A87B12",
  gold:     "#E8B93A",
  goldMuted:"#D4A82A",
  honey:    "#F5D76E",
  ink:      "#2C2417",
  body:     "#6B5F4F",
  muted:    "#9A8E7E",
  sage:     "#7BAB5E",
  bg:       "#FFFDF8",
  linen:    "#FAF7F0",
  sand:     "#F3EFE6",
  line:     "rgba(180,160,120,0.12)",
  lineFaint:"rgba(180,160,120,0.06)",
};

// ─── Animated Counter ───
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const isFloat = target % 1 !== 0;
        let s = null;
        const step = (ts) => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1600, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setVal(isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className="k-counter">{val}{suffix}</span>;
}

// ─── Reveal ───
function R({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: v ? 1 : 0,
      transform: v ? "none" : "translateY(32px)",
      transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ─── Icons ───
const ArrowR = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10h10M11 5l5 5-5 5"/></svg>
);
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2.5"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const TeamIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// ─── Data ───
const features = [
  { icon: <CalIcon/>, title: "Todos tus calendarios, unidos", desc: "Google, Outlook, Apple — todos sincronizados en una sola vista. Sin solapamientos, sin doble-agendado, sin revisar múltiples apps." },
  { icon: <LinkIcon/>, title: "Tu disponibilidad real, con un link", desc: "Compartí un link y que el otro elija. EnUno muestra solo los horarios donde realmente estás libre, cruzando todos tus calendarios." },
  { icon: <TeamIcon/>, title: "Coordiná equipos sin el caos", desc: "Encontrá el momento donde todo tu equipo puede reunirse, considerando la disponibilidad real de cada miembro." },
];

const plans = [
  { tier: "Gratis", price: "0", desc: "Para empezar a ordenar tu agenda hoy", items: ["Conectá hasta 2 calendarios","1 link de disponibilidad","Vista unificada de tu semana","Soporte en español"], cta: "Empezar gratis", hot: false },
  { tier: "Individual", price: "1.99", desc: "Para quienes quieren lo máximo de su tiempo", items: ["Calendarios ilimitados","Links ilimitados","Sincronización en tiempo real","Sin múltiples apps","Recordatorios y alertas"], cta: "Probar 14 días gratis", hot: true },
  { tier: "Equipos", price: null, desc: "Coordiná a todo tu equipo sin el caos", items: ["Todo lo del plan Individual","Disponibilidad de cada miembro","Vista de agenda del equipo","Links grupales de reunión","Onboarding dedicado"], cta: "Contactar", hot: false },
];

const stats = [
  { target: 7.6, label: "horas más de foco por semana" },
  { target: 46, label: "menos burnout reportado", suffix: "%" },
  { target: 55, label: "mejora en productividad", suffix: "%" },
  { target: 4, label: "horas menos de overtime semanal" },
];

// ─── Calendar Mockup Data ───
const calBlocks = [
  ["f","9:00","Deep Work"],[null],["f","9:00","Focus"],[null],["f","9:00","Deep Work"],
  ["m","11:00","1:1 Equipo"],["f","10:00","Focus"],["m","11:00","Sprint"],["f","10:00","Focus"],["b","11:30","Buffer"],
  ["b","12:30","Almuerzo"],["m","12:00","Demo"],["b","12:30","Pausa"],["m","12:00","Revisión"],["f","13:00","Cierre"],
];
const bClr = {
  f: { bg: "rgba(200,149,32,0.08)", border: "rgba(200,149,32,0.18)", color: "#A87B12" },
  m: { bg: "rgba(123,171,94,0.08)", border: "rgba(123,171,94,0.2)", color: "#5A8A3E" },
  b: { bg: "rgba(212,168,42,0.07)", border: "rgba(212,168,42,0.16)", color: "#96791A" },
};

// ─── Decorative: concentric rings SVG for hero ───
const HeroRings = () => (
  <svg style={{ position:"absolute", top:"-20%", right:"-15%", width:"70%", height:"140%", opacity:0.035, pointerEvents:"none" }}
    viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[80,140,200,260,320,380,440,500].map(r => (
      <circle key={r} cx="300" cy="300" r={r} stroke="#B49A40" strokeWidth="0.8"/>
    ))}
  </svg>
);

// ─── Dot pattern for sections ───
const DotPattern = ({ opacity = 0.03 }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", opacity,
    backgroundImage: `radial-gradient(circle, ${T.body} 0.6px, transparent 0.6px)`,
    backgroundSize: "24px 24px",
  }}/>
);

export default function EnUnoLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const Pill = ({ label, color }) => (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: T.bg, border: `1px solid ${T.line}`,
      borderRadius: 100, padding: "7px 16px",
      fontSize: 12.5, fontWeight: 500, color: T.ink,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );

  const Check = ({ children }) => (
    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: T.body }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke={T.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {children}
    </span>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: ${T.bg}; color: ${T.ink};
          line-height: 1.65; overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        ::selection { background: rgba(200,149,32,0.15); }

        .k-counter {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400; font-style: italic;
          font-size: clamp(40px, 5.5vw, 64px);
          color: ${T.amber};
          letter-spacing: -0.02em;
          line-height: 1;
        }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

        .k-feat-card { transition: transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s ease; }
        .k-feat-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(180,154,64,0.07); }

        .k-price-card { transition: transform 0.3s cubic-bezier(.16,1,.3,1), box-shadow 0.3s ease, border-color 0.3s ease; }
        .k-price-card:hover { transform: translateY(-4px); box-shadow: 0 16px 44px rgba(180,154,64,0.08); border-color: rgba(200,149,32,0.2) !important; }

        .k-btn-primary {
          display: inline-flex; align-items: center; gap: 10;
          background: ${T.ink}; color: ${T.bg};
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
          padding: 15px 34px; border-radius: 100px;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
          box-shadow: 0 4px 20px rgba(44,36,23,0.12);
        }
        .k-btn-primary:hover {
          background: ${T.amberDk};
          box-shadow: 0 8px 32px rgba(168,123,18,0.2);
          transform: translateY(-2px);
        }

        .k-btn-ghost {
          display: block; text-align: center;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
          padding: 13px 24px; border-radius: 100px;
          text-decoration: none; border: 1.5px solid ${T.line};
          color: ${T.ink}; background: transparent;
          transition: all 0.2s ease;
        }
        .k-btn-ghost:hover {
          border-color: rgba(200,149,32,0.3);
          background: rgba(200,149,32,0.04);
        }

        .k-btn-amber {
          display: block; text-align: center;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
          padding: 14px 24px; border-radius: 100px;
          text-decoration: none; border: none;
          color: #fff; background: ${T.amber};
          box-shadow: 0 4px 16px rgba(200,149,32,0.18);
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
        }
        .k-btn-amber:hover {
          background: ${T.amberDk};
          box-shadow: 0 8px 28px rgba(168,123,18,0.22);
          transform: translateY(-2px);
        }

        .k-serif {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
        }

        /* Hamburger */
        .k-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; margin-right: -8px; }
        .k-hamburger span { display: block; width: 20px; height: 2px; background: ${T.ink}; border-radius: 2px; transition: all 0.3s ease; }
        .k-hamburger span + span { margin-top: 5px; }
        .k-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(3.5px, 3.5px); }
        .k-hamburger.open span:nth-child(2) { opacity: 0; }
        .k-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(3.5px, -3.5px); }

        /* Mobile drawer */
        .k-mobile-drawer {
          display: none;
          position: fixed; top: 68px; left: 0; right: 0; bottom: 0; z-index: 99;
          background: ${T.bg};
          padding: 24px 32px 40px;
          flex-direction: column; gap: 0;
          border-top: 1px solid ${T.line};
          overflow-y: auto;
          animation: slideDown 0.25s cubic-bezier(.16,1,.3,1);
        }
        .k-mobile-drawer.open { display: flex; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

        .k-mobile-drawer a.k-mob-link {
          display: block; padding: 16px 0;
          font-size: 16px; font-weight: 500; color: ${T.ink};
          text-decoration: none; border-bottom: 1px solid ${T.lineFaint};
          transition: color 0.15s;
        }
        .k-mobile-drawer .k-mob-actions {
          display: flex; flex-direction: column; gap: 10; margin-top: 24;
        }

        @media (max-width: 800px) {
          .k-nav-links { display: none !important; }
          .k-hamburger { display: block !important; }
          .k-grid-3 { grid-template-columns: 1fr !important; }
          .k-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .k-mockup-body { grid-template-columns: 1fr !important; }
          .k-mockup-side { border-right: none !important; border-bottom: 1px solid ${T.lineFaint} !important; }
          .k-footer-inner { flex-direction: column !important; }
          .k-hero-h1 { font-size: clamp(40px, 9vw, 80px) !important; }
        }
        @media (max-width: 500px) {
          .k-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ═══════ NAV ═══════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: T.bg,
        borderBottom: `1px solid ${T.line}`,
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 1 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em", color: T.ink }}>En</span>
            <span className="k-serif" style={{ fontSize: 23, color: T.amber, fontStyle: "italic" }}>Uno</span>
          </a>

          {/* Desktop links */}
          <div className="k-nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: T.body, textDecoration: "none", transition: "color 0.2s", letterSpacing: "-0.01em" }}>Producto</a>
            <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: T.body, textDecoration: "none", transition: "color 0.2s", letterSpacing: "-0.01em" }}>Precios</a>
            <a href="#contacto" style={{ fontSize: 14, fontWeight: 500, color: T.body, textDecoration: "none", transition: "color 0.2s", letterSpacing: "-0.01em" }}>Contacto</a>
            <div style={{ width: 1, height: 20, background: T.line, margin: "0 2px" }} />
            <a href="https://maestro-app-omega.vercel.app/?mode=login" style={{
              fontSize: 13.5, fontWeight: 500, color: T.ink,
              textDecoration: "none", transition: "color 0.2s",
              letterSpacing: "-0.01em",
            }}>Ingreso</a>
            <a href="https://maestro-app-omega.vercel.app/?mode=register" style={{
              fontSize: 13.5, fontWeight: 600, color: "#fff",
              padding: "9px 22px", borderRadius: 100,
              background: T.ink,
              textDecoration: "none", transition: "all 0.25s cubic-bezier(.16,1,.3,1)",
              letterSpacing: "-0.01em",
              boxShadow: "0 2px 10px rgba(44,36,23,0.1)",
            }}>Registro</a>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className={`k-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`k-mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <a href="#features" className="k-mob-link" onClick={() => setMobileOpen(false)}>Producto</a>
        <a href="#pricing" className="k-mob-link" onClick={() => setMobileOpen(false)}>Precios</a>
        <a href="#contacto" className="k-mob-link" onClick={() => setMobileOpen(false)}>Contacto</a>
        <div className="k-mob-actions" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          <a href="https://maestro-app-omega.vercel.app/?mode=login" style={{
            display: "block", textAlign: "center",
            fontSize: 15, fontWeight: 500, color: T.ink,
            padding: "13px 24px", borderRadius: 100,
            border: `1.5px solid ${T.line}`,
            textDecoration: "none",
          }}>Ingreso</a>
          <a href="https://maestro-app-omega.vercel.app/?mode=register" style={{
            display: "block", textAlign: "center",
            fontSize: 15, fontWeight: 600, color: "#fff",
            padding: "13px 24px", borderRadius: 100,
            background: T.ink,
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(44,36,23,0.1)",
          }}>Registro</a>
        </div>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section style={{
        position: "relative",
        padding: "96px 0 0",
        background: `
          radial-gradient(ellipse 80% 55% at 50% -8%, rgba(245,215,110,0.12) 0%, transparent 50%),
          radial-gradient(ellipse 45% 40% at 85% 70%, rgba(200,149,32,0.05) 0%, transparent 45%),
          ${T.bg}
        `,
        textAlign: "center",
        overflow: "hidden",
      }}>
        <HeroRings />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative" }}>

          <R>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(200,149,32,0.06)",
              border: `1px solid rgba(200,149,32,0.12)`,
              color: T.amberDk, borderRadius: 100,
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 18px 6px 14px", marginBottom: 36,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.gold, animation: "pulse 2.2s ease-in-out infinite" }} />
              Tu calendario, simplificado
            </div>
          </R>

          <R delay={0.06}>
            <h1 className="k-hero-h1" style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(52px, 7.5vw, 88px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: T.ink,
              maxWidth: 780,
              margin: "0 auto 28px",
            }}>
              Organizá tu agenda.{" "}
              <em style={{ fontStyle: "italic", color: T.amber }}>Fácil.</em>
            </h1>
          </R>

          <R delay={0.12}>
            <p style={{ fontSize: 17, color: T.body, fontWeight: 400, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.7, letterSpacing: "-0.01em" }}>
              Todos tus calendarios en un solo lugar. Compartí tu disponibilidad real con un link y coordiná reuniones sin ir y venir entre apps.
            </p>
          </R>

          <R delay={0.18}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <a href="https://maestro-app-omega.vercel.app/?mode=register" className="k-btn-primary" style={{ fontSize: 16, padding: "17px 40px" }}>
                Conectar mi calendario
                <ArrowR />
              </a>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
                <Check>Plan gratuito para siempre</Check>
                <Check>Sin tarjeta de crédito</Check>
                <Check>Soporte en español</Check>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <Pill label="Google Calendar" color="#4285F4" />
                <Pill label="Outlook Calendar" color="#0078D4" />
              </div>
            </div>
          </R>

          {/* ─── MOCKUP ─── */}
          <R delay={0.24}>
            <div style={{ margin: "64px auto 0", maxWidth: 880, position: "relative" }}>

              <div style={{
                position: "absolute", top: 48, right: 18, zIndex: 5,
                background: T.ink, color: T.honey,
                borderRadius: 100, padding: "7px 16px",
                fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: "0 6px 20px rgba(44,36,23,0.15)",
                animation: "float 3.5s ease-in-out infinite",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.honey, animation: "shimmer 1.8s ease-in-out infinite" }} />
                IA optimizando
              </div>

              <div style={{
                background: T.bg,
                border: `1px solid ${T.line}`,
                borderRadius: 18,
                boxShadow: `0 1px 0 ${T.lineFaint}, 0 40px 80px rgba(44,36,23,0.06), 0 16px 32px rgba(44,36,23,0.04)`,
                overflow: "hidden",
              }}>
                <div style={{
                  background: T.linen, borderBottom: `1px solid ${T.lineFaint}`,
                  padding: "11px 18px", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#E8685A","#F5BF4F","#62C554"].map(c => (
                      <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }}/>
                    ))}
                  </div>
                  <div style={{ flex: 1, textAlign: "center", fontSize: 11.5, color: T.muted, fontWeight: 500, letterSpacing: "0.01em" }}>app.enuno.ai</div>
                </div>

                <div className="k-mockup-body" style={{ display: "grid", gridTemplateColumns: "165px 1fr", minHeight: 310 }}>
                  <div className="k-mockup-side" style={{ background: T.linen, borderRight: `1px solid ${T.lineFaint}`, padding: "18px 14px" }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 12, padding: "0 6px" }}>Semana</div>
                    {[
                      { l: "Esta semana", c: T.amber, active: true },
                      { l: "Focus Time", c: T.sage },
                      { l: "Reuniones", c: "#6B8FC4" },
                      { l: "Tareas", c: "#9B8ABF" },
                    ].map(item => (
                      <div key={item.l} style={{
                        display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 2,
                        fontSize: 12, color: item.active ? T.ink : T.body, fontWeight: item.active ? 600 : 400,
                        background: item.active ? T.bg : "transparent",
                        boxShadow: item.active ? `0 1px 4px rgba(44,36,23,0.05)` : "none",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.c, flexShrink: 0 }}/>
                        {item.l}
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
                      {["LUN","MAR","MIÉ","JUE","VIE"].map(d => (
                        <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: T.muted, paddingBottom: 8 }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
                      {calBlocks.map((b, i) => {
                        if (!b[0]) return <div key={i} style={{ borderRadius: 8, padding: "8px 10px", minHeight: 54, border: `1px dashed ${T.line}`, opacity: 0.4 }}/>;
                        const c = bClr[b[0]];
                        return (
                          <div key={i} style={{
                            borderRadius: 8, padding: "8px 10px", minHeight: 54,
                            display: "flex", flexDirection: "column", justifyContent: "flex-end",
                            background: c.bg, border: `1.5px solid ${c.border}`, color: c.color,
                            fontSize: 10.5, fontWeight: 600,
                          }}>
                            <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.55, marginBottom: 2 }}>{b[1]}</div>
                            {b[2]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: `linear-gradient(transparent, ${T.bg})`, pointerEvents: "none" }}/>
            </div>
          </R>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section style={{
        padding: "52px 0",
        background: T.linen,
        borderTop: `1px solid ${T.line}`,
        borderBottom: `1px solid ${T.line}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div className="k-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {stats.map((s, i) => (
              <R key={i} delay={i * 0.07}>
                <div style={{
                  textAlign: "center", padding: "14px 16px",
                  borderRight: i < 3 ? `1px solid ${T.line}` : "none",
                }}>
                  <Counter target={s.target} suffix={s.suffix || ""} />
                  <span style={{ display: "block", fontSize: 12.5, color: T.body, lineHeight: 1.45, marginTop: 10, letterSpacing: "-0.01em" }}>{s.label}</span>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" style={{ position: "relative", padding: "108px 0", background: T.bg }}>
        <DotPattern opacity={0.025} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          <R>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 className="k-serif" style={{
                fontSize: "clamp(34px, 5vw, 56px)",
                letterSpacing: "-0.025em", lineHeight: 1.08,
                marginBottom: 18, color: T.ink,
              }}>
                Todo en un solo lugar,<br/>sin complicaciones
              </h2>
              <p style={{ fontSize: 16, color: T.body, maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
                EnUno conecta tus calendarios y hace que coordinar sea tan simple como compartir un link.
              </p>
            </div>
          </R>

          <div className="k-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <R key={i} delay={i * 0.1}>
                <div className="k-feat-card" style={{
                  background: T.bg,
                  border: `1px solid ${T.line}`,
                  borderRadius: 16,
                  padding: "32px 28px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 20, left: 0, width: 3, height: 40, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${T.gold}, ${T.amber})` }}/>

                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: "rgba(200,149,32,0.06)",
                    border: `1px solid rgba(200,149,32,0.1)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 22,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 21, fontWeight: 400, letterSpacing: "-0.015em", marginBottom: 10, lineHeight: 1.25 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: T.body, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" style={{
        padding: "108px 0",
        background: `linear-gradient(180deg, ${T.bg} 0%, ${T.linen} 100%)`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <R>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 className="k-serif" style={{
                fontSize: "clamp(34px, 5vw, 56px)",
                letterSpacing: "-0.025em", lineHeight: 1.08,
                marginBottom: 16, color: T.ink,
              }}>
                Empezá gratis,<br/>crecé cuando quieras
              </h2>
              <p style={{ fontSize: 15.5, color: T.body }}>Sin contratos, sin sorpresas. Cancelá cuando quieras.</p>
            </div>
          </R>

          <div className="k-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, maxWidth: 960, margin: "0 auto" }}>
            {plans.map((p, i) => (
              <R key={i} delay={i * 0.1}>
                <div className="k-price-card" style={{
                  background: T.bg,
                  border: p.hot ? `1.5px solid ${T.amber}` : `1px solid ${T.line}`,
                  borderRadius: 18, padding: "36px 28px",
                  position: "relative",
                  boxShadow: p.hot ? `0 24px 56px rgba(200,149,32,0.08)` : "none",
                  height: "100%", display: "flex", flexDirection: "column",
                }}>
                  {p.hot && (
                    <div style={{
                      position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                      background: T.amber, color: "#fff",
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "5px 16px", borderRadius: "0 0 10px 10px",
                    }}>Más popular</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 14 }}>{p.tier}</div>
                  {p.price ? (
                    <div className="k-serif" style={{ fontSize: 52, color: T.ink, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
                      <sup style={{ fontSize: 22, verticalAlign: "super", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>$</sup>
                      {p.price}
                      <sub style={{ fontSize: 15, fontWeight: 400, color: T.muted, letterSpacing: 0, fontFamily: "'DM Sans', sans-serif" }}>/mes</sub>
                    </div>
                  ) : (
                    <div className="k-serif" style={{ fontSize: 40, fontStyle: "italic", color: T.ink, lineHeight: 1, marginBottom: 8, paddingTop: 6 }}>A medida</div>
                  )}
                  <div style={{ fontSize: 13, color: T.body, marginBottom: 28 }}>{p.desc}</div>
                  <div style={{ height: 1, background: T.line, marginBottom: 22 }}/>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 30, flex: 1 }}>
                    {p.items.map(item => (
                      <li key={item} style={{ display: "flex", gap: 9, fontSize: 13.5, color: T.ink, lineHeight: 1.45 }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M3 8.5L6.5 12L13 4" stroke={T.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {p.hot ? (
                    <a href="https://maestro-app-omega.vercel.app/?mode=register" className="k-btn-amber">{p.cta}</a>
                  ) : (
                    <a href="https://maestro-app-omega.vercel.app/?mode=register" className="k-btn-ghost">{p.cta}</a>
                  )}
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "108px 32px",
        background: `
          radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,215,110,0.1) 0%, transparent 60%),
          ${T.linen}
        `,
        borderTop: `1px solid ${T.line}`,
        textAlign: "center",
      }}>
        <DotPattern opacity={0.02} />
        <div style={{ position: "relative" }}>
          <R>
            <h2 className="k-serif" style={{
              fontSize: "clamp(38px, 6vw, 72px)",
              letterSpacing: "-0.03em", lineHeight: 1.04,
              marginBottom: 20, color: T.ink,
            }}>
              Tu agenda, ordenada.<br/>
              <em style={{ fontStyle: "italic", color: T.amber }}>Hoy mismo.</em>
            </h2>
          </R>
          <R delay={0.08}>
            <p style={{ fontSize: 17, color: T.body, marginBottom: 44, lineHeight: 1.65 }}>
              Conectá tus calendarios en menos de 2 minutos. Gratis para siempre.
            </p>
          </R>
          <R delay={0.14}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <a href="https://maestro-app-omega.vercel.app/?mode=register" className="k-btn-primary" style={{ fontSize: 16, padding: "17px 42px" }}>
                Empezar ahora
                <ArrowR />
              </a>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
                <Check>Plan gratuito permanente</Check>
                <Check>Sin tarjeta de crédito</Check>
                <Check>Soporte en español</Check>
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ background: T.bg, borderTop: `1px solid ${T.line}`, padding: "48px 32px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
          <a href="#" style={{ display: "flex", alignItems: "baseline", gap: 1, textDecoration: "none", marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 21, color: T.ink }}>En</span>
              <span className="k-serif" style={{ fontSize: 23, color: T.amber, fontStyle: "italic" }}>Uno</span>
          </a>
          <p style={{ fontSize: 13, color: T.body, lineHeight: 1.55 }}>IA para tu agenda. Creado para LATAM.</p>
          <div style={{ height: 1, width: 60, background: T.line, margin: "12px 0" }}/>
          <span style={{ fontSize: 12, color: T.muted }}>© 2025 EnUno. Hecho con ♥ en América Latina.</span>
        </div>
      </footer>
    </>
  );
}
