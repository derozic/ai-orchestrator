"""
FastAPI Backend for AI Orchestrator
High-performance API for intelligent model routing
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import httpx
from datetime import datetime
import json
import asyncio
from contextlib import asynccontextmanager

from backend.services.dspy_orchestrator import DSPyOrchestrator, TaskType

# Pydantic models for API
class TaskRequest(BaseModel):
    prompt: str = Field(..., description="The task prompt")
    task_type: Optional[str] = Field(None, description="Optional task type override")
    model_override: Optional[str] = Field(None, description="Optional model override")
    stream: bool = Field(False, description="Stream response")
    
class ChainRequest(BaseModel):
    tasks: List[Dict[str, str]] = Field(..., description="List of tasks to chain")
    
class ModelInfo(BaseModel):
    name: str
    type: str
    memory_gb: int
    capabilities: List[str]
    description: str
    available: bool

class TaskResponse(BaseModel):
    task_type: str
    model: str
    result: Dict[str, Any]
    timestamp: datetime
    execution_time: float

# Initialize orchestrator
orchestrator = DSPyOrchestrator()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting AI Orchestrator...")
    # Verify Ollama is running
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:11434/api/tags")
            if response.status_code == 200:
                print("✅ Ollama is running")
    except Exception as e:
        print(f"⚠️ Ollama connection failed: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down AI Orchestrator...")

# Create FastAPI app
app = FastAPI(
    title="AI Orchestrator",
    description="Intelligent model routing with DSPy and Ollama",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3765"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Orchestrator",
        "version": "0.1.0",
        "timestamp": datetime.now()
    }

@app.get("/models", response_model=List[ModelInfo])
async def list_models():
    """List all available models and their capabilities"""
    models = []
    
    # Get Ollama models
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://localhost:11434/api/tags")
            ollama_models = response.json().get("models", [])
            ollama_model_names = [m["name"] for m in ollama_models]
        except:
            ollama_model_names = []
    
    # Match with our configuration
    for model_id, config in orchestrator.config["models"].items():
        models.append(ModelInfo(
            name=config["name"],
            type=config["type"],
            memory_gb=config["memory_gb"],
            capabilities=config["capabilities"],
            description=config["description"],
            available=config["name"] in ollama_model_names
        ))
    
    return models

@app.post("/execute", response_model=TaskResponse)
async def execute_task(request: TaskRequest):
    """Execute a single task with intelligent model routing"""
    import time
    start_time = time.time()
    
    try:
        # Convert task type if provided
        task_type = TaskType(request.task_type) if request.task_type else None
        
        # Execute task
        result = orchestrator.execute_task(request.prompt, task_type)
        
        # Calculate execution time
        execution_time = time.time() - start_time
        
        return TaskResponse(
            task_type=result.get("task_type", "unknown"),
            model=result.get("model", "unknown"),
            result=result,
            timestamp=datetime.now(),
            execution_time=execution_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chain")
async def chain_tasks(request: ChainRequest):
    """Execute a chain of tasks with context passing"""
    try:
        results = orchestrator.chain_tasks(request.tasks)
        return {
            "chain_length": len(results),
            "results": results,
            "timestamp": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ollama/generate")
async def ollama_generate(model: str, prompt: str, stream: bool = False):
    """Direct Ollama generation endpoint"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": model, "prompt": prompt, "stream": stream},
                timeout=120.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/ollama/chat")
async def ollama_chat(model: str, messages: List[Dict[str, str]]):
    """Direct Ollama chat endpoint"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={"model": model, "messages": messages, "stream": False},
                timeout=120.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/routing-rules")
async def get_routing_rules():
    """Get current routing rules"""
    return orchestrator.routing_rules

@app.post("/analyze-prompt")
async def analyze_prompt(prompt: str):
    """Analyze a prompt to determine task type"""
    task_type = orchestrator.identify_task_type(prompt)
    selected_model = orchestrator.select_model(task_type)
    
    return {
        "prompt": prompt,
        "identified_task_type": task_type.value,
        "selected_model": selected_model.model_name if selected_model else None,
        "available": selected_model is not None
    }

@app.get("/system/info")
async def system_info():
    """Get system information"""
    import psutil
    
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
            "available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
            "percent": psutil.virtual_memory().percent
        },
        "models_loaded": len(orchestrator.models),
        "timestamp": datetime.now()
    }

# Run the app
def run():
    """Run the FastAPI server"""
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8765,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    run()