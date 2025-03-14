import React, { useState, useEffect } from 'react';
import CombatGauge from './components/CombatGauge';
import CardSelector from './components/CardSelector';
import CombatLog from './components/CombatLog';
import FighterCard from './components/FighterCard';
import CombatControls from './components/CombatControls';
import { calculateProbability, generateRandomNumbers, calculateHits } from './utils/combatUtils';
import { selectScenario } from './utils/scenarioUtils';
import { parseCardFromFilename, loadCards } from './utils/cardService';

/**
 * Main component for the JJJ Combat Simulator
 * @returns {JSX.Element} - Rendered component
 */
const JJJCombat = () => {
  // Default creature cards (will be replaced with random ones)
  const defaultCreature1 = parseCardFromFilename("Baby Swallow_1_4.png");
  const defaultCreature2 = parseCardFromFilename("POW Tiger_8_7.png");
  
  // Initial creature stats
  const [creature1, setCreature1] = useState(defaultCreature1);
  const [creature2, setCreature2] = useState(defaultCreature2);
  
  // Load random fighters on component mount
  useEffect(() => {
    const loadRandomFighters = async () => {
      try {
        // Load all available cards
        const allCards = await loadCards();
        
        if (allCards.length >= 2) {
          // Get two random indices
          let index1 = Math.floor(Math.random() * allCards.length);
          let index2;
          
          // Make sure index2 is different from index1
          do {
            index2 = Math.floor(Math.random() * allCards.length);
          } while (index2 === index1);
          
          // Set the random fighters
          setCreature1(allCards[index1]);
          setCreature2(allCards[index2]);
          
          console.log(`Randomly selected fighters: ${allCards[index1].name} vs ${allCards[index2].name}`);
        }
      } catch (error) {
        console.error("Error loading random fighters:", error);
      }
    };
    
    loadRandomFighters();
  }, []); // Empty dependency array means this runs once on component mount
  
  // Combat phases
  const phases = [
    { name: "倒", description: "Takedown", bonusWinner: null, complete: false },
    { name: "越", description: "Passing", bonusWinner: null, complete: false },
    { name: "制", description: "Pinning", bonusWinner: null, complete: false },
    { name: "極", description: "Submission", bonusWinner: null, complete: false }
  ];
  
  // Combat state
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [combatPhases, setCombatPhases] = useState(phases);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [hits, setHits] = useState([]);
  const [showingResults, setShowingResults] = useState(false);
  const [winner, setWinner] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [combatComplete, setCombatComplete] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectionMode, setSelectionMode] = useState(true);
  const [combatSpeed, setCombatSpeed] = useState(1); // 1 = normal speed, 2 = 2x speed, 0.5 = half speed
  const [injuredFighter, setInjuredFighter] = useState(null); // null, 1, or 2
  const [injuryType, setInjuryType] = useState(null); // null, 'injury', or 'broken'
  
  // Handle card selection
  const handleSelectCard1 = (card) => {
    setCreature1(card);
  };
  
  const handleSelectCard2 = (card) => {
    setCreature2(card);
  };
  
  // Handle speed change
  const handleSpeedChange = (e) => {
    setCombatSpeed(parseFloat(e.target.value));
  };
  
  // Calculate timing based on combat speed
  const getTimingValue = (baseValue) => {
    return Math.round(baseValue / combatSpeed);
  };
  
  // Calculate injury chance for submission phase
  const calculateInjuryChance = (attackerProbability, phasesLostByDefender) => {
    // Base chance is 1/10 of attacker's probability
    const baseChance = attackerProbability / 10;
    // Add 1% per phase lost by defender
    const bonusChance = phasesLostByDefender * 0.01;
    
    return baseChance + bonusChance;
  };
  
  // Check if injury occurs based on calculated chance
  const checkForInjury = (chance) => {
    const random = Math.random();
    return random < chance;
  };
  
  // Determine injury type (80% regular injury, 20% broken bone)
  const determineInjuryType = () => {
    const random = Math.random();
    return random < 0.8 ? 'injury' : 'broken';
  };
  
  // Resolve combat for a specific phase index (to avoid state update issues)
  const resolveCombatPhaseForIndex = async (phaseIndex) => {
    if (phaseIndex >= combatPhases.length) {
      setCombatComplete(true);
      return;
    }

    // Set animating state to true when starting a phase
    setIsAnimating(true);

    // Get previous bonus if any
    const previousBonus = phaseIndex > 0 ? combatPhases[phaseIndex - 1].bonusWinner === 1 ? 0.1 : 0 : 0;

    // Calculate probabilities with the cumulative bonus
    const p1 = calculateProbability(creature1, creature2, previousBonus > 0 ? previousBonus * 10 : 0);
    const p2 = calculateProbability(creature2, creature1, previousBonus < 0 ? Math.abs(previousBonus) * 10 : 0);
    
    // Generate random numbers
    const rand1 = generateRandomNumbers();
    const rand2 = generateRandomNumbers();
    setRandomNumbers([rand1, rand2]);
    
    // Calculate hits
    const hits1 = calculateHits(rand1, p1);
    const hits2 = calculateHits(rand2, p2);
    setHits([hits1, hits2]);
    
    // Define scramble thresholds for each phase
    const scrambleThresholds = [
      1.2, // Phase 0 (Takedown): 1.2 hits difference
      1.0, // Phase 1 (Passing): 1.0 hits difference
      0.8, // Phase 2 (Pinning): 0.8 hits difference
      0.6  // Phase 3 (Submission): 0.6 hits difference
    ];
    
    // Calculate the difference in hits
    const hitsDifference = Math.abs(hits1 - hits2);
    
    // Determine if this is a scramble based on the threshold for this phase
    const threshold = scrambleThresholds[phaseIndex];
    let isScramble = false;
    
    if (hitsDifference < threshold) {
      // Calculate scramble probability: 80% - (difference in hits × 50%)
      const scrambleProbability = 0.8 - (hitsDifference * 0.5);
      // Random check to see if it's a scramble
      isScramble = Math.random() < scrambleProbability;
    }
    
    // Determine phase winner
    let phaseWinner;
    if (isScramble) {
      phaseWinner = 0; // Draw/Scramble
    } else {
      phaseWinner = hits1 > hits2 ? 1 : hits2 > hits1 ? 2 : 0;
    }
    
    // Update phase results
    const updatedPhases = [...combatPhases];
    updatedPhases[phaseIndex].bonusWinner = phaseWinner;
    updatedPhases[phaseIndex].complete = true;
    updatedPhases[phaseIndex].isScramble = isScramble;
    
    // Store the bonus value for display
    updatedPhases[phaseIndex].bonusValue = 0.1;
    
    setCombatPhases(updatedPhases);
    
    // Calculate damage (will be applied at the end)
    const damage1 = Math.round(hits2 / 6);
    const damage2 = Math.round(hits1 / 6);
    
    // Select a scenario based on the current phase and outcome
    const scenario = selectScenario(
      phaseIndex, 
      phaseWinner === 0 ? 'draw' : 'success',
      updatedPhases
    );
    setCurrentScenario(scenario);
    
    // Check for injury in submission phase (phase 3)
    let isInjured = false;
    let injuredFighterNumber = null;
    let currentInjuryType = null;
    
    if (phaseIndex === 3 && phaseWinner !== 0) {
      // Count phases lost by the loser
      const loserNumber = phaseWinner === 1 ? 2 : 1;
      const phasesLostByLoser = updatedPhases.filter(
        (phase, idx) => idx < 3 && phase.bonusWinner === phaseWinner
      ).length;
      
      // Calculate injury chance based on winner's probability and phases lost by loser
      const winnerProb = phaseWinner === 1 ? p1 : p2;
      const injuryChance = calculateInjuryChance(winnerProb, phasesLostByLoser);
      
      // Check if injury occurs
      isInjured = checkForInjury(injuryChance);
      
      if (isInjured) {
        injuredFighterNumber = loserNumber;
        currentInjuryType = determineInjuryType();
        setInjuredFighter(loserNumber);
        setInjuryType(currentInjuryType);
      }
    }
    
    // Create a new log entry for this phase
    const newEntry = {
      phase: phaseIndex,
      p1, p2,
      hits1, hits2,
      phaseWinner,
      damage1, damage2,
      scenario,
      bonusValue: 0.1,
      isInjured,
      injuredFighter: injuredFighterNumber,
      injuryType: currentInjuryType,
      injuryChance: phaseIndex === 3 && phaseWinner !== 0 ? 
        calculateInjuryChance(
          phaseWinner === 1 ? p1 : p2, 
          updatedPhases.filter((phase, idx) => idx < 3 && phase.bonusWinner === phaseWinner).length
        ) : null,
      isScramble: isScramble,
      hitsDifference: hitsDifference
    };
    
    // Add this phase's log entry to the combat log, preserving all previous entries
    setCombatLog(prevLog => {
      // Remove any existing entry for this phase
      const filteredLog = prevLog.filter(entry => entry.phase !== phaseIndex);
      // Add the new entry and sort by phase
      const updatedLog = [...filteredLog, newEntry].sort((a, b) => a.phase - b.phase);
      
      // If this is the final phase, finalize combat with the updated log
      if (phaseIndex === 3) {
        // Use setTimeout to ensure state is updated before finalizing
        setTimeout(() => {
          finalizeCombat(updatedLog);
        }, 100);
      }
      
      return updatedLog;
    });
    
    // Simulate animation time
    setTimeout(() => {
      setIsAnimating(false);
      setShowingResults(true);
      
      // Check if combat is complete
      if (phaseIndex === 3) {
        // Combat is finalized in the setCombatLog callback above
        setCombatComplete(true);
      } else {
        // Auto-progress to next phase after a delay
        setTimeout(() => {
          // Use the explicit nextPhaseIndex to avoid state update issues
          const nextPhaseIndex = phaseIndex + 1;
          setCurrentPhaseIndex(nextPhaseIndex);
          setShowingResults(false);
          setCurrentScenario(null);
          
          // Continue to the next phase
          setTimeout(() => {
            if (nextPhaseIndex <= 3 && !combatComplete) {
              resolveCombatPhaseForIndex(nextPhaseIndex);
            }
          }, getTimingValue(500)); // Reduced delay to 0.5 seconds to ensure phases progress
        }, getTimingValue(3000)); // 3 seconds to view the results before moving to next phase
      }
    }, getTimingValue(2000)); // 2 seconds of animation
  };
  
  // Start combat after card selection
  const startCombat = () => {
    setSelectionMode(false);
    resetCombat();
  };
  
  // Finalize combat and determine winner
  const finalizeCombat = (log) => {
    // Ensure we have a valid log with entries
    if (!log || log.length === 0) {
      console.warn("Combat log is empty when finalizing combat");
      // Default to the current phase winner if available
      if (combatPhases[3].bonusWinner) {
        setWinner(combatPhases[3].bonusWinner);
      } else {
        // Fallback to a random winner if all else fails
        setWinner(Math.random() < 0.5 ? 1 : 2);
      }
      setCombatComplete(true);
      return;
    }
    
    // Get the most up-to-date log from state
    const currentLog = [...combatLog, ...log.filter(entry => 
      !combatLog.some(existingEntry => existingEntry.phase === entry.phase)
    )];
    
    // Check if the final phase (Submission) is a draw/scramble
    const finalPhaseEntry = currentLog.find(entry => entry.phase === 3);
    if (finalPhaseEntry && finalPhaseEntry.phaseWinner === 0) {
      // If the final phase is a draw/scramble, the match is a draw
      setWinner(0); // 0 indicates a draw
      setCombatComplete(true);
      return;
    }
    
    // IMPORTANT: If the final phase (Submission) has a clear winner, they win the match
    // This ensures that a reversal in the final phase determines the winner
    if (finalPhaseEntry && finalPhaseEntry.phaseWinner !== 0) {
      setWinner(finalPhaseEntry.phaseWinner);
      console.log(`Winner determination: Fighter ${finalPhaseEntry.phaseWinner} wins by submission in the final phase!`);
      setCombatComplete(true);
      return;
    }
    
    // If we reach here, it means the final phase doesn't have a clear winner
    // Count wins for each fighter (ignoring draws/scrambles)
    const wins1 = currentLog.filter(entry => entry.phaseWinner === 1).length;
    const wins2 = currentLog.filter(entry => entry.phaseWinner === 2).length;
    
    // Determine overall winner
    let overallWinner = 0;
    
    // In case of a tie, check previous phases in reverse order
    if (wins1 === wins2) {
      const phase2Entry = currentLog.find(entry => entry.phase === 2);
      if (phase2Entry && phase2Entry.phaseWinner !== 0) {
        overallWinner = phase2Entry.phaseWinner;
      } else {
        const phase1Entry = currentLog.find(entry => entry.phase === 1);
        if (phase1Entry && phase1Entry.phaseWinner !== 0) {
          overallWinner = phase1Entry.phaseWinner;
        } else {
          const phase0Entry = currentLog.find(entry => entry.phase === 0);
          if (phase0Entry && phase0Entry.phaseWinner !== 0) {
            overallWinner = phase0Entry.phaseWinner;
          } else {
            // If all phases are draws, pick randomly
            overallWinner = Math.random() < 0.5 ? 1 : 2;
          }
        }
      }
    } else {
      // If not tied, the fighter with more wins is the overall winner
      overallWinner = wins1 > wins2 ? 1 : 2;
    }
    
    // Log the winner determination for debugging
    console.log(`Winner determination: Fighter ${overallWinner} wins (Wins: ${wins1}-${wins2})`);
    
    setWinner(overallWinner);
    setCombatComplete(true);
  };
  
  // Reset combat to start a new match
  const resetCombat = () => {
    // Reset all combat state
    setCurrentPhaseIndex(0);
    setCombatPhases(phases.map(phase => ({ ...phase, bonusWinner: null, complete: false })));
    setRandomNumbers([]);
    setHits([]);
    setShowingResults(false);
    setWinner(null);
    setCombatLog([]);
    setCombatComplete(false);
    setCurrentScenario(null);
    setIsAnimating(false);
    setInjuredFighter(null);
    setInjuryType(null);
    
    // Set a flag to indicate we're starting a new combat
    const startingNewCombat = true;
    
    // Auto-start the first phase after a short delay
    setTimeout(() => {
      // Start with phase 0 and ensure we progress through all phases
      resolveCombatPhaseForIndex(0);
      
      // Set up a chain of phase resolutions to ensure all phases are processed
      if (startingNewCombat) {
        // We don't need to call the other phases directly here
        // as resolveCombatPhaseForIndex will handle the progression
        setIsAnimating(true);
      }
    }, getTimingValue(1000));
  };
  
  // Return to fighter selection
  const returnToSelection = () => {
    setSelectionMode(true);
    resetCombat();
  };
  
  // Render fighter selection screen
  if (selectionMode) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">JJJ Combat Simulator</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Select Your Fighters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <CardSelector 
                onSelectCard={handleSelectCard1} 
                position="left" 
                selectedCard={creature1} 
              />
            </div>
            
            <div>
              <CardSelector 
                onSelectCard={handleSelectCard2} 
                position="right" 
                selectedCard={creature2} 
              />
            </div>
          </div>
          
          {/* Combat Speed Control */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Combat Speed</h3>
            <div className="flex items-center justify-between">
              <label htmlFor="speed-control-selection" className="font-bold text-gray-700">Speed:</label>
              <div className="text-sm font-medium text-gray-500">
                {combatSpeed === 0.5 ? 'Slow' : combatSpeed === 1 ? 'Normal' : combatSpeed === 2 ? 'Fast' : 'Very Fast'}
              </div>
            </div>
            <input 
              id="speed-control-selection"
              type="range" 
              min="0.5" 
              max="3" 
              step="0.5" 
              value={combatSpeed} 
              onChange={handleSpeedChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
              <span>Very Fast</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              onClick={startCombat}
            >
              Start Combat
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render combat screen
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">JJJ Combat Simulator</h1>
      
      {/* Combat area */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        {/* Fighters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          {/* Fighter 1 */}
          <div className="text-center">
            <div className="relative">
              {winner === 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_Crown.png`} 
                    alt="Winner Crown" 
                    className="w-24 h-24"
                  />
                </div>
              )}
              {injuredFighter === 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/${injuryType === 'broken' ? 'JJJ_Icon_BrokenBone.png' : 'JJJ_Icon_Injury.png'}`} 
                    alt={injuryType === 'broken' ? "Broken Bone" : "Injury"} 
                    className="w-24 h-24"
                  />
                </div>
              )}
              <div className="relative">
                <FighterCard 
                  fighter={creature1} 
                  size={1}
                  isWinner={winner === 1}
                  showStats={false}
                />
              </div>
              {!combatComplete && hits.length > 0 && (
                <div className="mt-2 font-bold">
                  Hits: {hits[0]}
                </div>
              )}
            </div>
          </div>
          
          {/* Draw icon (displayed between fighters when there's a draw) */}
          {winner === 0 && combatComplete && (
            <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center sm:hidden">
              <img 
                src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_FistBump.png`} 
                alt="Draw - Fist Bump" 
                style={{ width: '96px', height: 'auto', display: 'block' }}
              />
            </div>
          )}
          
          {/* Fighter 2 */}
          <div className="text-center">
            <div className="relative">
              {winner === 2 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_Crown.png`} 
                    alt="Winner Crown" 
                    className="w-24 h-24"
                  />
                </div>
              )}
              {injuredFighter === 2 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/${injuryType === 'broken' ? 'JJJ_Icon_BrokenBone.png' : 'JJJ_Icon_Injury.png'}`} 
                    alt={injuryType === 'broken' ? "Broken Bone" : "Injury"} 
                    className="w-24 h-24"
                  />
                </div>
              )}
              <div className="relative">
                <FighterCard 
                  fighter={creature2} 
                  size={1}
                  isWinner={winner === 2}
                  showStats={false}
                />
              </div>
              {!combatComplete && hits.length > 0 && (
                <div className="mt-2 font-bold">
                  Hits: {hits[1]}
                </div>
              )}
            </div>
          </div>
          
          {/* Draw icon for desktop (centered between fighters) */}
          {winner === 0 && combatComplete && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center">
              <img 
                src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_FistBump.png`} 
                alt="Draw - Fist Bump" 
                style={{ width: '96px', height: 'auto', display: 'block' }}
              />
            </div>
          )}
        </div>
        
        {/* Combat gauge - Always visible */}
        <div className="mb-4">
          <CombatGauge 
            randomNumbers={randomNumbers}
            probability1={combatLog.length > 0 ? combatLog[combatLog.length - 1].p1 : 0.5}
            probability2={combatLog.length > 0 ? combatLog[combatLog.length - 1].p2 : 0.5}
            isActive={isAnimating && !combatComplete}
            fighter1Name={creature1.name}
            fighter2Name={creature2.name}
          />
        </div>
        
        {/* Combat log with vertical layout */}
        {combatLog.length > 0 && (
          <div className="mb-4">
            <CombatLog 
              combatLog={combatLog}
              combatPhases={combatPhases}
              creature1={creature1}
              creature2={creature2}
              currentScenario={currentScenario}
              showingResults={showingResults}
              currentPhaseIndex={currentPhaseIndex}
            />
          </div>
        )}
        
        {/* Combat Speed Control */}
        <div className="mb-4 p-3 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="speed-control" className="font-bold text-gray-700">Combat Speed:</label>
            <div className="text-sm font-medium text-gray-500">
              {combatSpeed === 0.5 ? 'Slow' : combatSpeed === 1 ? 'Normal' : combatSpeed === 2 ? 'Fast' : 'Very Fast'}
            </div>
          </div>
          <input 
            id="speed-control"
            type="range" 
            min="0.5" 
            max="3" 
            step="0.5" 
            value={combatSpeed} 
            onChange={handleSpeedChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
            <span>Very Fast</span>
          </div>
        </div>
        
        {/* Combat controls */}
        <CombatControls 
          onReturn={returnToSelection}
          combatComplete={combatComplete}
        />
      </div>
    </div>
  );
};

export default JJJCombat;

