import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer spinner */}
          <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>
          
          {/* Inner spinner with advanced animation */}
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 spinner-animation"></div>
          
          {/* Pulsing center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        <h2 className="text-lg font-medium text-gray-700 mt-4">Loading...</h2>
        
        {/* Progress dots */}
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}