'use client';

import { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse"
      >
        <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
        <path 
          d="M16 8C16 8 14 10 14 12C14 14 16 16 16 16M16 16C16 16 18 14 18 12C18 10 16 8 16 8M16 16V20M12 20H20M10 24H22" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="16" cy="12" r="1" fill="white" opacity="0.8"/>
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9"/>
            <stop offset="0.5" stopColor="#7c3aed"/>
            <stop offset="1" stopColor="#ec4899"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          DEROZIC AI
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Orchestrator</span>
      </div>
    </div>
  );
};

export default Logo;