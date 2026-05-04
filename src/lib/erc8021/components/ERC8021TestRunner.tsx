"use client"
import React, { useState } from 'react';
import { runTests } from '../test-utils';

export function ERC8021TestRunner() {
  const [result, setResult] = useState<boolean | null>(null);
  
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <h3 className="text-xl font-bold mb-4">ERC-8021 Test Runner</h3>
      <button 
        onClick={() => setResult(runTests())}
        className="px-4 py-2 bg-blue-600 rounded-lg text-white font-bold"
      >
        Run Tests
      </button>
      {result !== null && (
        <div className="mt-4">
          Status: {result ? "✅ All tests passed" : "❌ Some tests failed"}
        </div>
      )}
    </div>
  );
}
