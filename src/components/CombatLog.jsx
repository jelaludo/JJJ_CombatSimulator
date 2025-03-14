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
  
  const sortedLog = [...combatLog].sort((a, b) => a.phase - b.phase);
  
  const getWinnerName = (entry) => {
    return entry.phaseWinner === 1 ? creature1.name : creature2.name;
  };

  const phaseEntries = {};
  sortedLog.forEach(entry => {
    phaseEntries[entry.phase] = entry;
  });
  
  const getPhaseFlowStatus = (currentPhaseIndex) => {
    const currentEntry = phaseEntries[currentPhaseIndex];
    
    if (currentEntry && currentEntry.phaseWinner === 0) {
      return "Scramble!";
    }
    
    if (currentPhaseIndex === 0) return null;
    
    const previousEntry = phaseEntries[currentPhaseIndex - 1];
    
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
          <div className="font-semibold text-lg">Phase {phaseIndex + 1}</div>
          <div className="text-gray-600">{combatPhases[phaseIndex].description}</div>
        </div>

        {/* Scenario name if exists */}
        {entry.scenario && entry.scenario.name && (
          <div className="text-center mb-2">
            <span className="text-purple-600 font-bold">
              {entry.scenario.name}
            </span>
          </div>
        )}

        {/* Large centered kanji */}
        <div className="text-center my-4">
          <span className="text-5xl font-bold">{phaseKanji}</span>
        </div>

        {/* Combat results */}
        <div className="flex justify-between items-center text-lg">
          <div className="text-center flex-1">
            {Math.round(entry.hits1)} Hits
            {entry.bonusValue && entry.phaseWinner === 1 && (
              <span className="text-blue-600 ml-1">+{entry.bonusValue}</span>
            )}
          </div>
          <div className="text-center flex-1">
            {Math.round(entry.hits2)} Hits
            {entry.bonusValue && entry.phaseWinner === 2 && (
              <span className="text-blue-600 ml-1">+{entry.bonusValue}</span>
            )}
          </div>
        </div>

        {/* Scenario description */}
        {entry.scenario && entry.scenario.description && (
          <div className="mt-4 text-center text-green-500 text-sm italic">
            "{entry.scenario.description}"
          </div>
        )}

        {/* Flow status */}
        {flowStatus && (
          <div className="mt-2 text-center">
            <span className={`text-purple-600 font-bold`}>
              {flowStatus}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-2 px-2">Combat Log</h3>
      <div className="space-y-4">
        {[0, 1, 2, 3].map(phaseIndex => (
          <div key={phaseIndex} className="px-1">
            {renderPhaseLog(phaseIndex)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatLog; 