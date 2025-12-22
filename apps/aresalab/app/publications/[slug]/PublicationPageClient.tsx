"use client";

import Link from "next/link";
import { ArrowLeft, FileText, ExternalLink, Clock, Tag, Building2 } from "lucide-react";
import { Navigation } from "../../components/Navigation";
import { PublicationContent } from "./PublicationContent";
import { AnimatedNumber, MeshGradient, DotPattern, AnimatedOrbs, GlassButton, ModernCard, PillBadge, AnimatedGradientBorder } from "../../components/magic";
import { motion } from "framer-motion";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

interface Publication {
  slug: string;
  title: string;
  shortTitle?: string;
  abstract: string;
  authors: string[];
  institution: string;
  date: string;
  keywords: string[];
  badge?: string;
  pdfUrl?: string;
  demoUrl?: string;
  metrics?: Array<{ label: string; value: string | number }>;
}

interface PublicationPageClientProps {
  publication: Publication;
  content: { source: MDXRemoteSerializeResult } | null;
}

export function PublicationPageClient({ publication, content }: PublicationPageClientProps) {
  const gradientMap: Record<string, string> = {
    "geoai-agentic-flow": "from-purple-600 to-indigo-600",
    "coordinate-embedding": "from-blue-500 to-cyan-500",
    "multi-agent-coordination": "from-emerald-500 to-teal-500",
    "fire-safety-dashboard": "from-orange-500 to-red-500",
    "spotify-popularity": "from-green-500 to-emerald-500",
    "manufacturing-analytics": "from-slate-500 to-zinc-500",
    "network-centrality": "from-violet-500 to-purple-500",
  };

  const gradient = gradientMap[publication.slug] || "from-purple-500 to-indigo-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Modern Background Design */}
      <MeshGradient 
        colors={[
          "rgba(139, 92, 246, 0.15)",
          "rgba(59, 130, 246, 0.12)",
          "rgba(236, 72, 153, 0.12)",
        ]}
      />
      <AnimatedOrbs count={4} />
      <DotPattern
        className="opacity-30 dark:opacity-20"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1.5}
      />
      <Navigation />

      <main className="pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/publications"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Publications
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            {publication.badge && (
              <div className="mb-4">
                <PillBadge variant="gradient" size="md">
                  {publication.badge}
                </PillBadge>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                {publication.title}
              </span>
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div className="flex items-center px-3 py-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <Clock className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{publication.date}</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <Building2 className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{publication.institution}</span>
              </div>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 font-medium">
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Authors:</span>{" "}
              <span className="text-gray-900 dark:text-gray-100">{publication.authors.join(", ")}</span>
            </p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-6">
              {publication.keywords.map((keyword, index) => (
                <PillBadge
                  key={keyword}
                  variant="outline"
                  size="sm"
                >
                  <Tag className="w-3 h-3 mr-1.5" />
                  {keyword}
                </PillBadge>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              {publication.pdfUrl && (
                <AnimatedGradientBorder borderColor={gradient} className="inline-flex">
                  <GlassButton
                    href={publication.pdfUrl}
                    variant="primary"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </GlassButton>
                </AnimatedGradientBorder>
              )}
              {publication.demoUrl && (
                <AnimatedGradientBorder borderColor={gradient} className="inline-flex">
                  <GlassButton
                    href={publication.demoUrl}
                    variant="secondary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </GlassButton>
                </AnimatedGradientBorder>
              )}
            </div>
          </motion.header>

          {/* Key Metrics */}
          {publication.metrics && publication.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ModernCard variant="glass" className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                  Key Metrics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {publication.metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center p-5 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/30 hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        {typeof metric.value === 'number' ? (
                          <AnimatedNumber value={metric.value} />
                        ) : (
                          metric.value
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ModernCard>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {content ? (
              <PublicationContent source={content.source} />
            ) : (
              <ModernCard variant="glass">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                  Abstract
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  {publication.abstract}
                </p>

                {publication.pdfUrl && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                      The full paper is available as a PDF download.
                    </p>
                    <GlassButton
                      href={publication.pdfUrl}
                      variant="primary"
                    >
                      <FileText className="w-4 h-4" />
                      Download Full Paper
                    </GlassButton>
                  </div>
                )}
              </ModernCard>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

