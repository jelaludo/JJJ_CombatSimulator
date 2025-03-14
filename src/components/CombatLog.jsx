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
      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
        {/* Phase header with kanji */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Phase {phaseIndex + 1}: {combatPhases[phaseIndex].description}</span>
            <span className="text-2xl font-bold">{phaseKanji}</span>
          </div>
          {entry.scenario && entry.scenario.name && (
            <div className="flex flex-col items-end">
              <span className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                {entry.scenario.name}
              </span>
              {flowStatus && (
                <span className={`text-xs font-bold mt-1 ${getFlowStatusColor(flowStatus)}`}>
                  {flowStatus}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Combat results */}
        <div className="text-sm">
          {creature1.name}: {entry.hits1.toFixed(1)} hits • {creature2.name}: {entry.hits2.toFixed(1)} hits
        </div>

        {/* Outcome message */}
        {entry.phaseWinner !== 0 ? (
          <div className="mt-2 text-green-600 text-sm">
            {getWinnerName(entry)} {entry.bonusValue && `(+${entry.bonusValue})`}
          </div>
        ) : (
          <div className="mt-2 text-purple-600 text-sm">
            Scramble: No clear winner in this phase
            {entry.hitsDifference && ` (Difference: ${entry.hitsDifference.toFixed(1)})`}
          </div>
        )}

        {/* Scenario description */}
        {entry.scenario && entry.scenario.description && (
          <div className="mt-2 text-green-500 text-sm italic">
            "{entry.scenario.description}"
          </div>
        )}

        {/* Injury information */}
        {entry.isInjured && (
          <div className="mt-2 text-red-600 text-sm">
            {entry.injuredFighter === 1 ? creature1.name : creature2.name} suffered 
            {entry.injuryType === 'broken' ? ' a broken bone' : ' an injury'}!
            <div className="text-xs">
              (Chance: {(entry.injuryChance * 100).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-2 px-2">Combat Log</h3>
      <div className="space-y-2">
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