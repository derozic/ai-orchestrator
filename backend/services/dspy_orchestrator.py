"""
DSPy Orchestrator with Ollama Integration
Intelligent model selection and chaining for optimal results
"""

import dspy
from dspy import ChainOfThought, ReAct, ProgramOfThought
from typing import Dict, List, Optional, Any
import yaml
import httpx
import json
from pathlib import Path
import re
from enum import Enum

class TaskType(Enum):
    REASONING = "reasoning"
    CODING = "coding"
    DEVOPS = "devops"
    ARCHITECTURE = "architecture"
    BUSINESS = "business"
    HEAVY_REASONING = "heavy_reasoning"
    FAST_CODING = "fast_coding"
    LIGHTWEIGHT = "lightweight"
    MAXIMUM_CODING = "maximum_coding"

class OllamaLM(dspy.LM):
    """Custom DSPy LM for Ollama integration"""
    
    def __init__(self, model_name: str, base_url: str = "http://localhost:11434"):
        self.model_name = model_name
        self.base_url = base_url
        self.client = httpx.Client(timeout=120.0)
        super().__init__(model_name)
    
    def __call__(self, prompt: str, **kwargs) -> str:
        """Execute prompt against Ollama model"""
        response = self.client.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model_name,
                "prompt": prompt,
                "stream": False,
                **kwargs
            }
        )
        response.raise_for_status()
        return response.json()["response"]
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """Chat completion for conversational models"""
        response = self.client.post(
            f"{self.base_url}/api/chat",
            json={
                "model": self.model_name,
                "messages": messages,
                "stream": False,
                **kwargs
            }
        )
        response.raise_for_status()
        return response.json()["message"]["content"]

