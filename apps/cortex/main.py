import os
import argparse
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from agents import ScientistAgent, ReviewerAgent, EditorAgent

# Load environment variables
load_dotenv()

console = Console()

def main():
    parser = argparse.ArgumentParser(description="Run a multi-agent peer review simulation.")
    parser.add_argument("--topic", type=str, required=True, help="The research topic to explore.")
    args = parser.parse_args()

    console.print(Panel.fit(f"[bold blue]Cortex: Autonomous Research Agent System[/bold blue]\nTopic: {args.topic}", border_style="blue"))

    # 1. Scientist generates draft
    console.print("\n[bold green]Step 1: Scientist Generating Draft...[/bold green]")
    scientist = ScientistAgent()
    draft = scientist.generate_draft(args.topic)
    console.print(Panel(Markdown(draft), title="Scientist's Draft", border_style="green"))

    # 2. Reviewer critiques draft
    console.print("\n[bold yellow]Step 2: Reviewer Analyzing...[/bold yellow]")
    reviewer = ReviewerAgent()
    critique = reviewer.review_draft(draft)
    console.print(Panel(Markdown(critique), title="Peer Review Critique", border_style="yellow"))

    # 3. Editor finalizes
    console.print("\n[bold magenta]Step 3: Editor Synthesizing Final Version...[/bold magenta]")
    editor = EditorAgent()
    final_version = editor.finalize_draft(draft, critique)
    console.print(Panel(Markdown(final_version), title="Final Publication", border_style="magenta"))

    # 4. Save to file
    output_dir = "reports"
    os.makedirs(output_dir, exist_ok=True)
    filename = f"{args.topic.replace(' ', '_').lower()}.md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, "w") as f:
        f.write(final_version)
        
    console.print(f"\n[bold green]Report saved to {filepath}[/bold green]")

if __name__ == "__main__":
    main()
