import React, { useState, useEffect } from 'react';

/**
 * Component to display a combat gauge showing the advantage between two fighters
 * @param {Object} props - Component props
 * @param {Array} props.randomNumbers - Random numbers for animation
 * @param {number} props.probability1 - Probability of success for fighter 1
 * @param {number} props.probability2 - Probability of success for fighter 2
 * @param {boolean} props.isActive - Whether the gauge is active
 * @param {string} props.fighter1Name - Name of fighter 1
 * @param {string} props.fighter2Name - Name of fighter 2
 * @returns {JSX.Element} - Rendered component
 */
const CombatGauge = ({ 
  randomNumbers, 
  probability1, 
  probability2, 
  isActive,
  fighter1Name = "Fighter 1",
  fighter2Name = "Fighter 2"
}) => {
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
            const finalPosition = 50 + (diff * 5);
            setGaugePosition(Math.max(5, Math.min(95, finalPosition)));
          }
        }
      }, 100); // 100ms per frame = 2 seconds total
      
      return () => clearInterval(interval);
    }
  }, [animationFrames, randomNumbers, probability1, probability2]);
  
  // Calculate color intensities based on gauge position
  const getGaugeColors = () => {
    // Calculate intensity for fighter 1 (green when winning, red when losing)
    const intensity1 = Math.min(255, Math.round(Math.abs(gaugePosition - 50) * 5.1));
    const r1 = gaugePosition > 50 ? 0 : intensity1;
    const g1 = gaugePosition > 50 ? intensity1 : 0;
    const b1 = 0;
    
    // Calculate intensity for fighter 2 (green when winning, red when losing)
    const intensity2 = Math.min(255, Math.round(Math.abs(gaugePosition - 50) * 5.1));
    const r2 = gaugePosition < 50 ? 0 : intensity2;
    const g2 = gaugePosition < 50 ? intensity2 : 0;
    const b2 = 0;
    
    return {
      fighter1: `rgb(${r1}, ${g1}, ${b1})`,
      fighter2: `rgb(${r2}, ${g2}, ${b2})`
    };
  };
  
  const colors = getGaugeColors();
  
  return (
    <div className="w-full h-12 bg-gray-200 rounded-lg overflow-hidden relative mb-4">
      {/* Fighter 1 side */}
      <div 
        className="h-full transition-all duration-300 ease-in-out absolute top-0 left-0"
        style={{ 
          width: `${gaugePosition}%`,
          backgroundColor: colors.fighter1,
          opacity: 0.7
        }}
      />
      
      {/* Fighter 2 side */}
      <div 
        className="h-full transition-all duration-300 ease-in-out absolute top-0 right-0"
        style={{ 
          width: `${100 - gaugePosition}%`,
          backgroundColor: colors.fighter2,
          opacity: 0.7
        }}
      />
      
      {/* Center line */}
      <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-1/2 z-10" />
      
      {/* Fighter labels */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-4 z-20">
        <span className="font-bold text-white text-shadow" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          {fighter1Name}
        </span>
        <span className="font-bold text-white text-shadow" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          {fighter2Name}
        </span>
      </div>
    </div>
  );
};

export default CombatGauge; 