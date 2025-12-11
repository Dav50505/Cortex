import os
from openai import OpenAI
from typing import List, Optional, Tuple, Dict
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

    def chat(self, prompt: str, system_prompt: Optional[str] = None, temperature: float = 0.7) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            console.print(f"[bold red]Error communicating with LLM:[/bold red] {e}")
            return f"Error: {e}"

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
    """Improved Scientist Agent with strict guidelines against fabricating data."""
    
    def __init__(self):
        model = os.getenv("SCIENTIST_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Scientist", "Researcher", model=model)
    
    def generate_draft(self, topic: str, context: str = "") -> str:
        # 1. Perform Web Research
        console.print(f"[cyan]🔍 Researching topic on the web: {topic}...[/cyan]")
        web_results = self.search_web(topic, max_results=10)
        
        # Search for specific technical terms and standard taxonomies
        console.print(f"[cyan]🔍 Researching standard terminology and taxonomies...[/cyan]")
        taxonomy_query = f"{topic} standard taxonomy classification categories"
        taxonomy_results = self.search_web(taxonomy_query, max_results=5)
        
        full_context = f"{context}\n\nWEB RESEARCH RESULTS:\n{web_results}\n\nTAXONOMY RESEARCH:\n{taxonomy_results}"

        # 2. Generate Outline
        console.print("[cyan]📋 Generating detailed outline...[/cyan]")
        outline_prompt = (
            f"Create a comprehensive outline for a 5000-word research paper on '{topic}'. "
            "The outline MUST have 6-8 main sections, including a MANDATORY 'Evaluation' or 'Experiments' section. "
            "Other sections should include: Abstract, Introduction, Related Work, Methodology, Results, Conclusion. "
            "Return ONLY the list of section titles, one per line."
        )
        outline_response = self.chat(outline_prompt, system_prompt="You are a research architect. Plan a detailed, rigorous paper.")
        sections = [s.strip().strip('- ').strip('1234567890. ') for s in outline_response.split('\n') if s.strip()]
        
        # 3. Write Section by Section
        full_draft = f"# {topic}\n\n"
        
        for section in sections:
            console.print(f"[cyan]✍️  Writing section: {section}...[/cyan]")
            
            # Special handling for different section types
            if "experiment" in section.lower() or "evaluation" in section.lower():
                section_guidelines = self._get_experiment_guidelines()
            elif "methodology" in section.lower() or "framework" in section.lower():
                section_guidelines = self._get_methodology_guidelines()
            elif "taxonomy" in section.lower() or "types" in section.lower() or "categories" in section.lower():
                section_guidelines = self._get_taxonomy_guidelines(topic)
            else:
                section_guidelines = self._get_general_guidelines()
            
            section_prompt = (
                f"Write the '{section}' section for the paper on '{topic}'.\n\n"
                f"CONTEXT: {full_context}\n\n"
                f"CURRENT DRAFT SO FAR (Summary): {full_draft[:500]}...\n\n"
                f"{section_guidelines}\n\n"
                "FORMAT: Markdown. Start with '## {section}'."
            )
            section_content = self.chat(section_prompt, system_prompt=self._get_scientist_system_prompt(), temperature=0.5)
            full_draft += section_content + "\n\n"
            
        # 4. Generate References Section explicitly
        console.print("[cyan]📚 Compiling References...[/cyan]")
        references_prompt = (
            f"Create a 'References' section for the paper on '{topic}'.\n"
            f"Based ONLY on the following web research results:\n{web_results}\n\n"
            "CRITICAL REQUIREMENTS:\n"
            "1. List ONLY sources from the web research results provided.\n"
            "2. Format as proper academic citations: Author, Title, URL/Publication, Year (if available).\n"
            "3. DO NOT invent or fabricate any sources.\n"
            "4. If a source is missing information, note it as '[Information not available]'.\n"
            "5. Number references sequentially [1], [2], [3], etc. - ensure each number is used only once.\n"
            "6. Start with '## References'.\n"
            "7. DO NOT include placeholder text like:\n"
            "   - 'continue with remaining references'\n"
            "   - '[Insert relevant references here]'\n"
            "   - '... (continue with the remaining references)'\n"
            "   - Any other placeholder or incomplete text\n"
            "8. Verify that citation numbers in the text match the reference list.\n"
            "9. If you cannot find complete citation information, list what you have and note missing parts."
        )
        references_section = self.chat(references_prompt, system_prompt="You are a rigorous bibliographer. Only cite real sources.", temperature=0.3)
        full_draft += references_section + "\n\n"

        return full_draft

    def _get_scientist_system_prompt(self) -> str:
        return """You are a rigorous academic researcher writing a research paper. 

CRITICAL RULES:
1. NEVER fabricate experimental data, metrics, or results. If discussing experiments, clearly state they are hypothetical examples or cite real sources.
2. Use standard terminology and taxonomies from the field. Research standard categorizations before writing.
3. Define technical terms correctly (e.g., F1-score = harmonic mean of precision and RECALL, not accuracy).
4. Distinguish between precision, recall, accuracy, and F1-score - they are NOT interchangeable. Never say metrics are "interchangeable."
5. When discussing algorithmic complexity:
   - If you don't have exact complexity analysis, use qualitative descriptions ("inefficient", "scales poorly", "computationally expensive")
   - DO NOT make up Big-O notation without proper analysis
   - If complexity is uncertain, skip it entirely rather than guessing
6. Separate algorithmic complexity (time/space complexity) from task performance metrics (precision, recall, etc.) - they are different concepts.
7. Avoid generic template phrases like "Our experiments show..." unless you're describing actual experiments with real data.
8. Write in a clear, specific voice. Avoid repetitive padding and generic statements.
9. NEVER include meta-feedback sentences like "This revision addresses peer review feedback by..." or "This section responds to reviewer concerns..." - write as if this is the original paper, not a revision log.
10. If you don't have real data, use phrases like "For example, a hypothetical robot might..." or "Consider a scenario where..."
11. Base all claims on the research context provided or clearly mark them as theoretical/hypothetical.
12. When discussing precision vs recall, explain when each matters more (e.g., precision for false positives are costly, recall for missing cases is critical)."""

    def _get_experiment_guidelines(self) -> str:
        return """EXPERIMENT/EVALUATION SECTION REQUIREMENTS:
1. DO NOT fabricate specific numbers like "85% accuracy" or "30% improvement" unless you have real data.
2. If describing hypothetical experiments, clearly label them as such: "As a hypothetical example..." or "Consider a scenario where..."
3. Focus on methodology, metrics definitions, and theoretical analysis rather than fake results.
4. If discussing real experiments, cite the source clearly.
5. Define metrics correctly and explain when each matters:
   - Precision = TP / (TP + FP) - important when false positives are costly
   - Recall = TP / (TP + FN) - important when missing cases is critical
   - F1-score = 2 * (Precision * Recall) / (Precision + Recall) - balances both
   - Accuracy = (TP + TN) / (TP + TN + FP + FN) - overall correctness
   - NEVER say these metrics are "interchangeable" - they measure different things
6. Algorithmic complexity:
   - If you don't have proper complexity analysis, use qualitative terms: "inefficient", "scales poorly", "computationally expensive"
   - DO NOT make up Big-O notation (O(n), O(n²), etc.) without proper analysis
   - If uncertain about complexity, skip it entirely - better to omit than guess incorrectly
   - Discuss complexity separately from performance metrics (they are different concepts)
7. Include theoretical bounds or known benchmarks from literature if available."""

    def _get_methodology_guidelines(self) -> str:
        return """METHODOLOGY SECTION REQUIREMENTS:
1. Describe methods clearly and rigorously.
2. Use proper mathematical notation with LaTeX ($P(x)$, $\\theta$, etc.).
3. Define all variables and parameters.
4. Explain the rationale for methodological choices.
5. If comparing methods, cite standard approaches from the literature.
6. Avoid vague descriptions - be specific about algorithms, parameters, and procedures."""

    def _get_taxonomy_guidelines(self, topic: str) -> str:
        return f"""TAXONOMY/TYPES/CATEGORIES SECTION REQUIREMENTS:
1. Use STANDARD taxonomies from the field. Research what the field actually uses.
2. For robotics actuators: Standard categories are Electric (DC, BLDC, stepper, servo), Pneumatic, Hydraulic. NOT "thermal" and "laser" as primary categories.
3. For other fields: Research the canonical breakdown used in textbooks and major papers.
4. If discussing niche categories, clearly label them as specialized or emerging, not as primary categories.
5. Base your taxonomy on the research context provided or standard field knowledge.
6. If uncertain, use phrases like "Commonly recognized categories include..." rather than stating definitively."""

    def _get_general_guidelines(self) -> str:
        return """GENERAL SECTION REQUIREMENTS:
1. LENGTH: Write at least 1000 words for this section. Be detailed and thorough.
2. CONTENT: Be rigorous, academic, and specific. Avoid generic template language.
3. VOICE: Write in a clear, direct academic style. Avoid repetitive padding.
4. STRUCTURE: Use clear subsections with descriptive headers.
5. EXAMPLES: Use concrete examples, but clearly mark hypothetical ones as such.
6. CITATIONS: When making claims, cite sources from the research context or mark as theoretical."""

    def revise_draft(self, original_draft: str, feedback: str) -> str:
        sections = self.split_markdown_sections(original_draft)
        full_revised_draft = ""
        
        console.print(f"[cyan]🔄 Revising draft in {len(sections)} sections...[/cyan]")

        for title, content in sections:
            if len(content.strip()) < 10:
                full_revised_draft += content + "\n"
                continue

            console.print(f"[cyan]  - Revising section: {title[:50]}...[/cyan]")
            
            system_prompt = (
                "You are a humble and rigorous scientist. You have received peer review feedback "
                "on your draft. Your goal is to rewrite this specific section to address the critique. "
                "CRITICAL RULES:\n"
                "1. Return the COMPLETE updated section content. Do not summarize.\n"
                "2. Follow all the rules about not fabricating data and using standard terminology.\n"
                "3. NEVER include meta-feedback sentences like 'This revision addresses...' or 'Based on feedback...' - write as if this is the original paper.\n"
                "4. If feedback mentions incorrect complexity claims, either fix them properly or use qualitative descriptions ('inefficient', 'scales poorly').\n"
                "5. Remove any language suggesting metrics are 'interchangeable'.\n"
                "6. Fix reference placeholders and ensure consistent citation numbering.\n"
                "7. Write naturally - the reader should not know this was revised based on feedback."
            )
            prompt = (
                f"Original Section Content:\n{content}\n\n"
                f"Peer Review Feedback (Apply where relevant to this section):\n{feedback}\n\n"
                "Please rewrite this section to address the feedback. Return the FULL section text. "
                "IMPORTANT:\n"
                "- If the feedback mentions fabricated data, remove it or clearly mark it as hypothetical.\n"
                "- If feedback mentions incorrect complexity, fix it or remove it (use qualitative terms if uncertain).\n"
                "- Remove any meta-feedback language - write as original work, not a revision log.\n"
                "- Fix any 'interchangeable metrics' language.\n"
                "- Ensure references are complete with no placeholders."
            )
            revised_section = self.chat(prompt, system_prompt, temperature=0.5)
            full_revised_draft += revised_section + "\n\n"
            
        return full_revised_draft


