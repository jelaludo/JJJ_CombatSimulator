import React from 'react';

const ScenarioDisplay = ({ scenario, fighter1Name, fighter2Name, phaseWinner }) => {
  if (!scenario) return null;
  
  // Determine which fighter to mention in the description
  const loserName = phaseWinner === 1 ? fighter2Name : fighter1Name;
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
      <div className="text-center mb-2">
        <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {scenario.name}
        </span>
      </div>
      
      <p className="text-center italic">
        {scenario.description.replace('the opponent', loserName)}
      </p>
      
      <div className="mt-3 text-center font-bold">
        {phaseWinner === 1 ? (
          <span className="text-blue-600">{fighter1Name} executes a perfect {scenario.name}!</span>
        ) : (
          <span className="text-red-600">{fighter2Name} executes a perfect {scenario.name}!</span>
        )}
      </div>
    </div>
  );
};

export default ScenarioDisplay; 