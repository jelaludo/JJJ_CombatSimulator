import React from 'react';

/**
 * Component to display the current combat phase
 * @param {Object} props - Component props
 * @param {Array} props.phases - Array of phase data
 * @param {number} props.currentPhaseIndex - Index of the current phase
 * @returns {JSX.Element} - Rendered component
 */
const PhaseIndicator = ({ phases, currentPhaseIndex }) => {
  return (
    <div className="flex justify-between mb-6">
      {phases.map((phase, index) => (
        <div 
          key={index}
          className={`flex flex-col items-center ${
            index === currentPhaseIndex 
              ? 'text-blue-600 font-bold' 
              : phase.complete 
                ? 'text-green-600' 
                : 'text-gray-400'
          }`}
        >
          {/* Phase number */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
            index === currentPhaseIndex 
              ? 'bg-blue-600 text-white' 
              : phase.complete 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-500'
          }`}>
            {index + 1}
          </div>
          
          {/* Phase name */}
          <div className="text-lg font-bold">{phase.name}</div>
          
          {/* Phase description */}
          <div className="text-xs">{phase.description}</div>
          
          {/* Winner indicator */}
          {phase.complete && phase.bonusWinner !== 0 && (
            <div className={`text-xs mt-1 ${
              phase.bonusWinner === 1 ? 'text-red-500' : 'text-blue-500'
            }`}>
              Fighter {phase.bonusWinner} wins
            </div>
          )}
        </div>
      ))}
      
      {/* Connecting lines */}
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />
    </div>
  );
};

export default PhaseIndicator; 