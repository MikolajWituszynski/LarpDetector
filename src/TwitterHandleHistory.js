import React from 'react';
import { History, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";

const TwitterHandleHistory = ({ data }) => {
  if (!data?.metadata) return null;

  const currentHandle = data.metadata.username;
  const previousHandles = data.pastUsernames || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-medium">Handle History</CardTitle>
          </div>
          {previousHandles.length > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800">
              {previousHandles.length} Changes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Handle */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-mono">@{currentHandle}</span>
            <Badge variant="secondary">Current</Badge>
          </div>
        </div>

        {/* Previous Handles */}
        {previousHandles.map((handle, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <span className="font-mono">@{handle.username}</span>
            <span className="text-sm text-gray-500">
              {formatDate(handle.last_checked)}
            </span>
          </div>
        ))}

        {/* Warning for Multiple Changes */}
        {previousHandles.length > 2 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Multiple Handle Changes</AlertTitle>
            <AlertDescription>
              This account has changed handles {previousHandles.length} times.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitterHandleHistory;