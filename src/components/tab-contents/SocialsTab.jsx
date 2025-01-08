import React from 'react';
import { Twitter, MessageCircle, Lock, AlertCircle, Users, History, TrendingUp, Shield, ExternalLink } from 'lucide-react';
import { Button } from "../ui/button";
import AnalysisSection from '../AnalysisSection';
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const ExternalLinkButton = ({ href, icon: Icon, children }) => (
  <Button
    variant="outline"
    onClick={() => window.open(href, '_blank')}
    className="flex items-center gap-2"
  >
    <Icon className="h-4 w-4" />
    {children}
    <ExternalLink className="h-4 w-4 ml-1" />
  </Button>
);

const SocialsTab = () => {
 



  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <AnalysisSection 
        title="Quick Links" 
        subtitle="Direct access to project's social presence"
      >
        <div className="flex flex-wrap gap-3">
          <ExternalLinkButton
            icon={Twitter}
          >
            Twitter Profile
          </ExternalLinkButton>
          <ExternalLinkButton
            icon={MessageCircle}
          >
            Telegram Group
              </ExternalLinkButton> 
              <ExternalLinkButton
            href="https://app.streamflow.finance/"
            icon={Lock}
          >
            View Token Locks
          </ExternalLinkButton>
        </div>
      </AnalysisSection>

    
    
      </div>
  )
};

export default SocialsTab;