class DSPyOrchestrator:
    """Orchestrates model selection and execution using DSPy"""
    
    def __init__(self, config_path: str = "backend/config/models.yaml"):
        self.config = self._load_config(config_path)
        self.models = self._initialize_models()
        self.routing_rules = self.config["routing_rules"]
        
        # DSPy signatures for different task types
        self.signatures = {
            TaskType.REASONING: self._create_reasoning_signature(),
            TaskType.CODING: self._create_coding_signature(),
            TaskType.DEVOPS: self._create_devops_signature(),
            TaskType.ARCHITECTURE: self._create_architecture_signature(),
        }
    
    def _load_config(self, config_path: str) -> Dict:
        """Load model configuration from YAML"""
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def _initialize_models(self) -> Dict[str, OllamaLM]:
        """Initialize Ollama models with DSPy"""
        models = {}
        for model_id, config in self.config["models"].items():
            try:
                models[model_id] = OllamaLM(config["name"])
                print(f"✅ Initialized {model_id}: {config['name']}")
            except Exception as e:
                print(f"⚠️ Failed to initialize {model_id}: {e}")
        return models
    
    def _create_reasoning_signature(self) -> dspy.Signature:
        """Create DSPy signature for reasoning tasks"""
        class ReasoningSignature(dspy.Signature):
            """Complex reasoning and problem solving"""
            context: str = dspy.InputField(desc="Problem context and requirements")
            question: str = dspy.InputField(desc="Specific question to answer")
            reasoning: str = dspy.OutputField(desc="Step-by-step reasoning process")
            answer: str = dspy.OutputField(desc="Final answer or solution")
        return ReasoningSignature
    
    def _create_coding_signature(self) -> dspy.Signature:
        """Create DSPy signature for coding tasks"""
        class CodingSignature(dspy.Signature):
            """Code generation and implementation"""
            requirements: str = dspy.InputField(desc="Code requirements and context")
            language: str = dspy.InputField(desc="Programming language")
            approach: str = dspy.OutputField(desc="Implementation approach")
            code: str = dspy.OutputField(desc="Generated code")
            explanation: str = dspy.OutputField(desc="Code explanation")
        return CodingSignature
    
    def _create_devops_signature(self) -> dspy.Signature:
        """Create DSPy signature for DevOps tasks"""
        class DevOpsSignature(dspy.Signature):
            """DevOps and infrastructure automation"""
            task: str = dspy.InputField(desc="DevOps task description")
            environment: str = dspy.InputField(desc="Target environment details")
            strategy: str = dspy.OutputField(desc="Implementation strategy")
            configuration: str = dspy.OutputField(desc="Configuration or script")
            validation: str = dspy.OutputField(desc="Validation steps")
        return DevOpsSignature
    
    def _create_architecture_signature(self) -> dspy.Signature:
        """Create DSPy signature for architecture tasks"""
        class ArchitectureSignature(dspy.Signature):
            """API and system architecture design"""
            requirements: str = dspy.InputField(desc="System requirements")
            constraints: str = dspy.InputField(desc="Technical constraints")
            design: str = dspy.OutputField(desc="Architecture design")
            api_spec: str = dspy.OutputField(desc="API specification")
            implementation_notes: str = dspy.OutputField(desc="Implementation guidelines")
        return ArchitectureSignature
    
    def identify_task_type(self, prompt: str) -> TaskType:
        """Identify task type from prompt using routing rules"""
        prompt_lower = prompt.lower()
        
        for rule in self.routing_rules:
            if re.search(rule["pattern"], prompt_lower):
                return TaskType(rule["model_type"])
        
        # Default to reasoning if no pattern matches
        return TaskType.REASONING
    
    def select_model(self, task_type: TaskType, priority: int = 1) -> Optional[OllamaLM]:
        """Select appropriate model based on task type and priority"""
        for model_id, config in self.config["models"].items():
            if config["type"] == task_type.value and config.get("priority", 1) == priority:
                if model_id in self.models:
                    return self.models[model_id]
        return None
    
    def execute_task(self, prompt: str, task_type: Optional[TaskType] = None) -> Dict[str, Any]:
        """Execute task with appropriate model and DSPy program"""
        # Identify task type if not provided
        if task_type is None:
            task_type = self.identify_task_type(prompt)
        
        # Select model
        model = self.select_model(task_type)
        if not model:
            return {
                "error": f"No model available for task type: {task_type.value}",
                "task_type": task_type.value
            }
        
        # Configure DSPy with selected model
        dspy.configure(lm=model)
        
        # Execute based on task type
        try:
            if task_type == TaskType.REASONING:
                return self._execute_reasoning(prompt, model)
            elif task_type == TaskType.CODING:
                return self._execute_coding(prompt, model)
            elif task_type == TaskType.DEVOPS:
                return self._execute_devops(prompt, model)
            elif task_type == TaskType.ARCHITECTURE:
                return self._execute_architecture(prompt, model)
            else:
                return self._execute_generic(prompt, model)
        except Exception as e:
            return {
                "error": str(e),
                "task_type": task_type.value,
                "model": model.model_name
            }
    
    def _execute_reasoning(self, prompt: str, model: OllamaLM) -> Dict[str, Any]:
        """Execute reasoning task with Chain of Thought"""
        cot = ChainOfThought(self.signatures[TaskType.REASONING])
        result = cot(context=prompt, question="Solve this problem")
        return {
            "task_type": "reasoning",
            "model": model.model_name,
            "reasoning": result.reasoning,
            "answer": result.answer
        }
    
    def _execute_coding(self, prompt: str, model: OllamaLM) -> Dict[str, Any]:
        """Execute coding task"""
        cot = ChainOfThought(self.signatures[TaskType.CODING])
        result = cot(requirements=prompt, language="auto-detect")
        return {
            "task_type": "coding",
            "model": model.model_name,
            "approach": result.approach,
            "code": result.code,
            "explanation": result.explanation
        }
    
    def _execute_devops(self, prompt: str, model: OllamaLM) -> Dict[str, Any]:
        """Execute DevOps task"""
        cot = ChainOfThought(self.signatures[TaskType.DEVOPS])
        result = cot(task=prompt, environment="production")
        return {
            "task_type": "devops",
            "model": model.model_name,
            "strategy": result.strategy,
            "configuration": result.configuration,
            "validation": result.validation
        }
    
    def _execute_architecture(self, prompt: str, model: OllamaLM) -> Dict[str, Any]:
        """Execute architecture task"""
        cot = ChainOfThought(self.signatures[TaskType.ARCHITECTURE])
        result = cot(requirements=prompt, constraints="scalable, maintainable")
        return {
            "task_type": "architecture",
            "model": model.model_name,
            "design": result.design,
            "api_spec": result.api_spec,
            "implementation_notes": result.implementation_notes
        }
    
    def _execute_generic(self, prompt: str, model: OllamaLM) -> Dict[str, Any]:
        """Execute generic task with simple completion"""
        response = model(prompt)
        return {
            "task_type": "generic",
            "model": model.model_name,
            "response": response
        }
    
    def chain_tasks(self, tasks: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """Chain multiple tasks together"""
        results = []
        context = ""
        
        for task in tasks:
            # Add previous context if available
            if context:
                task["prompt"] = f"Context: {context}\n\n{task['prompt']}"
            
            # Execute task
            result = self.execute_task(
                task["prompt"],
                TaskType(task["type"]) if "type" in task else None
            )
            results.append(result)
            
            # Extract context for next task
            if "answer" in result:
                context = result["answer"]
            elif "response" in result:
                context = result["response"]
        
        return results