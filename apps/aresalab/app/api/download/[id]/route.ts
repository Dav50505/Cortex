import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`[Download API] Request for id: ${id}`);

    try {
        // Use absolute path to ensure DB is found
        const dbPath = '/Users/davidginzburg/coding/aresa/apps/cortex/data/cortex_db.json';

        if (!fs.existsSync(dbPath)) {
            console.error(`[Download API] DB file not found at ${dbPath}`);
            return new NextResponse('Database not found', { status: 404 });
        }

        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        const data = JSON.parse(fileContent);
        const paper = data.publications?.find((p: any) => p._id === id);

        if (!paper) {
            console.error(`[Download API] Paper not found with ID: ${id}`);
            return new NextResponse('Paper not found', { status: 404 });
        }

        console.log(`[Download API] Found paper: ${paper.topic}`);

        // If PDF exists, serve PDF
        if (paper.pdf_path && fs.existsSync(paper.pdf_path)) {
            const pdfBuffer = fs.readFileSync(paper.pdf_path);
            const filename = `${paper.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;

            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                },
            });
        }

        // Fallback to Markdown content
        if (paper.final_output) {
            const filename = `${paper.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

            return new NextResponse(paper.final_output, {
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                },
            });
        }

        return new NextResponse('No downloadable content found', { status: 404 });

    } catch (error) {
        console.error('[Download API] Error serving download:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
