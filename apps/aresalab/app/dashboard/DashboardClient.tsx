"use client";

import Link from 'next/link';
import {
    BarChart3,
    Cpu,
    FileText,
    Users,
    Zap,
    Clock,
    Database,
    ArrowLeft
} from 'lucide-react';
import { DeleteButton } from './DeleteButton';
import { AnimatedNumber, Shimmer, AnimatedGradientBorder, MeshGradient, DotPattern, AnimatedOrbs } from '../components/magic';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <Shimmer className="group">
            <AnimatedGradientBorder
                borderColor={`${color === 'emerald' ? 'from-emerald-500 to-teal-500' : color === 'blue' ? 'from-blue-500 to-cyan-500' : color === 'amber' ? 'from-amber-500 to-orange-500' : 'from-purple-500 to-pink-500'}`}
                className="h-full"
            >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {typeof value === 'number' ? (
                            <AnimatedNumber value={value} />
                        ) : (
                            value
                        )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {label}
                    </div>
                </div>
            </AnimatedGradientBorder>
        </Shimmer>
    );
}

export function DashboardClient({ stats }: { stats: any }) {
    if (!stats) {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
                <MeshGradient 
                  colors={[
                    "rgba(16, 185, 129, 0.15)",
                    "rgba(59, 130, 246, 0.12)",
                    "rgba(139, 92, 246, 0.12)",
                  ]}
                />
                <AnimatedOrbs count={3} />
                <DotPattern className="opacity-20" />
                <div className="text-center relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No Data Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Run a Cortex simulation to generate data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-12 relative overflow-hidden">
            {/* Modern Background Design */}
            <MeshGradient 
              colors={[
                "rgba(16, 185, 129, 0.15)",
                "rgba(59, 130, 246, 0.12)",
                "rgba(139, 92, 246, 0.12)",
              ]}
            />
            <AnimatedOrbs count={4} />
            <DotPattern
              className="opacity-25 dark:opacity-15"
              width={20}
              height={20}
              cx={1}
              cy={1}
              cr={1.5}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                        <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" />
                        System Performance
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Real-time metrics from the Cortex multi-agent swarm.
                    </p>
                </motion.div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <StatCard
                            label="Total Papers"
                            value={stats.totalPapers}
                            icon={FileText}
                            color="emerald"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <StatCard
                            label="Agent Interactions"
                            value={stats.totalAgents}
                            icon={Users}
                            color="blue"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <StatCard
                            label="Words Generated"
                            value={stats.totalWords}
                            icon={Zap}
                            color="amber"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <StatCard
                            label="Active Models"
                            value={3}
                            icon={Cpu}
                            color="purple"
                        />
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Shimmer>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Research Output (Last 7 Days)</h2>
                                <div className="h-64 flex items-end justify-between gap-2">
                                    {stats.chartData.map((item: any) => (
                                        <div key={item.date} className="flex-1 flex flex-col items-center group">
                                            <div
                                                className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-lg relative group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors"
                                                style={{ height: `${Math.max((item.count / 10) * 100, 10)}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.count} papers
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500 rotate-45 origin-left translate-y-2">
                                                {item.date.slice(5)}
                                            </div>
                                        </div>
                                    ))}
                                    {stats.chartData.length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No activity yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Shimmer>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Shimmer>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Recent Generations</h2>
                                <div className="space-y-4">
                                    {stats.recentPapers.map((paper: any) => (
                                        <div key={paper._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex-shrink-0">
                                                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                                                        {paper.topic}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(paper._timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                                    {paper.agents.length} Agents
                                                </div>
                                                <DeleteButton id={paper._id} title={paper.topic} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Shimmer>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