class ReviewerAgent(BaseAgent):
    """Enhanced Reviewer Agent that catches technical errors and fabricated data."""
    
    def __init__(self):
        model = os.getenv("REVIEWER_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Reviewer", "Critic", model=model)
    
    def review_draft(self, draft: str) -> str:
        system_prompt = (
            f"You are a critical {self.role} with deep technical expertise. Your name is {self.name}. "
            "Review the following draft research paper with extreme rigor.\n\n"
            "CRITICAL REVIEW CRITERIA:\n"
            "1. FABRICATION CHECK: Look for specific numbers, percentages, or metrics that appear fabricated. "
            "   Flag any claims like '85% accuracy' or '30% improvement' that lack citations or clear methodology.\n"
            "2. TECHNICAL ACCURACY: Check for technical errors:\n"
            "   - F1-score should be harmonic mean of precision and RECALL (not accuracy)\n"
            "   - Precision, recall, accuracy, and F1 are NOT interchangeable - flag any language suggesting they are\n"
            "   - Algorithmic complexity: Flag made-up Big-O notation or incorrect complexity claims\n"
            "   - If complexity is uncertain, it should be qualitative ('inefficient') or omitted, not guessed\n"
            "   - Time complexity is different from task performance metrics - they must be discussed separately\n"
            "   - Standard taxonomies (e.g., actuators: electric/pneumatic/hydraulic, NOT thermal/laser as primary)\n"
            "3. REFERENCES: Check for:\n"
            "   - Inconsistent citation numbering ([1] used for different sources)\n"
            "   - Placeholder text like:\n"
            "     * 'continue with remaining references'\n"
            "     * '[Insert relevant references here]'\n"
            "     * '... (continue with the remaining references)'\n"
            "   - Citations that don't match the claims being made\n"
            "   - Missing or incomplete references\n"
            "   - Citation numbers in text that don't match reference list\n"
            "4. META-FEEDBACK SENTENCES: Flag any sentences that read like editing logs:\n"
            "   - 'This revision addresses peer review feedback by...'\n"
            "   - 'This section responds to reviewer concerns...'\n"
            "   - 'Based on feedback, we have...'\n"
            "   - Any language suggesting this is a revision rather than original work\n"
            "5. VOICE & STRUCTURE: Look for:\n"
            "   - Generic template phrases ('Our experiments show...' without real experiments)\n"
            "   - Repetitive padding and filler content\n"
            "   - Vague methodology descriptions\n"
            "   - Language suggesting metrics are 'interchangeable'\n"
            "6. LOGIC: Are the arguments sound and well-structured?\n"
            "7. NOVELTY: Is the contribution clear?\n"
            "8. CLARITY: Is the writing precise and specific?\n\n"
            "Provide specific, actionable feedback. Be harsh but constructive. Flag every instance of "
            "fabricated data, technical errors, poor citations, meta-feedback sentences, or incorrect complexity claims."
        )
        return self.chat(f"Review this draft:\n\n{draft}", system_prompt, temperature=0.3)


