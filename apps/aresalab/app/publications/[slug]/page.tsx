import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ExternalLink, Clock, Tag, Building2 } from "lucide-react";
import { Navigation } from "../../components/Navigation";
import { getPublicationContent } from "../../../lib/mdx";
import { getPublicationBySlug } from "../../../lib/publications";
import { PublicationContent } from "./PublicationContent";
import { AnimatedGradientBorder, Shimmer, GridPattern, AnimatedNumber } from "../../components/magic";
import { PublicationPageClient } from "./PublicationPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicationPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  const content = await getPublicationContent(slug);

  if (!publication) {
    notFound();
  }

  return (
    <PublicationPageClient 
      publication={publication} 
      content={content}
    />
  );
}
