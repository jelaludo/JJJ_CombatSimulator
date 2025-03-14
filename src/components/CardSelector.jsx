import React, { useState, useEffect } from 'react';
import { loadCards } from '../utils/cardService';

/**
 * Component for selecting a fighter card
 * @param {Object} props - Component props
 * @param {Function} props.onSelectCard - Callback when a card is selected
 * @param {string} props.position - Position of the card selector ('left' or 'right')
 * @param {Object} props.selectedCard - Currently selected card
 * @returns {JSX.Element} - Rendered component
 */
const CardSelector = ({ onSelectCard, position, selectedCard }) => {
  const [cards, setCards] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cards from the assets folder
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const cardData = await loadCards();
        setCards(cardData);
      } catch (error) {
        console.error("Error loading cards:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, []);
  
  const handleSelectCard = (card) => {
    onSelectCard(card);
    // Don't close the tooltip immediately to prevent accidental clicks
    setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  };
  
  return (
    <div className="relative">
      {/* Card selector trigger */}
      <div 
        className="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-all"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {/* Current selected card or placeholder */}
        {selectedCard ? (
          <div className="relative w-full">
            <img 
              src={selectedCard.image} 
              alt={selectedCard.name} 
              className="w-full h-auto rounded-t-lg"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
              <div className="text-white text-center font-bold text-sm">
                {selectedCard.name}
              </div>
              <div className="flex justify-center gap-4 text-xs text-white">
                <span>ATK: {selectedCard.attack}</span>
                <span>DEF: {selectedCard.defense}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 text-center text-gray-500">
            Select a fighter
          </div>
        )}
      </div>
      
      {/* Card selection tooltip */}
      {showTooltip && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-2 bg-white sm:rounded-lg shadow-lg z-50 p-2 sm:p-4 border border-gray-200 overflow-auto">
          <div className="text-sm font-bold mb-2 pb-1 border-b flex justify-between items-center">
            <span>Select a Fighter</span>
            <button 
              className="sm:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setShowTooltip(false)}
            >
              ✕
            </button>
          </div>
          
          {loading ? (
            <div className="text-center p-4 text-gray-500">Loading cards...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[80vh] sm:max-h-60 overflow-y-auto">
              {cards.map(card => (
                <div 
                  key={card.id}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedCard && selectedCard.id === card.id 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectCard(card)}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative">
                    <img 
                      src={card.thumbnail} 
                      alt={card.name} 
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-1">
                      <div className="text-white text-center font-bold text-xs truncate">
                        {card.name}
                      </div>
                      <div className="flex justify-center gap-2 text-xs text-white">
                        <span>A:{card.attack}</span>
                        <span>D:{card.defense}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Card details on hover */}
          {hoveredCard && (
            <div className="mt-2 p-2 border-t border-gray-200">
              <div className="font-bold">{hoveredCard.name}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Attack: {hoveredCard.attack}</div>
                <div>Defense: {hoveredCard.defense}</div>
              </div>
            </div>
          )}
          
          <button 
            className="mt-2 w-full py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm sm:block hidden"
            onClick={() => setShowTooltip(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CardSelector; 