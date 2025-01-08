import React from 'react';
import { History, AlertTriangle, Twitter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const XHistoryTracker = ({ data }) => {
  const {
    currentHandle,
    previousHandles = [],
    lastChanged,
    riskLevel,
    verificationStatus
  } = data;

  const calculateRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Twitter className="h-5 w-5" />
          Twitter Handle Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Handle */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Current Handle:</span>
          </div>
          <span className="font-mono">@{currentHandle}</span>
        </div>

        {/* Handle History */}
        {previousHandles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              Previous Handles
            </h4>
            <div className="space-y-2">
              {previousHandles.map((handle, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="font-mono">@{handle.name}</span>
                  <span className="text-sm text-gray-600">
                    Changed: {formatDate(handle.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {riskLevel && (
          <Alert className={calculateRiskColor(riskLevel)}>
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Handle Change Risk: {riskLevel.toUpperCase()}
            </AlertTitle>
            <AlertDescription>
              {riskLevel === 'high' && 'Frequent handle changes detected. Exercise caution.'}
              {riskLevel === 'medium' && 'Some handle changes detected. Further verification recommended.'}
              {riskLevel === 'low' && 'Handle appears stable with minimal changes.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Verification Status */}
        <div className="mt-4 text-sm text-gray-600">
          <strong>Last Verified:</strong> {formatDate(lastChanged)}
          {verificationStatus && (
            <div className="mt-1">
              <strong>Status:</strong> {verificationStatus}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default XHistoryTracker;