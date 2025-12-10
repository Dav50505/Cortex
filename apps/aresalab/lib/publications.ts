export interface Publication {
  slug: string;
  title: string;
  shortTitle: string;
  authors: string[];
  date: string;
  institution: string;
  abstract: string;
  keywords: string[];
  category: "research" | "book" | "dashboard";
  pdfUrl?: string;
  demoUrl?: string;
  metrics: {
    label: string;
    value: string;
  }[];
  featured: boolean;
  badge?: string;
  hasMathContent?: boolean;
}

export const publications: Publication[] = [
  // =========================================
  // FEATURED RESEARCH PAPERS
  // =========================================
  {
    slug: "swarm-intelligence-code",
    title: "Swarm Intelligence in Code Generation: Distributed Multi-Agent Architectures for Software Engineering",
    shortTitle: "Swarm Code Generation",
    authors: ["Cortex Lab", "YoreAI"],
    date: "2024-12",
    institution: "Cortex Research",
    abstract: "We introduce a novel multi-agent architecture where specialized LLM agents (Architect, Developer, Reviewer, Tester) collaborate to generate production-ready software. Our 'Swarm' protocol reduces hallucination rates by 40% compared to single-model generation and achieves a 94% pass rate on the HumanEval benchmark.",
    keywords: ["Multi-Agent Systems", "Code Generation", "Swarm Intelligence", "LLMs", "Software Engineering"],
    category: "research",
    pdfUrl: "#",
    metrics: [
      { label: "Agents", value: "4" },
      { label: "Pass Rate", value: "94%" },
      { label: "Hallucination", value: "-40%" },
      { label: "Latency", value: "1.2s" },
    ],
    featured: true,
    badge: "FLAGSHIP",
    hasMathContent: true,
  },
  {
    slug: "consensus-protocols",
    title: "Byzantine Fault Tolerance in Large Language Model Networks",
    shortTitle: "LLM Consensus Protocols",
    authors: ["Cortex Lab", "YoreAI"],
    date: "2024-11",
    institution: "Cortex Research",
    abstract: "As autonomous agents become more prevalent, ensuring reliability is critical. We propose a consensus mechanism inspired by blockchain BFT algorithms to allow a network of 100+ small LLMs to agree on factual truths, effectively filtering out 'hallucinating' nodes without human intervention.",
    keywords: ["Consensus", "Byzantine Fault Tolerance", "Distributed Systems", "LLM Networks"],
    category: "research",
    pdfUrl: "#",
    metrics: [
      { label: "Nodes", value: "100+" },
      { label: "Accuracy", value: "99.2%" },
      { label: "Fault Tolerance", value: "33%" },
      { label: "Throughput", value: "500/s" },
    ],
    featured: true,
    badge: "THEORY",
    hasMathContent: true,
  },
  {
    slug: "cortex-architecture",
    title: "Cortex: A Framework for Autonomous Recursive Self-Improvement",
    shortTitle: "The Cortex Architecture",
    authors: ["Cortex Lab"],
    date: "2024-12",
    institution: "Cortex Research",
    abstract: "Presenting the Cortex architecture: a recursive loop where agents design, implement, and verify their own improvements. We demonstrate a system that successfully optimized its own prompt engineering strategies, resulting in a 15% efficiency gain over 24 hours of autonomous operation.",
    keywords: ["Recursive Self-Improvement", "Autonomous Agents", "Prompt Engineering", "Meta-Learning"],
    category: "research",
    pdfUrl: "#",
    metrics: [
      { label: "Iterations", value: "1,200" },
      { label: "Efficiency", value: "+15%" },
      { label: "Autonomy", value: "24h" },
      { label: "Code Lines", value: "12K" },
    ],
    featured: true,
    badge: "SYSTEMS",
    hasMathContent: true,
  },

  // =========================================
  // OTHER PUBLICATIONS
  // =========================================
  {
    slug: "distributed-reasoning",
    title: "Distributed Reasoning Networks: Breaking Down Complex Tasks",
    shortTitle: "Distributed Reasoning",
    authors: ["Cortex Lab"],
    date: "2024-10",
    institution: "Cortex Research",
    abstract: "Analyzing how breaking complex reasoning tasks into sub-components handled by specialized 'micro-agents' outperforms massive monolithic models. We show that a mesh of 7B parameter models can outperform a single 70B model on logic puzzles.",
    keywords: ["Distributed AI", "Micro-Agents", "Reasoning", "Model Merging"],
    category: "research",
    metrics: [
      { label: "Model Size", value: "7B" },
      { label: "Performance", value: ">70B" },
      { label: "Cost", value: "-80%" },
      { label: "Speed", value: "2x" },
    ],
    featured: false,
    hasMathContent: false,
  },
];

export interface Book {
  slug: string;
  title: string;
  author: string;
  date: string;
  description: string;
  chapters: number;
  pdfUrl?: string;
  coverGradient: string;
}

export const books: Book[] = [
  {
    slug: "hive-mind",
    title: "The Hive Mind: Engineering Collective Artificial Intelligence",
    author: "Cortex Lab",
    date: "2024",
    description: "A comprehensive guide to building multi-agent systems. Covers the fundamentals of agent communication, shared memory architectures, and conflict resolution protocols. Includes Python examples using the Cortex framework.",
    chapters: 12,
    pdfUrl: "#",
    coverGradient: "from-emerald-600 to-teal-600",
  },
  {
    slug: "autonomous-horizons",
    title: "Autonomous Horizons: The Future of Self-Governing AI",
    author: "Cortex Lab",
    date: "2025",
    description: "Exploring the ethical and technical implications of AI systems that operate without human oversight. We discuss safety guardrails, value alignment, and the roadmap to AGI through distributed intelligence.",
    chapters: 8,
    pdfUrl: "#",
    coverGradient: "from-cyan-600 to-blue-600",
  },
];

export function getPublicationBySlug(slug: string): Publication | undefined {
  return publications.find((pub) => pub.slug === slug);
}

export function getFeaturedPublications(): Publication[] {
  return publications.filter((pub) => pub.featured);
}

export function getPublicationsByCategory(category: Publication["category"]): Publication[] {
  return publications.filter((pub) => pub.category === category);
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
