import { Navigation } from "./components/Navigation";
import { getFeaturedPublications, publications, books } from "../lib/publications";
import { Hero } from "./components/magic/Hero";
import { BentoGrid, BentoGridItem } from "./components/magic/BentoGrid";
import { Brain, Network, Users, GitMerge, Share2, Bot, FileText, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
  "swarm-intelligence-code": Users,
  "consensus-protocols": GitMerge,
  "cortex-architecture": Brain,
  "distributed-reasoning": Network,
  "hive-mind": Share2,
  "autonomous-horizons": Bot,
};

export default function HomePage() {
  const featuredPubs = getFeaturedPublications();
  const otherPubs = publications.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />

      <Hero />

      <section id="research" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Research Highlights</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Featured Publications</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Pioneering studies on multi-agent collaboration, distributed reasoning, and autonomous system architecture.
            </p>
          </div>

          <BentoGrid>
            {featuredPubs.map((pub, i) => {
              const Icon = iconMap[pub.slug] || Brain;
              return (
                <Link
                  key={pub.slug}
                  href={`/publications/${pub.slug}`}
                  className={i === 3 || i === 6 ? "md:col-span-2 row-span-1 block group" : "row-span-1 block group"}
                >
                  <BentoGridItem
                    title={pub.shortTitle}
                    description={pub.abstract}
                    header={
                      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors group-hover:border-primary/20 flex items-center justify-center group-hover:scale-[1.02] duration-500">
                        <Icon className="w-12 h-12 text-neutral-400 group-hover:text-primary transition-colors duration-500 opacity-50 group-hover:opacity-100" />
                      </div>
                    }
                    icon={<Icon className="h-4 w-4 text-neutral-500" />}
                    className="h-full"
                  />
                </Link>
              );
            })}
          </BentoGrid>
        </div>
      </section>

      {/* Archive Section */}
      {otherPubs.length > 0 && (
        <section className="py-20 bg-neutral-50/50 dark:bg-neutral-900/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-10">Publication Archive</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherPubs.map((pub) => (
                <Link key={pub.slug} href={`/publications/${pub.slug}`} className="group block p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{pub.shortTitle}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{pub.abstract}</p>
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    Read Paper <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Books Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Research Books</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {books.map((book) => (
              <Link key={book.slug} href={`/books/${book.slug}`} className="group flex items-start gap-6 p-6 rounded-3xl border border-border bg-card hover:bg-muted/50 transition-all hover:shadow-xl hover:border-primary/20">
                <div className={`w-32 h-44 shrink-0 rounded-lg shadow-md bg-gradient-to-br ${book.coverGradient || 'from-primary/20 to-primary/5'} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                  <BookOpen className="w-10 h-10 text-white/90" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    by {book.author} • {book.date}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {book.description}
                  </p>
                  <div className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {book.chapters} Chapters
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 text-primary">
            <Bot className="w-5 h-5" />
            <span className="font-bold">Cortex Lab</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Collaborative Autonomous Research Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
