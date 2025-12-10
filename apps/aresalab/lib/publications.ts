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
  // STATIC PAPERS REMOVED - ONLY GENERATED PAPERS SHOWN
  // =========================================
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
    coverGradient: "from-emerald-600 to-teal-600",
  },
  {
    slug: "autonomous-horizons",
    title: "Autonomous Horizons: The Future of Self-Governing AI",
    author: "Cortex Lab",
    date: "2025",
    description: "Exploring the ethical and technical implications of AI systems that operate without human oversight. We discuss safety guardrails, value alignment, and the roadmap to AGI through distributed intelligence.",
    chapters: 8,
    coverGradient: "from-cyan-600 to-blue-600",
  },
];

import fs from 'fs';
import path from 'path';

export function getPublicationBySlug(slug: string): Publication | undefined {
  // First check static publications
  const staticPub = publications.find((pub) => pub.slug === slug);
  if (staticPub) return staticPub;

  // Then check dynamic publications
  const dynamicPubs = getDynamicPublications();
  return dynamicPubs.find((pub) => pub.slug === slug);
}

export function getFeaturedPublications(): Publication[] {
  const staticFeatured = publications.filter((pub) => pub.featured);
  const dynamicPubs = getDynamicPublications();
  // Add dynamic papers to featured list
  return [...dynamicPubs, ...staticFeatured];
}

export function getPublicationsByCategory(category: Publication["category"]): Publication[] {
  const staticPubs = publications.filter((pub) => pub.category === category);
  if (category === 'research') {
    return [...getDynamicPublications(), ...staticPubs];
  }
  return staticPubs;
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

// Helper to read from CortexDB
function getDynamicPublications(): Publication[] {
  try {
    // Path to cortex_db.json relative to apps/aresalab
    const dbPath = path.join(process.cwd(), '..', 'cortex', 'data', 'cortex_db.json');

    if (!fs.existsSync(dbPath)) {
      return [];
    }

    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(fileContent);
    const rawPapers = data.publications || [];

    return rawPapers.map((paper: any) => ({
      slug: paper._id, // Use ID as slug
      title: paper.topic,
      shortTitle: paper.topic.split(':')[0],
      authors: ["Cortex Swarm"],
      date: paper._timestamp ? new Date(paper._timestamp).toISOString().split('T')[0] : "2024",
      institution: "Cortex Lab",
      abstract: paper.summary ? paper.summary.split('\n\n')[0] : paper.final_output.split('\n\n')[0].replace('#', '').trim(), // First paragraph
      keywords: ["Generated", "Multi-Agent", ...paper.agents],
      category: "research",
      metrics: [
        { label: "Agents", value: String(paper.agents.length) },
        { label: "Drafts", value: "2" },
        { label: "Words", value: String(paper.final_output.split(' ').length) },
        { label: "Model", value: "LLM" },
      ],
      featured: true,
      badge: "GENERATED",
      hasMathContent: false,
      pdfUrl: paper.pdf_path ? `/api/download/${paper._id}` : undefined,
    }));
  } catch (error) {
    console.error("Error reading CortexDB:", error);
    return [];
  }
}
