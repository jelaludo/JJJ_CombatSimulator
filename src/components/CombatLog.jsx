import * as React from 'react';

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
  
  const phaseEntries = {};
  combatLog.forEach(entry => {
    phaseEntries[entry.phase] = entry;
  });
  
  const getPhaseFlowStatus = (phaseIndex) => {
    const currentEntry = phaseEntries[phaseIndex];
    
    if (currentEntry && currentEntry.phaseWinner === 0) {
      return "Scramble!";
    }
    
    if (phaseIndex === 0) return null;
    
    const previousEntry = phaseEntries[phaseIndex - 1];
    
    if (!currentEntry || !previousEntry || previousEntry.phaseWinner === 0) {
      return null;
    }
    
    return currentEntry.phaseWinner !== previousEntry.phaseWinner ? "REVERSAL!" : "Dominance!";
  };

  const getFlowStatusColor = (status) => {
    if (status === "REVERSAL!") return "text-red-600";
    if (status === "Dominance!") return "text-blue-600";
    if (status === "Scramble!") return "text-purple-600";
    return "";
  };

  // Get winner name based on phase winner
  const getWinnerName = (entry) => {
    if (!entry || entry.phaseWinner === 0) return null;
    return entry.phaseWinner === 1 ? creature1.name : creature2.name;
  };

  // Render technique and winner information
  const renderTechniqueInfo = (entry, phaseIndex) => {
    if (!entry) return null;
    
    // If it's a scramble, don't display any technique
    if (entry.phaseWinner === 0) return null;
    
    const winnerName = getWinnerName(entry);
    const techniqueName = entry.scenario && entry.scenario.name ? entry.scenario.name : "Technique";
    
    // For the final phase (submission), display the winner announcement
    if (phaseIndex === 3) {
      return (
        <div className="text-center mb-2">
          <span className="text-purple-600 font-bold text-base sm:text-lg">
            {winnerName} Winner! by {techniqueName}
          </span>
        </div>
      );
    }
    
    // For other phases, display technique by winner name
    return (
      <div className="text-center mb-2">
        <span className="text-purple-600 font-bold text-base sm:text-lg">
          {techniqueName} by {winnerName}
        </span>
      </div>
    );
  };

  const renderPhaseLog = (phaseIndex) => {
    const entry = phaseEntries[phaseIndex];
    const phaseKanji = ['倒', '越', '制', '極'][phaseIndex];
    
    if (!entry) {
      return (
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-400">Phase {phaseIndex + 1} pending...</p>
        </div>
      );
    }

    const flowStatus = getPhaseFlowStatus(phaseIndex);
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {/* Phase header */}
        <div className="text-center mb-2">
          <div className="font-semibold text-lg sm:text-xl">Phase {phaseIndex + 1}</div>
          <div className="text-gray-600 text-base sm:text-lg">{combatPhases[phaseIndex].description}</div>
        </div>

        {/* Technique and winner info */}
        {renderTechniqueInfo(entry, phaseIndex)}

        {/* Large centered kanji */}
        <div className="text-center my-4">
          <span className="text-5xl sm:text-6xl font-bold">{phaseKanji}</span>
        </div>

        {/* Combat results */}
        <div className="flex justify-between items-center text-lg sm:text-xl">
          <div className="text-center flex-1">
            {Math.floor(entry.hits1)} Hits
            {entry.bonusValue && entry.phaseWinner === 1 && (
              <span className="text-blue-600 ml-1">+{entry.bonusValue}</span>
            )}
          </div>
          <div className="text-center flex-1">
            {Math.floor(entry.hits2)} Hits
            {entry.bonusValue && entry.phaseWinner === 2 && (
              <span className="text-blue-600 ml-1">+{entry.bonusValue}</span>
            )}
          </div>
        </div>

        {/* Scenario description */}
        {entry.scenario && entry.scenario.description && (
          <div className="mt-4 text-center text-green-500 text-sm sm:text-base italic">
            "{entry.scenario.description}"
          </div>
        )}

        {/* Flow status - moved below the technique name */}
        {flowStatus && entry.phaseWinner === 0 && (
          <div className="mt-2 text-center">
            <span className="text-purple-600 font-bold text-base sm:text-lg">
              {flowStatus}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Create an array of phases to display in order
  // Current phase first, then previous phases in reverse order
  const getOrderedPhaseIndices = () => {
    const ordered = [];
    
    // Add current phase first
    ordered.push(currentPhaseIndex);
    
    // Add previous phases in reverse order
    for (let i = currentPhaseIndex - 1; i >= 0; i--) {
      ordered.push(i);
    }
    
    return ordered;
  };

  return (
    <div className="w-full">
      <h3 className="text-xl sm:text-2xl font-bold mb-2 px-2">Combat Log</h3>
      <div className="space-y-4">
        {getOrderedPhaseIndices().map(phaseIndex => (
          <div key={phaseIndex} className="px-1">
            {renderPhaseLog(phaseIndex)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatLog; 