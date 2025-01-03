import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const AnalysisSection = ({ title, subtitle, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalysisSection;