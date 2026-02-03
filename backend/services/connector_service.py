"""
Connector Service for External API Integrations
Manages OAuth flows and API connections for various services
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
import httpx
import json
from pathlib import Path
from enum import Enum

class ConnectorType(Enum):
    CLICKUP = "clickup"
    GITHUB = "github"
    GOOGLE_WORKSPACE = "google_workspace"
    TODOIST = "todoist"
    LINEAR = "linear"
    NOTION = "notion"
    DISCORD = "discord"

class ConnectorService:
    """Manages external service connectors and API integrations"""
    
    def __init__(self, config_path: str = "backend/config/connectors.yaml"):
        self.connectors: Dict[str, Any] = {}
        self.active_connections: Dict[str, Any] = {}
        self.config_path = config_path
        
    async def connect_service(self, connector_type: ConnectorType, credentials: Dict[str, str]) -> Dict[str, Any]:
        """Establish connection to external service"""
        connector_config = {
            ConnectorType.CLICKUP: {
                "base_url": "https://api.clickup.com/api/v2",
                "auth_type": "api_key",
                "scopes": ["task.read", "task.write", "workspace.read"]
            },
            ConnectorType.GITHUB: {
                "base_url": "https://api.github.com",
                "auth_type": "oauth",
                "scopes": ["repo", "workflow", "project"]
            },
            ConnectorType.GOOGLE_WORKSPACE: {
                "base_url": "https://www.googleapis.com",
                "auth_type": "oauth",
                "scopes": ["gmail.readonly", "calendar", "drive.file"]
            },
            ConnectorType.TODOIST: {
                "base_url": "https://api.todoist.com/rest/v2",
                "auth_type": "oauth",
                "scopes": ["task:add", "data:read", "data:delete"]
            },
            ConnectorType.LINEAR: {
                "base_url": "https://api.linear.app/graphql",
                "auth_type": "api_key",
                "scopes": ["read", "write", "admin"]
            },
            ConnectorType.NOTION: {
                "base_url": "https://api.notion.com/v1",
                "auth_type": "oauth",
                "scopes": ["read_content", "update_content", "insert_content"]
            },
            ConnectorType.DISCORD: {
                "base_url": "https://discord.com/api/v10",
                "auth_type": "bot_token",
                "scopes": ["bot", "messages.read", "messages.write"]
            }
        }
        
        config = connector_config.get(connector_type)
        if not config:
            return {"error": f"Unknown connector type: {connector_type.value}"}
        
        # Store connection
        self.active_connections[connector_type.value] = {
            "config": config,
            "credentials": credentials,
            "connected_at": datetime.now().isoformat(),
            "status": "connected"
        }
        
        return {
            "connector": connector_type.value,
            "status": "connected",
            "capabilities": config["scopes"],
            "connected_at": datetime.now().isoformat()
        }
    
    async def execute_workflow(self, workflow: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a multi-step workflow across connectors"""
        results = []
        context = {}
        
        for step in workflow.get("steps", []):
            connector_type = step.get("connector")
            action = step.get("action")
            params = step.get("params", {})
            
            # Add context from previous steps
            params["context"] = context
            
            # Execute step
            result = await self._execute_connector_action(connector_type, action, params)
            results.append({
                "step": step.get("name"),
                "connector": connector_type,
                "result": result
            })
            
            # Update context for next step
            if result.get("output"):
                context[step.get("name")] = result["output"]
        
        return {
            "workflow": workflow.get("name"),
            "executed_at": datetime.now().isoformat(),
            "results": results,
            "final_context": context
        }
    
    async def _execute_connector_action(self, connector: str, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a specific action on a connector"""
        if connector not in self.active_connections:
            return {"error": f"Connector {connector} not connected"}
        
        connection = self.active_connections[connector]
        config = connection["config"]
        
        # Map actions to API endpoints
        action_mapping = {
            "clickup": {
                "create_task": ("POST", "/task"),
                "get_tasks": ("GET", "/team/{team_id}/task"),
                "update_task": ("PUT", "/task/{task_id}")
            },
            "github": {
                "create_issue": ("POST", "/repos/{owner}/{repo}/issues"),
                "create_pr": ("POST", "/repos/{owner}/{repo}/pulls"),
                "get_commits": ("GET", "/repos/{owner}/{repo}/commits")
            },
            "todoist": {
                "create_task": ("POST", "/tasks"),
                "get_projects": ("GET", "/projects"),
                "complete_task": ("POST", "/tasks/{task_id}/close")
            },
            "linear": {
                "create_issue": ("POST", "/graphql"),
                "update_issue": ("POST", "/graphql"),
                "get_cycles": ("POST", "/graphql")
            },
            "notion": {
                "create_page": ("POST", "/pages"),
                "update_database": ("PATCH", "/databases/{database_id}"),
                "search": ("POST", "/search")
            }
        }
        
        # Get action details
        connector_actions = action_mapping.get(connector, {})
        action_details = connector_actions.get(action)
        
        if not action_details:
            return {"error": f"Unknown action {action} for connector {connector}"}
        
        method, endpoint = action_details
        
        # Simulate API call (in production, make actual HTTP request)
        return {
            "action": action,
            "status": "success",
            "output": {
                "id": f"{connector}_{action}_{datetime.now().timestamp()}",
                "created_at": datetime.now().isoformat()
            }
        }
    
    def get_connected_services(self) -> List[Dict[str, Any]]:
        """Get list of all connected services"""
        return [
            {
                "connector": name,
                "status": conn["status"],
                "connected_at": conn["connected_at"],
                "capabilities": conn["config"]["scopes"]
            }
            for name, conn in self.active_connections.items()
        ]
    
    async def disconnect_service(self, connector_type: ConnectorType) -> bool:
        """Disconnect from external service"""
        if connector_type.value in self.active_connections:
            del self.active_connections[connector_type.value]
            return True
        return False