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
import { DashboardClient } from './DashboardClient';

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

    return <DashboardClient stats={stats} />;
}

