'use client'

import { FC, useState } from 'react'

interface TaskInputProps {
  onSubmit: (prompt: string, taskType?: string) => void
  isLoading: boolean
}

const taskTypes = [
  { value: '', label: 'Auto-detect' },
  { value: 'reasoning', label: 'Reasoning' },
  { value: 'coding', label: 'Coding' },
  { value: 'devops', label: 'DevOps' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'business', label: 'Business' },
]

const TaskInput: FC<TaskInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('')
  const [taskType, setTaskType] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onSubmit(prompt, taskType || undefined)
      setPrompt('')
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Task Input</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Task Type (Optional)</label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {taskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your task prompt..."
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            rows={6}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-3 rounded-lg font-medium transition ${
            isLoading || !prompt.trim()
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Execute Task'
          )}
        </button>
      </form>
    </div>
  )
}

export default TaskInput