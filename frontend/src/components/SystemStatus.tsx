'use client'

import { FC, useEffect, useState } from 'react'

interface SystemInfo {
  cpu_percent: number
  memory: {
    total_gb: number
    available_gb: number
    percent: number
  }
  models_loaded: number
  timestamp: string
}

const SystemStatus: FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const response = await fetch('http://localhost:8765/system/info')
        if (response.ok) {
          const data = await response.json()
          setSystemInfo(data)
          setIsOnline(true)
        }
      } catch (error) {
        setIsOnline(false)
      }
    }

    checkSystem()
    const interval = setInterval(checkSystem, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">System Status</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">API Status</span>
          <span className={`flex items-center gap-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} ${isOnline ? 'animate-pulse' : ''}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        {systemInfo && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">CPU Usage</span>
                <span>{systemInfo.cpu_percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    systemInfo.cpu_percent > 80 ? 'bg-red-500' :
                    systemInfo.cpu_percent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(systemInfo.cpu_percent, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Memory Usage</span>
                <span>{systemInfo.memory.available_gb.toFixed(1)} / {systemInfo.memory.total_gb.toFixed(1)} GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    systemInfo.memory.percent > 80 ? 'bg-red-500' :
                    systemInfo.memory.percent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemInfo.memory.percent}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Models Loaded</span>
              <span className="text-blue-400 font-medium">{systemInfo.models_loaded}</span>
            </div>
          </>
        )}
        
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Backend</span>
            <span className="text-gray-400">http://localhost:8765</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-gray-500">Ollama</span>
            <span className="text-gray-400">http://localhost:11434</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus