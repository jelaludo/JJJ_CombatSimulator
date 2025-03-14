/**
 * Service for loading and parsing card data from the JJJCombatSimAssets folder
 */

/**
 * Load all available cards from the assets folder
 * @returns {Promise<Array>} - Array of card objects
 */
export const loadCards = async () => {
  try {
    // In a real production app with a backend, we would scan the directory
    // For this frontend-only app, we'll use the actual files in the JJJCombatSimAssets folder
    
    // These are the actual files in the JJJCombatSimAssets folder
    const cardFiles = [
      "Baby Swallow_1_4.png",
      "Balanced Capybara_6_7.png",
      "Fierce Swallow_2_9.png",
      "Mech Croc Kid_3_3.png",
      "Mech Croc_7_4.png",
      "POW Tiger Cub_2_3.png",
      "POW Tiger_8_7.png",
      "Zen Capybara_1_2.png"
    ];
    
    // Parse the card data from the filenames
    const cards = cardFiles.map(filename => parseCardFromFilename(filename));
    
    return cards;
  } catch (error) {
    console.error("Error loading cards:", error);
    return [];
  }
};

/**
 * Parse card data from a filename
 * @param {string} filename - Filename in the format "Name_Attack_Defense.png"
 * @returns {Object} - Card object with parsed data
 */
export const parseCardFromFilename = (filename) => {
  const imagePath = `${process.env.PUBLIC_URL}/JJJCombatSimAssets/${filename}`;

  return {
    id: filename.replace('.png', ''),
    filename,
    name: filename.split('_')[0].replace('.png', ''),
    attack: parseInt(filename.split('_')[1]),
    defense: parseInt(filename.split('_')[2].replace('.png', '')),
    terrainAttack: 1,
    terrainDefense: 1,
    subunits: 10,
    image: imagePath,
    thumbnail: imagePath,
    actualImagePath: imagePath
  };
}; 