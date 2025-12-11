import os
import argparse
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from agents_improved import ScientistAgent, ReviewerAgent, EditorAgent, FactCheckerAgent
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
    parser = argparse.ArgumentParser(description="Run an improved multi-agent peer review simulation with fact-checking.")
    parser.add_argument("--topic", type=str, required=True, help="The research topic to explore.")
    parser.add_argument("--use-improved", action="store_true", default=True, help="Use improved agents with fact-checking (default: True)")
    args = parser.parse_args()

    # Initialize Database
    db = CortexDB()

    console.print(Panel.fit(
        f"[bold blue]Cortex: Improved Research Agent System[/bold blue]\n"
        f"Topic: {args.topic}\n"
        f"Mode: {'Improved (with fact-checking)' if args.use_improved else 'Standard'}",
        border_style="blue"
    ))

    # 1. Scientist generates draft
    console.print("\n[bold green]Step 1: Scientist Generating Draft...[/bold green]")
    scientist = ScientistAgent()
    draft = scientist.generate_draft(args.topic)
    console.print(Panel(Markdown(draft[:2000] + "..."), title="Scientist's Draft (v1) [Preview]", border_style="green"))

    # 2. Fact-checker validates draft (NEW STEP)
    if args.use_improved:
        console.print("\n[bold yellow]Step 2: Fact-Checker Validating Draft...[/bold yellow]")
        fact_checker = FactCheckerAgent()
        issues = fact_checker.validate_draft(draft)
        fix_suggestions = fact_checker.generate_fix_suggestions(issues)
        
        if any(issues.values()):
            console.print(Panel(
                Markdown(fix_suggestions),
                title="Fact-Checker Issues Found",
                border_style="yellow"
            ))
        else:
            console.print("[bold green]✅ No major fact-checking issues found![/bold green]")

    # 3. Reviewer critiques draft
    console.print("\n[bold yellow]Step 3: Reviewer Analyzing...[/bold yellow]")
    reviewer = ReviewerAgent()
    critique = reviewer.review_draft(draft)
    console.print(Panel(Markdown(critique[:1500] + "..."), title="Peer Review Critique [Preview]", border_style="yellow"))
    
    # Include fact-checker findings in critique if available
    if args.use_improved and any(issues.values()):
        critique = f"{critique}\n\n## Fact-Checker Findings\n\n{fix_suggestions}"

    # 4. Scientist revises draft (Self-Correction)
    console.print("\n[bold green]Step 4: Scientist Revising based on Feedback...[/bold green]")
    revised_draft = scientist.revise_draft(draft, critique)
    console.print(Panel(Markdown(revised_draft[:2000] + "..."), title="Scientist's Revised Draft (v2) [Preview]", border_style="green"))

    # 5. Fact-checker validates revised draft (NEW STEP)
    if args.use_improved:
        console.print("\n[bold yellow]Step 5: Fact-Checker Validating Revised Draft...[/bold yellow]")
        issues_v2 = fact_checker.validate_draft(revised_draft)
        fix_suggestions_v2 = fact_checker.generate_fix_suggestions(issues_v2)
        
        if any(issues_v2.values()):
            console.print(Panel(
                Markdown(fix_suggestions_v2),
                title="Remaining Fact-Checker Issues",
                border_style="yellow"
            ))
            # Add to critique for final revision if needed
            if any(issues_v2.values()):
                critique = f"{critique}\n\n## Additional Fact-Checker Findings (Post-Revision)\n\n{fix_suggestions_v2}"
                console.print("[bold yellow]⚠️  Some issues remain. Consider another revision pass.[/bold yellow]")

    # 6. Editor finalizes
    console.print("\n[bold magenta]Step 6: Editor Publishing...[/bold magenta]")
    editor = EditorAgent()
    final_version = editor.finalize_draft(revised_draft)
    console.print(Panel(Markdown(final_version[:2000] + "..."), title="Final Publication [Preview]", border_style="magenta"))

    # 7. Generate Summary
    console.print("\n[bold magenta]Step 7: Generating Summary...[/bold magenta]")
    summary = editor.summarize_paper(final_version)
    console.print(Panel(Markdown(summary), title="Summary", border_style="magenta"))

    # 8. Generate PDF
    console.print("\n[bold magenta]Step 8: Generating PDF...[/bold magenta]")
    output_dir = "reports"
    os.makedirs(output_dir, exist_ok=True)
    pdf_filename = f"{args.topic.replace(' ', '_').lower()}.pdf"
    pdf_path = os.path.join(output_dir, pdf_filename)
    
    convert_markdown_to_pdf(final_version, pdf_path)
    console.print(f"[bold green]PDF saved to {pdf_path}[/bold green]")

    # 9. Save to Database
    doc_id = db.insert("publications", {
        "topic": args.topic,
        "draft_v1": draft,
        "critique": critique,
        "draft_v2": revised_draft,
        "final_output": final_version,
        "summary": summary,
        "pdf_path": os.path.abspath(pdf_path),
        "agents": ["Scientist", "FactChecker", "Reviewer", "Editor"] if args.use_improved else ["Scientist", "Reviewer", "Editor"],
        "fact_check_issues": issues if args.use_improved else None,
        "fact_check_issues_v2": issues_v2 if args.use_improved else None
    })
    console.print(f"\n[bold cyan]Saved to CortexDB (ID: {doc_id})[/bold cyan]")

    # 10. Save to file
    filename = f"{args.topic.replace(' ', '_').lower()}.md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(final_version)
        
    console.print(f"[bold green]Report saved to {filepath}[/bold green]")
    
    # Print summary of improvements
    if args.use_improved:
        console.print("\n[bold cyan]📊 Quality Improvements Applied:[/bold cyan]")
        console.print("  ✅ Strict guidelines against fabricating data")
        console.print("  ✅ Technical accuracy validation (metrics, taxonomies)")
        console.print("  ✅ Reference consistency checking")
        console.print("  ✅ Standard terminology enforcement")
        console.print("  ✅ Fact-checking at multiple stages")

if __name__ == "__main__":
    main()

