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
          <div className="relative w-full flex justify-center">
            <div className="w-1/2">
              <img 
                src={selectedCard.image} 
                alt={selectedCard.name} 
                className="w-full h-auto rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
                <div className="text-center font-bold">{selectedCard.name}</div>
                <div className="flex justify-center space-x-2 text-sm">
                  <span className="text-red-400">A: {selectedCard.attack}</span>
                  <span className="text-blue-400">D: {selectedCard.defense}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 min-h-[200px] flex items-center justify-center">
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
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowTooltip(false)}
        >
          <div 
            className="bg-white p-4 rounded-lg shadow-xl border border-gray-300 max-w-4xl w-full max-h-[80vh] overflow-y-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-center">Select a Fighter</h3>
            
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer transition-transform ${
                    selectedCard && selectedCard.id === card.id 
                      ? 'border-2 border-green-500 rounded-lg scale-105' 
                      : 'hover:scale-105 border border-gray-200 rounded-lg'
                  }`}
                  onClick={() => handleSelectCard(card)}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="p-2">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-center mt-2 font-semibold">{card.name}</div>
                    <div className="flex justify-center space-x-3 text-sm mt-1">
                      <span className="text-red-600 font-bold">A:{card.attack}</span>
                      <span className="text-blue-600 font-bold">D:{card.defense}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Hover details */}
            {hoveredCard && (
              <div className="mt-6 pt-4 border-t border-gray-300">
                <div className="flex items-center">
                  <div className="w-1/3">
                    <img 
                      src={hoveredCard.image} 
                      alt={hoveredCard.name} 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="w-2/3 pl-6">
                    <h3 className="text-xl font-bold mb-3">{hoveredCard.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-100 p-3 rounded-lg text-center">
                        <div className="text-sm text-red-600">Attack</div>
                        <div className="text-2xl font-bold text-red-700">{hoveredCard.attack}</div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        <div className="text-sm text-blue-600">Defense</div>
                        <div className="text-2xl font-bold text-blue-700">{hoveredCard.defense}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
                onClick={() => setShowTooltip(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSelector; 