# Improved Cortex Agent System

## Overview

This improved version of the Cortex multi-agent research paper generation system addresses critical issues identified in peer review feedback, specifically:

1. **Fabricated Data**: Prevents generation of fake experimental results and metrics
2. **Technical Errors**: Validates correct use of terminology, metrics, and taxonomies
3. **Reference Issues**: Ensures consistent, real citations
4. **Terminology Problems**: Enforces standard field taxonomies
5. **Generic Voice**: Reduces template-like padding and improves specificity

## Key Improvements

### 1. Enhanced Scientist Agent

**New Features:**
- Strict guidelines against fabricating experimental data
- Research-based taxonomy validation (searches for standard categorizations)
- Section-specific guidelines (experiments, methodology, taxonomies)
- Clear distinction between hypothetical examples and real data
- Improved reference generation (only uses real sources from web research)

**Key Prompts Added:**
- Never fabricate metrics like "85% accuracy" without real data
- Use standard taxonomies (e.g., actuators: electric/pneumatic/hydraulic, NOT thermal/laser)
- Define metrics correctly (F1 = harmonic mean of precision and RECALL, not accuracy)
- Never say metrics are "interchangeable" - they measure different things
- Algorithmic complexity: Use qualitative terms if uncertain, don't make up Big-O notation
- Never include meta-feedback sentences ("This revision addresses...")
- Mark hypothetical examples clearly
- Explain when precision vs recall matters more

### 2. Enhanced Reviewer Agent

**New Capabilities:**
- Fabrication detection (flags unsupported numerical claims)
- Technical accuracy checking:
  - F1-score definition validation
  - Precision/recall/accuracy distinction
  - Flags "interchangeable metrics" language
  - Algorithmic complexity validation (flags made-up Big-O notation)
  - Time complexity vs performance metrics separation
  - Standard taxonomy validation
- Reference consistency checking (including all placeholder types)
- Meta-feedback sentence detection
- Voice and structure analysis

### 3. New FactChecker Agent

**Purpose:** Validates technical claims before and after revision

**Checks For:**
- Fabricated data and unsupported metrics
- Technical errors (wrong definitions, misuse of terms, incorrect complexity claims)
- Reference problems (inconsistent numbering, all types of placeholders)
- Terminology issues (non-standard categorizations)
- Meta-feedback sentences (editing log language)

**Output:** Structured list of issues by category with specific fix suggestions

### 4. Enhanced Editor Agent

**Improvements:**
- Maintains technical accuracy while polishing
- Removes repetitive padding
- Ensures consistent terminology
- Does not change technical definitions or citations

## Usage

### Using the Improved Version

```bash
cd apps/cortex
source venv/bin/activate
python3 main_improved.py --topic "your research topic here"
```

### Comparison: Standard vs Improved

**Standard Version:**
```bash
python3 main.py --topic "basics of robotics"
```

**Improved Version (with fact-checking):**
```bash
python3 main_improved.py --topic "basics of robotics"
```

## What Gets Fixed

### Before (Issues Found):
- ❌ "85% accuracy" without citation or methodology
- ❌ F1-score defined as harmonic mean of precision and accuracy (wrong!)
- ❌ Actuators categorized as "motorized, thermal, laser" (non-standard)
- ❌ Inconsistent reference numbering [1] used for different sources
- ❌ Generic phrases like "Our experiments show..." without real experiments
- ❌ Placeholder text "continue with remaining references"
- ❌ Made-up Big-O notation (O(n), O(n²)) without proper analysis
- ❌ Language suggesting metrics are "interchangeable"
- ❌ Meta-feedback sentences like "This revision addresses peer review feedback..."
- ❌ Random walk complexity claims without proper analysis

### After (With Improvements):
- ✅ Hypothetical examples clearly marked: "Consider a scenario where..."
- ✅ F1-score correctly defined: harmonic mean of precision and RECALL
- ✅ Standard taxonomy: Electric (DC, BLDC, stepper), Pneumatic, Hydraulic
- ✅ Consistent, real citations from web research
- ✅ Specific, non-generic language
- ✅ Complete references without placeholders (including "[Insert relevant references here]")
- ✅ Algorithmic complexity: Either properly analyzed or qualitative ("inefficient", "scales poorly")
- ✅ No "interchangeable metrics" language - metrics clearly distinguished
- ✅ No meta-feedback sentences - reads as original work, not revision log
- ✅ Precision vs recall: Explains when each matters more

## Technical Details

### Fact-Checking Process

1. **After Initial Draft**: Fact-checker validates the scientist's draft
2. **After Revision**: Fact-checker validates again to catch remaining issues
3. **Issues Reported**: Structured by category (fabricated_data, technical_errors, etc.)
4. **Fix Suggestions**: Specific, actionable recommendations

### Validation Categories

1. **FABRICATED_DATA**: Unsupported numerical claims
2. **TECHNICAL_ERRORS**: Wrong definitions, misuse of metrics, incorrect complexity claims
3. **REFERENCE_ISSUES**: Inconsistent citations, placeholders (including "[Insert relevant references here]")
4. **TERMINOLOGY_ISSUES**: Non-standard categorizations
5. **META_FEEDBACK**: Sentences that read like editing logs rather than original work

## Configuration

You can still configure models via environment variables:

```bash
export LLM_BASE_URL="http://localhost:11434/v1"
export LLM_API_KEY="ollama"
export LLM_MODEL="llama3"

# Optional: Different models for different agents
export SCIENTIST_MODEL="llama3"
export REVIEWER_MODEL="llama3"
export EDITOR_MODEL="llama3"
export FACTCHECKER_MODEL="llama3"
```

## Migration Guide

To switch from standard to improved agents:

1. **Backup your current agents.py** (optional)
2. **Use the improved version:**
   ```bash
   # Option 1: Use main_improved.py directly
   python3 main_improved.py --topic "your topic"
   
   # Option 2: Replace agents.py with agents_improved.py
   cp agents_improved.py agents.py
   python3 main.py --topic "your topic"
   ```

## Expected Output Quality

**Conceptual Accuracy**: ~7/10 → **~8-9/10**
- Better field knowledge through research
- Standard taxonomies enforced

**Technical Precision**: ~5/10 → **~8-9/10**
- Correct metric definitions
- Standard terminology
- Validated taxonomies

**Scientific Credibility**: ~2/10 → **~6-7/10**
- No fabricated data (or clearly marked as hypothetical)
- Real citations
- Consistent references
- Rigorous methodology descriptions

## Limitations

The improved system still has limitations:

1. **LLM Knowledge**: Depends on the underlying model's training data
2. **Web Research Quality**: Limited by search result quality
3. **Fact-Checking**: May miss subtle errors or domain-specific nuances
4. **No Real Experiments**: Cannot run actual experiments, only theoretical/hypothetical

## Recommendations for Best Results

1. **Use Better Models**: GPT-4 or Claude for better accuracy
2. **Provide Context**: Add relevant papers or sources as context
3. **Review Output**: Always human-review the final paper
4. **Iterate**: Use multiple revision cycles if needed
5. **Domain Expertise**: For specialized topics, provide domain-specific guidelines

## Future Improvements

Potential enhancements:
- Integration with academic databases (arXiv, PubMed)
- Citation network analysis
- Plagiarism detection
- Real-time fact-checking against knowledge bases
- Domain-specific validation rules
- Multi-pass fact-checking with different models

