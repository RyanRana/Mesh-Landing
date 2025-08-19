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
  //{ q: "Is the information searchable?", a: "Yes. You can ask Mesh anything, and its GPT-powered assistant will search your team’s knowledge graph to return relevant answers and sources." },
  //{ q: "Who can access the knowledge in Mesh?", a: "Only team members with approved Google accounts can access your Mesh instance. Access is controlled by your admin." },
  { q: "Is Mesh secure?", a: "Yes. Mesh servers are self-hosted by your team, with strict access control via Google sign-in and admin-approved emails. All data is isolated and encrypted." },
  { q: "Can I use Mesh with my existing tools?", a: "Yes. Mesh supports import and integration with PDFs, code, images, links, meeting recordings, and more." },
  //{ q: "Can Mesh replace our wiki or knowledge base?", a: "Yes. Mesh not only replaces traditional wikis but enhances them with automatic tagging, graph linking, and GPT-powered search." },
  //{ q: "What makes Mesh different from Notion, Obsidian, or Confluence?", a: "Mesh is hosted privately by your team, uses AI to organize everything automatically, and visualizes knowledge as a browsable multiplayer graph." },
  { q: "Can I export or back up my team’s Mesh content?", a: "Yes. Admins can export all uploaded files, summaries, and the knowledge graph at any time." },
];

const EmptyNode = () => (
  <div
    style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: "#ccc",
      pointerEvents: "none", // disables all mouse events
    }}
    draggable={false}
  />
);



// Hero background graph component
const HeroBackgroundFlow = () => {
  const nodeTypes = useMemo(() => ({ custom: EmptyNode }), []);

 const generateRandomNodes = (count = 150) =>
  Array.from({ length: count }, (_, i) => {
    // Generate a random pastel-like color
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    const randomSize = Math.floor(Math.random() * 80) + 12;
    return {
      id: `node-${i}`,
      type: "custom",
      data: {},
      position: {
        x: Math.random() * 4000,
        y: Math.random() * 2000,
      },
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
    };
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
  preventScrolling={false} // You can keep this false if you want the user to scroll the entire landing page
>
  <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh" />

  <Controls showZoom={false} showFitView={false} showInteractive={false} />
</ReactFlow>


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

    .animate-gradient-mesh {
      background-size: 400% 400%;
      background-position: 0% 50%;
      animation: gradient-mesh 6s ease infinite;
    }
  `}</style>
        <title>Mesh</title>
        <meta name="description" content="Mesh — AI-powered team knowledge system" />
      </Head>

      {/* Header Nav */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Mesh Logo" className="h-12 w-12" />
          <span className="font-semibold text-xl text-gray-900">Mesh</span>
        </div>
        <button  onClick={() => router.push("/waitlist")} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
<section className="w-full min-h-[calc(100vh-64px)] bg-gray-50 relative px-4 py-16 flex flex-col items-center justify-center overflow-hidden animate-fade-in">

  <HeroBackgroundFlow />
  <div className="relative z-10 flex flex-col items-center">
    <div className="text-6xl md:text-6xl font-bold text-center mb-4 text-gray-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
      One searchable brain<br />for your entire team
    </div>
    <div className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mb-6 ">
      Mesh turns docs, threads, meetings, and whiteboards into a dynamic knowledge graph you can query.
    </div>
    <button onClick={() => router.push("/waitlist")} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition duration-300 shadow-lg">
      Get Started
    </button>
  </div>
</section>


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

      {/* FAQ Section */}
      <section className="w-full bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh px-4 py-20">
          <div className="text-2xl md:text-3xl font-bold text-center text-gray-900">
    Frequently Asked Questions
  </div>
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

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-purple text-white p-3 rounded-full shadow-md  transition"
        >↑</button>
      )}
      <style jsx global>{`
        .react-flow__handle {
          opacity: 0;
        }
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
