'use client'

import { FC } from 'react'

interface ProviderToggleProps {
  mode: 'free_first' | 'paid_only' | 'smart'
  onModeChange: (mode: 'free_first' | 'paid_only' | 'smart') => void
}

const ProviderToggle: FC<ProviderToggleProps> = ({ mode, onModeChange }) => {
  const modes = [
    { 
      value: 'free_first', 
      label: 'Free First', 
      description: 'Use local models, escalate to paid when needed',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      value: 'smart', 
      label: 'Smart Routing', 
      description: 'Intelligently route based on task complexity',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      value: 'paid_only', 
      label: 'Paid Priority', 
      description: 'Use premium models for best results',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Provider Mode
      </h2>
      
      <div className="space-y-3">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => onModeChange(m.value as any)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              mode === m.value 
                ? 'bg-gradient-to-r opacity-100 shadow-lg' 
                : 'bg-gray-700/50 opacity-70 hover:opacity-100'
            } ${mode === m.value ? m.color : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-medium ${mode === m.value ? 'text-white' : 'text-gray-200'}`}>
                  {m.label}
                </h3>
                <p className={`text-xs mt-1 ${mode === m.value ? 'text-gray-100' : 'text-gray-400'}`}>
                  {m.description}
                </p>
              </div>
              {mode === m.value && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Current Balance</span>
          <span className="text-green-400 font-mono">$24.82</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-gray-400">Usage Today</span>
          <span className="text-yellow-400 font-mono">127 requests</span>
        </div>
      </div>
    </div>
  )
}

export default ProviderToggle