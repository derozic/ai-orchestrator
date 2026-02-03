# AI Orchestration Platform

An intelligent AI model orchestration system using DSPy, Ollama, FastAPI, and Next.js for seamless integration with local LLMs.

## 🎯 Features

- **Intelligent Model Routing**: Automatically selects the best model for each task
- **DSPy Integration**: Programmatic prompting and chaining
- **Ollama REST API**: Direct access to all local models
- **FastAPI Backend**: High-performance API with async support
- **Next.js Frontend**: Modern React interface with real-time updates
- **Model Specialization**: Routes tasks to specialized models (coding, DevOps, reasoning)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│  FastAPI Backend│
└─────────────────┘     └─────────────────┘
                               │
                        ┌──────▼──────┐
                        │    DSPy     │
                        │ Orchestrator│
                        └──────┬──────┘
                               │
                  ┌────────────▼────────────┐
                  │   Ollama REST API       │
                  └────────────┬────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────┐        ┌────────▼────────┐    ┌───────▼────┐
│DeepSeek-R1 │        │ Qwen Coders     │    │   Kimi K2  │
│  32b/70b   │        │  32b/480b       │    │   DevOps   │
└────────────┘        └─────────────────┘    └────────────┘
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8765
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Ollama Setup
Ensure Ollama is running:
```bash
ollama serve
```

## 📦 Model Inventory

| Model | Specialization | Size | Use Case |
|-------|---------------|------|----------|
| DeepSeek-R1:32b | Reasoning | 19GB | Complex problem solving |
| DeepSeek-R1:70b | Heavy Reasoning | 40GB | When 32b isn't enough |
| Qwen2.5-Coder:32b | Coding | 19GB | Code generation |
| Kimi K2 | DevOps | 25GB | Infrastructure/automation |
| Codestral:22b | API Design | 13GB | REST/GraphQL architecture |

## 🔧 Configuration

Edit `backend/config/models.yaml` to configure model routing rules.

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [DSPy Integration](./docs/dspy.md)
- [Model Selection Logic](./docs/routing.md)

## 👥 Contributors

- Scott Derozic

## 📄 License

MIT