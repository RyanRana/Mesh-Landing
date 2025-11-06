"use client";

import React, { FC, useState, useEffect, useMemo } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { Shield, UploadCloud, Bot, Brain, MessageCircle, Search } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const faqs = [
  { q: "What is Mesh?", a: "Mesh is a private, AI-powered knowledge system that turns your team’s documents, meetings, whiteboards, and threads into a living, searchable intelligence map." },
  { q: "How does Mesh work?", a: "A team manager hosts a private Mesh server. Members join via invite and authenticate using a Google account tied to an admin-approved email. Uploaded content is ingested, summarized, tagged, and connected by AI." },
  { q: "What types of content can I upload?", a: "You can upload PDFs, images, audio files, code, text, notes, links, and meeting recordings. Mesh supports most common formats used by modern teams." },
  { q: "How does the AI organize the content?", a: "Mesh uses LLMs and embeddings to generate summaries and tag content by topic, uploader, team, and timeline. It builds a dynamic knowledge graph linking everything together." },
  { q: "Is Mesh secure?", a: "Yes. Mesh servers are self-hosted by your team, with strict access control via Google sign-in and admin-approved emails. All data is isolated and encrypted." },
  { q: "Can I use Mesh with my existing tools?", a: "Yes. Mesh supports import and integration with PDFs, code, images, links, meeting recordings, and more." },
  { q: "Can I export or back up my team’s Mesh content?", a: "Yes. Admins can export all uploaded files, summaries, and the knowledge graph at any time." },
];

const EmptyNode = () => (
  <div
    style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: "#ccc",
      pointerEvents: "none",
    }}
    draggable={false}
  />
);

// Demo Knowledge Graph Node Component
const KnowledgeNode = ({ data }: { data: { label: string; type: string; highlight?: boolean } }) => {
  const colors: Record<string, string> = {
    document: "bg-blue-500",
    meeting: "bg-purple-500",
    note: "bg-green-500",
    whiteboard: "bg-orange-500",
    code: "bg-pink-500",
  };
  
  return (
    <div
      className={`${colors[data.type] || "bg-gray-500"} rounded-lg p-3 shadow-lg transition-all duration-300 ${
        data.highlight ? "scale-125 ring-4 ring-yellow-400 z-10" : ""
      }`}
      style={{ minWidth: "100px", maxWidth: "150px" }}
    >
      <div className="text-white text-xs font-semibold">{data.label}</div>
      <div className="text-white/70 text-[10px] mt-1">{data.type}</div>
    </div>
  );
};

// 🔤 Typewriter hook (typing + deleting + pause + blink)
const useTypewriter = (
  phrases: string[],
  options?: { typingMs?: number; deletingMs?: number; holdMs?: number }
) => {
  const typingMs = options?.typingMs ?? 80;
  const deletingMs = options?.deletingMs ?? 40;
  const holdMs = options?.holdMs ?? 1200;

  const [i, setI] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];

    if (!deleting && sub === current.length) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }

    if (deleting && sub === 0) {
      setDeleting(false);
      setI((v) => (v + 1) % phrases.length);
      return;
    }

    const t = setTimeout(() => {
      setSub((v) => v + (deleting ? -1 : 1));
    }, deleting ? deletingMs : typingMs);

    return () => clearTimeout(t);
  }, [phrases, i, sub, deleting, typingMs, deletingMs, holdMs]);

  return {
    text: phrases[i % phrases.length].slice(0, sub),
    isDeleting: deleting,
  };
};

const TypingHeadline: FC = () => {
  const { text } = useTypewriter([
    "developer",
    "marketing",
    "production",
    "creative",
    "sales",
    "research & development",
    "legal",
    "finance",
    "product management"

  ], { typingMs: 75, deletingMs: 35, holdMs: 1100 });

  return (
    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-gray-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] leading-tight">
      <div>One smart searchable brain for all</div>
      <div>
        <span className="text-black"> your </span>
        <span className="text-blue-600 inline">{text}<span className="type-cursor">|</span></span>
        <span className="text-black">teams.</span>
      </div>
    </h1>
  );
};

