import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   SHARED DATA
══════════════════════════════════════════ */
const FEATURES = [
  { icon: "📄", title: "Document Upload", desc: "PDF, DOCX, or scanned images. OCR handles the rest." },
  { icon: "⚠️", title: "Risk Detection", desc: "Flags risky clauses and red flags automatically." },
  { icon: "🧠", title: "AI Summary", desc: "Plain language — Beginner, Student, or Pro mode." },
  { icon: "💬", title: "Chat With Doc", desc: "Ask questions, get grounded answers instantly." },
  { icon: "⚖️", title: "Fairness Check", desc: "Compare clauses against industry standards." },
  { icon: "🌐", title: "10+ Languages", desc: "Hindi, Marathi, Spanish, Arabic and more." },
];

const DOC_TYPES = [
  "Rental Agreement","Employment Contract","Loan Agreement",
  "NDA","Power of Attorney","Privacy Policy",
  "Sale Deed","Insurance Policy","Partnership Deed",
];

const STEPS = [
  { n: "01", title: "Upload",     desc: "Drop your document. We support PDF, DOCX, and scanned images." },
  { n: "02", title: "Analyze",    desc: "AI runs summary, risk, fairness, and safety score in one go." },
  { n: "03", title: "Understand", desc: "Read, ask questions, translate — know exactly what you're signing." },
];

const SUGGESTED = [
  { cat: "EMPLOYMENT", icon: "💼", q: "What is a non-compete clause?" },
  { cat: "REAL ESTATE", icon: "🏠", q: "What should I check before signing a rental agreement?" },
  { cat: "FINANCE",     icon: "🏦", q: "What are my rights in a loan default?" },
  { cat: "BUSINESS",    icon: "🏢", q: "How does an NDA protect me?" },
];

const DOC_CATS = [
  { icon: "🏠", label: "Housing & Property", sub: "Rent, buy, lease prope…" },
  { icon: "🏦", label: "Loans & Finance",    sub: "Home, personal, car lo…" },
  { icon: "💼", label: "Employment",          sub: "Jobs, NDAs, contracts" },
  { icon: "🏢", label: "Business",            sub: "GST, partnerships, ven…" },
  { icon: "🎓", label: "Education",           sub: "Admissions, scholarsh…" },
  { icon: "🛡️", label: "Insurance",           sub: "Health, life, property" },
];

/* ══════════════════════════════════════════
   SHARED UTILITIES
══════════════════════════════════════════ */
function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   APP SCREENS (warm beige — from screenshots)
══════════════════════════════════════════ */
const AB     = "#F0EBE1";
const AWHITE = "#FFFFFF";
const AGOLD  = "#A0845C";
const AGOLD2 = "#C9A96E";
const AGOLDBG= "#EDE0CC";
const ADARK  = "#1A1612";
const AMID   = "#6B6057";
const AMUTED = "#A09387";
const ABORDER= "#DDD5C8";

function AnalyzerScreen() {
  const [mode, setMode] = useState("Student");
  const [docIdx, setDocIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setDocIdx(i => (i + 1) % DOC_TYPES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={a.screen}>
      <div style={a.pageHeader}>
        <h1 style={a.pageTitle}>Document Analyzer</h1>
        <p style={a.pageSub}>Upload · Analyse · Understand</p>
      </div>

      <div style={a.modeRow}>
        {["Beginner","Student","Professional"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            ...a.modeBtn,
            background: mode===m ? AGOLDBG : "transparent",
            color: mode===m ? AGOLD : AMUTED,
            border: mode===m ? `1.5px solid ${AGOLD2}` : `1.5px solid ${ABORDER}`,
            fontWeight: mode===m ? 600 : 400,
          }}>{m}</button>
        ))}
      </div>

      <div
        style={{ ...a.dropZone, borderColor: dragging ? AGOLD : ABORDER, background: dragging ? AGOLDBG : AWHITE }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
      >
        <div style={a.dropIcon}><span style={{ fontSize:"1.5rem" }}>📄</span></div>
        {file ? (
          <>
            <p style={a.dropTitle}>{file.name}</p>
            <p style={a.dropSub}>Ready to analyze</p>
            <button style={a.analyzeBtn}>Analyze Document →</button>
          </>
        ) : (
          <>
            <p style={a.dropTitle}>Drop your document here</p>
            <p style={a.dropSub}>PDF · DOCX · Images (OCR)</p>
            <label style={a.browseBtn}>
              Browse Files
              <input type="file" accept=".pdf,.docx,.png,.jpg" style={{ display:"none" }}
                onChange={e => setFile(e.target.files[0])} />
            </label>
          </>
        )}
      </div>

      <div style={a.ticker}>
        <span style={a.tickerLabel}>Supports →</span>
        <span style={a.tickerVal} key={docIdx}>{DOC_TYPES[docIdx]}</span>
      </div>

      <div style={a.statsRow}>
        {[["50+","Doc Types"],["10+","Languages"],["0–100","Safety Score"],["100%","Private"]].map(([v,l]) => (
          <div key={l} style={a.statBox}>
            <span style={a.statVal}>{v}</span>
            <span style={a.statLabel}>{l}</span>
          </div>
        ))}
      </div>

      <div style={a.chipRow}>
        {["⚠️ Risk Detection","🧠 AI Summary","💬 Chat With Doc","⚖️ Fairness Check"].map(f => (
          <span key={f} style={a.chip}>{f}</span>
        ))}
      </div>
    </div>
  );
}

