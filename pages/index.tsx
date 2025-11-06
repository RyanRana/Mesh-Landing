"use client";

import React, { FC, useState, useEffect, useMemo } from "react";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { Shield, UploadCloud, Bot, Brain, MessageCircle, Search, FileText, Music, Code, Video, File, StickyNote } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  Node,
  Handle,
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

// SVG Icon Components
const DocumentIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MeetingIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H9L11 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="8" cy="12" r="1" fill={color}/>
    <circle cx="12" cy="12" r="1" fill={color}/>
    <circle cx="16" cy="12" r="1" fill={color}/>
  </svg>
);

const NoteIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WhiteboardIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M7 7H17M7 11H17M7 15H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 17L11 15L9 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="16 18 22 12 16 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="8 6 2 12 8 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const AudioIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M19.07 4.93C19.6599 5.51992 20.0099 6.26992 20.0099 7.05C20.0099 7.83008 19.6599 8.58008 19.07 9.17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M20.24 2.76C21.4201 3.93995 22.0099 5.49995 22.0099 7.05C22.0099 8.60005 21.4201 10.1601 20.24 11.34" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// Enhanced node component with SVG icons
const SimpleNode = ({ data }: { 
  data: { 
    type: string; 
    selected?: boolean;
    connected?: boolean;
    searchMatch?: boolean;
    searchMatchIndex?: number;
  } 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colors: Record<string, { bg: string; icon: string; border: string }> = {
    document: { bg: "#dbeafe", icon: "#3b82f6", border: "#3b82f6" },
    meeting: { bg: "#ede9fe", icon: "#8b5cf6", border: "#8b5cf6" },
    note: { bg: "#d1fae5", icon: "#10b981", border: "#10b981" },
    whiteboard: { bg: "#fed7aa", icon: "#f97316", border: "#f97316" },
    code: { bg: "#fce7f3", icon: "#ec4899", border: "#ec4899" },
    audio: { bg: "#e0e7ff", icon: "#6366f1", border: "#6366f1" },
  };
  
  const nodeColors = colors[data.type] || { bg: "#f1f5f9", icon: "#64748b", border: "#64748b" };
  const size = data.selected ? 48 : data.connected ? 42 : data.searchMatch ? 40 : 36;
  const iconSize = data.selected ? 20 : data.connected ? 18 : data.searchMatch ? 17 : 16;
  const borderColor = data.selected 
    ? nodeColors.border 
    : data.connected 
    ? `${nodeColors.border}80` 
    : data.searchMatch
    ? `${nodeColors.border}60`
    : `${nodeColors.border}40`;
  
  const getIcon = () => {
    const iconColor = nodeColors.icon;
    switch (data.type) {
      case "document":
        return <DocumentIcon size={iconSize} color={iconColor} />;
      case "meeting":
        return <MeetingIcon size={iconSize} color={iconColor} />;
      case "note":
        return <NoteIcon size={iconSize} color={iconColor} />;
      case "whiteboard":
        return <WhiteboardIcon size={iconSize} color={iconColor} />;
      case "code":
        return <CodeIcon size={iconSize} color={iconColor} />;
      case "audio":
        return <AudioIcon size={iconSize} color={iconColor} />;
      default:
        return <DocumentIcon size={iconSize} color={iconColor} />;
    }
  };
  
  const animationDelay = data.searchMatch && data.searchMatchIndex !== undefined 
    ? `${data.searchMatchIndex * 0.1}s` 
    : "0s";
  
  return (
    <div
      className="transition-all duration-300 cursor-pointer flex items-center justify-center relative"
      style={{ 
        width: size,
        height: size,
        borderRadius: "12px",
        backgroundColor: nodeColors.bg,
        border: `2px solid ${borderColor}`,
        boxShadow: data.selected 
          ? `0 0 0 4px ${nodeColors.border}40, 0 8px 24px ${nodeColors.border}40`
          : data.connected
          ? `0 0 0 2px ${nodeColors.border}40, 0 4px 12px ${nodeColors.border}30`
          : data.searchMatch
          ? `0 0 0 2px ${nodeColors.border}30, 0 4px 8px ${nodeColors.border}20`
          : `0 2px 4px ${nodeColors.border}20`,
        transform: data.selected 
          ? "scale(1.15)" 
          : data.connected 
          ? "scale(1.08)" 
          : data.searchMatch
          ? "scale(1.05)"
          : isHovered 
          ? "scale(1.1)" 
          : "scale(1)",
        transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${animationDelay}`,
        zIndex: data.selected ? 50 : data.connected ? 40 : data.searchMatch ? 35 : 30,
        animation: data.searchMatch ? `search-reveal 0.6s ease-out ${animationDelay} both` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible handles for ReactFlow edge connections - one source and one target */}
      <Handle type="source" position={Position.Right} id="source" style={{ opacity: 0, width: 0, height: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Left} id="target" style={{ opacity: 0, width: 0, height: 0, pointerEvents: "none" }} />
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        opacity: data.selected ? 1 : data.connected ? 0.9 : 0.8,
      }}>
        {getIcon()}
      </div>
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

// Fake data generators
const generateFakeData = (nodeId: string, type: string) => {
  const descriptions: Record<string, string[]> = {
    document: [
      "Comprehensive analysis document covering key project metrics and performance indicators.",
      "Technical specification outlining system architecture and integration patterns.",
      "Research findings document from recent investigation into market trends.",
      "Strategic planning document detailing Q4 objectives and resource allocation.",
      "Project proposal document outlining scope, timeline, and deliverables.",
    ],
    meeting: [
      "Team standup meeting discussing sprint progress and blockers.",
      "Quarterly planning session reviewing goals and setting priorities.",
      "Client presentation meeting covering project status and updates.",
      "Technical architecture review meeting with engineering leads.",
      "Retrospective meeting analyzing team performance and improvements.",
    ],
    note: [
      "Quick capture of key insights from brainstorming session.",
      "Meeting notes highlighting action items and decisions.",
      "Research notes compiling findings from multiple sources.",
      "Ideation notes documenting creative concepts and explorations.",
      "Strategic notes outlining high-level planning considerations.",
    ],
    whiteboard: [
      "System architecture diagram showing component relationships.",
      "User flow visualization mapping customer journey.",
      "Brainstorming session output with ideas and connections.",
      "Technical design sketch illustrating proposed solution.",
      "Organizational structure diagram showing team hierarchy.",
    ],
    code: [
      "API endpoint implementation with authentication and error handling.",
      "Data processing pipeline for transforming raw inputs.",
      "Component library code with reusable UI elements.",
      "Algorithm implementation with optimization techniques.",
      "Database schema migration script with schema changes.",
    ],
    audio: [
      "Team meeting recording covering project updates.",
      "Client interview recording with key insights and feedback.",
      "Training session recording demonstrating new features.",
      "Podcast episode discussing industry trends and best practices.",
      "Voice memo capturing quick thoughts and ideas.",
    ],
  };

  const aiInsights: string[] = [
    "This content shows strong connections to 3 other documents discussing similar topics.",
    "AI analysis suggests this is part of a larger knowledge cluster related to project planning.",
    "Pattern detection indicates this content is frequently referenced by team members.",
    "Semantic analysis reveals high relevance to recent team discussions and decisions.",
    "This node appears central to understanding the project's technical architecture.",
    "Content similarity analysis shows strong alignment with strategic planning documents.",
    "AI identifies this as a key knowledge hub connecting multiple subject areas.",
    "Temporal analysis suggests this content is part of an active discussion thread.",
    "Cross-reference analysis indicates this is frequently cited in related documents.",
    "AI insights reveal this content bridges multiple knowledge domains.",
  ];

  const tagPools: Record<string, string[]> = {
    document: ["planning", "strategy", "research", "analysis", "reference", "technical", "specification"],
    meeting: ["standup", "planning", "review", "sync", "discussion", "collaboration", "alignment"],
    note: ["quick-capture", "ideas", "insights", "notes", "brainstorming", "research", "findings"],
    whiteboard: ["architecture", "design", "flow", "diagram", "visualization", "planning", "sketch"],
    code: ["api", "backend", "frontend", "implementation", "library", "algorithm", "optimization"],
    audio: ["recording", "meeting", "interview", "training", "podcast", "memo", "discussion"],
  };

  const authors = ["Sarah Chen", "Michael Rodriguez", "Emma Thompson", "David Kim", "Lisa Anderson", "James Wilson"];
  const dates = ["2 days ago", "1 week ago", "3 days ago", "5 days ago", "1 day ago", "4 days ago"];

  const descPool = descriptions[type] || descriptions.document;
  const tagsPool = tagPools[type] || tagPools.document;

  // Use nodeId to seed randomness for consistent fake data
  const seed = parseInt(nodeId) || 0;
  
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeId}`,
    description: descPool[seed % descPool.length],
    aiInsight: aiInsights[seed % aiInsights.length],
    tags: tagsPool.sort(() => Math.random() - 0.5).slice(0, 3 + (seed % 3)),
    author: authors[seed % authors.length],
    date: dates[seed % dates.length],
    connections: 2 + (seed % 4),
  };
};

// Fake AI natural language search
const performFakeAISearch = (query: string, nodes: any[]) => {
  if (!query.trim()) return { matchingNodeIds: [], aiResponse: "" };
  
  const lowerQuery = query.toLowerCase();
  const matchingNodes: Array<{ id: string; score: number }> = [];
  
  // Question patterns that indicate type filtering
  const questionPatterns = ["where are", "show me", "find", "what are", "list", "give me", "display"];
  const isQuestion = questionPatterns.some(pattern => lowerQuery.startsWith(pattern) || lowerQuery.includes(pattern + " "));
  
  // Type keywords mapping
  const typeKeywords: Record<string, string[]> = {
    document: ["document", "documents", "file", "files", "paper", "papers", "report", "reports", "spec", "specification"],
    meeting: ["meeting", "meetings", "sync", "standup", "discussion", "discussions", "call", "calls", "conference"],
    note: ["note", "notes", "memo", "memos", "reminder", "reminders"],
    whiteboard: ["whiteboard", "whiteboards", "board", "boards", "diagram", "diagrams", "sketch", "sketches", "visual"],
    code: ["code", "codes", "programming", "api", "implementation", "implementations", "script", "scripts", "function"],
    audio: ["audio", "recording", "recordings", "sound", "sounds", "voice", "podcast", "podcasts"],
  };
  
  // Keywords that match different aspects (for non-question queries)
  const keywords = {
    document: ["document", "file", "paper", "report", "spec", "specification"],
    meeting: ["meeting", "sync", "standup", "discussion", "call", "conference"],
    note: ["note", "notes", "jot", "memo", "reminder", "write"],
    whiteboard: ["whiteboard", "board", "diagram", "sketch", "draw", "visual"],
    code: ["code", "programming", "api", "implementation", "script", "function"],
    audio: ["audio", "recording", "sound", "voice", "podcast", "listen"],
    planning: ["plan", "planning", "roadmap", "strategy", "objective"],
    research: ["research", "study", "analysis", "investigation", "findings"],
    team: ["team", "collaboration", "group", "people", "member"],
    architecture: ["architecture", "system", "design", "structure"],
  };
  
  // If it's a question, extract type and filter strictly
  let targetType: string | null = null;
  if (isQuestion) {
    for (const [type, typeWords] of Object.entries(typeKeywords)) {
      if (typeWords.some(word => lowerQuery.includes(word))) {
        targetType = type;
        break;
      }
    }
  }
  
  nodes.forEach(node => {
    const fakeData = node.data.fakeData;
    const nodeText = `${fakeData.title} ${fakeData.description} ${fakeData.tags.join(" ")} ${fakeData.aiInsight}`.toLowerCase();
    
    // If question with type detected, only include matching type
    if (isQuestion && targetType) {
      if (node.data.type === targetType) {
        matchingNodes.push({ id: node.id, score: 10 });
      }
      return; // Skip keyword matching for question queries
    }
    
    // Regular keyword matching (non-question queries)
    let score = 0;
    
    // Type matching
    Object.entries(keywords).forEach(([key, words]) => {
      if (words.some(word => lowerQuery.includes(word))) {
        if (key === node.data.type || nodeText.includes(key)) {
          score += 3;
        }
        if (nodeText.includes(key)) {
          score += 2;
        }
      }
    });
    
    // Direct text matching - support partial matches for real-time typing
    const queryWords = lowerQuery.split(" ").filter(w => w.length > 0);
    queryWords.forEach(word => {
      // Match if any word in node text starts with or contains the query
      if (nodeText.includes(word)) score += 2;
      if (fakeData.title.toLowerCase().includes(word)) score += 3;
      if (fakeData.tags.some((tag: string) => tag.includes(word))) score += 2;
      
      // Also check if keywords start with the query (for partial matching like "co" -> "code")
      Object.values(keywords).flat().forEach(keyword => {
        if (keyword.startsWith(word) && (nodeText.includes(keyword) || fakeData.title.toLowerCase().includes(keyword))) {
          score += 2;
        }
      });
    });
    
    if (score > 0) {
      matchingNodes.push({ id: node.id, score });
    }
  });
  
  // Sort by score and take top matches (or all if question with type)
  matchingNodes.sort((a, b) => b.score - a.score);
  const topMatches = isQuestion && targetType 
    ? matchingNodes.map(m => m.id) // Show all matching type for questions
    : matchingNodes.slice(0, 8).map(m => m.id);
  
  // Generate fake AI response
  let aiResponse = "";
  if (isQuestion && targetType) {
    aiResponse = `Found ${topMatches.length} ${targetType} ${topMatches.length === 1 ? 'file' : 'files'} matching your query.`;
  } else {
    const aiResponses = [
      `Found ${topMatches.length} relevant ${topMatches.length === 1 ? 'item' : 'items'} related to "${query}". These ${topMatches.length === 1 ? 'appears' : 'appear'} to be connected through shared topics and context.`,
      `Based on your query "${query}", I've identified ${topMatches.length} ${topMatches.length === 1 ? 'node' : 'nodes'} that match your search criteria. The content ${topMatches.length === 1 ? 'relates' : 'relate'} to this topic.`,
      `Search results for "${query}": ${topMatches.length} ${topMatches.length === 1 ? 'document' : 'documents'} found. These are connected through semantic relationships in your knowledge graph.`,
      `I found ${topMatches.length} relevant ${topMatches.length === 1 ? 'item' : 'items'} matching "${query}". The connections between these nodes suggest they are part of related work streams.`,
    ];
    aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }
  
  return {
    matchingNodeIds: topMatches,
    aiResponse: aiResponse,
  };
};

// Minimal Intelligent Demo Section
const DemoSection: FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ matchingNodeIds: string[]; aiResponse: string }>({ matchingNodeIds: [], aiResponse: "" });
  const demoNodeTypes = useMemo(() => ({ simple: SimpleNode }), []);
  
  // Generate 20 nodes with random positions
  const baseNodes = useMemo(() => {
    const types = ["document", "meeting", "note", "whiteboard", "code", "audio"];
    return Array.from({ length: 20 }, (_, i) => {
      const id = String(i + 1);
      const type = types[i % types.length];
      return {
        id,
        data: {
          type,
          fakeData: generateFakeData(id, type),
        },
        position: { 
          x: 120 + (i % 6) * 140 + Math.random() * 30,
          y: 100 + Math.floor(i / 6) * 140 + Math.random() * 30,
        },
      };
    });
  }, []);

  // Generate random edges connecting nodes
  const demoEdges = useMemo(() => {
    const edges: any[] = [];
    const nodeIds = baseNodes.map(n => n.id);
    const edgeSet = new Set<string>();
    
    // Create connections - ensure each node has at least 1-2 connections
    // First, connect each node to at least one other node
    nodeIds.forEach((nodeId, index) => {
      // Connect to next node (circular)
      const nextIndex = (index + 1) % nodeIds.length;
      const nextNodeId = nodeIds[nextIndex];
      const edgeKey = `${nodeId}-${nextNodeId}`;
      
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          id: `e${nodeId}-${nextNodeId}`,
          source: nodeId,
          target: nextNodeId,
          type: "straight",
          animated: false,
          style: { stroke: "#64748b", strokeWidth: 1.5, opacity: 0.3 },
        });
      }
    });
    
    // Then add random additional connections
    let attempts = 0;
    while (edges.length < 30 && attempts < 100) {
      attempts++;
      const source = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      let target = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      
      // Ensure source != target
      while (target === source) {
        target = nodeIds[Math.floor(Math.random() * nodeIds.length)];
      }
      
      const edgeKey = `${source}-${target}`;
      const reverseKey = `${target}-${source}`;
      
      // Avoid duplicate edges
      if (!edgeSet.has(edgeKey) && !edgeSet.has(reverseKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          id: `e${source}-${target}`,
          source,
          target,
          type: "straight",
          animated: false,
          style: { stroke: "#64748b", strokeWidth: 1.5, opacity: 0.3 },
        });
      }
    }
    
    console.log('Generated edges:', edges.length);
    return edges;
  }, [baseNodes]);

  // Function to find all connected nodes (recursive/group detection)
  const findConnectedNodes = useMemo(() => {
    const edgeMap = new Map<string, string[]>();
    demoEdges.forEach(edge => {
      if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
      if (!edgeMap.has(edge.target)) edgeMap.set(edge.target, []);
      edgeMap.get(edge.source)!.push(edge.target);
      edgeMap.get(edge.target)!.push(edge.source);
    });
    
    return (nodeId: string): Set<string> => {
      const connected = new Set<string>([nodeId]);
      const queue = [nodeId];
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbors = edgeMap.get(current) || [];
        for (const neighbor of neighbors) {
          if (!connected.has(neighbor)) {
            connected.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      
      return connected;
    };
  }, [demoEdges]);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = performFakeAISearch(searchQuery, baseNodes);
      setSearchResults(results);
    } else {
      setSearchResults({ matchingNodeIds: [], aiResponse: "" });
    }
  }, [searchQuery, baseNodes]);

  // Transform nodes with selection state and search highlighting
  const demoNodes = useMemo(() => {
    const connectedNodeIds = selectedNodeId ? findConnectedNodes(selectedNodeId) : new Set<string>();
    
    return baseNodes.map((node, index) => {
      const isSelected = selectedNodeId === node.id;
      const isConnected = !isSelected && connectedNodeIds.has(node.id);
      const isSearchMatch = searchResults.matchingNodeIds.includes(node.id);
      const searchMatchIndex = isSearchMatch ? searchResults.matchingNodeIds.indexOf(node.id) : -1;
      
      return {
        ...node,
        type: "simple",
        data: {
          ...node.data,
          selected: isSelected,
          connected: isConnected,
          searchMatch: isSearchMatch,
          searchMatchIndex: searchMatchIndex,
        },
        style: {
          opacity: searchQuery && !isSearchMatch ? 0.2 : 1,
          transition: "opacity 0.4s ease, transform 0.4s ease",
        },
      };
    });
  }, [baseNodes, selectedNodeId, findConnectedNodes, searchResults, searchQuery]);

  // Enhanced edge highlighting with subtle glow for connected edges
  const enhancedEdges = useMemo(() => {
    const connectedNodeIds = selectedNodeId ? findConnectedNodes(selectedNodeId) : new Set<string>();
    const searchMatchIds = new Set(searchResults.matchingNodeIds);
    
    return demoEdges.map(edge => {
      const isDirectlyConnected = (edge.source === selectedNodeId || edge.target === selectedNodeId) && selectedNodeId !== null;
      const isInConnectedGroup = selectedNodeId && connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target);
      
      // Show edges connecting search-matched nodes
      const connectsSearchMatches = searchQuery && searchMatchIds.has(edge.source) && searchMatchIds.has(edge.target);
      
      if (isDirectlyConnected || isInConnectedGroup) {
      return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "straight",
          animated: true,
        style: {
            stroke: "#06b6d4",
            strokeWidth: isDirectlyConnected ? 3 : 2.5,
            opacity: 0.6,
            filter: `drop-shadow(0 0 4px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))`,
          },
        };
      }
      
      if (connectsSearchMatches) {
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "straight",
          animated: true,
          style: {
            stroke: "#8b5cf6",
            strokeWidth: 2,
            opacity: 0.5,
            filter: `drop-shadow(0 0 3px rgba(139, 92, 246, 0.5))`,
            transition: "opacity 0.4s ease, stroke-width 0.4s ease",
          },
        };
      }
      
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "straight",
        animated: false,
        style: {
          stroke: "#64748b",
          strokeWidth: 1.5,
          opacity: selectedNodeId || searchQuery ? 0.2 : 0.3,
          transition: "opacity 0.4s ease",
        },
      };
    });
  }, [demoEdges, selectedNodeId, findConnectedNodes, searchResults, searchQuery]);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null); // Deselect if clicking the same node
    } else {
      setSelectedNodeId(node.id);
      setSearchQuery(""); // Clear search when selecting a node
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = performFakeAISearch(searchQuery, baseNodes);
      setSearchResults(results);
      // Optionally select the first result
      if (results.matchingNodeIds.length > 0) {
        setSelectedNodeId(results.matchingNodeIds[0]);
      }
    }
  };

  const selectedNodeData = selectedNodeId 
    ? baseNodes.find(n => n.id === selectedNodeId)?.data.fakeData 
    : null;

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(demoNodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(enhancedEdges);

  useEffect(() => {
    setFlowNodes(demoNodes);
  }, [demoNodes, setFlowNodes]);

  useEffect(() => {
    setFlowEdges(enhancedEdges);
    // Debug: Log edges to verify they're being created
    console.log('Edges count:', enhancedEdges.length);
    console.log('Sample edges:', enhancedEdges.slice(0, 3));
  }, [enhancedEdges, setFlowEdges]);

  return (
    <section className="w-full bg-white px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          See It In Action
        </h2>
        <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Ask questions about your files or click any node to explore connections
        </p>

        {/* Natural Language Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full px-6 py-4 pr-12 rounded-lg border border-gray-300 focus:border-blue-400 focus:outline-none text-gray-900 shadow-sm transition-all duration-300 bg-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <Search size={20} />
            </button>
          </form>
          
          {/* Demo Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-2">
            Demo: Search uses simulated AI responses. Real API integration available in production.
          </p>
          
          {/* AI Response */}
          {searchResults.aiResponse && (
            <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Brain size={20} className="mt-0.5 flex-shrink-0 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900 mb-1">AI Assistant (Demo)</p>
                  <p className="text-sm text-purple-800">{searchResults.aiResponse}</p>
                  <p className="text-xs text-purple-600 mt-2 pt-2 border-t border-purple-200">
                    Note: This is a demo with simulated responses. Real API integration powered by Inngest available in production.
                  </p>
          </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Container with Graph and Sidebar */}
        <div className="flex gap-6">
          {/* Graph View */}
          <div className={`bg-white rounded-lg shadow-sm p-6 overflow-hidden border border-gray-200 transition-all duration-300 ${selectedNodeId ? 'flex-1' : 'w-full'}`}>
            <div className="bg-slate-50 rounded-lg h-[600px] relative overflow-hidden react-flow-container" style={{
            backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0',
          }}>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={demoNodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={() => setSelectedNodeId(null)}
              fitView
              fitViewOptions={{ padding: 0.2, minZoom: 0.4, maxZoom: 1 }}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnScroll={false}
              panOnDrag={false}
              nodesDraggable={false}
              preventScrolling={false}
              className="bg-transparent"
              defaultEdgeOptions={{ type: "straight" }}
            >
              <Controls showZoom={false} showFitView={false} showInteractive={false} />
            </ReactFlow>
            </div>
          </div>
          
          {/* Sidebar */}
          {selectedNodeId && selectedNodeData && (
            <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-6 animate-slide-in">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedNodeData.title}</h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {baseNodes.find(n => n.id === selectedNodeId)?.data.type}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedNodeData.description}</p>
          </div>
          
                <div>
                  <p className="text-sm text-gray-500 mb-1">AI Insight</p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-900 leading-relaxed flex items-start gap-2">
                      <Brain size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
                      {selectedNodeData.aiInsight}
                    </p>
                    <p className="text-xs text-purple-700 mt-2 pt-2 border-t border-purple-200">
                      Powered by real API setup with Inngest
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeData.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Author</p>
                      <p className="font-medium text-gray-900">{selectedNodeData.author}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium text-gray-900">{selectedNodeData.date}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Connections</p>
                      <p className="font-medium text-cyan-600">{selectedNodeData.connections} linked nodes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// College Logo Bar Component
const CollegeLogoBar: FC = () => {
  const colleges = [
    { name: "Rutgers", logo: "/logos/Rutgers_Scarlet_Knights_logo.svg.png" },
    { name: "Rowan", logo: "/logos/rowan-university-profs-logo-png_seeklogo-454657.png" },
    { name: "NJIT", logo: "/logos/New_Jersey_IT_logo.svg.png" },
    { name: "Penn State", logo: "/logos/penn-state-shield.jpg" },
    { name: "Indiana", logo: "/logos/indiana_hoosiers_2002-pres.webp" },
    { name: "Seton Hall", logo: "/logos/seton_hall_pirates_2009-pres.webp" },
  ];
  
  // Duplicate for seamless loop
  const collegeList = [...colleges, ...colleges];

  return (
    <div className="relative overflow-hidden py-8 h-40 w-full">
      <div className="flex animate-scroll whitespace-nowrap items-center">
        {collegeList.map((college, i) => (
          <div
            key={i}
            className="mx-2 flex-shrink-0 h-24 w-[220px] flex items-center justify-center"
          >
            <img 
              src={college.logo} 
              alt={`${college.name} logo`}
              className="h-24 w-auto object-contain max-w-[200px] opacity-100"
            />
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
      animation: scroll 30s linear infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 12px rgba(34, 211, 238, 0.6); }
      50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.9), 0 0 30px rgba(34, 211, 238, 0.5); }
    }
    .glow-effect {
      animation: glow-pulse 2s ease-in-out infinite;
    }
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
    @keyframes search-reveal {
      from {
        opacity: 0;
        transform: scale(0.5) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @media (max-width: 1024px) {
      .college-logo-container {
        width: calc(100% / 4);
      }
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
          Get Started
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
            Get Started
          </button>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Section */}
      <section className="w-full bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 animate-gradient-mesh px-4 py-20 animate-slide-up">
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
      <section className="w-full bg-white px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            6 universities. 30+ teams. 600+ users.
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
        .react-flow-container {
          position: relative;
        }
        .react-flow__viewport {
          pointer-events: none;
        }
        .react-flow__pane {
          pointer-events: none;
        }
        .react-flow__renderer {
          pointer-events: none;
        }
        .react-flow__edges {
          pointer-events: none !important;
          z-index: 5 !important;
        }
        .react-flow__node {
          pointer-events: auto;
          cursor: pointer;
        }
        .react-flow-container:hover .react-flow__viewport,
        .react-flow-container:hover .react-flow__pane,
        .react-flow-container:hover .react-flow__renderer {
          pointer-events: auto;
        }
        .react-flow-container:active .react-flow__viewport,
        .react-flow-container:active .react-flow__pane,
        .react-flow-container:active .react-flow__renderer {
          pointer-events: auto;
        }
        .react-flow__edge {
          z-index: 10 !important;
          pointer-events: none !important;
        }
        .react-flow__edge-path {
          stroke-width: 1.5 !important;
          pointer-events: none !important;
        }
        .react-flow__edge.selected .react-flow__edge-path {
          stroke-width: 2 !important;
        }
        .react-flow__connectionline {
          z-index: 1000;
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