import React, { useState, useEffect } from 'react';
import { loadCards } from './cardService';

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
    setShowTooltip(false);
  };
  
  return (
    <div className="relative">
      <div 
        className="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-all"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          setShowTooltip(false);
          setHoveredCard(null);
        }}
      >
        {/* Current selected card or placeholder */}
        {selectedCard ? (
          <div className="relative">
            <img 
              src={selectedCard.image} 
              alt={selectedCard.name} 
              className="w-full h-auto"
              style={{ maxWidth: "200px" }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              <div className="text-center font-bold">{selectedCard.name}</div>
              <div className="flex justify-center space-x-2 text-sm">
                <span className="text-red-400">A: {selectedCard.attack}</span>
                <span className="text-blue-400">D: {selectedCard.defense}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 min-h-[100px] flex items-center justify-center">
            {loading ? (
              <span className="text-gray-500">Loading cards...</span>
            ) : (
              <span className="text-sm font-bold">Select {position === 'left' ? 'Fighter 1' : 'Fighter 2'}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Tooltip with card thumbnails */}
      {showTooltip && !loading && (
        <div className="absolute z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-300 w-[340px]"
             style={{ 
               top: '100%', 
               left: position === 'left' ? '0' : 'auto',
               right: position === 'left' ? 'auto' : '0',
               marginTop: '10px'
             }}>
          <div className="grid grid-cols-3 gap-2">
            {cards.map((card, index) => (
              <div 
                key={index}
                className={`cursor-pointer transition-transform ${
                  selectedCard && selectedCard.id === card.id 
                    ? 'border-2 border-green-500 rounded-lg scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => handleSelectCard(card)}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img 
                  src={card.thumbnail} 
                  alt={card.name} 
                  className="w-full h-auto rounded-lg border border-gray-300"
                />
                <div className="text-xs text-center mt-1 font-semibold truncate">{card.name}</div>
              </div>
            ))}
          </div>
          
          {/* Hover details */}
          {hoveredCard && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex items-center">
                <div className="w-1/3">
                  <img 
                    src={hoveredCard.thumbnail} 
                    alt={hoveredCard.name} 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="w-2/3 pl-3">
                  <h3 className="font-bold">{hoveredCard.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-red-100 p-1 rounded text-center">
                      Attack: {hoveredCard.attack}
                    </div>
                    <div className="bg-blue-100 p-1 rounded text-center">
                      Defense: {hoveredCard.defense}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardSelector; 