function GuidanceScreen() {
  return (
    <div style={a.screen}>
      <div style={a.pageHeader}>
        <h1 style={a.pageTitle}>Document Guide</h1>
        <p style={a.pageSub}>What do you need today?</p>
      </div>

      <div style={a.catGrid}>
        {DOC_CATS.map((cat,i) => (
          <div key={i} style={a.catCard} className="app-card-hover">
            <div style={a.catIconWrap}><span style={{ fontSize:"1.4rem" }}>{cat.icon}</span></div>
            <h3 style={a.catLabel}>{cat.label}</h3>
            <p style={a.catSub}>{cat.sub}</p>
          </div>
        ))}
      </div>

      <div style={a.sectionTitle}>Popular Documents</div>
      <div style={a.docListA}>
        {[
          { icon:"🏠", name:"Rental Agreement",   tag:"Housing" },
          { icon:"💼", name:"Employment Contract", tag:"Employment" },
          { icon:"🏦", name:"Home Loan Agreement", tag:"Finance" },
          { icon:"📝", name:"NDA",                 tag:"Business" },
          { icon:"👤", name:"Power of Attorney",   tag:"Personal" },
        ].map((d,i) => (
          <div key={i} style={a.docRow} className="app-card-hover">
            <div style={a.docRowIcon}>{d.icon}</div>
            <div style={{ flex:1 }}>
              <div style={a.docRowName}>{d.name}</div>
              <div style={a.docRowTag}>{d.tag}</div>
            </div>
            <span style={a.docArrow}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AILawyerScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("English");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    const newMessages = [...messages, { role:"user", content:q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Lex, a friendly AI legal assistant. Provide clear, plain-language legal guidance. Always clarify you're not a licensed lawyer. Keep responses concise. Respond in ${lang}.`,
          messages: newMessages.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text||"").join("") || "Sorry, I couldn't process that.";
      setMessages([...newMessages, { role:"assistant", content:reply }]);
    } catch {
      setMessages([...newMessages, { role:"assistant", content:"Network error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ ...a.screen, paddingBottom:0, display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={a.lexHeader}>
        <div style={a.lexAvatar}><span style={{ fontSize:"1.2rem" }}>⚖️</span></div>
        <div style={{ flex:1 }}>
          <div style={a.lexName}>Lex</div>
          <div style={a.lexStatus}><span style={a.greenDot}/>AI Legal Assistant</div>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)} style={a.langPicker}>
          {["English","Hindi","Marathi","Spanish","Arabic","French"].map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div style={a.chatArea}>
        {messages.length === 0 && (
          <div style={a.chatEmpty}>
            <div style={a.lexBigIcon}><span style={{ fontSize:"2rem" }}>⚖️</span></div>
            <h2 style={a.lexBigTitle}>Ask Lex Anything</h2>
            <p style={a.lexBigSub}>General legal guidance, instantly.<br/>Not a lawyer — but fluent in law.</p>
            <div style={a.suggestedLabel}>SUGGESTED QUESTIONS</div>
            <div style={a.suggestedList}>
              {SUGGESTED.map((sq,i) => (
                <button key={i} onClick={() => send(sq.q)} style={a.suggestedCard} className="app-card-hover">
                  <div style={a.sugIcon}>{sq.icon}</div>
                  <div>
                    <div style={a.sugCat}>{sq.cat}</div>
                    <div style={a.sugQ}>{sq.q}</div>
                  </div>
                  <span style={a.sugArrow}>↗</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
            {m.role==="assistant" && <div style={a.aiBubbleAvatar}><span style={{ fontSize:"0.9rem" }}>⚖️</span></div>}
            <div style={m.role==="user" ? a.userBubble : a.aiBubble}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
            <div style={a.aiBubbleAvatar}><span style={{ fontSize:"0.9rem" }}>⚖️</span></div>
            <div style={{ ...a.aiBubble, padding:"12px 16px" }}><span style={a.typingDots}>● ● ●</span></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div style={a.chatInput}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Ask a legal question…" style={a.inputField}/>
        <button onClick={() => send()} style={a.sendBtn}>›</button>
      </div>
    </div>
  );
}

/* Beige App Shell */
function AppShell({ onBack }) {
  const [tab, setTab] = useState("analyzer");
  const tabs = [
    { id:"analyzer",  label:"Analyzer",  icon:"📄" },
    { id:"guidance",  label:"Guidance",  icon:"📁" },
    { id:"ai-lawyer", label:"AI Lawyer", icon:"💬" },
  ];

  return (
    <div style={a.appShell}>
      <div style={a.appContent}>
        {tab==="analyzer"  && <AnalyzerScreen/>}
        {tab==="guidance"  && <GuidanceScreen/>}
        {tab==="ai-lawyer" && <AILawyerScreen/>}
      </div>
      <nav style={a.tabBar}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...a.tabBtn,
            background: tab===t.id ? AGOLDBG : "transparent",
          }}>
            <span style={{ fontSize:"1.1rem", marginBottom:2 }}>{t.icon}</span>
            <span style={{ ...a.tabLabel, color:tab===t.id?AGOLD:AMUTED, fontWeight:tab===t.id?600:400 }}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ══════════════════════════════════════════
   DARK HOMEPAGE (original — unchanged)
══════════════════════════════════════════ */
const G      = "#c9a96e";
const G2     = "#e2c47a";
const BG     = "#080a10";
const BG2    = "#0b0e18";
const CARD   = "#0f1320";
const BORDER = "#1c2333";

export default function LexNova() {
  const [page, setPage] = useState("home"); // "home" | "app"
  const [scrolled, setScrolled] = useState(false);
  const [docIdx, setDocIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDocIdx(i => (i + 1) % DOC_TYPES.length), 2000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  if (page === "app") return (
    <>
      <style>{APP_CSS + GLOBAL_CSS}</style>
      <AppShell onBack={() => setPage("home")}/>
    </>
  );

  return (
    <div style={c.page}>
      <style>{GLOBAL_CSS + APP_CSS}</style>

      {/* NAV */}
      <nav style={{
        ...c.nav,
        background: scrolled ? "rgba(8,10,16,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid #1c2333" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}>
        <div style={c.navWrap}>
          <div style={c.logo}>
            <div style={c.logoMark}>L</div>
            <span style={c.logoName}>LexNova</span>
          </div>
          <div style={c.navRight}>
            {["features","how-it-works","documents"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={c.navBtn}>
                {id.replace(/-/g," ").replace(/\b\w/g,x=>x.toUpperCase())}
              </button>
            ))}
            <button onClick={() => setPage("app")} style={c.navCta}>Get Started</button>
            <button style={c.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              <span style={{ ...c.hLine, transform:menuOpen?"rotate(45deg) translate(4px,4px)":"" }}/>
              <span style={{ ...c.hLine, opacity:menuOpen?0:1 }}/>
              <span style={{ ...c.hLine, transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"" }}/>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={c.mobileNav}>
            {["features","how-it-works","documents"].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={c.mobileNavBtn}>
                {id.replace(/-/g," ").replace(/\b\w/g,x=>x.toUpperCase())}
              </button>
            ))}
            <button onClick={() => setPage("app")} style={{ ...c.mobileNavBtn, color:G }}>Get Started</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={c.hero}>
        <div style={c.heroBg}/>
        <div style={c.heroContent}>
          <div className="a1" style={c.pill}>AI-Powered Legal Intelligence</div>
          <h1 className="a2" style={c.h1}>
            Understand every<br/>
            <span style={c.accent}>legal document</span><br/>
            you ever sign.
          </h1>
          <p className="a3" style={c.heroSub}>
            LexNova analyzes contracts, flags hidden risks, checks clause fairness,
            and explains everything in plain language.
          </p>
          <div className="a4" style={c.docPill}>
            <span style={c.docPillLabel}>Analyzing →</span>
            <span style={c.docPillVal} key={docIdx}>{DOC_TYPES[docIdx]}</span>
          </div>
          <div className="a5" style={c.heroBtns}>
            <button style={c.btnPrimary} onClick={() => setPage("app")}>Analyze a Document →</button>
            <button style={c.btnOutline} onClick={() => scrollTo("how-it-works")}>How it works</button>
          </div>
          <div className="a6" style={c.heroStats}>
            {[["50+","Document Types"],["10+","Languages"],["0–100","Safety Score"],["100%","Private & Local"]].map(([v,l]) => (
              <div key={l} style={c.heroStat}>
                <span style={c.heroStatVal}>{v}</span>
                <span style={c.heroStatLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="a3 float" style={c.sampleCard}>
          <div style={c.sampleCardHead}>
            <span style={c.sampleCardIcon}>📄</span>
            <div>
              <div style={c.sampleCardFile}>Employment_Contract.pdf</div>
              <div style={c.sampleCardMeta}>12 pages · Analyzed</div>
            </div>
            <span style={c.liveDot}/>
          </div>
          <div style={c.sampleDivider}/>
          {[
            { k:"Risk Score",   v:"68 / 100", col:"#f59e0b" },
            { k:"Safety Score", v:"54 / 100", col:"#ef4444" },
            { k:"Red Flags",    v:"3 found",  col:"#ef4444" },
            { k:"Fairness",     v:"2 Unfair", col:"#f59e0b" },
          ].map(r => (
            <div key={r.k} style={c.sampleRow}>
              <span style={c.sampleKey}>{r.k}</span>
              <span style={{ ...c.sampleVal, color:r.col }}>{r.v}</span>
            </div>
          ))}
          <div style={c.sampleFlag}>
            ⚠️ "Employer may terminate without notice at sole discretion."
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={c.section}>
        <div style={c.wrap}>
          <FadeIn>
            <p style={c.sectionTag}>What it does</p>
            <h2 style={c.h2}>Everything you need to<br/><span style={c.accent}>read between the lines</span></h2>
          </FadeIn>
          <div style={c.featGrid}>
            {FEATURES.map((f,i) => (
              <FadeIn key={i} delay={i*0.06}>
                <div style={c.featCard} className="card-hover">
                  <div style={c.featIconWrap}>{f.icon}</div>
                  <h3 style={c.featTitle}>{f.title}</h3>
                  <p style={c.featDesc}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ ...c.section, background:"#0b0e18" }}>
        <div style={c.wrap}>
          <FadeIn>
            <p style={c.sectionTag}>The process</p>
            <h2 style={c.h2}>Three steps from upload<br/><span style={c.accent}>to full clarity</span></h2>
          </FadeIn>
          <div style={c.stepsRow}>
            {STEPS.map((s,i) => (
              <FadeIn key={i} delay={i*0.12}>
                <div style={c.stepCard}>
                  <div style={c.stepNum}>{s.n}</div>
                  <h3 style={c.stepTitle}>{s.title}</h3>
                  <p style={c.stepDesc}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={c.pipeline}>
              {["Upload","Parse + OCR","Embeddings","LLM Analysis","Results"].map((label,i) => (
                <div key={i} style={c.pipeStep}>
                  <div style={c.pipeCircle}>{i+1}</div>
                  <span style={c.pipeLabel}>{label}</span>
                  {i<4 && <span style={c.pipeArrow}>→</span>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DOCUMENT TYPES */}
      <section id="documents" style={c.section}>
        <div style={c.wrap}>
          <FadeIn>
            <p style={c.sectionTag}>Supported documents</p>
            <h2 style={c.h2}>Works on every kind of<br/><span style={c.accent}>legal document</span></h2>
          </FadeIn>
          <div style={c.docGrid}>
            {[
              { icon:"🏠", label:"Housing & Property", items:["Rental Agreement","Lease Agreement","Sale Deed","Builder Buyer Agreement"] },
              { icon:"💼", label:"Employment",          items:["Employment Contract","NDA","Non-Compete","Offer Letter"] },
              { icon:"🏦", label:"Finance & Loans",     items:["Home Loan","Personal Loan","Mortgage","Credit Card T&C"] },
              { icon:"🏢", label:"Business",            items:["Partnership Deed","MOU","Vendor Agreement","Shareholder Agreement"] },
              { icon:"💻", label:"Digital & Tech",      items:["Terms of Service","Privacy Policy","EULA","App T&C"] },
              { icon:"👤", label:"Personal Legal",      items:["Power of Attorney","Will & Testament","Affidavit","Settlement"] },
            ].map((cat,i) => (
              <FadeIn key={i} delay={i*0.07}>
                <div style={c.docCard} className="card-hover">
                  <div style={c.docCardHead}>
                    <span style={c.docIcon}>{cat.icon}</span>
                    <span style={c.docLabel}>{cat.label}</span>
                  </div>
                  <ul style={c.docList}>
                    {cat.items.map(item => (
                      <li key={item} style={c.docItem}>
                        <span style={c.docDash}>–</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ ...c.section, background:"#0b0e18" }}>
        <div style={c.wrap}>
          <FadeIn>
            <div style={c.ctaBox}>
              <p style={c.sectionTag}>Get started</p>
              <h2 style={{ ...c.h2, textAlign:"center", marginBottom:16 }}>
                Never sign a contract<br/><span style={c.accent}>blind again.</span>
              </h2>
              <p style={c.ctaSub}>
                Runs entirely on your own server using local LLMs.<br/>
                Your documents never leave your machine.
              </p>
              <div style={c.ctaBtns}>
                <button style={c.btnPrimary} onClick={() => setPage("app")}>Try it on App →</button>
              </div>
              <div style={c.ctaTags}>
                {["100% Private","Local LLM","No Cloud","Open Source"].map(t => (
                  <span key={t} style={c.ctaTag}>✓ {t}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={c.footer}>
        <div style={c.wrap}>
          <div style={c.footerRow}>
            <div style={c.logo}>
              <div style={c.logoMark}>L</div>
              <span style={c.logoName}>LexNova</span>
            </div>
            <div style={c.footerLinks}>
              {["Features","How It Works","Documents","GitHub"].map(l => (
                <a key={l} href="#" style={c.footerLink}>{l}</a>
              ))}
            </div>
          </div>
          <div style={c.footerBottom}>
            <span>AI-Powered Legal Document Simplification</span>
            <span>© 2025 LexNova · MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════
   DARK HOMEPAGE STYLES (original)
══════════════════════════════════════════ */
const c = {
  page:{ background:BG, color:"#dde2ed", fontFamily:"'DM Sans', sans-serif", lineHeight:1.65, overflowX:"hidden" },
  nav:{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all 0.3s" },
  navWrap:{ maxWidth:1160, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:{ display:"flex", alignItems:"center", gap:10 },
  logoMark:{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${G},${G2})`, color:"#080a10", fontFamily:"'Cormorant Garamond', serif", fontWeight:700, fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center" },
  logoName:{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.25rem", fontWeight:700, color:"#dde2ed", letterSpacing:"0.02em" },
  navRight:{ display:"flex", alignItems:"center", gap:4 },
  navBtn:{ background:"none", border:"none", color:"#7a8499", fontSize:"0.85rem", cursor:"pointer", padding:"7px 12px", borderRadius:6 },
  navCta:{ background:`linear-gradient(135deg,${G},${G2})`, color:"#080a10", border:"none", borderRadius:8, padding:"8px 18px", fontSize:"0.85rem", fontWeight:600, cursor:"pointer", marginLeft:6 },
  hamburger:{ display:"none", flexDirection:"column", gap:5, background:"none", border:"none", cursor:"pointer", padding:4, marginLeft:8 },
  hLine:{ display:"block", width:20, height:2, background:"#dde2ed", borderRadius:2, transition:"all 0.25s" },
  mobileNav:{ background:CARD, borderTop:`1px solid ${BORDER}`, padding:"12px 16px", display:"flex", flexDirection:"column" },
  mobileNavBtn:{ background:"none", border:"none", color:"#7a8499", padding:"12px 16px", textAlign:"left", cursor:"pointer", fontSize:"0.95rem", borderRadius:6 },
  hero:{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", padding:"100px 24px 80px", overflow:"hidden" },
  heroBg:{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 40% 40%, rgba(201,169,110,0.06) 0%, transparent 65%)`, pointerEvents:"none" },
  heroContent:{ maxWidth:580, position:"relative", zIndex:2, marginLeft:"auto", marginRight:"auto" },
  pill:{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(201,169,110,0.08)", border:"1px solid rgba(201,169,110,0.22)", borderRadius:100, padding:"5px 14px", fontSize:"0.75rem", color:G, letterSpacing:"0.05em", marginBottom:24 },
  h1:{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.6rem,5vw,4.2rem)", fontWeight:700, lineHeight:1.1, marginBottom:20, color:"#edf0f7" },
  accent:{ background:`linear-gradient(90deg,${G},${G2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  heroSub:{ fontSize:"1rem", color:"#7a8499", marginBottom:28, maxWidth:500 },
  docPill:{ display:"inline-flex", alignItems:"center", gap:10, background:CARD, border:`1px solid ${BORDER}`, borderRadius:8, padding:"9px 16px", marginBottom:32, fontSize:"0.85rem" },
  docPillLabel:{ color:"#3d4a60", fontSize:"0.78rem" },
  docPillVal:{ color:G, fontWeight:600, animation:"pop 0.35s ease" },
  heroBtns:{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:44 },
  btnPrimary:{ background:`linear-gradient(135deg,${G},${G2})`, color:"#080a10", border:"none", borderRadius:9, padding:"13px 26px", fontSize:"0.92rem", fontWeight:700, cursor:"pointer" },
  btnOutline:{ background:"transparent", border:`1px solid ${BORDER}`, color:"#7a8499", borderRadius:9, padding:"13px 26px", fontSize:"0.92rem", cursor:"pointer", textDecoration:"none", display:"inline-flex", alignItems:"center" },
  heroStats:{ display:"flex", gap:28, flexWrap:"wrap", paddingTop:28, borderTop:`1px solid ${BORDER}` },
  heroStat:{ display:"flex", flexDirection:"column", gap:2 },
  heroStatVal:{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.6rem", fontWeight:700, color:"#edf0f7" },
  heroStatLabel:{ fontSize:"0.73rem", color:"#3d4a60" },
  sampleCard:{ position:"absolute", right:"max(24px, calc(50% - 560px))", top:"50%", transform:"translateY(-50%)", width:262, background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:20, boxShadow:"0 24px 56px rgba(0,0,0,0.5)", zIndex:3 },
  sampleCardHead:{ display:"flex", alignItems:"center", gap:10, marginBottom:14 },
  sampleCardIcon:{ fontSize:"1.4rem" },
  sampleCardFile:{ fontSize:"0.8rem", color:"#dde2ed", fontWeight:600 },
  sampleCardMeta:{ fontSize:"0.7rem", color:"#3d4a60", marginTop:1 },
  liveDot:{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e", display:"block", marginLeft:"auto" },
  sampleDivider:{ height:1, background:BORDER, marginBottom:12 },
  sampleRow:{ display:"flex", justifyContent:"space-between", marginBottom:8 },
  sampleKey:{ fontSize:"0.76rem", color:"#5a6680" },
  sampleVal:{ fontSize:"0.76rem", fontWeight:600 },
  sampleFlag:{ marginTop:12, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:7, padding:"9px 11px", fontSize:"0.72rem", color:"#f87171", lineHeight:1.55 },
  section:{ padding:"88px 24px" },
  wrap:{ maxWidth:1160, margin:"0 auto" },
  sectionTag:{ fontSize:"0.7rem", letterSpacing:"0.14em", textTransform:"uppercase", color:G, marginBottom:12, fontWeight:600 },
  h2:{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.9rem,3.5vw,2.9rem)", fontWeight:700, lineHeight:1.18, marginBottom:48, color:"#edf0f7" },
  featGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 },
  featCard:{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:"24px 22px", transition:"border-color 0.2s, transform 0.2s" },
  featIconWrap:{ fontSize:"1.5rem", marginBottom:14 },
  featTitle:{ fontSize:"0.95rem", fontWeight:700, color:"#dde2ed", marginBottom:8 },
  featDesc:{ fontSize:"0.84rem", color:"#5a6680", lineHeight:1.65 },
  stepsRow:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:32 },
  stepCard:{ background:BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"26px 22px" },
  stepNum:{ fontFamily:"'Cormorant Garamond', serif", fontSize:"2.8rem", fontWeight:700, color:G, opacity:0.4, lineHeight:1, marginBottom:14 },
  stepTitle:{ fontSize:"1rem", fontWeight:700, color:"#dde2ed", marginBottom:8 },
  stepDesc:{ fontSize:"0.84rem", color:"#5a6680", lineHeight:1.65 },
  pipeline:{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap", gap:8 },
  pipeStep:{ display:"flex", alignItems:"center", gap:7 },
  pipeCircle:{ width:28, height:28, borderRadius:"50%", background:"rgba(201,169,110,0.12)", border:"1px solid rgba(201,169,110,0.3)", color:G, fontSize:"0.72rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
  pipeLabel:{ fontSize:"0.8rem", color:"#5a6680" },
  pipeArrow:{ color:"#232d40", fontSize:"0.9rem", marginLeft:2 },
  docGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 },
  docCard:{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:"22px", transition:"border-color 0.2s" },
  docCardHead:{ display:"flex", alignItems:"center", gap:9, marginBottom:14 },
  docIcon:{ fontSize:"1.2rem" },
  docLabel:{ fontSize:"0.88rem", fontWeight:700, color:"#dde2ed" },
  docList:{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:5 },
  docItem:{ fontSize:"0.8rem", color:"#5a6680", display:"flex", gap:7, alignItems:"center" },
  docDash:{ color:G, opacity:0.45, fontSize:"0.7rem" },
  ctaBox:{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"64px 40px", textAlign:"center" },
  ctaSub:{ color:"#5a6680", fontSize:"0.95rem", marginBottom:32, lineHeight:1.7 },
  ctaBtns:{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:24 },
  ctaTags:{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" },
  ctaTag:{ fontSize:"0.75rem", color:"#3d4a60", background:BG2, border:`1px solid ${BORDER}`, borderRadius:100, padding:"4px 12px" },
  footer:{ borderTop:`1px solid ${BORDER}`, padding:"36px 24px" },
  footerRow:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:16 },
  footerLinks:{ display:"flex", gap:20, flexWrap:"wrap" },
  footerLink:{ color:"#3d4a60", fontSize:"0.82rem", textDecoration:"none" },
  footerBottom:{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"#252f42", flexWrap:"wrap", gap:8 },
};

/* ══════════════════════════════════════════
   BEIGE APP STYLES
══════════════════════════════════════════ */
const a = {
  appShell:{ background:AB, minHeight:"100vh", display:"flex", flexDirection:"column", fontFamily:"'Lora', Georgia, serif", maxWidth:480, margin:"0 auto", position:"relative" },
  appContent:{ flex:1, overflowY:"auto", paddingBottom:90 },
  screen:{ padding:"28px 20px 16px" },
  pageHeader:{ marginBottom:24 },
  pageTitle:{ fontSize:"2rem", fontWeight:700, color:ADARK, lineHeight:1.2, marginBottom:4 },
  pageSub:{ fontSize:"0.88rem", color:AMUTED, fontFamily:"'DM Sans', sans-serif" },
  modeRow:{ display:"flex", gap:8, marginBottom:20 },
  modeBtn:{ flex:1, padding:"8px 6px", borderRadius:100, fontSize:"0.8rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"all 0.2s" },
  dropZone:{ border:`1.5px dashed ${ABORDER}`, borderRadius:18, padding:"40px 24px", textAlign:"center", marginBottom:16, transition:"all 0.25s", cursor:"pointer" },
  dropIcon:{ width:64, height:64, borderRadius:"50%", background:AGOLDBG, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", border:`1px solid ${AGOLD2}` },
  dropTitle:{ fontSize:"1rem", fontWeight:700, color:ADARK, marginBottom:6, fontFamily:"'DM Sans', sans-serif" },
  dropSub:{ fontSize:"0.82rem", color:AMUTED, marginBottom:18, fontFamily:"'DM Sans', sans-serif" },
  browseBtn:{ display:"inline-block", background:"transparent", border:`1.5px solid ${ABORDER}`, borderRadius:100, padding:"9px 28px", fontSize:"0.85rem", color:AMID, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:500 },
  analyzeBtn:{ display:"inline-block", background:AGOLD, color:AWHITE, border:"none", borderRadius:100, padding:"10px 28px", fontSize:"0.88rem", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontWeight:600 },
  ticker:{ display:"flex", alignItems:"center", gap:8, background:AWHITE, border:`1px solid ${ABORDER}`, borderRadius:10, padding:"10px 16px", marginBottom:16 },
  tickerLabel:{ fontSize:"0.75rem", color:AMUTED, fontFamily:"'DM Sans', sans-serif" },
  tickerVal:{ fontSize:"0.85rem", fontWeight:600, color:AGOLD, fontFamily:"'DM Sans', sans-serif", animation:"pop 0.3s ease" },
  statsRow:{ display:"flex", gap:8, marginBottom:16 },
  statBox:{ flex:1, background:AWHITE, border:`1px solid ${ABORDER}`, borderRadius:12, padding:"12px 8px", textAlign:"center" },
  statVal:{ display:"block", fontFamily:"'Lora', serif", fontSize:"1.1rem", fontWeight:700, color:ADARK, marginBottom:2 },
  statLabel:{ display:"block", fontSize:"0.68rem", color:AMUTED, fontFamily:"'DM Sans', sans-serif" },
  chipRow:{ display:"flex", flexWrap:"wrap", gap:8 },
  chip:{ background:AWHITE, border:`1px solid ${ABORDER}`, borderRadius:100, padding:"6px 14px", fontSize:"0.75rem", color:AMID, fontFamily:"'DM Sans', sans-serif" },
  catGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 },
  catCard:{ background:AWHITE, borderRadius:16, padding:"20px 16px", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" },
  catIconWrap:{ width:48, height:48, borderRadius:12, background:AGOLDBG, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:`1px solid ${AGOLD2}` },
  catLabel:{ fontSize:"0.92rem", fontWeight:700, color:ADARK, marginBottom:4, lineHeight:1.3, fontFamily:"'DM Sans', sans-serif" },
  catSub:{ fontSize:"0.75rem", color:AMUTED, fontFamily:"'DM Sans', sans-serif" },
  sectionTitle:{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:AMUTED, fontFamily:"'DM Sans', sans-serif", fontWeight:600, marginBottom:10 },
  docListA:{ display:"flex", flexDirection:"column", gap:8 },
  docRow:{ background:AWHITE, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"transform 0.15s" },
  docRowIcon:{ fontSize:"1.2rem", width:36, height:36, background:AGOLDBG, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" },
  docRowName:{ fontSize:"0.88rem", fontWeight:600, color:ADARK, fontFamily:"'DM Sans', sans-serif", marginBottom:2 },
  docRowTag:{ fontSize:"0.72rem", color:AMUTED, fontFamily:"'DM Sans', sans-serif" },
  docArrow:{ fontSize:"1.4rem", color:AMUTED },
  lexHeader:{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", borderBottom:`1px solid ${ABORDER}`, background:AB },
  lexAvatar:{ width:44, height:44, borderRadius:"50%", background:AGOLDBG, border:`1.5px solid ${AGOLD2}`, display:"flex", alignItems:"center", justifyContent:"center" },
  lexName:{ fontSize:"1rem", fontWeight:700, color:ADARK, fontFamily:"'DM Sans', sans-serif" },
  lexStatus:{ fontSize:"0.75rem", color:AMUTED, display:"flex", alignItems:"center", gap:4, fontFamily:"'DM Sans', sans-serif" },
  greenDot:{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:"#22c55e" },
  langPicker:{ background:"transparent", border:`1px solid ${ABORDER}`, borderRadius:100, padding:"5px 10px", fontSize:"0.78rem", color:AMID, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" },
  chatArea:{ flex:1, overflowY:"auto", padding:"16px 16px 0" },
  chatEmpty:{ textAlign:"center", paddingTop:12 },
  lexBigIcon:{ width:72, height:72, borderRadius:"50%", background:AGOLDBG, border:`1.5px solid ${AGOLD2}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" },
  lexBigTitle:{ fontSize:"1.7rem", fontWeight:800, color:ADARK, marginBottom:8, fontFamily:"'Lora', serif" },
  lexBigSub:{ fontSize:"0.88rem", color:AMUTED, marginBottom:24, lineHeight:1.6, fontFamily:"'DM Sans', sans-serif" },
  suggestedLabel:{ fontSize:"0.68rem", letterSpacing:"0.12em", color:AMUTED, fontFamily:"'DM Sans', sans-serif", fontWeight:600, marginBottom:10, textAlign:"left" },
  suggestedList:{ display:"flex", flexDirection:"column", gap:10, textAlign:"left" },
  suggestedCard:{ background:AWHITE, border:`1px solid ${ABORDER}`, borderRadius:14, padding:"14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", width:"100%", transition:"transform 0.15s, box-shadow 0.15s" },
  sugIcon:{ width:38, height:38, background:AGOLDBG, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 },
  sugCat:{ fontSize:"0.65rem", letterSpacing:"0.1em", color:AMUTED, fontFamily:"'DM Sans', sans-serif", fontWeight:600, marginBottom:3 },
  sugQ:{ fontSize:"0.85rem", fontWeight:600, color:ADARK, fontFamily:"'DM Sans', sans-serif", lineHeight:1.35 },
  sugArrow:{ fontSize:"1rem", color:AMUTED, marginLeft:"auto", flexShrink:0 },
  userBubble:{ background:AGOLD, color:AWHITE, borderRadius:"18px 18px 4px 18px", padding:"11px 15px", maxWidth:"78%", fontSize:"0.87rem", lineHeight:1.55, fontFamily:"'DM Sans', sans-serif" },
  aiBubble:{ background:AWHITE, border:`1px solid ${ABORDER}`, color:ADARK, borderRadius:"18px 18px 18px 4px", padding:"11px 15px", maxWidth:"78%", fontSize:"0.87rem", lineHeight:1.55, fontFamily:"'DM Sans', sans-serif" },
  aiBubbleAvatar:{ width:28, height:28, borderRadius:"50%", background:AGOLDBG, display:"flex", alignItems:"center", justifyContent:"center", marginRight:6, flexShrink:0, alignSelf:"flex-end", marginBottom:4 },
  typingDots:{ color:AMUTED, letterSpacing:"4px", animation:"pulse 1.2s ease infinite" },
  chatInput:{ display:"flex", gap:10, padding:"12px 16px 16px", borderTop:`1px solid ${ABORDER}`, background:AB },
  inputField:{ flex:1, background:AWHITE, border:`1.5px solid ${ABORDER}`, borderRadius:100, padding:"12px 18px", fontSize:"0.88rem", outline:"none", color:ADARK, fontFamily:"'DM Sans', sans-serif" },
  sendBtn:{ width:46, height:46, borderRadius:"50%", background:AGOLD, color:AWHITE, border:"none", fontSize:"1.5rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, lineHeight:1 },
  tabBar:{ position:"sticky", bottom:0, background:AWHITE, borderTop:`1px solid ${ABORDER}`, display:"flex", padding:"6px 16px 10px", gap:4, boxShadow:"0 -2px 16px rgba(0,0,0,0.07)" },
  tabBtn:{ flex:1, border:"none", borderRadius:12, padding:"8px 6px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, transition:"background 0.2s" },
  tabLabel:{ fontSize:"0.72rem", fontFamily:"'DM Sans', sans-serif" },
};

/* ══════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080a10; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #1c2333; border-radius: 4px; }
  @keyframes pop {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .a1 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.1s  both; }
  .a2 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.2s  both; }
  .a3 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.32s both; }
  .a4 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.42s both; }
  .a5 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.52s both; }
  .a6 { animation: rise 0.7s cubic-bezier(.16,1,.3,1) 0.62s both; }
  @keyframes rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .float { animation: bob 5s ease-in-out infinite; }
  @keyframes bob {
    0%,100% { transform: translateY(-50%); }
    50%      { transform: translateY(calc(-50% - 12px)); }
  }
  .card-hover:hover {
    border-color: rgba(201,169,110,0.3) !important;
    transform: translateY(-3px);
  }
  @media (max-width: 860px) { .float { display: none !important; } }
  @media (max-width: 600px) { .hamburger { display: flex !important; } }
`;

const APP_CSS = `
  @keyframes pulse {
    0%,100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  .app-card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(160,132,92,0.15) !important;
  }
`;