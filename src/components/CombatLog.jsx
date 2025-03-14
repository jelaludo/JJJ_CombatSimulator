import React from 'react';

/**
 * Component to display the combat log
 * @param {Object} props - Component props
 * @param {Array} props.combatLog - Array of combat log entries
 * @param {Array} props.combatPhases - Array of combat phases
 * @param {Object} props.creature1 - Fighter 1 data
 * @param {Object} props.creature2 - Fighter 2 data
 * @returns {JSX.Element} - Rendered component
 */
const CombatLog = ({ combatLog, combatPhases, creature1, creature2 }) => {
  if (!combatLog || combatLog.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Combat Log</h2>
      
      <div className="text-sm">
        {combatLog.map((entry, index) => {
          // Get the correct phase name for this entry based on the phase property
          const phaseNames = ["Takedown", "Passing", "Pinning", "Submission"];
          const phaseName = phaseNames[entry.phase];
          
          // Get the winner name
          const winnerName = entry.phaseWinner === 1 ? creature1.name : 
                            entry.phaseWinner === 2 ? creature2.name : "No one";
          
          // Get the loser name
          const loserName = entry.phaseWinner === 1 ? creature2.name : 
                           entry.phaseWinner === 2 ? creature1.name : "No one";
          
          return (
            <div key={index} className="mb-2 p-2 border-b">
              <div className="font-bold">
                Phase {entry.phase + 1}: {combatPhases[entry.phase].name} ({combatPhases[entry.phase].description})
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  {creature1.name}: {entry.hits1} hits (p={entry.p1.toFixed(2)})
                </div>
                <div>
                  {creature2.name}: {entry.hits2} hits (p={entry.p2.toFixed(2)})
                </div>
              </div>
              <div>
                Result: {entry.phaseWinner === 1 ? 
                  `${creature1.name} wins` : 
                  entry.phaseWinner === 2 ? 
                  `${creature2.name} wins` : 
                  'Draw'}
                {entry.bonusValue && entry.phaseWinner !== 0 && (
                  <span className="ml-2 font-semibold text-green-600">
                    +{entry.bonusValue} bonus for next phase
                  </span>
                )}
                {entry.scenario && (
                  <div className="mt-1 pl-4 border-l-2 border-blue-300">
                    <div className="font-semibold">{phaseName} Phase:</div>
                    <div>{winnerName} executes {entry.scenario.name}: {entry.scenario.description.replace('the opponent', loserName)}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CombatLog; 