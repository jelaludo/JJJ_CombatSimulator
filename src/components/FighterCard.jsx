import React from 'react';

/**
 * Component to display a fighter card
 * @param {Object} props - Component props
 * @param {Object} props.fighter - Fighter data
 * @param {number} props.size - Size multiplier (0.5 for half size, 1 for full size)
 * @param {boolean} props.showStats - Whether to show fighter stats
 * @param {boolean} props.isWinner - Whether this fighter is the winner
 * @returns {JSX.Element} - Rendered component
 */
const FighterCard = ({ 
  fighter, 
  size = 1, 
  showStats = true, 
  isWinner = false 
}) => {
  if (!fighter) return null;
  
  return (
    <div className={`relative ${isWinner ? 'ring-4 ring-yellow-500' : ''}`}>
      <div className="overflow-hidden rounded-lg">
        <img 
          src={fighter.image} 
          alt={fighter.name} 
          className="w-full h-auto"
          style={{ transform: `scale(${size})` }}
        />
      </div>
      
      {showStats && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
          <div className="text-white text-center font-bold">
            {fighter.name}
          </div>
          <div className="flex justify-center gap-4 text-sm text-white">
            <span>ATK: {fighter.attack}</span>
            <span>DEF: {fighter.defense}</span>
          </div>
        </div>
      )}
      
      {isWinner && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
          <img 
            src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_Crown.png`} 
            alt="Winner Crown" 
            className="w-16 h-16"
          />
        </div>
      )}
    </div>
  );
};

export default FighterCard; 