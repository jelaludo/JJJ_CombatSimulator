import React from 'react';
import { ArrowRight, X } from 'lucide-react';

/**
 * Component for combat control buttons
 * @param {Object} props - Component props
 * @param {Function} props.onReset - Callback for reset button
 * @param {Function} props.onReturn - Callback for return button
 * @param {boolean} props.combatComplete - Whether combat is complete
 * @returns {JSX.Element} - Rendered component
 */
const CombatControls = ({ 
  onReset, 
  onReturn, 
  combatComplete 
}) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      {/* Only show buttons when combat is complete */}
      {combatComplete && (
        <>
          {/* Reset combat button */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={onReset}
          >
            <span>New Combat</span>
            <ArrowRight size={16} />
          </button>
          
          {/* Return to selection button */}
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={onReturn}
          >
            <span>Change Fighters</span>
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default CombatControls; 