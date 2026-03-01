import React, { useState } from 'react';
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
} from 'lucide-react';
import OnekoCat from './components/OnekoCat';
import GitHubContributions from './components/GitHubContributions';

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
      <div className="h-full w-[1px] bg-white/10 mx-auto relative overflow-hidden">
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
      className={`group relative border border-white/10 bg-white/[0.03] overflow-hidden rounded-2xl ${className} ${span}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.12),
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
  <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-400">
    {children}
  </span>
);

const SocialBtn = ({ href, icon, label, primary }) => (
  <a
    href={href}
    target={href.startsWith('mailto') ? undefined : '_blank'}
    rel="noopener noreferrer"
    className={`
      flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all text-sm
      ${primary
        ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
        : 'border border-white/10 text-white hover:bg-white/[0.08] bg-black/20 backdrop-blur-sm'
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
    className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
  >
    {React.cloneElement(icon, { size: 14 })}
    {label}
  </a>
);

const NAV_ITEMS = ['Home', 'Projects', 'Skills', 'Contributions', 'Contact'];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'circOut' }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-auto"
    >
      {/* Desktop nav */}
      <div className="hidden md:flex px-6 py-3 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full justify-center gap-8 shadow-2xl">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-500 transition-all group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-300">Vatsal.</span>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-300 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 px-4 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-3"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/[0.05]"
                >
                  {item}
                </a>
              ))}
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
    icon: <BrainCircuit className="text-white" />,
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
    icon: <Bot className="text-white" />,
    source: 'https://github.com/vatsaljain568/YoutubeRAGBot',
  },
  {
    num: '03',
    title: 'Yappin',
    description:
      'A real-time chat application built with Next.js and TypeScript. Features a modern UI with real-time messaging capabilities.',
    challenge: 'Implemented real-time WebSocket communication with optimistic UI updates and proper state synchronization across clients.',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'Tailwind CSS'],
    icon: <Bot className="text-white" />,
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
    icon: <Zap className="text-white" />,
    source: 'https://github.com/vatsaljain568/Electricity-Cost',
  },
  {
    num: '05',
    title: 'Diabetes Prediction',
    description:
      'Classification model for early diabetes risk prediction using patient health indicators. Exploratory data analysis and multiple ML model comparison.',
    challenge: 'Compared Logistic Regression, Random Forest, and SVM classifiers with cross-validation, achieving robust generalisation on imbalanced medical data.',
    tags: ['Scikit-Learn', 'Pandas', 'Jupyter', 'EDA'],
    icon: <ComputerIcon className="text-white" />,
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
  { name: 'FastAPI', category: 'tool' },
  { name: 'React', category: 'tool' },
  { name: 'Beautiful Soup', category: 'tool' },
  { name: 'Docker', category: 'tool' },
  { name: 'Scikit-Learn', category: 'tool' },
];

// ─── Main App ────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <div className="bg-[#050505] min-h-screen text-gray-200 selection:bg-purple-500/30 selection:text-white font-sans overflow-x-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">


        <section id="home" className="min-h-screen flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/20">
              <img
                src="/PROFILE.JPG"
                alt="Vatsal Jain"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tight"
            >
              I am <span className="relative inline-block italic text-purple-300">Vatsal<OnekoCat /></span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 max-w-4xl leading-snug"
            >
              AI Engineer building production systems with{' '}
              <span className="text-white">LLMs</span>,{' '}
              <span className="text-white">RAG</span>, and{' '}
              <span className="text-white">Agentic Workflows</span>.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 sm:items-center mt-12 border-t border-dashed border-white/10 pt-8"
          >
            <a
              href="https://drive.google.com/file/d/1SiSNeGvLJqOwsCDkVMabOYgfGBnmnWbx/view?usp=drive_link"
              download="Vatsal_Jain_Resume.pdf"
              className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all w-fit text-sm"
            >
              Download Resume
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-mono text-gray-500">AVAILABLE FOR WORK</span>
            </div>
          </motion.div>
        </section>

        {/* ── SELECTED WORKS ── */}
        <section id="projects" className="py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white">Selected Works</h2>
            <span className="hidden md:block text-xs font-mono text-gray-500">
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
        <section id="skills" className="py-24 md:py-32 relative">
          <div className="flex items-end gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white">Technical Arsenal</h2>
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
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.06)' }}
                className="p-5 border border-white/10 bg-white/[0.03] rounded-xl cursor-default transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                  {skill.category === 'ai' && (
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-60" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs font-mono text-gray-600 mt-6">
            <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 align-middle opacity-60" />
            AI / ML stack
          </p>
        </section>

        {/* ── OPEN SOURCE CONTRIBUTIONS ── */}
        <GitHubContributions username="vatsaljain568" />

        {/* ── CONTACT / FOOTER ── */}
        <footer id="contact" className="py-20 border-t border-white/10">
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/20 blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                Let&apos;s build something intelligent.
              </h2>
              <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                I&apos;m seeking roles in Applied AI Engineering — from LLM orchestration and RAG systems to agentic tooling. If you&apos;re building the future, I want to help ship it.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <SocialBtn href="mailto:jain.vatsal2006@gmail.com" icon={<Mail />} label="Email Me" primary />
                <SocialBtn href="https://github.com/vatsaljain568" icon={<Github />} label="GitHub" />
                <SocialBtn href="https://www.linkedin.com/in/vatsal-jain-69b903321/" icon={<Linkedin />} label="LinkedIn" />
                <SocialBtn href="https://x.com/Vatsalj02855578" icon={<Twitter />} label="Twitter" />
              </div>

              <div className="mt-16 text-[10px] font-mono text-gray-600 uppercase flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>© 2025 Vatsal Jain</span>
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
      <div className="p-8 h-full flex flex-col">
        {project.icon && (
          <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
            {project.icon}
          </div>
        )}
        <div className="absolute top-8 right-8 text-5xl font-serif text-white/[0.06]">
          {project.num}
        </div>
        <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-2 leading-relaxed">{project.description}</p>
        <p className="text-gray-500 text-xs mb-auto leading-relaxed italic">
          {project.challenge}
        </p>
        <div className="flex gap-2 mt-6 flex-wrap">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-dashed border-white/10 flex gap-4">
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