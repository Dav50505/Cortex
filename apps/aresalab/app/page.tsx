import Link from "next/link";
import {
  Brain,
  Network,
  Users,
  Cpu,
  BarChart3,
  Clock,
  ExternalLink,
  BookOpen,
  FileText,
  Beaker,
  ArrowRight,
  Database,
  Terminal,
  Share2,
  GitMerge,
  Bot,
} from "lucide-react";
import { Navigation } from "./components/Navigation";
import { getFeaturedPublications, publications, books } from "../lib/publications";

const iconMap: Record<string, any> = {
  "swarm-intelligence-code": Users,
  "consensus-protocols": GitMerge,
  "cortex-architecture": Brain,
  "distributed-reasoning": Network,
  "hive-mind": Share2,
  "autonomous-horizons": Bot,
};

const gradientMap: Record<string, string> = {
  "swarm-intelligence-code": "from-emerald-500 to-teal-500",
  "consensus-protocols": "from-blue-500 to-cyan-500",
  "cortex-architecture": "from-violet-500 to-purple-600",
  "distributed-reasoning": "from-orange-500 to-amber-500",
};

export default async function HomePage() {
  const allFeatured = getFeaturedPublications();
  // Sort by date (newest first) - assuming dynamic ones are newer
  // But static ones have "2024-12" etc.
  // Let's just use the order returned by getFeaturedPublications (dynamic first)

  const featuredPubs = allFeatured;
  const otherPubs = publications.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-colors duration-300">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 mb-8 space-x-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg">
              <Bot className="w-4 h-4" />
              <span>Multi-Agent Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-gray-100 dark:via-emerald-300 dark:to-teal-300">
                CORTEX
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                Collaborative Autonomous Research Systems
              </span>
            </h1>

            <p className="max-w-4xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Engineering the "Hive Mind" — where swarms of specialized AI agents collaborate to solve complex problems faster than any single model.
            </p>

            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto mb-12 p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-emerald-100 dark:border-gray-700 shadow-xl">
              <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                We believe the future of AI isn't just bigger models, but <span className="font-semibold text-gray-900 dark:text-white">better collaboration</span>.
                Cortex Lab is building the protocols, architectures, and tools that allow AI agents to work together like a digital organism.
                From self-correcting code generation to distributed scientific discovery, we are defining the sociology of silicon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
            <Cpu className="w-8 h-8 mr-3 text-emerald-600" />
            Featured Research
          </h2>

          <div className="space-y-8">
            {featuredPubs.map((pub, index) => {
              const Icon = iconMap[pub.slug] || Brain;
              const gradient = gradientMap[pub.slug] || "from-emerald-500 to-teal-500";

              return (
                <div
                  key={pub.slug}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8`}>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {pub.badge && (
                            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${gradient}`}>
                              {pub.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg transition-all duration-300 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 hover:shadow-lg"
                            >
                              <FileText className="w-4 h-4" />
                              <span>PDF</span>
                            </a>
                          )}
                          {(pub.category === "research" || pub.category === "dashboard") && (
                            <Link
                              href={`/publications/${pub.slug}`}
                              className="inline-flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg transition-all duration-300 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 hover:shadow-lg"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Read Paper</span>
                            </Link>
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {pub.shortTitle}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        {pub.abstract}
                      </p>

                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{pub.date}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Authors:</strong> {pub.authors.join(", ")}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Institution:</strong> {pub.institution}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <strong>Keywords:</strong>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pub.keywords.slice(0, 4).map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Panel */}
                    <div className="md:w-80">
                      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Key Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {pub.metrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="px-3 py-4 text-center rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className={`text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                                {metric.value}
                              </div>
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl pointer-events-none`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Publications */}
      {otherPubs.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Additional Publications
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPubs.map((pub) => {
                const Icon = iconMap[pub.slug] || FileText;
                const gradient = gradientMap[pub.slug] || "from-gray-500 to-slate-500";

                return (
                  <Link
                    key={pub.slug}
                    href={`/publications/${pub.slug}`}
                    className="group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`p-2 bg-gradient-to-br ${gradient} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {pub.shortTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {pub.abstract}
                    </p>
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      Read more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Books Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-emerald-600" />
            Research Books
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {books.map((book) => (
              <Link
                key={book.slug}
                href={`/books/${book.slug}`}
                className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-32 h-44 bg-gradient-to-br ${book.coverGradient} rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <BookOpen className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      by {book.author} • {book.date}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {book.description}
                    </p>
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      {book.chapters} Chapters <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Cortex Lab — Collaborative Autonomous Research
          </p>
        </div>
      </footer>
    </div>
  );
}
