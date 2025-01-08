// RoadmapFeature.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import  {Badge}  from "./ui/Badge";

const RoadmapFeature = ({ icon: Icon, title, description, timeline, features, status }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <Badge variant={status === 'Planned' ? 'secondary' : 'default'}>
          {status} - {timeline}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default RoadmapFeature;