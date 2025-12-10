# Multi-Model Guide for Cortex

## Quick Start

Copy the example and customize:
```bash
cp .env.example .env
```

## Using the Same Model for All Agents

Edit `.env` and set:
```bash
LLM_MODEL="mistral"  # or any model from the list
```

## Using Different Models per Agent

Want the Scientist to be creative but the Reviewer to be critical? Use specialized models:

```bash
# The "creative" Scientist
SCIENTIST_MODEL="llama3"

# The "strict" Reviewer  
REVIEWER_MODEL="mistral"

# The "polished" Editor
EDITOR_MODEL="gemma:7b"
```

## Popular Ollama Models

### For General Use (Recommended)
- `llama3` - Meta's Llama 3 8B (best all-rounder)
- `mistral` - Mistral 7B (great reasoning)
- `gemma:7b` - Google Gemma (fast & accurate)

### For Coding Research
- `codellama` - Optimized for code generation
- `deepseek-coder` - Best open-source coder
- `qwen2.5-coder` - Excellent at understanding code

### For High-End Machines (16GB+ RAM)
- `llama3:70b` - State of the art (slow but accurate)
- `mixtral` - Mixture of Experts (smart routing)

## Installing a New Model

```bash
# Pull from Ollama
ollama pull mistral

# Then update your .env
LLM_MODEL="mistral"
```

## Using Cloud APIs (OpenAI/Anthropic)

If you don't want to run Ollama locally, you can use cloud APIs:

### OpenAI
```bash
LLM_BASE_URL="https://api.openai.com/v1"
LLM_API_KEY="sk-your-key-here"
LLM_MODEL="gpt-4"
```

### Anthropic Claude
```bash
LLM_BASE_URL="https://api.anthropic.com/v1"
LLM_API_KEY="sk-ant-your-key-here"
LLM_MODEL="claude-3-opus-20240229"
```

## Which Model Should I Use?

| Task | Recommended Model | Why |
|------|------------------|-----|
| Creative Writing (Scientist) | `llama3` | Better at generating novel ideas |
| Critical Analysis (Reviewer) | `mistral` | Stronger logical reasoning |
| Polishing Text (Editor) | `gemma:7b` | Fast and grammatically precise |
| Code Generation | `deepseek-coder` | Specifically trained on code |

## Example: A "Heterogeneous Swarm"

```bash
# Different models for diversity
SCIENTIST_MODEL="llama3"
REVIEWER_MODEL="mistral"
EDITOR_MODEL="qwen2.5-coder"
```

This creates a more robust system because different models have different strengths!
