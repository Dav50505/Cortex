import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    console.log(`[Delete API] Request to delete: ${slug}`);

    try {
        // Use absolute path to ensure DB is found
        const dbPath = '/Users/davidginzburg/coding/aresa/apps/cortex/data/cortex_db.json';

        if (!fs.existsSync(dbPath)) {
            return new NextResponse('Database not found', { status: 404 });
        }

        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const data = JSON.parse(fileContent);
        const rawPapers = data.publications || [];

        // Filter out the paper
        const newPapers = rawPapers.filter((p: any) => p._id !== slug);

        if (newPapers.length === rawPapers.length) {
            return new NextResponse('Paper not found', { status: 404 });
        }

        // Save back to DB
        data.publications = newPapers;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

        console.log(`[Delete API] Deleted paper: ${slug}`);
        return new NextResponse('Deleted successfully', { status: 200 });

    } catch (error) {
        console.error('[Delete API] Error deleting paper:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
