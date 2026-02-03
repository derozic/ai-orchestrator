'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ModelSelector from '@/components/ModelSelector'
import TaskInput from '@/components/TaskInput'
import ResultDisplay from '@/components/ResultDisplay'
import SystemStatus from '@/components/SystemStatus'
import ProviderToggle from '@/components/ProviderToggle'
import { GradientMesh } from '@/components/GradientMesh'
import Logo from '@/components/Logo'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState<any[]>([])
  const [providerMode, setProviderMode] = useState<'free_first' | 'paid_only' | 'smart'>('smart')

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
          provider_mode: providerMode,
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
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <GradientMesh />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <header className="mb-8 border-b border-gray-800 pb-6">
            <div className="flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-4">
                <Link 
                  href="/settings"
                  className="px-4 py-2 bg-gray-800/50 backdrop-blur rounded-lg text-sm hover:bg-gray-700/50 transition"
                >
                  Settings
                </Link>
                <a 
                  href="/docs"
                  target="_blank"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Documentation
                </a>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <TaskInput onSubmit={handleTaskSubmit} isLoading={isLoading} />
              <ResultDisplay results={results} />
            </div>
            
            <div className="space-y-6">
              <ProviderToggle 
                mode={providerMode} 
                onModeChange={setProviderMode} 
              />
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
    </div>
  )
}
