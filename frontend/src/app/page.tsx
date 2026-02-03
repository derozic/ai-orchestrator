'use client'

import { useState, useEffect } from 'react'
import ModelSelector from '@/components/ModelSelector'
import TaskInput from '@/components/TaskInput'
import ResultDisplay from '@/components/ResultDisplay'
import SystemStatus from '@/components/SystemStatus'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState<any[]>([])

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8765/models')
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  }

  const handleTaskSubmit = async (prompt: string, taskType?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8765/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          task_type: taskType,
          model_override: selectedModel,
          stream: false
        })
      })
      const result = await response.json()
      setResults([result, ...results])
    } catch (error) {
      console.error('Task execution failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Orchestrator</h1>
          <p className="text-gray-400">Intelligent model routing with DSPy and Ollama</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskInput onSubmit={handleTaskSubmit} isLoading={isLoading} />
            <ResultDisplay results={results} />
          </div>
          
          <div className="space-y-6">
            <ModelSelector 
              models={models}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
            <SystemStatus />
          </div>
        </div>
      </div>
    </div>
  )
}
