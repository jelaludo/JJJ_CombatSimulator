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
  const getTextColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'complete':
        return 'text-black';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex flex-col items-center ${getTextColor(status)}`}>
      <div className="text-2xl sm:text-3xl font-bold mb-1">{kanji}</div>
      <div className="text-xs sm:text-sm whitespace-nowrap">{description}</div>
    </div>
  );
};

export default PhaseKanji; 