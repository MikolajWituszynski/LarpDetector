import React, { useState } from 'react';

const GitHubAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const calculateTimeMetrics = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const now = new Date();

    return {
      age: Math.floor((now - created) / (1000 * 60 * 60 * 24)),
      lastActivity: Math.floor((now - updated) / (1000 * 60 * 60 * 24)),
      activeTime: Math.floor((updated - created) / (1000 * 60 * 60 * 24))
    };
  };

  const analyzeRepo = async () => {
    if (!url) return;
    setLoading(true);
    
    try {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error('INVALID URL');
      
      const [, owner, repo] = match;
      const repoData = await fetch(`https://api.github.com/repos/${owner}/${repo}`).then(r => r.json());
      const commits = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`).then(r => r.json());
      const files = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`).then(r => r.json());
      
      const risks = [];
      const timeMetrics = calculateTimeMetrics(repoData.created_at, repoData.updated_at);

      // Basic stats analysis
      if (repoData.stargazers_count < 5) risks.push('LOW COMMUNITY INTEREST');
      if (commits.length < 10) risks.push('VERY FEW COMMITS');

      // Time-based analysis
      if (timeMetrics.lastActivity > 180) risks.push('PROJECT INACTIVE FOR 6+ MONTHS');
      if (timeMetrics.age > 30 && commits.length < 5) risks.push('LOW ACTIVITY FOR PROJECT AGE');

      // Fork analysis
      if (repoData.fork) {
        const originalRepo = await fetch(repoData.parent.url).then(r => r.json());
        const timeDiff = new Date(repoData.created_at) - new Date(originalRepo.created_at);
        risks.push(`FORK OF ${originalRepo.full_name}`);
        risks.push(`CREATED ${Math.floor(timeDiff/(1000*60*60*24))} DAYS AFTER ORIGINAL`);
      }

      // Contributor analysis
      const commitAuthors = new Set(commits.map(c => c.author?.login).filter(Boolean));
      if (commitAuthors.size === 1) risks.push('SINGLE CONTRIBUTOR - POTENTIAL COPY');

      // Initial commits analysis
      if (commits.length > 0 && 
          commits[0].commit.message.includes('Initial commit') && 
          commits.length < 3) {
        risks.push('ONLY INITIAL COMMITS - POSSIBLY ABANDONED COPY');
      }

      // Files analysis
      const hasReadme = files.some(f => f.name.toLowerCase().includes('readme'));
      const hasLicense = files.some(f => f.name.toLowerCase().includes('license'));
      if (!hasReadme && !hasLicense) risks.push('MISSING STANDARD REPOSITORY FILES');

      // Recent activity analysis
      const recentCommits = commits.filter(c => {
        const date = new Date(c.commit.author.date);
        return (new Date() - date) < 1000*60*60*24*7;
      });
      if (recentCommits.length > 50) risks.push('UNUSUAL HIGH COMMIT FREQUENCY');

      // Commit pattern analysis
      if (commits.length > 1) {
        const commitDates = commits.map(c => new Date(c.commit.author.date));
        const timeDiffs = commitDates.slice(1).map((date, i) => date - commitDates[i]);
        const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        if (avgDiff < 1000*60*5) risks.push('SUSPICIOUS COMMIT PATTERN - BULK PUSH');
      }

      const metrics = {
        repoData,
        commits,
        timeMetrics,
        risks,
        commitFrequency: (commits.length / Math.max(timeMetrics.activeTime, 1)).toFixed(2)
      };

      setData(metrics);
    } catch (err) {
      alert(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px' }}>⌘</span>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Repository Health Check</h1>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
          style={{
            flex: 1,
            padding: '10px',
            border: '2px solid black',
            fontSize: '16px',
            fontFamily: 'monospace'
          }}
        />
        <button
          onClick={analyzeRepo}
          disabled={loading}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          {loading ? '...' : 'ANALYZE'}
        </button>
      </div>

      {data && (
        <div style={{ border: '2px solid black', padding: '20px', fontFamily: 'monospace' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', textTransform: 'uppercase' }}>
            {data.repoData.name}
          </h2>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Stars:</span>
              <span>{data.repoData.stargazers_count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Forks:</span>
              <span>{data.repoData.forks_count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Commits:</span>
              <span>{data.commits.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Project Age:</span>
              <span>{data.timeMetrics.age} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Last Activity:</span>
              <span>{data.timeMetrics.lastActivity} days ago</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Active Period:</span>
              <span>{data.timeMetrics.activeTime} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' }}>
              <span>Commit Frequency:</span>
              <span>{data.commitFrequency} commits/day</span>
            </div>
          </div>

          {data.risks.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '10px',
              border: '2px solid black',
              background: '#ff000010'
            }}>
              <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>RISK FACTORS:</div>
              {data.risks.map((risk, i) => (
                <div key={i} style={{ marginBottom: '5px', color: 'red' }}>! {risk}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubAnalyzer;