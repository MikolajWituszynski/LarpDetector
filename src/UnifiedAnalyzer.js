import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { X, Github, Command, Map, Info,HelpCircle,AlertCircle,ShieldAlert } from 'lucide-react';
import { analyzeGitHubRepo } from "./services/github";
import { getHealthScoreColor, getHealthScoreDisplay } from "./constants";
import { TABS } from "./constants";
import Tab from "./components/tab-contents/Tab";
import OverviewTab from "./components/tab-contents/OverviewTab";
import RoadmapSidebar from './components/tab-contents/RoadmapSidebar';
import HowToStartSidebar from  './components/tab-contents/HowToStartSidebar'
import SocialsSidebar from  './components/tab-contents/SocialsSidebar'
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/Badge";
import MetricCard from './components/MetricCard';
import XLogo from './components/ui/logo';
import { useNavigate } from 'react-router-dom';
import GettingStartedTab from './components/tab-contents/GettingStartedTab';
import { Tooltip,TooltipProvider,TooltipTrigger,TooltipContent } from './components/ui/tooltip';
const UnifiedAnalyzer = ({ type = 'github' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [howToStartOpen, setHowToStartOpen] = useState(false);
  const navigate = useNavigate();

 // Update the handleAnalyze function
const handleAnalyze = async () => {
  if (!input) return;
  setLoading(true);
  setError(null);
  
  try {
    if (type === 'github') {
      const githubResult = await analyzeGitHubRepo(input);
      setData(githubResult);
    } else if (type === 'x') {
      // Remove the @ symbol if it's included
      const cleanHandle = input.replace('@', '');
      const response = await fetch(`http://localhost:3001/api/twitter/analyze/${cleanHandle}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to analyze handle');
      setData(result.data);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const renderTabContent = () => {
    if (!data || type !== 'github') return null;

    switch (activeTab) {
      case "overview": return <OverviewTab data={data} />;
      case "started": return <GettingStartedTab data={data}/>
      default: return <OverviewTab data={data} />;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              
            <div className="flex items-center gap-3">
            </div>  <span className="font-mono text-xl font-bold">WarOnLarps</span>
</div>
              
              {/* Analysis Type Toggle */}
              <div className="flex items-center border-2 border-black rounded-lg overflow-hidden">
                <button
                  onClick={() => navigate('/github')}
                  className={`flex items-center px-4 py-2 font-mono ${
                    type === 'github' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </button>
                <button
                  onClick={() => navigate('/x')}
                  className={`flex items-center px-4 py-2 font-mono ${
                    type === 'x' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <XLogo className="h-4 w-4 mr-2" />
                  (Twitter)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">


            <Button
                variant="outline"
                onClick={() => setHowToStartOpen(true)}
                className="font-mono"
              >
            <Info className="h-4 w-4 mr-2" />
            📚 How to Use!
                <Badge variant="secondary" className="ml-2">New</Badge>
              </Button>

              <Button
                variant="outline"
                onClick={() => setRoadmapOpen(true)}
                className="font-mono"
              >
                <Map className="h-4 w-4 mr-2" />
                Roadmap
                <Badge variant="secondary" className="ml-2">New</Badge>
              </Button>
              <Button
                variant="outline"
                onClick={() => setSocialsOpen(true)}
                className="font-mono"
              >
                <div className="h-4 w-4 mr-2" />
               🌐 Links
                <Badge variant="secondary" className="ml-2">New</Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">

{/* Input Section */}
<div className="bg-white p-6 rounded-lg border-2 border-black mb-6">
  <div className="space-y-4">
    <div className="max-w-2xl">
      <div className="flex space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {type === 'x' ? (
              <XLogo className="h-5 w-5 text-gray-400" />
            ) : (
              <Github className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              type === 'github' 
                ? 'Enter repository URL (e.g., https://github.com/facebook/react)' 
                : 'Enter X handle (e.g., @username)'
            }
            className="block w-full pl-10 pr-10 py-3 border-2 border-black font-mono text-base"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <HelpCircle className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {type === 'github' 
                    ? 'Enter a GitHub repository URL in the format: https://github.com/username/repository'
                    : 'Enter an X (Twitter) handle with or without the @ symbol'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white px-6 font-mono"
        >
          {loading ? "..." : "ANALYZE"}
        </Button>
      </div>
    </div>

    {/* Quick Examples */}
    {type === 'github' && (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Try examples:</span>
        <div className="flex gap-2">
          {[
            { name: 'Listen', url: 'https://github.com/piotrostr/listen' },
            { name: 'Neur.sh', url: 'https://github.com/NeurProjects/neur-app' },
          ].map((example) => (
            <button
              key={example.name}
              onClick={() => setInput(example.url)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Format Guide */}
    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-gray-700">Quick Guide</p>
        {type === 'github' ? (
          <p>Enter a GitHub repository URL in the format: https://github.com/username/repository</p>
        ) : (
          <p>Enter an X (Twitter) handle with or without the @ symbol (e.g., @username or username)</p>
        )}
      </div>
    </div>
  </div>
</div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* GitHub Results */}
        {data && type === 'github' && (
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

            <div className="p-5">{renderTabContent()}</div>
          </div>
        )}

        {/* Twitter Results */}
        {data && type === 'x' && data.metadata && data.metadata.data && data.metadata.data[0] && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-2 border-black">
              <div className="flex items-start gap-4">
                <XLogo className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{data.metadata.data[0].list_name}</h2>
                      <p className="text-gray-600">@{data.metadata.data[0].username}</p>
                    </div>
                  </div>
                  {data.bio && (
                    <p className="mt-2 text-gray-700">{data.metadata.data[0].bio}</p>
                  )}
                </div>
              </div>
            </div>

            <TwitterHandleHistory data={data} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Followers"
                value={data.metadata.data[0].num_followers}
                description="Total followers"
              />
              <MetricCard
                title="Following"
                value={data.metadata.data[0].num_friends}
                description="Accounts following"
              />
              <MetricCard
                title="Tweets"
                value={data.metadata.data[0].num_tweets}
                description="Total tweets"
              />
            </div>

            {data.metadata.data[0].location && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Location</h3>
                <p>{data.location}</p>
              </div>
            )}

            {data.metadata.data[0].website && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Website</h3>
                <a 
                  href={data.metadata.data[0].website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {data.metadata.data[0].website}
                </a>
              </div>
            )}
          </div>
        )}
      </main>
     {/* Footer Disclaimer */}
     {/* Simplified Footer Disclaimer */}
     <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <ShieldAlert className="h-4 w-4 mr-2" />
              <span>
                DISCLAIMER: This tool is provided for informational and research purposes only and does not constitute financial, investment, legal, or tax advice. Past performance does not guarantee future results.{" "}
                <a 
                  href="#/terms" 
                  className="text-blue-600 hover:text-blue-800 underline ml-1"
                >
                  For more information, visit our Terms and Conditions
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    
     {/* Sidebars */}
     <RoadmapSidebar 
     open={roadmapOpen} 
     onClose={() => setRoadmapOpen(false)} 
   />
   
   <SocialsSidebar 
     open={socialsOpen} 
     onClose={() => setSocialsOpen(false)} 
   />

   <HowToStartSidebar
     open={howToStartOpen}
     onClose={() => setHowToStartOpen(false)}
   />
   </>
  );
};

export default UnifiedAnalyzer;