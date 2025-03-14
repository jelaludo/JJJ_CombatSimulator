import React from 'react';

/**
 * Component to display a kanji character for a combat phase with color indicating status
 * @param {Object} props - Component props
 * @param {string} props.kanji - The kanji character to display
 * @param {string} props.description - The phase description
 * @param {string} props.status - The phase status ('pending', 'active', 'complete')
 * @returns {JSX.Element} - Rendered component
 */
const PhaseKanji = ({ kanji, description, status }) => {
  // Determine text color based on status
  const getTextColor = () => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'complete':
        return 'text-black';
      case 'pending':
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`text-5xl font-bold ${getTextColor()}`}>
        {kanji}
      </div>
      <div className={`text-xs mt-1 ${getTextColor()}`}>
        {description}
      </div>
    </div>
  );
};

export default PhaseKanji; 