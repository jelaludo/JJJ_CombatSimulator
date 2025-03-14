/**
 * Service for loading and parsing card data from the JJJCombatSimAssets folder
 */

/**
 * Load all available cards from the assets folder
 * @returns {Promise<Array>} - Array of card objects
 */
export const loadCards = async () => {
  try {
    // List of actual cards that exist in the JJJCombatSimAssets folder
    // IMPORTANT: This list needs to be manually updated when new character files are added to the public/JJJCombatSimAssets folder
    const actualCardFiles = [
      // Original characters
      "Baby Swallow_1_4.png",
      "Balanced Capybara_6_7.png",
      "Fierce Swallow_2_9.png",
      "Mech Croc Kid_3_3.png",
      "Mech Croc_7_4.png",
      "POW Tiger Cub_2_3.png",
      "POW Tiger_8_7.png",
      "Zen Capybara_1_2.png",
      "Sakura Elemental_4_9_Woman.png",
      "Sakura Elemental Man_6_8_.png",
      "Gorilla Mech_10_5.png",
      "Gorilla Mech Baby_4_3.png",
      "Cyber Kid_6_1_.png",
      "Cyber Brown_6_5.png",
      
      // New characters
      "Unicorn Baby_4_5_.png",
      "Mattari Zaru_2_3.png",
      "Tadanaru Penguin_7_9.png",
      "White Belt Penguin_2_2.png",
      "Onsen Baby Zaru_2_2.png",
      "Unicorn_8_7.png"
    ];
    
    // Parse the card data from the filenames
    const cards = actualCardFiles.map(filename => parseCardFromFilename(filename));
    
    console.log(`Loaded ${cards.length} cards from JJJCombatSimAssets folder`);
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
  
  try {
    // Remove file extension for processing
    const nameWithoutExtension = filename.replace(/\.png$/i, '');
    
    // Split the filename by underscores
    const parts = nameWithoutExtension.split('_');
    
    // Extract name (everything before the first underscore)
    const name = parts[0];
    
    // Extract attack (second part, should be a number)
    let attack = 5; // Default value
    if (parts.length > 1) {
      const attackValue = parseInt(parts[1]);
      if (!isNaN(attackValue)) {
        attack = attackValue;
      }
    }
    
    // Extract defense (third part, should be a number)
    let defense = 5; // Default value
    if (parts.length > 2) {
      // The defense might have .png attached or might be followed by additional parts
      const defenseStr = parts[2].replace(/\.png$/i, '');
      const defenseValue = parseInt(defenseStr);
      if (!isNaN(defenseValue)) {
        defense = defenseValue;
      }
    }
    
    return {
      id: nameWithoutExtension,
      filename,
      name: name,
      attack: attack,
      defense: defense,
      terrainAttack: 1,
      terrainDefense: 1,
      subunits: 10,
      image: imagePath,
      thumbnail: imagePath,
      actualImagePath: imagePath
    };
  } catch (error) {
    console.error(`Error parsing filename ${filename}:`, error);
    
    // Return a default card object if parsing fails
    return {
      id: filename.replace(/\.png$/i, ''),
      filename,
      name: filename.split('_')[0] || "Unknown Fighter",
      attack: 5,
      defense: 5,
      terrainAttack: 1,
      terrainDefense: 1,
      subunits: 10,
      image: imagePath,
      thumbnail: imagePath,
      actualImagePath: imagePath
    };
  }
}; 