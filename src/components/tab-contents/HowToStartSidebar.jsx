import React, { useState } from 'react';
import { Info, ChevronLeft, Activity, Shield, GitBranch, Users, Copy, CheckCheck, AlertTriangle, Check } from 'lucide-react';
import { Button } from "../ui/button";
import { useCallback,useEffect } from 'react';
const EXAMPLE_REPOS = [
  {
    name: "Uniswap v3",
    url: "https://github.com/Uniswap/v3-core",
    type: "Top-tier DeFi",
    description: "Perfect example of what legit project's code should look like",
    greenFlags: ["Daily commits", "100+ contributors", "Full documentation"]
  },
  {
    name: "AAVE Protocol",
    url: "https://github.com/aave/aave-v3-core",
    type: "Leading lending protocol",
    description: "Another example of legitimate development practices",
    greenFlags: ["Active development", "Security features", "Professional team"]
  }
];

const RED_FLAGS = [
  {
    flag: "Empty Repository",
    why: "No real development = likely a scam",
    lookFor: "Missing code, only README file"
  },
  {
    flag: "Copy-Pasted Code",
    why: "Shows lack of real development",
    lookFor: "Identical code to other projects, unchanged names"
  },
  {
    flag: "No Recent Updates",
    why: "Abandoned or fake project",
    lookFor: "No commits in past months"
  },
  {
    flag: "Single Contributor",
    why: "Possible one-person scam",
    lookFor: "Only one person ever touched the code"
  }
];

const GREEN_FLAGS = [
  {
    flag: "Active Development",
    why: "Shows project is alive and maintained",
    lookFor: "Regular commits, multiple contributors"
  },
  {
    flag: "Security Features",
    why: "Shows care about user funds",
    lookFor: "Audits, security tools, bug bounties"
  },
  {
    flag: "Professional Setup",
    why: "Indicates serious team",
    lookFor: "Testing, documentation, proper organization"
  }
];

