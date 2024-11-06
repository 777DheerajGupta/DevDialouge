import React from 'react';

const AdditionalSections = () => {
  const insights = [
    { title: 'Weekly Summary', description: 'View your activity summary' },
    { title: 'Achievement Progress', description: 'Track your badges and rewards' },
    { title: 'Trending Topics', description: 'Popular discussions in your areas' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Insights</h2>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.title} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{insight.title}</h3>
            <p className="text-sm text-gray-600">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalSections; 