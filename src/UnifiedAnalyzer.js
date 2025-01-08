import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Twitter, Github } from 'lucide-react';
import Navbar from './Navbar';
import { analyzeGitHubRepo } from "./services/github";
import { getHealthScoreColor, getHealthScoreDisplay } from "./constants";
import { TABS } from "./constants";
import Tab from "./components/tab-contents/Tab";
import OverviewTab from "./components/tab-contents/OverviewTab";
import CodeQualityTab from "./components/tab-contents/CodeQualityTab";
import ActivityTab from "./components/tab-contents/ActivityTab";
import CommunityTab from "./components/tab-contents/CommunityTab";

import MetricCard from './components/MetricCard';
const UnifiedAnalyzer = ({ type = 'github' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [howToStartOpen, setHowToStartOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    setError(null);
    
    try {
      if (type === 'github') {
        const githubResult = await analyzeGitHubRepo(input);
        setData(githubResult);
      } else {
        const response = await fetch(`http://localhost:3001/api/twitter/analyze/${input}`);
        const result = await response.json();
        console.log("Response: res " + JSON.stringify(result.data));

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
      case "activity": return <ActivityTab data={data} />;
      case "community": return <CommunityTab data={data} />;
      default: return <OverviewTab data={data} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="font-mono p-5 max-w-6xl mx-auto">
        <Navbar 
            setRoadmapOpen={setRoadmapOpen}
            setSocialsOpen={setSocialsOpen}
            setHowToStartOpen={setHowToStartOpen}
            roadmapOpen={roadmapOpen}
            socialsOpen={socialsOpen}
            howToStartOpen={howToStartOpen}
            currentPage={type}
          />

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={type === 'github' ? 'https://github.com/user/repo' : 'Enter Twitter handle...'}
              className="flex-1 p-3 border-2 border-black text-base font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-black text-white px-5 py-3 text-base cursor-pointer font-mono disabled:opacity-50"
            >
              {loading ? "..." : "ANALYZE"}
            </button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                  <div className={`px-3 py-1 rounded-full text-sm ${getHealthScoreDisplay(data.health.score).color}`}>
                    {getHealthScoreDisplay(data.health.score).description}
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

{data && type === 'twitter' && data.metadata && data.metadata.data && data.metadata.data[0] && (

<div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border-2 border-black">
                <div className="flex items-start gap-4">
                  <Twitter className="h-8 w-8 text-blue-500" />
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
        </div>
      </div>
    </div>
  );
};

export default UnifiedAnalyzer;