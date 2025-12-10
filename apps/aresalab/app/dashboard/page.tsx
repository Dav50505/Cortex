import fs from 'fs';
import path from 'path';
import {
    BarChart3,
    Cpu,
    FileText,
    Users,
    Zap,
    Clock,
    Database
} from 'lucide-react';
import { DeleteButton } from './DeleteButton';

export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        const dbPath = path.resolve(process.cwd(), '..', 'cortex', 'data', 'cortex_db.json');

        if (!fs.existsSync(dbPath)) {
            return null;
        }

        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const data = JSON.parse(fileContent);
        const papers = data.publications || [];

        // Calculate stats
        const totalPapers = papers.length;
        const totalAgents = papers.reduce((acc: number, p: any) => acc + (p.agents?.length || 0), 0);
        const totalWords = papers.reduce((acc: number, p: any) => acc + (p.final_output?.split(' ').length || 0), 0);

        // Group by date
        const papersByDate: Record<string, number> = {};
        papers.forEach((p: any) => {
            const date = p._timestamp ? new Date(p._timestamp).toISOString().split('T')[0] : 'Unknown';
            papersByDate[date] = (papersByDate[date] || 0) + 1;
        });

        // Sort dates
        const sortedDates = Object.keys(papersByDate).sort();
        const chartData = sortedDates.map(date => ({
            date,
            count: papersByDate[date]
        })).slice(-7); // Last 7 days

        return {
            totalPapers,
            totalAgents,
            totalWords,
            chartData,
            recentPapers: papers.slice(-5).reverse()
        };
    } catch (error) {
        console.error('Error reading stats:', error);
        return null;
    }
}

export default async function DashboardPage() {
    const stats = await getStats();

    if (!stats) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-center">
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
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                        <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" />
                        System Performance
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Real-time metrics from the Cortex multi-agent swarm.
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Total Papers"
                        value={stats.totalPapers}
                        icon={FileText}
                        color="emerald"
                    />
                    <StatCard
                        label="Agent Interactions"
                        value={stats.totalAgents}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        label="Words Generated"
                        value={stats.totalWords.toLocaleString()}
                        icon={Zap}
                        color="amber"
                    />
                    <StatCard
                        label="Active Models"
                        value="3"
                        icon={Cpu}
                        color="purple"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Research Output (Last 7 Days)</h2>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {stats.chartData.map((item) => (
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

                    {/* Recent Activity */}
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
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    +12%
                </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </div>
        </div>
    );
}
