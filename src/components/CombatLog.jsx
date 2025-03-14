import React from 'react';
import PhaseKanji from './PhaseKanji';

/**
 * Component to display the combat log
 * @param {Object} props - Component props
 * @param {Array} props.combatLog - Array of combat log entries
 * @param {Array} props.combatPhases - Array of combat phases
 * @param {Object} props.creature1 - Fighter 1 data
 * @param {Object} props.creature2 - Fighter 2 data
 * @param {Object} props.currentScenario - Current scenario being displayed
 * @param {boolean} props.showingResults - Whether results are being shown
 * @param {number} props.currentPhaseIndex - Current phase index
 * @returns {JSX.Element} - Rendered component
 */
const CombatLog = ({ 
  combatLog, 
  combatPhases, 
  creature1, 
  creature2, 
  currentScenario,
  showingResults,
  currentPhaseIndex
}) => {
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

  // Get descriptive message for phase winner
  const getWinnerMessage = (entry, phaseIndex) => {
    if (entry.phaseWinner === 0) {
      return "Both fighters are locked in a scramble with no clear advantage!";
    }
    
    const winnerName = getWinnerName(entry);
    const loserName = entry.phaseWinner === 1 ? creature2.name : creature1.name;
    
    // Different messages based on phase
    switch(phaseIndex) {
      case 0: // Takedown
        return `${winnerName} has taken ${loserName} to the ground with superior technique!`;
      case 1: // Passing
        return `${winnerName} has skillfully passed ${loserName}'s guard and gained position!`;
      case 2: // Pinning
        return `${winnerName} has established dominant control over ${loserName}!`;
      case 3: // Submission
        return `${winnerName} has emerged victorious after an intense battle!`;
      default:
        return `${winnerName} wins this phase!`;
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
          Phase {phaseIndex + 1}: {combatPhases[phaseIndex].description}
        </div>
        <div className="text-sm">
          {creature1.name}: {entry.hits1.toFixed(1)} hits
        </div>
        <div className="text-sm">
          {creature2.name}: {entry.hits2.toFixed(1)} hits
        </div>
        {entry.phaseWinner !== 0 ? (
          <div className="mt-2 text-green-600 text-sm">
            {getWinnerMessage(entry, phaseIndex)}
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
        {/* Display scenario description in green text for more flavor */}
        {entry.scenario && entry.scenario.description && (
          <div className="mt-2 text-green-500 text-sm italic">
            "{entry.scenario.description}"
          </div>
        )}
        {entry.isInjured && (
          <div className="mt-2 text-red-600 text-sm">
            {entry.injuredFighter === 1 ? creature1.name : creature2.name} suffered 
            {entry.injuryType === 'broken' ? ' a broken bone' : ' an injury'} during the submission!
            <div className="text-xs">
              (Chance: {(entry.injuryChance * 100).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get phase status for kanji display
  const getPhaseStatus = (phaseIndex) => {
    if (phaseIndex === currentPhaseIndex) return 'active';
    if (phaseIndex < currentPhaseIndex || phaseEntries[phaseIndex]) return 'complete';
    return 'pending';
  };

  // Kanji characters for each phase
  const phaseKanjis = ['倒', '越', '制', '極'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Combat Log</h3>
      
      {/* Vertical layout with kanji on the left and log entries on the right */}
      <div className="space-y-4">
        {[0, 1, 2, 3].map(phaseIndex => (
          <div key={phaseIndex} className="flex items-stretch">
            {/* Kanji indicator */}
            <div className="w-16 flex-shrink-0 mr-4">
              <PhaseKanji 
                kanji={phaseKanjis[phaseIndex]} 
                description={combatPhases[phaseIndex].description}
                status={getPhaseStatus(phaseIndex)}
              />
            </div>
            
            {/* Log entry */}
            <div className="flex-grow">
              {renderPhaseLog(phaseIndex)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatLog; 