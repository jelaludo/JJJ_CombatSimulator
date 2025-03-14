import * as React from 'react';
import * as LucideIcons from 'lucide-react';
const { X } = LucideIcons;

/**
 * Component for combat control buttons
 * @param {Object} props - Component props
 * @param {Function} props.onReturn - Callback for return button
 * @param {boolean} props.combatComplete - Whether combat is complete
 * @returns {JSX.Element} - Rendered component
 */
const CombatControls = ({ 
  onReturn, 
  combatComplete 
}) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      {/* Only show button when combat is complete */}
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