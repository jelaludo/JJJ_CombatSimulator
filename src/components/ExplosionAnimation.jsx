import * as React from 'react';
const { useState, useEffect, useRef } = React;

/**
 * Component to display an explosion animation between fighters during combat
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the animation should be playing
 * @param {number} props.fps - Frames per second for the animation (default: 8)
 * @param {number} props.currentPhaseIndex - Current phase index (0-3)
 * @returns {JSX.Element} - Rendered component
 */
const ExplosionAnimation = ({ isActive, fps = 8, currentPhaseIndex = 0 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Total number of frames in the explosion animation
  const totalFrames = 24;
  
  // Reset and play animation when isActive changes
  useEffect(() => {
    if (isActive && !isPlaying) {
      setCurrentFrame(0);
      setIsPlaying(true);
    }
  }, [isActive, isPlaying]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const frameInterval = 1000 / fps; // Calculate interval based on fps
    
    const animationTimer = setTimeout(() => {
      if (currentFrame < totalFrames - 1) {
        setCurrentFrame(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, frameInterval);
    
    return () => clearTimeout(animationTimer);
  }, [currentFrame, isPlaying, fps]);
  
  // Don't render anything if not active or playing
  if (!isActive && !isPlaying) return null;
  
  // Format the frame number with leading zeros
  const frameNumber = String(currentFrame + 1).padStart(2, '0');
  
  return (
    <div className="pointer-events-none">
      <img 
        src={`/animations/Explosion Large/spr_explosion_large_${frameNumber}.png`}
        alt={`Explosion frame ${currentFrame + 1}`}
        className="w-64 h-64 sm:w-96 sm:h-96 object-contain"
      />
    </div>
  );
};

export default ExplosionAnimation; 