import React from 'react';
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import  Progress  from "../ui/Progress";
import MetricCard from '../MetricCard';
import AnalysisSection from '../AnalysisSection';
const CodeQualityTab = ({ data }) => {
  if (!data) return null;

  const { codeQuality, languages } = data;
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  // Sort languages by usage
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, bytes]) => ({
      name: lang,
      bytes,
      percentage: (bytes / totalBytes) * 100
    }));

  return (
    <div className="space-y-6">
      {/* Code Style Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Languages"
          value={Object.keys(languages).length}
          description="Number of programming languages used"
        />
        <MetricCard
          title="Code Style Tools"
          value={Object.values(codeQuality.codeStyle).filter(Boolean).length}
          description="Number of code quality tools configured"
        />
        <MetricCard
          title="Primary Language"
          value={sortedLanguages[0]?.name || 'N/A'}
          description={`${sortedLanguages[0]?.percentage.toFixed(1)}% of codebase`}
        />
      </div>

      {/* Language Distribution */}
      <AnalysisSection title="Language Distribution">
        <div className="space-y-4">
          {sortedLanguages.map((lang) => (
            <div key={lang.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{lang.name}</span>
                <span className="text-sm text-gray-600">
                  {lang.percentage.toFixed(1)}% ({(lang.bytes / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Progress value={lang.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Code Maintenance */}
      <AnalysisSection title="Code Maintenance Tools">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(codeQuality.codeStyle).map(([tool, isPresent]) => (
            <div
              key={tool}
              className={`p-4 rounded-lg border ${
                isPresent ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                {isPresent ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium">
                    {tool.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isPresent
                      ? `${tool.replace(/([A-Z])/g, ' $1').trim()} is configured`
                      : `No ${tool.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} configuration found`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Code Complexity */}
      {codeQuality.complexity && (
        <AnalysisSection 
          title="Code Complexity" 
          subtitle="Analysis of code complexity metrics"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Average File Size"
              value={`${codeQuality.complexity.averageFileSize.toFixed(1)} KB`}
              description="Average size of source files"
            />
            <MetricCard
              title="Largest File"
              value={`${codeQuality.complexity.largestFile.size.toFixed(1)} KB`}
              description={`${codeQuality.complexity.largestFile.name}`}
            />
            <MetricCard
              title="Directory Depth"
              value={codeQuality.complexity.maxDirectoryDepth}
              description="Maximum directory nesting level"
            />
          </div>
        </AnalysisSection>
      )}

      {/* Best Practices */}
      <AnalysisSection title="Best Practices">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Configuration Files</h4>
            <ul className="space-y-2">
              {[
                { name: 'EditorConfig', present: codeQuality.codeStyle.hasEditorConfig },
                { name: 'Git Attributes', present: codeQuality.hasGitAttributes },
                { name: 'Git Ignore', present: codeQuality.hasGitIgnore },
                { name: 'Package Lock', present: codeQuality.hasPackageLock }
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  {item.present ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={item.present ? 'text-green-900' : 'text-gray-600'}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Documentation</h4>
            <ul className="space-y-2">
              {[
                { name: 'README', present: codeQuality.hasReadme },
                { name: 'Contributing Guide', present: codeQuality.hasContributing },
                { name: 'License', present: codeQuality.hasLicense },
                { name: 'Changelog', present: codeQuality.hasChangelog }
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  {item.present ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={item.present ? 'text-green-900' : 'text-gray-600'}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default CodeQualityTab;