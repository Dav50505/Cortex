# Cortex Lab

**Collaborative Autonomous Research Systems**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Quarto](https://img.shields.io/badge/Made%20with-Quarto-blue)](https://quarto.org)
[![Rust](https://img.shields.io/badge/Rust-1.75+-orange.svg)](https://www.rust-lang.org)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://python.org)

---

## Vision

**Engineering the "Hive Mind" — where swarms of specialized AI agents collaborate to solve complex problems.**

Humans are becoming the bottleneck of research progress. Cortex Lab is building the protocols, architectures, and tools that allow AI agents to work together like a digital organism. From self-correcting code generation to distributed scientific discovery, we are defining the sociology of silicon.

**Core Pillars:**
- **Swarm Intelligence**: Multi-agent consensus and collaboration.
- **Autonomous Research**: Self-improving loops for discovery.
- **Open Science**: Validated, reproducible benchmarks.

---

## Repository Structure

```
cortex-lab/
├── apps/                          # Deployable Web Applications
│   ├── aresalab/                  # Main Research Hub (Web UI)
│   │   └── → cortexlab.vercel.app
│   ├── cortex/                    # Multi-Agent Simulation Engine (Python)
│   │   └── The "Council of Agents" prototype
│   ├── aresadb-studio/            # Database tools
│   └── aresa-studio/              # Universal SQL/Vector UI
│
├── tools/                         # Development Tools & Libraries
│   ├── aresa-cli/                 # Rust CLI for any database
│   └── aresadb/                   # High-performance multi-model database
│
├── publications/                  # Research papers (.qmd → PDF)
│   ├── swarm_intelligence/        # Multi-agent code generation
│   ├── consensus_protocols/       # BFT for LLMs
│   └── ... more papers
│
└── scripts/                       # Build utilities
```

---

## Applications

### Cortex Lab Hub
**Main research hub** — [cortexlab.vercel.app](https://cortexlab.vercel.app)

Publications, books, and documentation for the Cortex ecosystem.

### Cortex Engine (`apps/cortex`)
**Multi-Agent Simulation**

A Python-based framework for running local multi-agent systems.
- **Scientist Agent**: Generates hypotheses.
- **Reviewer Agent**: Critiques and validates.
- **Editor Agent**: Synthesizes final output.

Run it locally:
```bash
cd apps/cortex
python main.py --topic "The future of AI"
```

### AresaDB Studio
**Database exploration UI**

Web interface for the AresaDB multi-model database with Vector similarity search for RAG applications.

---

## Publications

| Domain | Paper | Key Contribution |
|--------|-------|------------------|
| **Multi-Agent Systems** | Swarm Intelligence in Code | 40% reduction in hallucinations via 4-agent swarm |
| **Distributed Systems** | LLM Consensus Protocols | Byzantine Fault Tolerance for 100+ node networks |
| **Meta-Learning** | Cortex Architecture | Recursive self-improvement loop (15% gain in 24h) |
| **Distributed AI** | Distributed Reasoning | Mesh of 7B models outperforming 70B models |

---

## Development

### Prerequisites

```bash
# macOS
brew install --cask quarto
brew install uv rust

# Verify
quarto --version
cargo --version
uv --version
```

### Build Everything

```bash
# Build Cortex Engine
cd apps/cortex
pip install -r requirements.txt

# Build Web Hub
cd apps/aresalab
npm install && npm run build
```

---

## License

MIT License — Open research and tools for the community.

---

<div align="center">

**Cortex Lab**: *Defining the sociology of silicon.*

</div>
