/**
 * Utility functions for scenario selection
 */
import combatScenarios from '../data/combatScenarios';

/**
 * Select a random scenario based on phase and outcome
 * @param {number} phase - Current phase index (0-3)
 * @param {string} outcome - Outcome of the phase ('success', 'draw', 'failure')
 * @param {Array} combatPhases - Array of combat phases with results
 * @returns {Object} - Selected scenario object
 */
export const selectScenario = (phase, outcome, combatPhases) => {
  let scenarioPool = [];
  const phaseWinner = combatPhases[phase].bonusWinner;
  
  // Determine the scenario pool based on the current phase
  switch(phase) {
    case 0: // PHASE 1: Takedown
      if (phaseWinner !== 0) {
        scenarioPool = combatScenarios.takedown.success;
      } else if (outcome === 'draw') {
        scenarioPool = combatScenarios.takedown.draw;
      } else {
        scenarioPool = combatScenarios.takedown.failure;
      }
      break;
      
    case 1: // PHASE 2: Guard Passing
      if (phaseWinner !== 0) {
        scenarioPool = combatScenarios.passing.success;
      } else if (outcome === 'draw') {
        scenarioPool = combatScenarios.passing.draw;
      } else {
        scenarioPool = combatScenarios.passing.failure;
      }
      break;
      
    case 2: // PHASE 3: Pinning
      if (phaseWinner !== 0) {
        // Check if previous phase winner matches current phase winner
        const prevPhaseWinner = combatPhases[phase-1].bonusWinner;
        if (prevPhaseWinner === phaseWinner) {
          scenarioPool = combatScenarios.pinning.successAfterPass;
        } else {
          scenarioPool = combatScenarios.pinning.successAfterFailedPass;
        }
      } else if (outcome === 'draw') {
        scenarioPool = combatScenarios.pinning.draw;
      } else {
        scenarioPool = combatScenarios.pinning.failure;
      }
      break;
      
    case 3: // PHASE 4: Submission
      if (phaseWinner !== 0) {
        // Check if previous phase winner matches current phase winner
        const prevPhaseWinner = combatPhases[phase-1].bonusWinner;
        if (prevPhaseWinner === phaseWinner) {
          scenarioPool = combatScenarios.submission.successAfterPin;
        } else {
          scenarioPool = combatScenarios.submission.successAfterFailedPin;
        }
      } else if (outcome === 'draw') {
        scenarioPool = combatScenarios.submission.draw;
      } else {
        scenarioPool = combatScenarios.submission.failure;
      }
      break;
      
    default:
      return null;
  }
  
  // Select a random scenario from the pool
  if (scenarioPool && scenarioPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * scenarioPool.length);
    const selectedScenario = scenarioPool[randomIndex];
    
    // Add phase information to help with debugging
    return {
      ...selectedScenario,
      phaseType: ['Takedown', 'Passing', 'Pinning', 'Submission'][phase],
      phaseIndex: phase
    };
  }
  
  return null;
}; 