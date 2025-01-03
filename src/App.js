import React from 'react';
import { Toaster } from './components/ui/toaster';
import GitHubAnalyzer from './GitHubAnalyzer';


function App() {
  return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8">
          <GitHubAnalyzer />
        </main>
        <Toaster />
      </div>
  );
}

export default App;