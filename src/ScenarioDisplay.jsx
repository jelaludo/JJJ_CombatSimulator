import React from 'react';

const ScenarioDisplay = ({ scenario, fighter1Name, fighter2Name, phaseWinner }) => {
  if (!scenario) return null;
  
  // Get the winner and loser names
  const winnerName = phaseWinner === 1 ? fighter1Name : fighter2Name;
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
        <span className="text-blue-600">{winnerName} executes a perfect {scenario.name}!</span>
      </div>
    </div>
  );
};

export default ScenarioDisplay; 