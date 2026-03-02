import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Download,
  ArrowUpRight,
  Bot,
  Zap,
  ComputerIcon,
  BrainCircuit,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import OnekoCat from './components/OnekoCat';
import GitHubContributions from './components/GitHubContributions';

const ThemeContext = createContext({ dark: true, toggle: () => {} });
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return !document.documentElement.classList.contains('light');
    }
    return true;
  });

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Theme Toggle Button ─────────────────────────────────────

const ThemeToggle = ({ className = '' }) => {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full
        border border-[var(--card-border)] bg-[var(--card-bg)]
        hover:bg-[var(--glass)] transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun size={16} className="text-[var(--txt-secondary)]" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon size={16} className="text-[var(--txt-secondary)]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

// ─── Shared Components ───────────────────────────────────────

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed left-0 top-0 bottom-0 w-1 z-50 hidden md:flex flex-col justify-center">
      <div className="h-full w-[1px] bg-[var(--border)] mx-auto relative overflow-hidden">
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 left-0 w-full h-full bg-purple-500 origin-top"
        />
      </div>
    </div>
  );
};

const SpotlightCard = ({ children, className = '', span = '' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`group relative border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden rounded-2xl theme-transition ${className} ${span}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--spotlight-rgb), 0.12),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

const Badge = ({ children }) => (
  <span className="px-2 py-1 text-[10px] font-mono border border-[var(--badge-border)] rounded bg-[var(--badge-bg)] text-[var(--badge-text)] theme-transition">
    {children}
  </span>
);

const SocialBtn = ({ href, icon, label, primary }) => (
  <a
    href={href}
    target={href.startsWith('mailto') ? undefined : '_blank'}
    rel="noopener noreferrer"
    className={`
      flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all text-xs sm:text-sm theme-transition
      ${primary
        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
        : 'border border-[var(--card-border)] text-[var(--txt)] hover:bg-[var(--glass)] bg-[var(--card-bg)] backdrop-blur-sm'
      }
    `}
  >
    {React.cloneElement(icon, { size: 16 })}
    {label}
  </a>
);

const ProjectLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-xs font-mono text-[var(--txt-muted)] hover:text-[var(--txt)] transition-colors"
  >
    {React.cloneElement(icon, { size: 14 })}
    {label}
  </a>
);

const NAV_ITEMS = ['Home', 'Projects', 'Skills', 'Contributions', 'Contact'];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'circOut' }}
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* ── Desktop bar (≥1024px) — full pill with links ── */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-3 bg-[var(--nav-bg)] backdrop-blur-lg border border-[var(--card-border)] rounded-full shadow-2xl theme-transition">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[11px] xl:text-xs font-mono uppercase tracking-widest text-[var(--txt-secondary)] hover:text-[var(--txt)] transition-colors relative group whitespace-nowrap"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-500 transition-all group-hover:w-full" />
          </a>
        ))}
        <div className="w-px h-4 bg-[var(--border)]" />
        <ThemeToggle />
      </div>

      {/* ── Mobile / Tablet bar (<1024px) — compact pill with hamburger + theme ── */}
      <div className="lg:hidden flex flex-col items-end">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-[var(--nav-bg)] backdrop-blur-lg border border-[var(--card-border)] rounded-full shadow-2xl theme-transition">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--glass)] transition-colors active:scale-95"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={16} className="text-[var(--txt-secondary)]" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={16} className="text-[var(--txt-secondary)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav-menu"
              role="menu"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-2 w-48 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--dropdown-bg)] backdrop-blur-xl shadow-2xl theme-transition"
            >
              <div className="flex flex-col py-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="px-5 py-3 text-sm font-mono uppercase tracking-widest text-[var(--txt-secondary)] hover:text-[var(--txt)] active:text-[var(--txt)] hover:bg-[var(--glass)] active:bg-[var(--glass)] transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const PROJECTS = [
  {
    num: '01',
    title: 'AskDB',
    description:
      'Natural-language-to-SQL pipeline with a multi-node LangGraph agent. Parses intent, generates & executes SQL, summarises results, and plans visualisations — all with session persistence.',
    challenge: 'Designed a 5-node agentic graph (Intent → SQL → Executor → Summariser → Visualiser) with DuckDB for in-process analytics and SQLite checkpointing for conversation memory.',
    tags: ['LangGraph', 'LangChain', 'OpenAI', 'FastAPI', 'React', 'DuckDB'],
    icon: <BrainCircuit className="text-purple-400" />,
    live: 'https://ask-db-rho.vercel.app/',
    source: 'https://github.com/vatsaljain568/AskDB',
  },
  {
    num: '02',
    title: 'YouTube RAGBot',
    description:
      'Retrieval-Augmented Generation chatbot that lets you ask questions about any YouTube video. Fetches transcripts, chunks them, embeds with HuggingFace, and retrieves context via Chroma for accurate answers.',
    challenge: 'Built an end-to-end RAG pipeline: transcript extraction → recursive splitting → MiniLM-L6-v2 embeddings → Chroma vector store → DeepSeek LLM generation with source attribution.',
    tags: ['LangChain', 'HuggingFace', 'ChromaDB', 'RAG', 'Streamlit'],
    icon: <Bot className="text-purple-400" />,
    source: 'https://github.com/vatsaljain568/YoutubeRAGBot',
  },
  {
    num: '03',
    title: 'Yappin',
    description:
      'A real-time chat application built with Next.js and TypeScript. Features a modern UI with real-time messaging capabilities.',
    challenge: 'Implemented real-time WebSocket communication with optimistic UI updates and proper state synchronization across clients.',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Tailwind CSS'],
    icon: <Bot className="text-purple-400" />,
    live: 'https://yappin-chi.vercel.app',
    source: 'https://github.com/vatsaljain568/Yappin',
  },
  {
    num: '04',
    title: 'Electricity Cost Predictor',
    description:
      'ML system that predicts monthly electricity costs for properties by analysing environmental, operational, and structural features with ensemble methods.',
    challenge: 'Achieved high accuracy with XGBoost ensembles, feature engineering on 15+ property attributes, and served predictions via a FastAPI REST endpoint.',
    tags: ['Scikit-Learn', 'XGBoost', 'FastAPI', 'Pandas'],
    icon: <Zap className="text-purple-400" />,
    source: 'https://github.com/vatsaljain568/Electricity-Cost',
  },
  {
    num: '05',
    title: 'Diabetes Prediction',
    description:
      'Classification model for early diabetes risk prediction using patient health indicators. Exploratory data analysis and multiple ML model comparison.',
    challenge: 'Compared Logistic Regression, Random Forest, and SVM classifiers with cross-validation, achieving robust generalisation on imbalanced medical data.',
    tags: ['Scikit-Learn', 'Pandas', 'Jupyter', 'EDA'],
    icon: <ComputerIcon className="text-purple-400" />,
    source: 'https://github.com/vatsaljain568/Diabetes-Prediction',
  },
];

const SKILLS = [
  { name: 'LangChain', category: 'ai' },
  { name: 'LangGraph', category: 'ai' },
  { name: 'LangSmith', category: 'ai' },
  { name: 'RAG Pipelines', category: 'ai' },
  { name: 'OpenAI API', category: 'ai' },
  { name: 'HuggingFace', category: 'ai' },
  { name: 'Vector Databases', category: 'ai' },
  { name: 'MCP Servers', category: 'ai' },
  { name: 'Machine Learning', category: 'ai' },
  { name: 'Deep Learning', category: 'ai' },
  { name: 'Python', category: 'lang' },
  { name: 'Java', category: 'lang' },
  { name: 'Express', category: 'tool' },
  { name: 'MongoDB', category: 'tool' },
  { name: 'FastAPI', category: 'tool' },
  { name: 'React', category: 'tool' },
  { name: 'Beautiful Soup', category: 'tool' },
  { name: 'Docker', category: 'tool' },
  { name: 'Scikit-Learn', category: 'tool' },
];


export default function Portfolio() {
  return (
    <ThemeProvider>
      <PortfolioInner />
    </ThemeProvider>
  );
}

function PortfolioInner() {
  const { dark } = useTheme();

  return (
    <div className="bg-[var(--surface)] min-h-screen text-[var(--txt)] selection:bg-purple-500/30 selection:text-white font-sans overflow-x-hidden theme-transition">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">


        <section id="home" className="min-h-screen flex flex-col justify-center pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[var(--card-border)] shadow-2xl shadow-purple-900/20 theme-transition">
              <img
                src="/vatsal.jpeg"
                alt="Vatsal Jain"
                className="w-full h-full object-cover scale-125"
              />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-[var(--txt)] leading-[0.9] tracking-tight"
            >
              I am <span className="relative inline-block italic text-purple-400">Vatsal<OnekoCat /></span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-[var(--txt-secondary)] max-w-4xl leading-snug"
            >
              AI Engineer building production systems with{' '}
              <span className="text-[var(--txt)]">LLMs</span>,{' '}
              <span className="text-[var(--txt)]">RAG</span>, and{' '}
              <span className="text-[var(--txt)]">Agentic Workflows</span>.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center mt-8 sm:mt-12 border-t border-dashed border-[var(--border)] pt-6 sm:pt-8"
          >
            <a
              href="https://drive.google.com/file/d/1SiSNeGvLJqOwsCDkVMabOYgfGBnmnWbx/view?usp=drive_link"
              download="Vatsal_Jain_Resume.pdf"
              className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all w-fit text-sm shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            >
              Download Resume
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-mono text-[var(--txt-muted)]">AVAILABLE FOR WORK</span>
            </div>
          </motion.div>
        </section>

        {/* ── SELECTED WORKS ── */}
        <section id="projects" className="py-16 sm:py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--txt)]">Selected Works</h2>
            <span className="hidden md:block text-xs font-mono text-[var(--txt-muted)]">
              ({String(PROJECTS.length).padStart(2, '0')})
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <StandardProject key={project.num} project={project} />
            ))}
          </div>
        </section>

        {/* ── TECHNICAL ARSENAL ── */}
        <section id="skills" className="py-16 sm:py-24 md:py-32 relative">
          <div className="flex items-end gap-3 sm:gap-4 mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--txt)]">Technical Arsenal</h2>
            <div className="h-px bg-purple-500/30 flex-1 mb-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.03 }}
                className="p-3.5 sm:p-5 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-xl cursor-default group hover:bg-[var(--glass)] theme-transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[var(--txt-secondary)] group-hover:text-[var(--txt)] transition-colors">
                    {skill.name}
                  </span>
                  {skill.category === 'ai' && (
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-60" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs font-mono text-[var(--txt-muted)] mt-6">
            <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 align-middle opacity-60" />
            AI / ML stack
          </p>
        </section>

        {/* ── OPEN SOURCE CONTRIBUTIONS ── */}
        <GitHubContributions username="vatsaljain568" />

        {/* ── CONTACT / FOOTER ── */}
        <footer id="contact" className="py-12 sm:py-16 md:py-20 border-t border-[var(--border)] theme-transition">
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 md:p-16 text-center relative overflow-hidden theme-transition">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-[var(--txt)] mb-4 sm:mb-6">
                Let&apos;s build something intelligent.
              </h2>
              <p className="text-[var(--txt-secondary)] text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                I&apos;m seeking roles in Applied AI Engineering from LLM orchestration and RAG systems to agentic tooling. If you&apos;re building the future, I want to help ship it.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <SocialBtn href="mailto:jain.vatsal2006@gmail.com" icon={<Mail />} label="Email Me" primary />
                <SocialBtn href="https://github.com/vatsaljain568" icon={<Github />} label="GitHub" />
                <SocialBtn href="https://www.linkedin.com/in/vatsal-jain-69b903321/" icon={<Linkedin />} label="LinkedIn" />
                <SocialBtn href="https://x.com/Vatsalj02855578" icon={<Twitter />} label="Twitter" />
              </div>

              <div className="mt-16 text-[10px] font-mono text-[var(--txt-muted)] uppercase flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>© 2026 Vatsal Jain</span>
                <span>
                  System Status: <span className="text-green-500">Online</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}


function StandardProject({ project }) {
  return (
    <SpotlightCard>
      <div className="p-5 sm:p-8 h-full flex flex-col">
        {project.icon && (
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--card-bg)] rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-[var(--card-border)] theme-transition">
            {project.icon}
          </div>
        )}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 text-4xl sm:text-5xl font-serif text-[var(--txt)]/[0.06]">
          {project.num}
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-[var(--txt)] mb-2">{project.title}</h3>
        <p className="text-[var(--txt-secondary)] text-sm mb-2 leading-relaxed">{project.description}</p>
        <p className="text-[var(--txt-muted)] text-xs mb-auto leading-relaxed italic">
          {project.challenge}
        </p>
        <div className="flex gap-2 mt-6 flex-wrap">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-dashed border-[var(--border)] flex gap-4">
          {project.live && (
            <ProjectLink href={project.live} icon={<ArrowUpRight />} label="Live Demo" />
          )}
          {project.source && (
            <ProjectLink href={project.source} icon={<Github />} label="Source" />
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
