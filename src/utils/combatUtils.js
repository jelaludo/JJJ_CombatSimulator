/**
 * Utility functions for combat calculations
 */

/**
 * Calculate the probability of success based on attacker and defender stats
 * @param {Object} attacker - The attacking fighter
 * @param {Object} defender - The defending fighter
 * @param {number} bonus - Additional bonus to apply
 * @returns {number} - Probability between 0 and 1
 */
export const calculateProbability = (attacker, defender, bonus = 0) => {
  // Base probability is attacker's attack vs defender's defense
  const baseProb = attacker.attack / (attacker.attack + defender.defense);
  
  // Apply bonus (positive for advantage, negative for disadvantage)
  const adjustedProb = baseProb + (bonus * 0.1);
  
  // Clamp between 0.1 and 0.9 to always give some chance
  return Math.max(0.1, Math.min(0.9, adjustedProb));
};

/**
 * Generate an array of random numbers for combat resolution
 * @returns {Array} - Array of 10 random numbers between 0 and 1
 */
export const generateRandomNumbers = () => {
  const numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(Math.random());
  }
  return numbers;
};

/**
 * Calculate the number of successful hits based on random numbers and probability
 * @param {Array} randomNums - Array of random numbers
 * @param {number} probability - Probability of success
 * @returns {number} - Number of successful hits
 */
export const calculateHits = (randomNums, probability) => {
  return randomNums.filter(num => num < probability).length;
}; 