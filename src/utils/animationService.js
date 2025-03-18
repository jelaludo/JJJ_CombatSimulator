/**
 * Animation configuration for all available animations
 */
const animations = {
  explosion: {
    name: "TEST - Large Explosion",
    description: "A detailed 24-frame explosion animation",
    type: "sequence",
    frameCount: 24,
    fps: 8,
    folder: "/animations/Explosion Large",
    filePattern: "spr_explosion_large_##.png", // ## will be replaced with the frame number
    fileNumberFormat: "padStart", // 01, 02, 03, etc.
  },
  comic: {
    name: "TEST - Colored Comic",
    description: "A 4-frame comic style explosion from a sprite sheet",
    type: "spritesheet",
    frameCount: 4,
    fps: 8,
    file: "/animations/ColoredComicFight/ColoredSmokeFightSprite4x.png",
    grid: "2x2", // 2 rows, 2 columns
    frames: [
      { position: "0% 0%" },    // top-left
      { position: "50% 0%" },   // top-right
      { position: "0% 50%" },   // bottom-left
      { position: "50% 50%" },  // bottom-right
    ]
  },
  sequence: {
    name: "Colored Fight Sequence",
    description: "A 12-frame colored fight animation sequence",
    type: "sequence",
    frameCount: 12,
    fps: 8,
    folder: "/animations/ColoredComicFightx12",
    filePattern: "ColoredFightAnimationx12_#.png", // # will be replaced with the frame number
    fileNumberFormat: "raw", // 1, 2, 3, etc.
  }
};

/**
 * Get an animation by its ID
 * @param {string} animationId - The ID of the animation to get
 * @returns {Object} - Animation configuration
 */
export const getAnimation = (animationId) => {
  return animations[animationId] || animations.sequence;
};

/**
 * Get a list of all available animations
 * @returns {Array} - Array of animation objects with id and name
 */
export const getAllAnimations = () => {
  return Object.keys(animations).map(id => ({
    id,
    name: animations[id].name,
    description: animations[id].description
  }));
};

export default animations; 