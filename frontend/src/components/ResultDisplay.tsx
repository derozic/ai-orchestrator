'use client'

import { FC } from 'react'

interface Result {
  task_type: string
  model: string
  result: any
  timestamp: string
  execution_time: number
}

interface ResultDisplayProps {
  results: Result[]
}

const ResultDisplay: FC<ResultDisplayProps> = ({ results }) => {
  const formatResult = (result: any) => {
    if (result.error) {
      return (
        <div className="text-red-400">
          <strong>Error:</strong> {result.error}
        </div>
      )
    }
    
    if (result.reasoning && result.answer) {
      return (
        <div className="space-y-3">
          <div>
            <strong className="text-blue-400">Reasoning:</strong>
            <p className="mt-1 text-gray-300">{result.reasoning}</p>
          </div>
          <div>
            <strong className="text-green-400">Answer:</strong>
            <p className="mt-1 text-gray-300">{result.answer}</p>
          </div>
        </div>
      )
    }
    
    if (result.code) {
      return (
        <div className="space-y-3">
          {result.approach && (
            <div>
              <strong className="text-blue-400">Approach:</strong>
              <p className="mt-1 text-gray-300">{result.approach}</p>
            </div>
          )}
          <div>
            <strong className="text-green-400">Code:</strong>
            <pre className="mt-2 p-3 bg-gray-900 rounded overflow-x-auto">
              <code className="text-sm text-gray-300">{result.code}</code>
            </pre>
          </div>
          {result.explanation && (
            <div>
              <strong className="text-yellow-400">Explanation:</strong>
              <p className="mt-1 text-gray-300">{result.explanation}</p>
            </div>
          )}
        </div>
      )
    }
    
    if (result.configuration) {
      return (
        <div className="space-y-3">
          {result.strategy && (
            <div>
              <strong className="text-blue-400">Strategy:</strong>
              <p className="mt-1 text-gray-300">{result.strategy}</p>
            </div>
          )}
          <div>
            <strong className="text-green-400">Configuration:</strong>
            <pre className="mt-2 p-3 bg-gray-900 rounded overflow-x-auto">
              <code className="text-sm text-gray-300">{result.configuration}</code>
            </pre>
          </div>
          {result.validation && (
            <div>
              <strong className="text-yellow-400">Validation:</strong>
              <p className="mt-1 text-gray-300">{result.validation}</p>
            </div>
          )}
        </div>
      )
    }
    
    if (result.design) {
      return (
        <div className="space-y-3">
          <div>
            <strong className="text-blue-400">Design:</strong>
            <p className="mt-1 text-gray-300">{result.design}</p>
          </div>
          {result.api_spec && (
            <div>
              <strong className="text-green-400">API Specification:</strong>
              <pre className="mt-2 p-3 bg-gray-900 rounded overflow-x-auto">
                <code className="text-sm text-gray-300">{result.api_spec}</code>
              </pre>
            </div>
          )}
          {result.implementation_notes && (
            <div>
              <strong className="text-yellow-400">Implementation Notes:</strong>
              <p className="mt-1 text-gray-300">{result.implementation_notes}</p>
            </div>
          )}
        </div>
      )
    }
    
    if (result.response) {
      return (
        <div>
          <strong className="text-blue-400">Response:</strong>
          <p className="mt-1 text-gray-300">{result.response}</p>
        </div>
      )
    }
    
    return <pre className="text-gray-300">{JSON.stringify(result, null, 2)}</pre>
  }

  if (results.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        <p className="text-gray-400">No results yet. Execute a task to see results here.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {results.map((result, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-600 rounded text-xs font-medium">
                  {result.task_type}
                </span>
                <span className="px-2 py-1 bg-purple-600 rounded text-xs font-medium">
                  {result.model}
                </span>
              </div>
              <div className="text-right text-xs text-gray-400">
                <div>{new Date(result.timestamp).toLocaleString()}</div>
                <div>{result.execution_time.toFixed(2)}s</div>
              </div>
            </div>
            
            <div className="mt-3">
              {formatResult(result.result)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultDisplay