// App.js
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import UnifiedAnalyzer from './UnifiedAnalyzer';

function App() {
  return (
    <Router>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<UnifiedAnalyzer type="github" />} />
            <Route path="/X-check" element={<UnifiedAnalyzer type="twitter" />
} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
    </Router>
  );
}

export default App;
