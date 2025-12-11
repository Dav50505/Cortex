import os
import argparse
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from agents import ScientistAgent, ReviewerAgent, EditorAgent
from database import CortexDB
import markdown2
from fpdf import FPDF

# Load environment variables
load_dotenv()

console = Console()

def convert_markdown_to_pdf(markdown_text, output_path):
    try:
        # Replace common Unicode characters that cause issues with ASCII equivalents
        text = markdown_text.replace('–', '-').replace('—', '-').replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'").replace('…', '...')
        
        html = markdown2.markdown(text)
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("helvetica", size=12)
        # FPDF2 write_html handles basic HTML tags
        pdf.write_html(html)
        pdf.output(output_path)
        return True
    except Exception as e:
        console.print(f"[bold red]Error generating PDF:[/bold red] {e}")
        # Try a simpler text-based approach as fallback
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Courier", size=9)
            # Clean text and split into lines
            clean_text = markdown_text.replace('–', '-').replace('—', '-').replace('"', '"').replace('"', '"')
            clean_text = clean_text.replace(''', "'").replace(''', "'")
            for line in clean_text.split('\n'):
                if line.strip():
                    # Truncate long lines to fit page width
                    line = line[:90] if len(line) > 90 else line
                    pdf.cell(0, 8, line, ln=1)
            pdf.output(output_path)
            console.print(f"[bold yellow]PDF generated with simplified formatting[/bold yellow]")
            return True
        except Exception as e2:
            console.print(f"[bold yellow]Warning: PDF generation failed, but markdown file was saved[/bold yellow]")
            return False

def main():
    parser = argparse.ArgumentParser(description="Run a multi-agent peer review simulation.")
    parser.add_argument("--topic", type=str, required=True, help="The research topic to explore.")
    args = parser.parse_args()

    # Initialize Database
    db = CortexDB()

    console.print(Panel.fit(f"[bold blue]Cortex: Autonomous Research Agent System[/bold blue]\nTopic: {args.topic}", border_style="blue"))

    # 1. Scientist generates draft
    console.print("\n[bold green]Step 1: Scientist Generating Draft...[/bold green]")
    scientist = ScientistAgent()
    draft = scientist.generate_draft(args.topic)
    console.print(Panel(Markdown(draft), title="Scientist's Draft (v1)", border_style="green"))

    # 2. Reviewer critiques draft
    console.print("\n[bold yellow]Step 2: Reviewer Analyzing...[/bold yellow]")
    reviewer = ReviewerAgent()
    critique = reviewer.review_draft(draft)
    console.print(Panel(Markdown(critique), title="Peer Review Critique", border_style="yellow"))

    # 3. Scientist revises draft (Self-Correction)
    console.print("\n[bold green]Step 3: Scientist Revising based on Feedback...[/bold green]")
    revised_draft = scientist.revise_draft(draft, critique)
    console.print(Panel(Markdown(revised_draft), title="Scientist's Revised Draft (v2)", border_style="green"))

    # 4. Editor finalizes
    console.print("\n[bold magenta]Step 4: Editor Publishing...[/bold magenta]")
    editor = EditorAgent()
    final_version = editor.finalize_draft(revised_draft)
    console.print(Panel(Markdown(final_version), title="Final Publication", border_style="magenta"))

    # 5. Generate Summary
    console.print("\n[bold magenta]Step 5: Generating Summary...[/bold magenta]")
    summary = editor.summarize_paper(final_version)
    console.print(Panel(Markdown(summary), title="Summary", border_style="magenta"))

    # 6. Generate PDF
    console.print("\n[bold magenta]Step 6: Generating PDF...[/bold magenta]")
    output_dir = "reports"
    os.makedirs(output_dir, exist_ok=True)
    pdf_filename = f"{args.topic.replace(' ', '_').lower()}.pdf"
    pdf_path = os.path.join(output_dir, pdf_filename)
    
    convert_markdown_to_pdf(final_version, pdf_path)
    console.print(f"[bold green]PDF saved to {pdf_path}[/bold green]")

    # 7. Save to Database
    doc_id = db.insert("publications", {
        "topic": args.topic,
        "draft_v1": draft,
        "critique": critique,
        "draft_v2": revised_draft,
        "final_output": final_version,
        "summary": summary,
        "pdf_path": os.path.abspath(pdf_path),
        "agents": ["Scientist", "Reviewer", "Editor"]
    })
    console.print(f"\n[bold cyan]Saved to CortexDB (ID: {doc_id})[/bold cyan]")

    # 8. Save to file (Legacy)
    filename = f"{args.topic.replace(' ', '_').lower()}.md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, "w") as f:
        f.write(final_version)
        
    console.print(f"[bold green]Report saved to {filepath}[/bold green]")

if __name__ == "__main__":
    main()
