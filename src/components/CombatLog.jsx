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
  
  // Sort the combat log by phase to ensure they're displayed in order
  const sortedLog = [...combatLog].sort((a, b) => a.phase - b.phase);
  
  const getWinnerName = (entry) => {
    return entry.phaseWinner === 1 ? creature1.name : creature2.name;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Combat Log</h3>
      <div className="space-y-4">
        {sortedLog.map((entry, index) => (
          <div key={index} className="border-b pb-2 last:border-b-0">
            <div className="font-semibold text-lg mb-2">
              Phase {entry.phase + 1}: {combatPhases[entry.phase].description}
            </div>
            <div>
              {creature1.name}: {entry.hits1.toFixed(1)} hits
            </div>
            <div>
              {creature2.name}: {entry.hits2.toFixed(1)} hits
            </div>
            <div className="mt-2 text-green-600">
              {getWinnerName(entry)} wins this phase!
              {entry.bonusValue && (
                <span className="text-blue-500 ml-2">
                  (+{entry.bonusValue} bonus for next phase)
                </span>
              )}
            </div>
            {entry.isInjured && (
              <div className="mt-2 text-red-600">
                {entry.injuredFighter === 1 ? creature1.name : creature2.name} was injured!
                <div className="text-sm">
                  (Injury chance was {(entry.injuryChance * 100).toFixed(1)}%)
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatLog; 