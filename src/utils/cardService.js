/**
 * Service for loading and parsing card data from the JJJCombatSimAssets folder
 */

/**
 * Load all available cards from the assets folder
 * @returns {Promise<Array>} - Array of card objects
 */
export const loadCards = async () => {
  try {
    // In a frontend-only app, we can't directly read the directory
    // Instead, we'll use a combination of known files and pattern-based discovery
    
    // Base list of known cards (for fallback)
    const knownCardFiles = [
      "Baby Swallow_1_4.png",
      "Balanced Capybara_6_7.png",
      "Fierce Swallow_2_9.png",
      "Mech Croc Kid_3_3.png",
      "Mech Croc_7_4.png",
      "POW Tiger Cub_2_3.png",
      "POW Tiger_8_7.png",
      "Zen Capybara_1_2.png",
      "Sakura Elemental_4_9_Woman.png",
      "Sakura Elemental Man_6_8_.png"
    ];
    
    // Dynamically check for files
    const cardFiles = await discoverCardFiles(knownCardFiles);
    
    // Parse the card data from the filenames
    const cards = cardFiles.map(filename => parseCardFromFilename(filename));
    
    console.log(`Loaded ${cards.length} cards from JJJCombatSimAssets folder`);
    return cards;
  } catch (error) {
    console.error("Error loading cards:", error);
    return [];
  }
};

/**
 * Discover card files by checking if they exist
 * @param {Array} knownFiles - List of known files to check
 * @returns {Promise<Array>} - Array of available card filenames
 */
const discoverCardFiles = async (knownFiles) => {
  // Create a set to store unique filenames
  const discoveredFiles = new Set();
  
  // Check each known file
  const checkPromises = knownFiles.map(async (filename) => {
    try {
      const exists = await checkFileExists(`${process.env.PUBLIC_URL}/JJJCombatSimAssets/${filename}`);
      if (exists) {
        discoveredFiles.add(filename);
      }
    } catch (error) {
      console.warn(`Could not check file ${filename}:`, error);
    }
  });
  
  // Wait for all checks to complete
  await Promise.all(checkPromises);
  
  // Try to discover additional files using common patterns
  await discoverAdditionalFiles(discoveredFiles);
  
  // Convert set back to array
  return Array.from(discoveredFiles);
};

/**
 * Attempt to discover additional card files using common patterns
 * @param {Set} discoveredFiles - Set of already discovered files
 * @returns {Promise<void>}
 */
const discoverAdditionalFiles = async (discoveredFiles) => {
  // Common creature types and prefixes to try
  const commonTypes = [
    "Dragon", "Phoenix", "Ninja", "Samurai", "Monk", "Warrior", 
    "Tiger", "Lion", "Bear", "Wolf", "Eagle", "Hawk", "Falcon",
    "Elemental", "Master", "Sensei", "Student", "Disciple",
    "Fire", "Water", "Earth", "Air", "Shadow", "Light",
    "Mystic", "Ancient", "Legendary", "Elite", "Champion"
  ];
  
  // Common suffixes
  const commonSuffixes = ["", "Cub", "Kid", "Master", "Sensei", "Lord", "King", "Queen", "Prince", "Princess", "Man", "Woman"];
  
  // Attack and defense ranges to try
  const statRange = Array.from({ length: 10 }, (_, i) => i + 1); // 1-10
  
  // Generate potential filenames and check if they exist
  const checkPromises = [];
  
  for (const type of commonTypes) {
    for (const suffix of commonSuffixes) {
      for (const attack of statRange) {
        for (const defense of statRange) {
          // Only check a subset of combinations to avoid too many requests
          if ((attack + defense) % 3 !== 0) continue; // Skip some combinations
          
          const baseName = suffix ? `${type} ${suffix}` : type;
          const filename = `${baseName}_${attack}_${defense}.png`;
          
          // Skip if we already know about this file
          if (discoveredFiles.has(filename)) continue;
          
          // Check if this file exists
          const promise = (async () => {
            try {
              const exists = await checkFileExists(`${process.env.PUBLIC_URL}/JJJCombatSimAssets/${filename}`);
              if (exists) {
                discoveredFiles.add(filename);
                console.log(`Discovered new card: ${filename}`);
              }
            } catch (error) {
              // Silently fail for discovery attempts
            }
          })();
          
          checkPromises.push(promise);
        }
      }
    }
  }
  
  // Wait for all checks to complete (with a timeout to avoid hanging)
  await Promise.race([
    Promise.all(checkPromises),
    new Promise(resolve => setTimeout(resolve, 5000)) // 5 second timeout
  ]);
};

/**
 * Check if a file exists by attempting to fetch its headers
 * @param {string} url - URL of the file to check
 * @returns {Promise<boolean>} - Whether the file exists
 */
const checkFileExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
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
    
    // Log the parsed values for debugging
    console.log(`Parsed card: ${name} (ATK: ${attack}, DEF: ${defense})`);
    
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