const HowToStartSidebar = ({ open, onClose }) => {
  const [activeSection, setActiveSection] = useState('howto');
  const [copiedRepo, setCopiedRepo] = useState(null);
  const [width, setWidth] = useState(384); // 96 * 4 = 384px (w-96 equivalent)
  const [isResizing, setIsResizing] = useState(false);
  const [showResizeTooltip, setShowResizeTooltip] = useState(false);

  
// Handle mouse move for resizing
const handleMouseMove = useCallback((e) => {
  if (isResizing) {
    const newWidth = e.clientX;
    // Set min and max width limits
    if (newWidth >= 320 && newWidth <= 800) {
      setWidth(newWidth);
    }
  }
}, [isResizing]);

// Handle mouse up to stop resizing
const handleMouseUp = useCallback(() => {
  setIsResizing(false);
  setShowResizeTooltip(false);

}, []);

// Add and remove event listeners
useEffect(() => {
  if (isResizing) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing, handleMouseMove, handleMouseUp]);

const copyToClipboard = (repo) => {
  navigator.clipboard.writeText(repo.url);
  setCopiedRepo(repo.name);
  setTimeout(() => setCopiedRepo(null), 2000);
};
  return (
   
    <>
    {open && (
      <div 
        className="fixed inset-0 bg-black/20 z-30"
        onClick={onClose}
      />
    )}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          bg-white border-r border-gray-200 flex
        `}
        style={{ width: `${width}px` }}
      >
<div className="flex flex-col h-full w-full">

{/* Header with compact styling */}
<div className="p-3 border-b border-gray-200 flex-shrink-0 bg-white">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Info className="h-4 w-4 text-blue-600" />
      <h2 className="font-medium">Rug Check Guide</h2>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="h-8 w-8 hover:bg-gray-100 rounded-full"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  </div>
  
  <div className="flex gap-2">
    <button
      onClick={() => setActiveSection('howto')}
      className={`
        flex-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm
        ${activeSection === 'howto'
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span>🔍</span>
        <span className="font-medium">Quick Check</span>
        <div className="text-xs opacity-75">5-min basic scan</div>

      </div>
    </button>

    <button
      onClick={() => setActiveSection('detailed')}
      className={`
        flex-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm
        ${activeSection === 'detailed'
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span>🔎</span>
        <span className="font-medium">DYOR Details</span>
      </div>
    </button>
  </div>
</div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeSection === 'howto' ? (
              // Quick Check Section
              <div className="space-y-6">
                {/* Why Check GitHub */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">GitHub is your #1 tool to verify project legitimacy.</h3>
                  <p className="text-gray-700 mb-3">
                    GitHub shows you the actual code behind a token or DeFi project. 
                    No GitHub or empty code? Major red flag! 
                  </p>
                  <div className="bg-yellow-50 rounded p-3 text-sm">
                    <p className="font-medium text-yellow-800">Pro Tip:</p>
                    <p className="text-yellow-700">
                      Scammers often don't bother with real code. They focus on marketing and hype instead.
                    </p>
                  </div>
                </div>

                {/* How to Find It */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Finding Project's Code 🔍</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Check project's website for GitHub links</li>
                    <li>Look in their docs/whitepaper</li>
                    <li>Search their Twitter/Telegram for links</li>
                    <li>Ask team for repository link (no link = 🚩)</li>
                  </ol>
                </div>

                {/* Quick Red Flags */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Instant Red Flags 🚩</h3>
                  <div className="space-y-3">
                    {RED_FLAGS.map((flag, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
                        <h4 className="font-medium text-red-800">{flag.flag}</h4>
                        <p className="text-sm text-gray-600 mt-1">{flag.why}</p>
                        <p className="text-xs text-red-600 mt-1">Look for: {flag.lookFor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Legit Examples ✅</h3>
                  <p className="text-gray-700 mb-3">
                    Compare project's code with these trusted repos:
                  </p>
                  <div className="space-y-3">
                    {EXAMPLE_REPOS.map((repo) => (
                      <div key={repo.name} className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{repo.name}</h4>
                            <p className="text-sm text-gray-600">{repo.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {repo.greenFlags.map((flag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(repo)}
                            className={`${copiedRepo === repo.name ? 'text-green-600' : 'text-gray-500'}`}
                          >
                            {copiedRepo === repo.name ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Score */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Code Trust Score 📊</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>80+ = ✨ Likely legit project</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>60-80 =🔍 Check team & socials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full" />
                      <span>Below 45 = 🚩 High risk of rug</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // DYOR Details Section
              <div className="space-y-6">
                {/* Development Signals */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">What Makes Code Trustworthy</h3>
                  {GREEN_FLAGS.map((flag, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <h4 className="font-medium text-blue-800 flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {flag.flag}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">Why: {flag.why}</p>
                      <p className="text-xs text-blue-600 mt-1">Look for: {flag.lookFor}</p>
                    </div>
                  ))}
                </div>

                {/* Advanced Checks */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">Advanced DYOR Checklist</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Security First 🛡️</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Check for security audits</li>
                        <li>• Look for bug bounty programs</li>
                        <li>• Verify multisig setup</li>
                        <li>• Review access controls</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Code Quality 💎</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Test coverage (more = better)</li>
                        <li>• Documentation quality</li>
                        <li>• Clean, readable code</li>
                        <li>• Professional commit messages</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Team Check 👥</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Multiple active developers</li>
                        <li>• Regular code reviews</li>
                        <li>• Professional discussions</li>
                        <li>• Response to issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

       {/* Enhanced Resize Handle */}
       <div
          className={`
            absolute top-0 right-0 w-4 h-full 
            cursor-ew-resize hover:bg-blue-50 
            transition-colors duration-200
            flex items-center justify-center
            ${isResizing ? 'bg-blue-100' : ''}
          `}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          onMouseEnter={() => setShowResizeTooltip(true)}
          onMouseLeave={() => !isResizing && setShowResizeTooltip(false)}
        >
          {/* Resize Handle Bar */}
          <div className="w-0.5 h-8 bg-gray-300 group-hover:bg-blue-400 rounded-full" />
          
          {/* Resize Tooltip */}
          {showResizeTooltip && (
            <div className="
              absolute right-6 top-1/2 -translate-y-1/2
              bg-gray-800 text-white px-2 py-1 rounded text-sm
              whitespace-nowrap
            ">
              Drag to resize
            </div>
          )}
          
          {/* Size Indicator during resize */}
          {isResizing && (
            <div className="
              absolute bottom-4 right-6
              bg-gray-800 text-white px-2 py-1 rounded text-sm
              whitespace-nowrap
            ">
              {width}px
            </div>
          )}
        </div>
        </div>
    </>
  );
};

export default HowToStartSidebar;