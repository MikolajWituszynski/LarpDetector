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
import { Map, ChevronRight, ChevronLeft,Twitter } from 'lucide-react';
import RoadmapDetails from './components/RoadmapDetails';
import  {Button, buttonVariants}  from "./components/ui/button";
import  {Badge } from "./components/ui/Badge";
import RoadmapSidebar from './components/tab-contents/RoadmapSidebar';
import SocialsSidebar from './components/tab-contents/SocialsSidebar';

const GitHubAnalyzer = () => {
  
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  const [url, setUrl] = useState('');

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

// Helper function to fetch social data
const fetchSocialData = async (url) => {
  // In real implementation, this would fetch data from your backend
  // Mock data for demonstration
  return {
    twitter: {
      followers: 5000,
      createdAt: '2023-01-01',
      handleChanges: 2,
      avgDailyGrowth: '1.2%',
      engagementRate: '3.5%',
      riskIndicators: [
        {
          title: 'Recent Handle Change',
          description: 'Twitter handle was changed 2 days ago',
          severity: 'warning'
        }
      ]
    },
    telegram: {
      members: 2500,
      activeMembers: 1200,
      messageFrequency: 450,
      spamProtection: true,
      verificationLevel: 'High',
      activity: {
        '24h': 2400,
        '7d': 15000,
        '30d': 45000
      }
    },
    tokenLocks: {
      totalLocked: '45%',
      averageDuration: '180 days',
      lockCount: 3,
      locks: [
        {
          type: 'Team Tokens',
          amount: '1,000,000',
          percentage: 10,
          duration: '365 days',
          progress: 30,
          isVesting: true
        }
      ]
    },
    socialScore: 85
  };
};
  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both GitHub and social data
      const [githubResult, socialResult] = await Promise.all([
        analyzeGitHubRepo(url),
        fetchSocialData(url)
      ]);
      
      // Merge the data
      setData({
        ...githubResult,
        social: socialResult
      });
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
      {/* Both sidebars */}
      <RoadmapSidebar 
        open={roadmapOpen} 
        onClose={() => setRoadmapOpen(false)} 
      />
      
      <SocialsSidebar 
        open={socialsOpen} 
        onClose={() => setSocialsOpen(false)} 
        data={data}
        />

      {/* Main Content */}
      <div className="flex-1">
        <div className="font-mono p-5 max-w-6xl mx-auto">
          {/* Header with working buttons */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌘</span>
              <h1 className="m-0 text-2xl"></h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Opening roadmap...');  // Add this for debugging
                  setRoadmapOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Roadmap
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Opening socials...');  // Add this for debugging
                  setSocialsOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Socials
                <Badge variant="secondary" className="ml-1">New</Badge>
              </Button>
            </div>
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