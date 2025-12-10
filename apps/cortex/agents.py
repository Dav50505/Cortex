import os
from openai import OpenAI
from typing import List, Optional
from rich.console import Console
from rich.panel import Panel

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

class ScientistAgent(BaseAgent):
    def __init__(self):
        super().__init__("Scientist", "Researcher")
    
    def generate_draft(self, topic: str) -> str:
        system_prompt = (
            "You are a senior research scientist. Your goal is to write a clear, "
            "concise, and scientifically accurate draft on the given topic. "
            "Focus on hypothesis, methodology, and potential impact. "
            "Do not use markdown formatting like bolding or headers, just plain text paragraphs."
        )
        return self.chat(f"Write a research draft about: {topic}", system_prompt)

class ReviewerAgent(BaseAgent):
    def __init__(self):
        super().__init__("Reviewer", "Critic")
    
    def review_draft(self, draft: str) -> str:
        system_prompt = (
            "You are a critical peer reviewer. Your job is to find flaws, "
            "logical inconsistencies, or missing context in the provided draft. "
            "Be constructive but rigorous. List your 3 main critiques."
        )
        return self.chat(f"Review this draft:\n\n{draft}", system_prompt)

class EditorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Editor", "Synthesizer")
    
    def finalize_draft(self, original_draft: str, critique: str) -> str:
        system_prompt = (
            "You are a senior editor. Your goal is to produce a final, polished version "
            "of a research paper. You have the original draft and a peer review critique. "
            "Integrate the valid points from the critique to improve the draft. "
            "Ensure the tone is professional and authoritative."
        )
        prompt = (
            f"Original Draft:\n{original_draft}\n\n"
            f"Critique:\n{critique}\n\n"
            "Please rewrite the draft to address the critique."
        )
        return self.chat(prompt, system_prompt)
