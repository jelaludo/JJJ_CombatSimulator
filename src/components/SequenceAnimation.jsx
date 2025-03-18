import * as React from 'react';
const { useState, useEffect } = React;

/**
 * Component to display a sequence animation between fighters during combat
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the animation should be playing
 * @param {number} props.fps - Frames per second for the animation (default: 8)
 * @param {number} props.currentPhaseIndex - Current phase index (0-3)
 * @returns {JSX.Element} - Rendered component
 */
const SequenceAnimation = ({ isActive, fps = 8, currentPhaseIndex = 0 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Total number of frames in the animation sequence
  const totalFrames = 12;
  
  // Reset and play animation when isActive changes
  useEffect(() => {
    if (isActive && !isPlaying) {
      setCurrentFrame(0);
      setIsPlaying(true);
      // Preload first image
      const img = new Image();
      img.src = `/animations/ColoredComicFightx12/ColoredFightAnimationx12_${currentFrame + 1}.png`;
      img.onload = () => setImageLoaded(true);
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
  
  // Calculate vertical position based on current phase
  const getVerticalPosition = () => {
    switch(currentPhaseIndex) {
      case 0: return "top-1/4";
      case 1: return "top-2/5";
      case 2: return "top-3/5";
      case 3: return "top-3/4";
      default: return "top-1/2";
    }
  };
  
  return (
    <div className="pointer-events-none">
      <div className="w-64 h-64 sm:w-96 sm:h-96 relative">
        {/* Fallback colored animation if image doesn't load */}
        {!imageLoaded && (
          <div className="w-full h-full bg-purple-500 rounded-full opacity-70" />
        )}
        <img 
          src={`/animations/ColoredComicFightx12/ColoredFightAnimationx12_${currentFrame + 1}.png`}
          alt={`Animation frame ${currentFrame + 1}`}
          className="w-full h-full object-contain"
          style={{ display: isPlaying ? 'block' : 'none' }}
          onError={() => setImageLoaded(false)}
        />
      </div>
    </div>
  );
};

export default SequenceAnimation; 