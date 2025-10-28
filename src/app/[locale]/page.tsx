// src/app/page.tsx
"use client";

import { useState } from "react";
{ /* We'll import our runner and hook here */ }
import { runTransformFlow } from "../lib/runner";

// The example component from the prompt
const exampleCode = `// example.tsx
export default function Hero() {
  return (
    <div>
      <h1>Welcome to Trgmly</h1>
      <p>Make your code speak multiple languages</p>
      <button title="Get started">Get Started</button>
    </div>
  );
}`;

export default function HomePage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const flowResult = await runTransformFlow(exampleCode, "ar");
      setResult(flowResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Trgmly</h1>
        <p className="text-center text-gray-600 mb-8">
          Automate your i18n workflow for React/Next.js
        </p>

        <div className="text-center mb-8">
          <button
            onClick={handleTransform}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Processing..." : "Transform Example Code"}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mb-4">Error: {error}</p>}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Transformed Code</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{result.transformedCode}</code>
              </pre>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Translations JSON (ar)</h2>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(result.translationsJson, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}