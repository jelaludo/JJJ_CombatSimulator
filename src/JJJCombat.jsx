import React, { useState } from 'react';
import CombatGauge from './components/CombatGauge';
import ScenarioDisplay from './components/ScenarioDisplay';
import CardSelector from './components/CardSelector';
import CombatLog from './components/CombatLog';
import FighterCard from './components/FighterCard';
import CombatControls from './components/CombatControls';
import PhaseIndicator from './components/PhaseIndicator';
import { calculateProbability, generateRandomNumbers, calculateHits } from './utils/combatUtils';
import { selectScenario } from './utils/scenarioUtils';
import { parseCardFromFilename } from './utils/cardService';

/**
 * Main component for the JJJ Combat Simulator
 * @returns {JSX.Element} - Rendered component
 */
const JJJCombat = () => {
  // Default creature cards
  const defaultCreature1 = parseCardFromFilename("Baby Swallow_1_4.png");
  const defaultCreature2 = parseCardFromFilename("POW Tiger_8_7.png");
  
  // Initial creature stats
  const [creature1, setCreature1] = useState(defaultCreature1);
  const [creature2, setCreature2] = useState(defaultCreature2);
  
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
    
    // Determine phase winner
    const phaseWinner = hits1 > hits2 ? 1 : hits2 > hits1 ? 2 : 0;
    
    // Update phase results
    const updatedPhases = [...combatPhases];
    updatedPhases[phaseIndex].bonusWinner = phaseWinner;
    updatedPhases[phaseIndex].complete = true;
    
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
    
    // Update combat log
    const newLog = [
      ...combatLog,
      {
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
          ) : null
      }
    ];
    setCombatLog(newLog);
    
    // Simulate animation time
    setTimeout(() => {
      setIsAnimating(false);
      setShowingResults(true);
      
      // Check if combat is complete
      if (phaseIndex === 3) {
        finalizeCombat(newLog);
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
          }, getTimingValue(1000));
        }, getTimingValue(3000)); // 3 seconds to view the results before moving to next phase
      }
    }, getTimingValue(2000)); // 2 seconds of animation
  };
  
  // Start combat after card selection
  const startCombat = () => {
    setSelectionMode(false);
    resetCombat();
    
    // Auto-start the first phase after a short delay
    setTimeout(() => {
      resolveCombatPhaseForIndex(0);
    }, getTimingValue(1000));
  };
  
  // Finalize combat and determine winner
  const finalizeCombat = (log) => {
    // Count wins for each fighter
    const wins1 = log.filter(entry => entry.phaseWinner === 1).length;
    const wins2 = log.filter(entry => entry.phaseWinner === 2).length;
    
    // Determine overall winner
    let overallWinner = 0;
    if (wins1 > wins2) {
      overallWinner = 1;
    } else if (wins2 > wins1) {
      overallWinner = 2;
    } else {
      // If tied, winner of final phase wins
      overallWinner = log[log.length - 1].phaseWinner;
    }
    
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
  };
  
  // Return to fighter selection
  const returnToSelection = () => {
    setSelectionMode(true);
    resetCombat();
  };
  
  // Render fighter selection screen
  if (selectionMode) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">JJJ Combat Simulator</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Select Your Fighters</h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2">Fighter 1</h3>
              <CardSelector 
                onSelectCard={handleSelectCard1} 
                position="left" 
                selectedCard={creature1} 
              />
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Fighter 2</h3>
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">JJJ Combat Simulator</h1>
      
      {/* Phase indicator */}
      <div className="relative mb-8">
        <PhaseIndicator 
          phases={combatPhases} 
          currentPhaseIndex={currentPhaseIndex} 
          fighter1={creature1}
          fighter2={creature2}
        />
      </div>
      
      {/* Combat area */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Fighter 1 */}
          <div className="text-center">
            <div className="relative mb-2">
              {winner === 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_Crown.png`} 
                    alt="Winner Crown" 
                    className="w-12 h-12"
                  />
                </div>
              )}
              <h2 className="text-lg font-bold">{creature1.name}</h2>
            </div>
            <div className="relative">
              <FighterCard 
                fighter={creature1} 
                size={combatComplete ? 1 : 0.5}
                isWinner={winner === 1}
              />
              {injuredFighter === 1 && (
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/${injuryType === 'broken' ? 'JJJ_Icon_BrokenBone.png' : 'JJJ_Icon_Injury.png'}`} 
                    alt={injuryType === 'broken' ? "Broken Bone" : "Injury"} 
                    className="w-10 h-10"
                  />
                </div>
              )}
            </div>
            {!combatComplete && hits.length > 0 && (
              <div className="mt-2 font-bold">
                Hits: {hits[0]}
              </div>
            )}
          </div>
          
          {/* Fighter 2 */}
          <div className="text-center">
            <div className="relative mb-2">
              {winner === 2 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/JJJ_Icon_Crown.png`} 
                    alt="Winner Crown" 
                    className="w-12 h-12"
                  />
                </div>
              )}
              <h2 className="text-lg font-bold">{creature2.name}</h2>
            </div>
            <div className="relative">
              <FighterCard 
                fighter={creature2} 
                size={combatComplete ? 1 : 0.5}
                isWinner={winner === 2}
              />
              {injuredFighter === 2 && (
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <img 
                    src={`${process.env.PUBLIC_URL}/icons/${injuryType === 'broken' ? 'JJJ_Icon_BrokenBone.png' : 'JJJ_Icon_Injury.png'}`} 
                    alt={injuryType === 'broken' ? "Broken Bone" : "Injury"} 
                    className="w-10 h-10"
                  />
                </div>
              )}
            </div>
            {!combatComplete && hits.length > 0 && (
              <div className="mt-2 font-bold">
                Hits: {hits[1]}
              </div>
            )}
          </div>
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
        
        {/* Scenario display - Always visible */}
        <div className="mb-4 min-h-[100px]">
          {showingResults && currentScenario ? (
            <ScenarioDisplay 
              scenario={currentScenario}
              fighter1Name={creature1.name}
              fighter2Name={creature2.name}
              phaseWinner={combatPhases[currentPhaseIndex].bonusWinner}
            />
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Combat scenarios will appear here during the match</p>
            </div>
          )}
        </div>
        
        {/* Combat result */}
        {combatComplete && (
          <div className="text-center p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-2xl font-bold mb-2">
              {winner === 1 ? creature1.name : creature2.name} Wins!
            </h2>
            <p className="text-gray-600">
              {winner === 1 ? creature1.name : creature2.name} has emerged victorious after an intense battle!
            </p>
            {injuredFighter !== null && (
              <p className="mt-2 text-red-600 font-semibold">
                {injuredFighter === 1 ? creature1.name : creature2.name} suffered 
                {injuryType === 'broken' ? ' a broken bone' : ' an injury'} during the submission!
              </p>
            )}
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
          onReset={resetCombat}
          onReturn={returnToSelection}
          combatComplete={combatComplete}
        />
      </div>
      
      {/* Combat log */}
      {combatLog.length > 0 && (
        <CombatLog 
          combatLog={combatLog}
          combatPhases={combatPhases}
          creature1={creature1}
          creature2={creature2}
        />
      )}
    </div>
  );
};

export default JJJCombat;
