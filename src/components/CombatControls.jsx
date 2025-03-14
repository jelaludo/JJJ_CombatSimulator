import React from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

/**
 * Component for combat control buttons
 * @param {Object} props - Component props
 * @param {Function} props.onNextPhase - Callback for next phase button
 * @param {Function} props.onReset - Callback for reset button
 * @param {Function} props.onReturn - Callback for return button
 * @param {boolean} props.isAnimating - Whether combat is animating
 * @param {boolean} props.showingResults - Whether results are being shown
 * @param {boolean} props.combatComplete - Whether combat is complete
 * @returns {JSX.Element} - Rendered component
 */
const CombatControls = ({ 
  onNextPhase, 
  onReset, 
  onReturn, 
  isAnimating, 
  showingResults, 
  combatComplete 
}) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      {/* Next phase button */}
      {!combatComplete && showingResults && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={onNextPhase}
        >
          <span>Next Phase</span>
          <ArrowRight size={16} />
        </button>
      )}
      
      {/* Resolve phase button */}
      {!showingResults && !isAnimating && !combatComplete && (
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={onNextPhase}
        >
          <span>Resolve Phase</span>
          <Check size={16} />
        </button>
      )}
      
      {/* Reset combat button */}
      {combatComplete && (
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={onReset}
        >
          <span>New Combat</span>
          <ArrowRight size={16} />
        </button>
      )}
      
      {/* Return to selection button */}
      {combatComplete && (
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={onReturn}
        >
          <span>Change Fighters</span>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default CombatControls; 