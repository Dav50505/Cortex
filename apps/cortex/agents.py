import os
from openai import OpenAI
from typing import List, Optional, Tuple
import re
from rich.console import Console
from rich.panel import Panel
from duckduckgo_search import DDGS

console = Console()

class BaseAgent:
    def __init__(self, name: str, role: str, model: str = None):
        self.name = name
        self.role = role
        self.client = OpenAI(
            base_url=os.getenv("LLM_BASE_URL", "http://localhost:11434/v1"),
            api_key=os.getenv("LLM_API_KEY", "ollama")
        )
        self.model = model or os.getenv("LLM_MODEL", "llama3")

    def chat(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            console.print(f"[bold red]Error communicating with LLM:[/bold red] {e}")
            return f"Error: {e}"

    def read_file(self, file_path: str) -> str:
        """Tool: Reads a file from the local filesystem."""
        try:
            with open(file_path, 'r') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file {file_path}: {e}"

    def search_web(self, query: str, max_results: int = 5) -> str:
        """Tool: Searches the web for the given query."""
        try:
            results = DDGS().text(query, max_results=max_results)
            if not results:
                return "No results found."
            formatted_results = "\n".join([f"- {r['title']}: {r['body']} ({r['href']})" for r in results])
            return formatted_results
        except Exception as e:
            console.print(f"[bold red]Error searching web:[/bold red] {e}")
            return f"Error searching web: {e}"

    def split_markdown_sections(self, text: str) -> List[Tuple[str, str]]:
        """Helper: Splits markdown text into sections based on headers."""
        lines = text.split('\n')
        sections = []
        current_title = "Preamble"
        current_content = []

        for line in lines:
            if line.strip().startswith('#'):
                if current_content:
                    sections.append((current_title, '\n'.join(current_content)))
                current_title = line.strip()
                current_content = [line]
            else:
                current_content.append(line)
        
        if current_content:
            sections.append((current_title, '\n'.join(current_content)))
            
        return sections

class ScientistAgent(BaseAgent):
    def __init__(self):
        model = os.getenv("SCIENTIST_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Scientist", "Researcher", model=model)
    
    def generate_draft(self, topic: str, context: str = "") -> str:
        # 1. Perform Web Research
        console.print(f"[cyan]🔍 Researching topic on the web: {topic}...[/cyan]")
        web_results = self.search_web(topic, max_results=5)
        
        full_context = f"{context}\n\nWEB RESEARCH RESULTS:\n{web_results}"

        # 2. Generate Outline
        console.print("[cyan]📋 Generating detailed outline...[/cyan]")
        outline_prompt = (
            f"Create a comprehensive outline for a 5000-word research paper on '{topic}'. "
            "The outline MUST have 6-8 main sections, including a MANDATORY 'Evaluation' or 'Experiments' section. "
            "Other sections should include: Abstract, Introduction, Related Work, Methodology, Results, Conclusion. "
            "Return ONLY the list of section titles, one per line."
        )
        outline_response = self.chat(outline_prompt, system_prompt="You are a research architect. Plan a massive, detailed paper.")
        sections = [s.strip().strip('- ').strip('1234567890. ') for s in outline_response.split('\n') if s.strip()]
        
        # 3. Write Section by Section
        full_draft = f"# {topic}\n\n"
        
        for section in sections:
            console.print(f"[cyan]✍️  Writing section: {section}...[/cyan]")
            section_prompt = (
                f"Write the '{section}' section for the paper on '{topic}'.\n\n"
                f"CONTEXT: {full_context}\n\n"
                f"CURRENT DRAFT SO FAR (Summary): {full_draft[:500]}...\n\n" # Pass a bit of context
                "REQUIREMENTS:\n"
                "1. LENGTH: Write at least 1000 words for this section. Go deep.\n"
                "2. CONTENT: Be extremely detailed, rigorous, and academic.\n"
                "3. EVALUATION: If this is the Evaluation/Experiments section, you MUST include concrete metrics, simulated data tables, or theoretical bounds. Do not be vague.\n"
                "4. MATH: If applicable (Methodology/Framework), use LaTeX math ($P(x)$).\n"
                "5. FORMAT: Markdown. Start with '## {section}'."
            )
            section_content = self.chat(section_prompt, system_prompt=f"You are writing the {section} section of a major paper.")
            full_draft += section_content + "\n\n"
            
        # 4. Generate References Section explicitly
        console.print("[cyan]📚 Compiling References...[/cyan]")
        references_prompt = (
            f"Create a 'References' section for the paper on '{topic}'.\n"
            f"Based ONLY on the following web research results:\n{web_results}\n\n"
            "REQUIREMENTS:\n"
            "1. List every source mentioned in the web results.\n"
            "2. Format as a proper bibliography (Title, URL, Summary).\n"
            "3. DO NOT invent sources. Use the ones provided.\n"
            "4. Start with '## References'."
        )
        references_section = self.chat(references_prompt, system_prompt="You are a bibliographer.")
        full_draft += references_section + "\n\n"

        return full_draft

    def revise_draft(self, original_draft: str, feedback: str) -> str:
        sections = self.split_markdown_sections(original_draft)
        full_revised_draft = ""
        
        console.print(f"[cyan]🔄 Revising draft in {len(sections)} sections...[/cyan]")

        for title, content in sections:
            # Skip empty sections or just the main title if it has no content
            if len(content.strip()) < 10:
                full_revised_draft += content + "\n"
                continue

            console.print(f"[cyan]  - Revising section: {title[:50]}...[/cyan]")
            
            system_prompt = (
                "You are a humble and rigorous scientist. You have received peer review feedback "
                "on your draft. Your goal is to rewrite this specific section to address the critique. "
                "CRITICAL: Return the COMPLETE updated section content. Do not summarize."
            )
            prompt = (
                f"Original Section Content:\n{content}\n\n"
                f"Peer Review Feedback (Apply where relevant to this section):\n{feedback}\n\n"
                "Please rewrite this section to address the feedback. Return the FULL section text."
            )
            revised_section = self.chat(prompt, system_prompt)
            full_revised_draft += revised_section + "\n\n"
            
        return full_revised_draft

class ReviewerAgent(BaseAgent):
    def __init__(self):
        model = os.getenv("REVIEWER_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Reviewer", "Critic", model=model)
    
    def review_draft(self, draft: str) -> str:
        system_prompt = (
            f"You are a critical {self.role}. Your name is {self.name}. "
            "Review the following draft research paper.\n"
            "CRITERIA:\n"
            "1. LOGIC: Are the arguments sound?\n"
            "2. MATH: Are the mathematical proofs rigorous and correct? (Check for formal definitions)\n"
            "3. EVALUATION: Is there a distinct evaluation section? Is it rigorous? Are there clear metrics and baselines?\n"
            "4. NOVELTY: Is the contribution clear?\n"
            "5. CLARITY: Is the writing precise?\n\n"
            "Provide constructive feedback to improve the paper. Be specific about missing evaluation metrics."
        )
        return self.chat(f"Review this draft:\n\n{draft}", system_prompt)

class EditorAgent(BaseAgent):
    def __init__(self):
        model = os.getenv("EDITOR_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Editor", "Synthesizer", model=model)
    
    def finalize_draft(self, revised_draft: str) -> str:
        sections = self.split_markdown_sections(revised_draft)
        final_publication = ""
        
        console.print(f"[magenta]✨ Finalizing publication in {len(sections)} sections...[/magenta]")

        for title, content in sections:
             # Skip empty sections
            if len(content.strip()) < 10:
                final_publication += content + "\n"
                continue

            console.print(f"[magenta]  - Polishing section: {title[:50]}...[/magenta]")

            system_prompt = (
                "You are a senior editor. Your goal is to polish this specific section of a research paper. "
                "Format it beautifully with Markdown. "
                "CRITICAL: DO NOT SUMMARIZE. Retain all content and details. "
                "Just improve the flow, tone, and formatting."
            )
            final_section = self.chat(f"Finalize this section:\n\n{content}", system_prompt)
            final_publication += final_section + "\n\n"
            
        return final_publication

    def summarize_paper(self, paper_content: str) -> str:
        console.print("[magenta]📝 Generating summary...[/magenta]")
        system_prompt = (
            "You are a science communicator. Your goal is to summarize a complex research paper "
            "into a concise, engaging 400-500 word summary for a general audience. "
            "Focus on the key findings, implications, and the 'big picture'. "
            "Do not use technical jargon if possible."
        )
        # We might need to truncate input if it's too long for context, but usually 5000 words fits in input context (just not output)
        # Llama 3 8k context can handle ~6000 words input.
        return self.chat(f"Summarize this paper:\n\n{paper_content[:20000]}", system_prompt)
