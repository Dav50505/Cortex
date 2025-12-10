import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const PUBLICATIONS_DIR = path.join(process.cwd(), "public/publications");

export async function getPublicationContent(slug: string) {
  // 1. Check CortexDB for generated papers
  try {
    const dbPath = path.join(process.cwd(), '..', 'cortex', 'data', 'cortex_db.json');
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, 'utf-8');
      const data = JSON.parse(fileContent);
      const rawPapers = data.publications || [];
      const paper = rawPapers.find((p: any) => p._id === slug);

      if (paper) {
        // Use summary if available, otherwise fallback to final_output
        const contentToRender = paper.summary || paper.final_output;

        const mdxSource = await serialize(contentToRender, {
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex as any],
          },
          parseFrontmatter: true,
        });

        return {
          source: mdxSource,
          frontmatter: {
            title: paper.topic,
            date: paper._timestamp,
          },
        };
      }
    }
  } catch (e) {
    console.error("Error reading CortexDB in MDX loader:", e);
  }

  // 2. Fallback to Filesystem (Static Papers)
  // Convert slug (kebab-case) to directory name (snake_case)
  // Try both kebab and snake case for directory matching
  let dirName = slug.replace(/-/g, "_");
  let filePath = path.join(PUBLICATIONS_DIR, dirName, "index.mdx"); // Changed to index.mdx based on previous edits

  if (!fs.existsSync(filePath)) {
    // Try original logic if index.mdx doesn't exist
    filePath = path.join(PUBLICATIONS_DIR, dirName, "preview.mdx");
  }

  if (!fs.existsSync(filePath)) {
    // Try kebab case directory
    dirName = slug;
    filePath = path.join(PUBLICATIONS_DIR, dirName, "index.mdx");
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex as any],
    },
    parseFrontmatter: true,
  });

  return {
    source: mdxSource,
    frontmatter: data,
  };
}

export async function getBookContent(slug: string) {
  // Convert slug (kebab-case) to directory name (snake_case)
  const dirName = slug.replace(/-/g, "_");
  const filePath = path.join(PUBLICATIONS_DIR, dirName, "preview.mdx");

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex as any],
    },
  });

  return {
    source: mdxSource,
    frontmatter: data,
  };
}

export function getAllPublicationSlugs(): string[] {
  if (!fs.existsSync(PUBLICATIONS_DIR)) {
    return [];
  }

  const dirs = fs.readdirSync(PUBLICATIONS_DIR);
  return dirs
    .filter((dir) => {
      const dirPath = path.join(PUBLICATIONS_DIR, dir);
      return (
        fs.statSync(dirPath).isDirectory() &&
        dir !== "pdf" &&
        dir !== "__pycache__"
      );
    })
    .filter((dir) => {
      // Only include if preview.mdx exists
      const previewPath = path.join(PUBLICATIONS_DIR, dir, "preview.mdx");
      return fs.existsSync(previewPath);
    });
}

export function getAllBookSlugs(): string[] {
  // Books are now also in publications/ directory
  // Just filter for books from the publications list
  return []; // We'll use publications.ts for book slugs instead
}