// Hero background graph component
const HeroBackgroundFlow = () => {
  const nodeTypes = useMemo(() => ({ custom: EmptyNode }), []);

  const generateRandomNodes = (count = 200) =>
    Array.from({ length: count }, (_, i) => {
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
      const randomSize = Math.floor(Math.random() * 80) + 12;
      return {
        id: `node-${i}`,
        type: "custom",
        data: {},
        position: { x: Math.random() * 4000, y: Math.random() * 2000 },
        style: {
          width: randomSize,
          height: randomSize,
          borderRadius: "50%",
          background: randomColor,
          border: "none",
          boxShadow: `0 0 8px ${randomColor}`,
          animation: "pulse 2s ease-in-out infinite",
          transition: "transform 0.3s ease",
        },
        draggable: false,
        selectable: false,
        connectable: false,
      } as any;
    });

  const generateRandomEdges = (nodes: any[]) =>
    nodes.slice(1).map((_, i) => ({
      id: `edge-${i}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true,
      style: { stroke: "#b8b6b6" },
      type: "bezier",
    }));

  const nodes = useMemo(() => generateRandomNodes(), []);
  const edges = useMemo(() => generateRandomEdges(nodes), [nodes]);
  const [flowNodes] = useNodesState(nodes);
  const [flowEdges] = useEdgesState(edges);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        preventScrolling={false}
      >
        <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh" />
        <Controls showZoom={false} showFitView={false} showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

// Demo Section Component
const DemoSection: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const demoNodeTypes = useMemo(() => ({ knowledge: KnowledgeNode }), []);
  
  const demoNodes = useMemo(() => {
    const nodes = [
      { id: "1", data: { label: "Research Paper", type: "document" }, position: { x: 50, y: 50 } },
      { id: "2", data: { label: "Team Meeting", type: "meeting" }, position: { x: 200, y: 50 } },
      { id: "3", data: { label: "Project Notes", type: "note" }, position: { x: 350, y: 50 } },
      { id: "4", data: { label: "Design Board", type: "whiteboard" }, position: { x: 50, y: 150 } },
      { id: "5", data: { label: "Code Review", type: "code" }, position: { x: 200, y: 150 } },
      { id: "6", data: { label: "API Docs", type: "document" }, position: { x: 350, y: 150 } },
    ];
    
    return nodes.map((node) => ({
      ...node,
      type: "knowledge",
      data: {
        ...node.data,
        highlight: searchQuery && node.data.label.toLowerCase().includes(searchQuery.toLowerCase()),
      },
    }));
  }, [searchQuery]);

  const demoEdges = useMemo(() => [
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#3b82f6" } },
    { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#8b5cf6" } },
    { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#10b981" } },
    { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#f97316" } },
    { id: "e5-6", source: "5", target: "6", animated: true, style: { stroke: "#ec4899" } },
    { id: "e1-4", source: "1", target: "4", animated: true, style: { stroke: "#6366f1" } },
  ], []);

  const mobileNodes = useMemo(() => {
    const nodes = [
      { id: "m1", data: { label: "Research Paper", type: "document" }, position: { x: 25, y: 30 } },
      { id: "m2", data: { label: "Team Meeting", type: "meeting" }, position: { x: 25, y: 100 } },
      { id: "m3", data: { label: "Project Notes", type: "note" }, position: { x: 25, y: 170 } },
      { id: "m4", data: { label: "Design Board", type: "whiteboard" }, position: { x: 25, y: 240 } },
    ];
    
    return nodes.map((node) => ({
      ...node,
      type: "knowledge",
      data: {
        ...node.data,
        highlight: searchQuery && node.data.label.toLowerCase().includes(searchQuery.toLowerCase()),
      },
    }));
  }, [searchQuery]);

  const mobileEdges = useMemo(() => [
    { id: "me1-2", source: "m1", target: "m2", animated: true, style: { stroke: "#3b82f6" } },
    { id: "me2-3", source: "m2", target: "m3", animated: true, style: { stroke: "#8b5cf6" } },
    { id: "me3-4", source: "m3", target: "m4", animated: true, style: { stroke: "#10b981" } },
  ], []);

  const [mobileFlowNodes, setMobileFlowNodes, onMobileNodesChange] = useNodesState(mobileNodes);
  const [mobileFlowEdges, setMobileFlowEdges, onMobileEdgesChange] = useEdgesState(mobileEdges);
  const [desktopFlowNodes, setDesktopFlowNodes, onDesktopNodesChange] = useNodesState(demoNodes);
  const [desktopFlowEdges, setDesktopFlowEdges, onDesktopEdgesChange] = useEdgesState(demoEdges);

  useEffect(() => {
    setMobileFlowNodes(mobileNodes);
  }, [mobileNodes, setMobileFlowNodes]);

  useEffect(() => {
    setDesktopFlowNodes(demoNodes);
  }, [demoNodes, setDesktopFlowNodes]);

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          See It In Action
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Experience how your knowledge connects across devices
        </p>
        
        {/* Interactive Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your knowledge graph..."
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 shadow-lg transition-all duration-300"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Side-by-side Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile View */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-gray-500 font-semibold">Mobile View</span>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-[400px] relative overflow-hidden">
              <ReactFlow
                nodes={mobileFlowNodes}
                edges={mobileFlowEdges}
                nodeTypes={demoNodeTypes}
                onNodesChange={onMobileNodesChange}
                onEdgesChange={onMobileEdgesChange}
                fitView
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnScroll={false}
                panOnDrag={false}
                nodesDraggable={false}
                className="bg-transparent"
              >
                <Controls showZoom={false} showFitView={false} showInteractive={false} />
              </ReactFlow>
            </div>
          </div>

          {/* Desktop View */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-gray-500 font-semibold">Desktop View</span>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-[400px] relative overflow-hidden">
              <ReactFlow
                nodes={desktopFlowNodes}
                edges={desktopFlowEdges}
                nodeTypes={demoNodeTypes}
                onNodesChange={onDesktopNodesChange}
                onEdgesChange={onDesktopEdgesChange}
                fitView
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnScroll={false}
                panOnDrag={false}
                nodesDraggable={false}
                className="bg-transparent"
              >
                <Controls showZoom={false} showFitView={false} showInteractive={false} />
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// College Logo Bar Component
const CollegeLogoBar: FC = () => {
  const colleges = [
    "MIT", "Stanford", "Harvard", "Berkeley", "Carnegie Mellon", "Princeton", "Yale", "Columbia"
  ];
  
  // Duplicate for seamless loop
  const collegeList = [...colleges, ...colleges];

  return (
    <div className="relative overflow-hidden bg-white py-12 h-24">
      <div className="flex animate-scroll whitespace-nowrap">
        {collegeList.map((college, i) => (
          <div
            key={i}
            className="mx-8 flex-shrink-0 text-2xl md:text-3xl font-bold text-gray-700 opacity-60 hover:opacity-100 transition-opacity"
          >
            {college}
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showTop, setShowTop] = useState(false);
  const router = useRouter();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="w-full flex flex-col items-center">
      <Head>
        <style>{`
    @keyframes gradient-mesh {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-mesh { background-size: 400% 400%; background-position: 0% 50%; animation: gradient-mesh 6s ease infinite; }
/* add in <style> */
.noise::after{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.05;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><filter id=\"n\"><feTurbulence baseFrequency=\"0.8\" numOctaves=\"2\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.4\"/></svg>');
  mix-blend-mode: multiply;
}

    /* blinking cursor */
    @keyframes type-blink { 0%, 49%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .type-cursor { display:inline-block; width: .5ch; margin-left: 2px; animation: type-blink 1s steps(1) infinite; }
    
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 20s linear infinite;
    }
  `}</style>
        <title>Mesh</title>
        <meta name="description" content="Mesh — AI-powered team knowledge system" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      {/* Header Nav */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Mesh Logo" className="h-12 w-12" />
          <span className="font-semibold text-xl text-gray-900">Mesh</span>
        </div>
        <button onClick={() => router.push("/contact")} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg">
          Get Started with Us Today
        </button>
      </header>

      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-64px)] bg-gray-50 relative px-4 py-16 flex flex-col items-center justify-center overflow-hidden animate-fade-in relative noise">
        <HeroBackgroundFlow />
        <div className="relative z-10 flex flex-col items-center">
          <TypingHeadline />
          <div className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mb-6 ">
            Mesh turns docs, threads, meetings, and whiteboards into a dynamic knowledge graph you can query.
          </div>
          <button onClick={() => router.push("/contact")} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg">
            Get Started with Us Today
          </button>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Section */}
      <section className="w-full bg-white px-4 py-20 animate-slide-up">
        <div className="text-2xl md:text-3xl font-bold text-center text-gray-900  mb-10 ">
          Capabilities
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard title="Private Team Server" description="Managers host secure servers. Members join via invite + Google SSO matched to approved emails." icon={<Shield size={40} />} />
          <FeatureCard title="Upload Anything" description="Share files, images, PDFs, code, audio, links, and more. Mesh supports your team’s entire knowledge stream." icon={<UploadCloud size={40} />} />
          <FeatureCard title="AI-Powered Organization" description="Mesh auto-tags content by topic, timeline, and uploader, generating brief summaries for each asset." icon={<Bot size={40} />} />
          <FeatureCard title="Knowledge Graph" description="Your workspace becomes a dynamic map — like multiplayer Obsidian — built from your team’s shared memory." icon={<Brain size={40} />} />
          <FeatureCard title="Ask Anything" description="GPT-powered assistant tuned to your content answers questions with precision and references." icon={<MessageCircle size={40} />} />
          <FeatureCard title="Built for Search" description="Find anything fast — search by topic, person, date, or keyword. Mesh connects all the dots." icon={<Search size={40} />} />
        </div>
      </section>

      {/* College Adoption Section */}
      <section className="w-full bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by teams at leading institutions
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-12">
            Adopted by research teams, academics, and hackathons at various colleges
          </p>
          <CollegeLogoBar />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh px-4 py-20">
        <div className="text-2xl md:text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</div>
        <div className="mt-10 max-w-3xl w-full space-y-4 pb-20 mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white p-5 rounded-xl shadow-sm cursor-pointer transform transition duration-500 ease-out ${openIndex === i ? 'scale-100' : 'hover:scale-[1.02]'}`}
              onClick={() => toggle(i)}
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{faq.q}</h3>
              {openIndex === i && (
                <p className="text-sm text-gray-700 leading-relaxed mt-2">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-100 text-gray-500 py-6 text-center">
        <span className="text-sm tracking-wide">&copy; {new Date().getFullYear()} Mesh Intelligence, Inc.</span>
      </footer>

      {showTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-purple text-white p-3 rounded-full shadow-md  transition">↑</button>
      )}

      <style jsx global>{`
        .react-flow__handle { opacity: 0; }
      `}</style>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md text-center transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-center items-center mb-3 text-gray-800">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      {hovered && <p className="text-sm text-gray-600 leading-relaxed mt-2">{description}</p>}
    </div>
  );
};

export default LandingPage;