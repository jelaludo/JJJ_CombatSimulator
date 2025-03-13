import React, { useState, useEffect } from 'react';

const CombatGauge = ({ randomNumbers, probability1, probability2, isActive }) => {
  const [gaugePosition, setGaugePosition] = useState(50); // Start in the middle
  const [animationFrames, setAnimationFrames] = useState([]);
  
  // Generate more random numbers for smoother animation
  useEffect(() => {
    if (isActive && randomNumbers && randomNumbers.length === 2) {
      // Generate 20 frames of animation
      const frames = [];
      for (let i = 0; i < 20; i++) {
        // Generate a value between -10 and 10 to add some randomness
        const randomFactor = (Math.random() * 20) - 10;
        
        // Calculate advantage based on probabilities and random numbers
        const advantage1 = randomNumbers[0].filter(n => n < probability1).length;
        const advantage2 = randomNumbers[1].filter(n => n < probability2).length;
        
        // Calculate position (0-100 scale, where 0 is completely fighter 2, 100 is completely fighter 1)
        // Start from middle (50) and adjust based on advantage
        const diff = advantage1 - advantage2;
        const position = 50 + (diff * 5) + randomFactor;
        
        // Clamp between 5 and 95 to always show a bit of both sides
        frames.push(Math.max(5, Math.min(95, position)));
      }
      setAnimationFrames(frames);
    } else {
      setAnimationFrames([]);
      setGaugePosition(50);
    }
  }, [randomNumbers, probability1, probability2, isActive]);
  
  // Animate through the frames
  useEffect(() => {
    if (animationFrames.length > 0) {
      let frameIndex = 0;
      const interval = setInterval(() => {
        setGaugePosition(animationFrames[frameIndex]);
        frameIndex++;
        
        if (frameIndex >= animationFrames.length) {
          clearInterval(interval);
          
          // Set final position based on actual probabilities
          if (randomNumbers && randomNumbers.length === 2) {
            const advantage1 = randomNumbers[0].filter(n => n < probability1).length;
            const advantage2 = randomNumbers[1].filter(n => n < probability2).length;
            const diff = advantage1 - advantage2;
            const finalPosition = 50 + (diff * 7);
            setGaugePosition(Math.max(5, Math.min(95, finalPosition)));
          }
        }
      }, 100); // 100ms per frame
      
      return () => clearInterval(interval);
    }
  }, [animationFrames, randomNumbers, probability1, probability2]);

  // Calculate color intensities based on gauge position
  const getGaugeColors = () => {
    const intensity1 = Math.min(1, Math.max(0, (gaugePosition - 50) / 30)); // 0 to 1 for fighter 1
    const intensity2 = Math.min(1, Math.max(0, (50 - gaugePosition) / 30)); // 0 to 1 for fighter 2
    
    return {
      fighter1: gaugePosition >= 50 
        ? `rgb(${Math.round(220 - 120 * intensity1)}, ${Math.round(220)}, ${Math.round(220 - 120 * intensity1)})` // Green gradient
        : `rgb(${Math.round(220)}, ${Math.round(220 - 120 * (1 - intensity1))}, ${Math.round(220 - 120 * (1 - intensity1))})`, // Red gradient
      fighter2: gaugePosition <= 50
        ? `rgb(${Math.round(220 - 120 * intensity2)}, ${Math.round(220)}, ${Math.round(220 - 120 * intensity2)})` // Green gradient
        : `rgb(${Math.round(220)}, ${Math.round(220 - 120 * (1 - intensity2))}, ${Math.round(220 - 120 * (1 - intensity2))})` // Red gradient
    };
  };

  const gaugeColors = getGaugeColors();
  
  return (
    <div className="w-full mb-4">
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Fighter 1 side */}
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${gaugePosition}%`,
            backgroundColor: gaugeColors.fighter1
          }}
        ></div>
        
        {/* Fighter 2 side */}
        <div 
          className="absolute top-0 right-0 h-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${100 - gaugePosition}%`,
            backgroundColor: gaugeColors.fighter2
          }}
        ></div>
        
        {/* Center line */}
        <div className="absolute top-0 left-1/2 h-full w-0.5 bg-black transform -translate-x-1/2"></div>
        
        {/* Indicator */}
        <div 
          className="absolute top-0 h-full w-2 bg-yellow-400 transition-all duration-300 ease-in-out"
          style={{ left: `${gaugePosition}%`, transform: 'translateX(-50%)' }}
        ></div>
        
        {/* Labels */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-2">
          <span className="text-xs font-bold text-white z-10 drop-shadow-md">Fighter 1</span>
          <span className="text-xs font-bold text-white z-10 drop-shadow-md">Fighter 2</span>
        </div>
      </div>
      
      {isActive && (
        <div className="text-center text-sm mt-1">
          {gaugePosition > 60 ? "Fighter 1 has the advantage!" : 
           gaugePosition < 40 ? "Fighter 2 has the advantage!" : 
           "The battle is evenly matched!"}
        </div>
      )}
    </div>
  );
};

export default CombatGauge; 