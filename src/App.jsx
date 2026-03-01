import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Download,
  ArrowUpRight,
  Bot,
  Database,
  Cpu,
  Layers,
  Coffee,
  Code2,
  WashingMachine,
  ComputerIcon
} from 'lucide-react';

// --- Components ---

// 1. The Left Scroll Progress Line (Desktop Only)
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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

// 2. Spotlight Card Component
const SpotlightCard = ({ children, className = "", span = "" }) => {
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group relative border border-white/10 bg-white/5 overflow-hidden rounded-3xl ${className} ${span}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

// 3. Responsive Navbar
const Navbar = () => (
  <motion.nav
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8, ease: "circOut" }}
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto"
  >
    <div className="px-4 md:px-6 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex justify-between md:justify-center md:gap-8 shadow-2xl">
      {['Home', 'Projects', 'Skills', 'Contact'].map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors relative group"
        >
          {item}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-500 transition-all group-hover:w-full"></span>
        </a>
      ))}
    </div>
  </motion.nav>
);

// --- Main App Component ---

export default function Portfolio() {
  return (
    <div className="bg-[#050505] min-h-screen text-gray-200 selection:bg-purple-500/30 selection:text-white font-sans overflow-x-hidden">

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Clean Profile Photo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/20">
              <img
                src="/PROFILE.JPG"
                alt="Vatsal"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] tracking-tight"
            >
              I am <span className="italic text-purple-300">Vatsal</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-400 max-w-4xl leading-tight"
            >
              Building Intelligence with <span className="text-white">Agents</span>, <span className="text-white">RAG</span>, and <span className="text-white">MCP Servers</span>.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col md:flex-row gap-8 md:items-center mt-12 border-t border-dashed border-white/10 pt-8"
          >
            <a
              href="/resume.pdf"
              className="group flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all w-fit"
            >
              Download Resume
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-mono text-gray-400">AVAILABLE FOR WORK</span>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white">Selected Works</h2>
            <span className="hidden md:block text-xs font-mono text-gray-500">(06)</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Project 1 */}
            <SpotlightCard span="md:col-span-2">
              <div className="absolute inset-0">
                <img 
                  src="/AskDB.png"
                  alt='AskDB'
                  className="w-full h-full object-fill" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              </div>
              
              {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black opacity-50" /> */}
              <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                <div className="absolute top-8 right-8 text-8xl font-serif text-white/15 ">01</div>
                <div className="flex gap-2 mb-4">
                  <Badge>React</Badge>
                  <Badge>LangGraph</Badge>
                  <Badge>OpenAI</Badge>
                </div>
                <h3 className="text-3xl font-medium text-white mb-2">AskDB</h3>
                <p className="text-gray-400 max-w-md mb-6"> AI-powered data assistant that lets you interact with your database using plain English</p>
                <div className="flex gap-4">

                  {/* Live Demo */}
                  <a href="https://ask-db-rho.vercel.app/" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<ArrowUpRight />, { size: 14 })}
                    {"Live Demo"}
                  </a>

                  {/* Github Link */}
                  <a href="https://github.com/vatsaljain568/AskDB" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<Github />, { size: 14 })}
                    {"Source"}
                  </a>

                </div>
              </div>
            </SpotlightCard>

            {/* Project 2 */}
            <SpotlightCard>
              <div className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <Bot className="text-white" />
                </div>

                <div className="absolute top-8 right-8 text-6xl font-serif text-white/15 ">02</div>
                
                <h3 className="text-2xl font-medium text-white mb-2">Local Agent</h3>
                <p className="text-gray-400 text-sm mb-auto">ChatBot With Tools</p>
                <div className="flex gap-2 mb-4">
                  <Badge>Streamlit</Badge>
                  <Badge>Persistance</Badge>
                  <Badge>Streaming</Badge>
                </div>
                <div className="mt-6 pt-6 border-t border-dashed border-white/10 flex gap-5">
                  <a href="https://ask-db-rho.vercel.app/" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<ArrowUpRight />, { size: 14 })}
                    {"Live Demo"}
                  </a>
                  <a href="https://github.com/vatsaljain568/AskDB" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<Github />, { size: 14 })}
                    {"Source"}
                  </a>
                </div>
              </div>
            </SpotlightCard>

            {/* Project 3 */}
            <SpotlightCard>
              <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-medium text-white">MCP Server</h3>
                  <span className="text-6xl font-serif text-white/10">03</span>
                </div>
                <p className="text-gray-400 text-2xl mb-6">Coming Soon</p>

                <div className="mt-auto">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-purple-500 w-3/4">
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">Progress</span>
                </div>


              </div>
            </SpotlightCard>

            {/* Project 4 */}
            <SpotlightCard span="md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black opacity-50" />
              <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                <div className="absolute top-8 right-8 text-8xl font-serif text-white/15 ">04</div>
                <div className="flex gap-2 mb-4">
                  <Badge>RAG</Badge>
                  <Badge>VectorDB</Badge>
                  <Badge>LangChain</Badge>
                  <Badge>HuggingFace</Badge>
                </div>
                <h3 className="text-3xl font-medium text-white mb-2">Youtube RAGBot</h3>
                <p className="text-gray-400 max-w-md mb-6"> A chatbot that lets you ask questions about any YouTube video using its transcript</p>
                <div className="flex gap-4">

                  {/* Github Link */}
                  <a href="https://github.com/vatsaljain568/YoutubeRAGBot" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<Github />, { size: 14 })}
                    {"Source"}
                  </a>

                </div>
              </div>
            </SpotlightCard>

            {/* Project 5 */}
            <SpotlightCard>
              <div className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <ComputerIcon className="text-white" />
                </div>

                <div className="absolute top-8 right-8 text-6xl font-serif text-white/15 ">05</div>
                
                <h3 className="text-2xl font-medium text-white mb-2">Electricity-Cost Predictions</h3>
                <p className="text-gray-400 text-sm mb-auto">Predicts monthly electricity costs for a property using ML Models. The system analyzes environmental, operational, and structural features to forecast electricity expenses.
                </p>

                <div className="flex gap-2 mb-4">
                  <Badge>Sckit-Learn</Badge>
                  <Badge>Xg-Boost</Badge>
                  <Badge>FastApi</Badge>
                </div>

                <div className="mt-6 pt-6 border-t border-dashed border-white/10 flex gap-5">
                  <a href="https://github.com/vatsaljain568/Electricity-Cost" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<Github />, { size: 14 })}
                    {"Source"}
                  </a>
                </div>
              </div>
            </SpotlightCard>

            {/* Project 6 */}
            <SpotlightCard span="md:col-span-2">
              <div className="absolute inset-0">
                <img 
                  src="/AskDB.png"
                  alt='AskDB'
                  className="w-full h-full object-fill" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              </div>
              
              {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black opacity-50" /> */}
              <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                <div className="absolute top-8 right-8 text-8xl font-serif text-white/15 ">06</div>
                <div className="flex gap-2 mb-4">
                  <Badge>NextJs</Badge>
                  <Badge>LangGraph</Badge>
                  <Badge>OpenAI</Badge>
                </div>
                <h3 className="text-3xl font-medium text-white mb-2">AskDB</h3>
                <p className="text-gray-400 max-w-md mb-6"> AI-powered data assistant that lets you interact with your database using plain English</p>
                <div className="flex gap-4">

                  {/* Live Demo */}
                  <a href="https://ask-db-rho.vercel.app/" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<ArrowUpRight />, { size: 14 })}
                    {"Live Demo"}
                  </a>

                  {/* Github Link */}
                  <a href="https://github.com/vatsaljain568/AskDB" className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors">
                    {React.cloneElement(<Github />, { size: 14 })}
                    {"Source"}
                  </a>

                </div>
              </div>
            </SpotlightCard>

          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-32 relative">
          <div className="flex items-end gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-white">Technical Arsenal</h2>
            <div className="h-px bg-purple-500/30 flex-1 mb-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="p-6 border border-white/10 bg-white/5 rounded-xl cursor-default transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-300 group-hover:text-white group-hover:font-semibold transition-all">{skill}</span>
                  {/* {skill === "FastAPI" && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>} */}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER (THE PURPLE GLOW VERSION) */}
        <footer id="contact" className="py-20 border-t border-white/10">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-16 text-center relative overflow-hidden">

            {/* The Abstract Purple Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-900/20 blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to deploy?</h2>
              <p className="text-gray-200 text-1xl mb-10 max-w-2xl mx-auto">
                I am currently looking for roles in Applied AI Engineering. If you are building the future, I want to help you code it.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <SocialBtn href="mailto:jain.vatsal2006@gmail.com" icon={<Mail />} label="Email Me" primary />
                <SocialBtn href="https://github.com/vatsaljain568" icon={<Github />} label="GitHub" />
                <SocialBtn href="https://www.linkedin.com/in/vatsal-jain-69b903321/" icon={<Linkedin />} label="LinkedIn" />
                <SocialBtn href="https://x.com/Vatsalj02855578" icon={<Twitter />} label="Twitter / X" />
              </div>

              <div className="mt-20 text-[10px] font-mono text-gray-500 uppercase flex justify-between items-end">
                <span>© 2025 Vatsal</span>
                <span>System Status: <span className="text-green-500">Online</span></span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

// --- Helper Components ---

const Badge = ({ children }) => (
  <span className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded bg-white/5 text-gray-300">
    {children}
  </span>
);

const SocialBtn = ({ href, icon, label, primary }) => (
  <a
    href={href}
    className={`
      flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all
      ${primary
        ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
        : 'border border-white/10 text-white hover:bg-white/10 bg-black/20 backdrop-blur-sm'
      }
    `}
  >
    {React.cloneElement(icon, { size: 18 })}
    {label}
  </a>
);

const skills = [
  "LangChain",
  "LangGraph",
  "LangSmith",
  "MCP-Server",
  "FastAPI",
  "Python",
  "ML - Training",
  "Deep Learning",
  "Java",
  "Full-stack",
  "Vector DB",
  "Docker"
];