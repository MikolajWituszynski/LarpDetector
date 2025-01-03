import React from 'react';
import InfoTooltip from './InfoTooltip';
import { Card, CardContent, CardHeader } from "./ui/card";

const MetricCard = ({ title, value, description, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm text-gray-600">{title}</h3>
          {description && <InfoTooltip content={description} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;