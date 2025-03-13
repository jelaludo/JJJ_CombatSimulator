/**
 * Service for loading and parsing card data from the JJJCombatSimAssets folder
 */

// Function to load all available cards
export const loadCards = async () => {
  try {
    // In a real production app with a backend, we would scan the directory
    // For this frontend-only app, we'll use a static list that simulates the files in the folder
    
    // This simulates the files that would be in the JJJCombatSimAssets folder
    const cardFiles = [
      "Gorilla Warrior_3_8.png",
      "Thunder Bull_7_2.png",
      "Forest Serpent_5_5.png",
      "Mountain Lion_6_4.png",
      "Desert Scorpion_8_1.png",
      "Swamp Toad_2_9.png",
      "Sky Eagle_4_6.png",
      "Ocean Shark_9_3.png"
    ];
    
    // Parse the card data from the filenames
    const cards = cardFiles.map(filename => parseCardFromFilename(filename));
    
    return cards;
  } catch (error) {
    console.error("Error loading cards:", error);
    return [];
  }
};

// Function to parse card data from a filename
export const parseCardFromFilename = (filename) => {
  try {
    const nameParts = filename.split('_');
    if (nameParts.length < 3) {
      throw new Error(`Invalid card filename format: ${filename}`);
    }
    
    // Extract the stats from the filename
    const attackValue = parseInt(nameParts[nameParts.length - 2]);
    
    // Get defense value from the last part (which includes the file extension)
    const lastPart = nameParts[nameParts.length - 1];
    const defenseValue = parseInt(lastPart.split('.')[0]);
    
    // Reconstruct the name (everything before the last two underscores)
    const name = nameParts.slice(0, nameParts.length - 2).join(' ');
    
    // Generate a color based on the card's stats
    const color = getColorForCard(attackValue, defenseValue);
    
    // In a real app, we would use the actual image path
    // For now, we'll use placeholder images with colors based on stats
    const imagePath = `/JJJCombatSimAssets/${filename}`;
    
    return {
      id: filename.replace('.png', ''),
      filename,
      name,
      attack: attackValue,
      defense: defenseValue,
      terrainAttack: 1, // Default terrain values
      terrainDefense: 1,
      subunits: 10, // Default stamina
      // Use placeholder images until real assets are available
      // In production, these would be the actual image paths
      image: `https://via.placeholder.com/547x742/${color}/ffffff?text=${encodeURIComponent(name)}`,
      thumbnail: `https://via.placeholder.com/100x136/${color}/ffffff?text=${encodeURIComponent(name)}`,
      // Store the actual image path for future use
      actualImagePath: imagePath
    };
  } catch (error) {
    console.error(`Error parsing card from filename ${filename}:`, error);
    return null;
  }
};

// Generate a color based on attack and defense values
export const getColorForCard = (attack, defense) => {
  // Higher attack = more red, higher defense = more blue
  const red = Math.min(255, Math.round((attack / 10) * 255));
  const blue = Math.min(255, Math.round((defense / 10) * 255));
  const green = Math.min(255, Math.round(((10 - Math.abs(attack - defense)) / 10) * 100));
  
  // Convert to hex
  return (red << 16 | green << 8 | blue).toString(16).padStart(6, '0');
}; 