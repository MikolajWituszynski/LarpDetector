import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { TABS } from './constants';
import Tab from './components/tab-contents/Tab';
import { analyzeGitHubRepo } from './services/github';
import { getHealthScoreColor } from './constants';
import OverviewTab from './components/tab-contents/OverviewTab';
import CodeQualityTab from './components/tab-contents/CodeQualityTab';
import DependenciesTab from './components/tab-contents/DependenciesTab';
import ActivityTab from './components/tab-contents/ActivityTab';
import CommunityTab from './components/tab-contents/CommunityTab';
import SecurityTab from './components/tab-contents/SecurityTab';
import BranchesTab from './components/tab-contents/BranchesTab';
import RisksTab from './components/tab-contents/RisksTab';
import RoadmapTab from './components/tab-contents/RoadmapTab';
import { Map, ChevronRight, ChevronLeft } from 'lucide-react';
import RoadmapDetails from './components/RoadmapDetails';
import  {Button, buttonVariants}  from "./components/ui/button";
import  {Badge } from "./components/ui/Badge";

const GitHubAnalyzer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeGitHubRepo(url);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!data) return null;
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data} />;
      case 'code':
        return <CodeQualityTab data={data} />;
      case 'dependencies':
        return <DependenciesTab data={data} />;
      case 'activity':
        return <ActivityTab data={data} />;
      case 'community':
        return <CommunityTab data={data} />;
      case 'security':
        return <SecurityTab data={data} />;
      case 'branches':
        return <BranchesTab data={data} />;
      case 'risks':
        return <RisksTab data={data} />;
      default:
        return <OverviewTab data={data} />;
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40
               w-102

        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-white border-r border-gray-200
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Map className="h-5 w-5" />
              <h2 className="font-medium">Development Roadmap</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <RoadmapDetails />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="font-mono p-5 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌘</span>
              <h1 className="m-0 text-2xl">Repository Health Check</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Roadmap
              <Badge variant="secondary" className="ml-1">New</Badge>
            </Button>
          </div>

          {/* Input Section */}
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 p-3 border-2 border-black text-base font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-black text-white px-5 py-3 text-base cursor-pointer font-mono disabled:opacity-50"
            >
              {loading ? '...' : 'ANALYZE'}
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {data && (
            <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
              <div className="p-5 bg-gray-50 border-b-2 border-black">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl uppercase flex items-center gap-2">
                    {data.repoData.name}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      {data.repoData.description}
                    </span>
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm ${getHealthScoreColor(data.health.score)}`}>
                    Health Score: {data.health.score}
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-black">
                <div className="flex overflow-x-auto">
                  {TABS.map((tab) => (
                    <Tab
                      key={tab.id}
                      icon={tab.icon}
                      label={tab.label}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="p-5">
                {renderTabContent(activeTab, data)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubAnalyzer;