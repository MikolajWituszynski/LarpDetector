// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import UnifiedAnalyzer from './UnifiedAnalyzer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/github" replace />} />
            <Route path="/github" element={<UnifiedAnalyzer type="github" />} />
            <Route path="/x" element={<UnifiedAnalyzer type="x" />} />
            <Route path="*" element={<Navigate to="/github" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;