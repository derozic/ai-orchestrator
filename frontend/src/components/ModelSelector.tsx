'use client'

import { FC } from 'react'

interface Model {
  name: string
  type: string
  memory_gb: number
  capabilities: string[]
  description: string
  available: boolean
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string | null
  onModelSelect: (model: string | null) => void
}

const ModelSelector: FC<ModelSelectorProps> = ({ models, selectedModel, onModelSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Available Models</h2>
      
      <div className="mb-4">
        <button
          onClick={() => onModelSelect(null)}
          className={`w-full px-4 py-2 rounded transition ${
            selectedModel === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Auto-select (Intelligent Routing)
        </button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {models.map((model) => (
          <div
            key={model.name}
            className={`p-3 rounded cursor-pointer transition ${
              selectedModel === model.name
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            } ${!model.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => model.available && onModelSelect(model.name)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium">{model.name}</h3>
                <p className="text-xs text-gray-300 mt-1">{model.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                    {model.type}
                  </span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                    {model.memory_gb}GB
                  </span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full mt-2 ${
                model.available ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModelSelector