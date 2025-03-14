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

  // Create a map of phase entries for easy access
  const phaseEntries = {};
  sortedLog.forEach(entry => {
    phaseEntries[entry.phase] = entry;
  });
  
  // Check if this phase is a reversal, continuation of dominance, or a scramble
  const getPhaseFlowStatus = (currentPhaseIndex) => {
    const currentEntry = phaseEntries[currentPhaseIndex];
    
    // If the current entry is a scramble/draw, return "Scramble!"
    if (currentEntry && currentEntry.phaseWinner === 0) {
      return "Scramble!";
    }
    
    // Phase 0 (first phase) doesn't have a previous phase to compare
    if (currentPhaseIndex === 0) return null;
    
    const previousEntry = phaseEntries[currentPhaseIndex - 1];
    
    // If either entry is missing or previous has no winner, we can't determine
    if (!currentEntry || !previousEntry || previousEntry.phaseWinner === 0) {
      return null;
    }
    
    // Compare winners
    if (currentEntry.phaseWinner !== previousEntry.phaseWinner) {
      return "REVERSAL!";
    } else {
      return "Dominance!";
    }
  };

  // Render a single phase log
  const renderPhaseLog = (phaseIndex) => {
    const entry = phaseEntries[phaseIndex];
    
    if (!entry) {
      return (
        <div className="bg-gray-50 p-3 rounded-lg h-full flex items-center justify-center">
          <p className="text-gray-400">Phase {phaseIndex + 1} pending...</p>
        </div>
      );
    }
    
    // Get the flow status (REVERSAL, Dominance, or Scramble)
    const flowStatus = getPhaseFlowStatus(phaseIndex);
    
    // Determine the color for the flow status
    const getFlowStatusColor = (status) => {
      if (status === "REVERSAL!") return "text-red-600";
      if (status === "Dominance!") return "text-blue-600";
      if (status === "Scramble!") return "text-purple-600";
      return "";
    };
    
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-200 h-full relative">
        {/* Decisive Element Badge - Display scenario name in top-right */}
        {entry.scenario && entry.scenario.name && (
          <div className="absolute top-2 right-2">
            <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              {entry.scenario.name}
            </span>
            {/* Display flow status under the technique name */}
            {flowStatus && (
              <div className={`text-center mt-1 text-xs font-bold ${getFlowStatusColor(flowStatus)}`}>
                {flowStatus}
              </div>
            )}
          </div>
        )}
        
        <div className="font-semibold text-md mb-2">
          Phase {entry.phase + 1}: {combatPhases[entry.phase].description}
        </div>
        <div className="text-sm">
          {creature1.name}: {entry.hits1.toFixed(1)} hits
        </div>
        <div className="text-sm">
          {creature2.name}: {entry.hits2.toFixed(1)} hits
        </div>
        {entry.phaseWinner !== 0 ? (
          <div className="mt-2 text-green-600 text-sm">
            {getWinnerName(entry)} wins this phase!
            {entry.bonusValue && (
              <span className="text-blue-500 ml-2">
                (+{entry.bonusValue})
              </span>
            )}
          </div>
        ) : (
          <div className="mt-2 text-purple-600 text-sm">
            Scramble! No clear winner in this phase.
            {entry.hitsDifference && (
              <span className="text-gray-500 ml-2">
                (Difference: {entry.hitsDifference.toFixed(1)})
              </span>
            )}
          </div>
        )}
        {entry.isInjured && (
          <div className="mt-2 text-red-600 text-sm">
            {entry.injuredFighter === 1 ? creature1.name : creature2.name} was injured!
            <div className="text-xs">
              (Chance: {(entry.injuryChance * 100).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Combat Log</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Phase 1: Takedown */}
        <div>{renderPhaseLog(0)}</div>
        
        {/* Phase 2: Passing */}
        <div>{renderPhaseLog(1)}</div>
        
        {/* Phase 3: Pinning */}
        <div>{renderPhaseLog(2)}</div>
        
        {/* Phase 4: Submission */}
        <div>{renderPhaseLog(3)}</div>
      </div>
    </div>
  );
};

export default CombatLog; 