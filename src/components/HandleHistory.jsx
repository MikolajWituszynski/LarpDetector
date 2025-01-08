import React from 'react';
import { History, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/Badge";

const HandleHistory = ({ handleData }) => {
  const {
    currentHandle,
    previousHandles = [
      { name: "@elonmusk_old", date: "2023-01-15" },
      { name: "@OriginalElon", date: "2023-06-20" }
    ],
    lastChanged = "2024-01-01",
    riskLevel = "low",
    verificationStatus = "Verified"
  } = handleData;

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
          <History className="h-5 w-5" />
          Handle History Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Handle */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
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
                  <span className="font-mono">{handle.name}</span>
                  <span className="text-sm text-gray-600">
                    Changed: {formatDate(handle.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
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

        {/* Verification Status */}
        <div className="mt-4 text-sm text-gray-600">
          <strong>Last Verified:</strong> {formatDate(lastChanged)}
          {verificationStatus && (
            <div className="mt-1">
              <strong>Status:</strong>{' '}
              <Badge variant={verificationStatus === 'Verified' ? 'success' : 'warning'}>
                {verificationStatus}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HandleHistory;