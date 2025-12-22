"use client";

import Link from "next/link";
import { FileText, ArrowRight, ExternalLink, Tag, Clock } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { AnimatedGradientBorder, Shimmer, MeshGradient, DotPattern, AnimatedOrbs } from "../components/magic";
import { motion } from "framer-motion";
import { Publication } from "../../lib/publications";

const gradientMap: Record<string, string> = {
  "geoai-agentic-flow": "from-purple-600 to-indigo-600",
  "coordinate-embedding": "from-blue-500 to-cyan-500",
  "multi-agent-coordination": "from-emerald-500 to-teal-500",
  "fire-safety-dashboard": "from-orange-500 to-red-500",
  "spotify-popularity": "from-green-500 to-emerald-500",
  "manufacturing-analytics": "from-slate-500 to-zinc-500",
  "network-centrality": "from-violet-500 to-purple-500",
};

interface PublicationsPageClientProps {
  publications: Publication[];
}

export function PublicationsPageClient({ publications }: PublicationsPageClientProps) {
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
      <AnimatedOrbs count={5} />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <AnimatedGradientBorder className="inline-block mb-8" borderColor="from-purple-500 via-pink-500 to-indigo-500">
              <div className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full">
                <FileText className="w-4 h-4" />
                <span>All Publications</span>
              </div>
            </AnimatedGradientBorder>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Research Publications
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Peer-reviewed research and technical reports in machine learning, spatial intelligence, and data analytics.
            </p>
          </motion.div>

          {/* Publications List */}
          <div className="space-y-6">
            {publications.map((pub, index) => {
              const gradient = gradientMap[pub.slug] || "from-purple-500 to-indigo-500";

              return (
                <motion.div
                  key={pub.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Shimmer className="group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {pub.badge && (
                            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${gradient}`}>
                              {pub.badge}
                            </span>
                          )}
                          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {pub.date}
                          </span>
                        </div>

                        <Link href={`/publications/${pub.slug}`}>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {pub.title}
                          </h2>
                        </Link>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {pub.authors.join(", ")} — {pub.institution}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {pub.abstract}
                        </p>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pub.keywords.slice(0, 4).map((keyword) => (
                            <span
                              key={keyword}
                              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-48">
                        <AnimatedGradientBorder borderColor={gradient} className="w-full">
                          <Link
                            href={`/publications/${pub.slug}`}
                            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all duration-300"
                          >
                            Read Paper
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </AnimatedGradientBorder>

                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF
                          </a>
                        )}

                        {pub.demoUrl && (
                          <a
                            href={pub.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </Shimmer>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