class FactCheckerAgent(BaseAgent):
    """New agent that validates technical claims and terminology."""
    
    def __init__(self):
        model = os.getenv("FACTCHECKER_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("FactChecker", "Validator", model=model)
    
    def validate_draft(self, draft: str) -> Dict[str, List[str]]:
        """Validates the draft and returns issues by category."""
        console.print("[yellow]🔍 Fact-checking draft...[/yellow]")
        
        system_prompt = (
            "You are a technical fact-checker. Analyze the draft for:\n"
            "1. FABRICATED_DATA: Specific numbers/metrics without citations or clear methodology\n"
            "2. TECHNICAL_ERRORS: Incorrect definitions, misuse of terms, wrong taxonomies\n"
            "3. REFERENCE_ISSUES: Inconsistent citations, placeholders, missing sources\n"
            "4. TERMINOLOGY_ISSUES: Non-standard categorizations, incorrect field terminology\n\n"
            "Return a structured list of issues found, organized by category."
        )
        
        prompt = (
            f"Analyze this research paper draft for technical accuracy:\n\n{draft}\n\n"
            "Identify and list:\n"
            "1. Any fabricated or unsupported numerical claims\n"
            "2. Technical errors:\n"
            "   - Wrong definitions (e.g., F1-score = precision + accuracy)\n"
            "   - Language suggesting metrics are 'interchangeable'\n"
            "   - Made-up or incorrect algorithmic complexity (Big-O notation without proper analysis)\n"
            "   - Misuse of metrics, incorrect taxonomies\n"
            "3. Reference problems:\n"
            "   - Inconsistent numbering ([1] used for different sources)\n"
            "   - Placeholder text: '[Insert relevant references here]', 'continue with remaining references', etc.\n"
            "   - Missing or incomplete citations\n"
            "4. Terminology issues (non-standard categorizations)\n"
            "5. Meta-feedback sentences (e.g., 'This revision addresses...', 'Based on feedback...')\n\n"
            "Format your response as:\n"
            "FABRICATED_DATA:\n- [issue 1]\n- [issue 2]\n\n"
            "TECHNICAL_ERRORS:\n- [issue 1]\n- [issue 2]\n\n"
            "REFERENCE_ISSUES:\n- [issue 1]\n- [issue 2]\n\n"
            "TERMINOLOGY_ISSUES:\n- [issue 1]\n- [issue 2]\n\n"
            "META_FEEDBACK:\n- [issue 1]\n- [issue 2]"
        )
        
        validation_result = self.chat(prompt, system_prompt, temperature=0.2)
        
        # Parse the result into a structured format
        issues = {
            "fabricated_data": [],
            "technical_errors": [],
            "reference_issues": [],
            "terminology_issues": [],
            "meta_feedback": []
        }
        
        current_category = None
        for line in validation_result.split('\n'):
            line = line.strip()
            if 'FABRICATED_DATA' in line.upper():
                current_category = "fabricated_data"
            elif 'TECHNICAL_ERRORS' in line.upper():
                current_category = "technical_errors"
            elif 'REFERENCE_ISSUES' in line.upper():
                current_category = "reference_issues"
            elif 'TERMINOLOGY_ISSUES' in line.upper():
                current_category = "terminology_issues"
            elif 'META_FEEDBACK' in line.upper() or 'META-FEEDBACK' in line.upper():
                current_category = "meta_feedback"
            elif line.startswith('-') and current_category:
                issues[current_category].append(line[1:].strip())
        
        return issues
    
    def generate_fix_suggestions(self, issues: Dict[str, List[str]]) -> str:
        """Generates specific fix suggestions based on found issues."""
        if not any(issues.values()):
            return "No major issues found. The draft appears technically sound."
        
        suggestions = []
        if issues["fabricated_data"]:
            suggestions.append("FABRICATED DATA ISSUES:\n" + "\n".join(f"- {issue}" for issue in issues["fabricated_data"]))
        if issues["technical_errors"]:
            suggestions.append("TECHNICAL ERRORS:\n" + "\n".join(f"- {issue}" for issue in issues["technical_errors"]))
        if issues["reference_issues"]:
            suggestions.append("REFERENCE ISSUES:\n" + "\n".join(f"- {issue}" for issue in issues["reference_issues"]))
        if issues["terminology_issues"]:
            suggestions.append("TERMINOLOGY ISSUES:\n" + "\n".join(f"- {issue}" for issue in issues["terminology_issues"]))
        if issues["meta_feedback"]:
            suggestions.append("META-FEEDBACK SENTENCES (remove - these read like editing logs):\n" + "\n".join(f"- {issue}" for issue in issues["meta_feedback"]))
        
        return "\n\n".join(suggestions)


class EditorAgent(BaseAgent):
    """Enhanced Editor Agent that maintains technical accuracy while polishing."""
    
    def __init__(self):
        model = os.getenv("EDITOR_MODEL") or os.getenv("LLM_MODEL", "llama3")
        super().__init__("Editor", "Synthesizer", model=model)
    
    def finalize_draft(self, revised_draft: str) -> str:
        sections = self.split_markdown_sections(revised_draft)
        final_publication = ""
        
        console.print(f"[magenta]✨ Finalizing publication in {len(sections)} sections...[/magenta]")

        for title, content in sections:
            if len(content.strip()) < 10:
                final_publication += content + "\n"
                continue

            console.print(f"[magenta]  - Polishing section: {title[:50]}...[/magenta]")

            system_prompt = (
                "You are a senior editor with technical expertise. Your goal is to polish this section "
                "while maintaining all technical accuracy and rigor. "
                "CRITICAL RULES:\n"
                "1. DO NOT SUMMARIZE - retain all content and details\n"
                "2. DO NOT change technical definitions or metrics\n"
                "3. DO NOT remove citations or references\n"
                "4. Improve flow, tone, and formatting only\n"
                "5. Remove repetitive padding and generic phrases\n"
                "6. Remove any meta-feedback sentences (e.g., 'This revision addresses...', 'Based on feedback...')\n"
                "7. Remove placeholder text in references (e.g., '[Insert relevant references here]')\n"
                "8. Remove any language suggesting metrics are 'interchangeable'\n"
                "9. If you see incorrect complexity claims (made-up Big-O), either fix them or convert to qualitative descriptions\n"
                "10. Ensure consistent terminology throughout"
            )
            final_section = self.chat(f"Finalize this section:\n\n{content}", system_prompt, temperature=0.4)
            final_publication += final_section + "\n\n"
            
        return final_publication

    def summarize_paper(self, paper_content: str) -> str:
        console.print("[magenta]📝 Generating summary...[/magenta]")
        system_prompt = (
            "You are a science communicator. Your goal is to summarize a complex research paper "
            "into a concise, engaging 400-500 word summary for a general audience. "
            "Focus on the key findings, implications, and the 'big picture'. "
            "Do not use technical jargon if possible, but maintain accuracy."
        )
        return self.chat(f"Summarize this paper:\n\n{paper_content[:20000]}", system_prompt, temperature=0.5)

