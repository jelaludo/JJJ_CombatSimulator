import * as React from 'react';
const { useState, useEffect, useRef } = React;

/**
 * Component to display a sprite sheet animation between fighters during combat
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether the animation should be playing
 * @param {number} props.fps - Frames per second for the animation (default: 8)
 * @param {number} props.currentPhaseIndex - Current phase index (0-3)
 * @returns {JSX.Element} - Rendered component
 */
const SpriteSheetAnimation = ({ isActive, fps = 8, currentPhaseIndex = 0 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Total number of frames in the sprite sheet animation
  const totalFrames = 4;
  
  // Load the sprite sheet image
  useEffect(() => {
    const img = new Image();
    img.src = '/animations/ColoredComicFight/ColoredSmokeFightSprite4x.png';
    img.onload = () => {
      setImageLoaded(true);
      // Store the image in a ref so we can use it later
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width / 2; // Half width for one frame
        canvas.height = img.height / 2; // Half height for one frame
        
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, img, currentFrame);
      }
    };
    
    img.onerror = (error) => {
      console.error("Error loading image:", error);
      setImageLoaded(false);
    };
    
    return () => {
      // Clean up the image
      img.onload = null;
      img.onerror = null;
    };
  }, []);
  
  // Helper function to draw the current frame
  const drawFrame = (ctx, img, frameIndex) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Calculate the source position in the sprite sheet
    const frameWidth = img.width / 2;
    const frameHeight = img.height / 2;
    
    // Calculate the source rectangle based on the frame index
    // 0 1
    // 2 3
    const sx = (frameIndex % 2) * frameWidth;
    const sy = Math.floor(frameIndex / 2) * frameHeight;
    
    // Draw the current frame to the canvas
    ctx.drawImage(
      img,
      sx, sy, frameWidth, frameHeight, // Source rectangle
      0, 0, ctx.canvas.width, ctx.canvas.height // Destination rectangle
    );
  };
  
  // Reset and play animation when isActive changes
  useEffect(() => {
    if (isActive && !isPlaying) {
      setCurrentFrame(0);
      setIsPlaying(true);
    }
  }, [isActive, isPlaying]);
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying || !imageLoaded || !canvasRef.current) return;
    
    const frameInterval = 1000 / fps; // Calculate interval based on fps
    
    // Get the canvas context
    const ctx = canvasRef.current.getContext('2d');
    
    // Load the image again to use for animation
    const img = new Image();
    img.src = '/animations/ColoredComicFight/ColoredSmokeFightSprite4x.png';
    
    const animationTimer = setTimeout(() => {
      if (currentFrame < totalFrames - 1) {
        const nextFrame = currentFrame + 1;
        setCurrentFrame(nextFrame);
        
        // Draw the next frame
        drawFrame(ctx, img, nextFrame);
      } else {
        setIsPlaying(false);
      }
    }, frameInterval);
    
    return () => clearTimeout(animationTimer);
  }, [currentFrame, isPlaying, fps, imageLoaded]);
  
  // Update the canvas when the current frame changes
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current) return;
    
    const img = new Image();
    img.src = '/animations/ColoredComicFight/ColoredSmokeFightSprite4x.png';
    
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      drawFrame(ctx, img, currentFrame);
    };
  }, [currentFrame, imageLoaded]);
  
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
          <div className="w-full h-full bg-blue-500 rounded-full opacity-70" />
        )}
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
};

export default SpriteSheetAnimation; 