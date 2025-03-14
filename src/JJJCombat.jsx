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
  
  // Handle card selection
  const handleSelectCard1 = (card) => {
    setCreature1(card);
  };
  
  const handleSelectCard2 = (card) => {
    setCreature2(card);
  };
  
  // Start combat after card selection
  const startCombat = () => {
    setSelectionMode(false);
    resetCombat();
  };
  
  // Handle combat resolution for a phase
  const resolveCombatPhase = () => {
    if (currentPhaseIndex >= combatPhases.length) return;
    
    setIsAnimating(true);
    
    // Calculate previous bonuses
    const prevPhaseBonus = currentPhaseIndex > 0 ? 
      (combatPhases[currentPhaseIndex-1].bonusWinner === 1 ? 1 : 
       combatPhases[currentPhaseIndex-1].bonusWinner === 2 ? -1 : 0) : 0;
    
    // Calculate probabilities
    const p1 = calculateProbability(creature1, creature2, prevPhaseBonus > 0 ? 1 : 0);
    const p2 = calculateProbability(creature2, creature1, prevPhaseBonus < 0 ? 1 : 0);
    
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
    updatedPhases[currentPhaseIndex].bonusWinner = phaseWinner;
    updatedPhases[currentPhaseIndex].complete = true;
    setCombatPhases(updatedPhases);
    
    // Calculate damage (will be applied at the end)
    const damage1 = Math.round(hits2 / 6);
    const damage2 = Math.round(hits1 / 6);
    
    // Select a scenario based on the current phase and outcome
    const scenario = selectScenario(
      currentPhaseIndex, 
      phaseWinner === 0 ? 'draw' : 'success',
      updatedPhases
    );
    setCurrentScenario(scenario);
    
    // Update combat log
    const newLog = [
      ...combatLog,
      {
        phase: currentPhaseIndex,
        p1, p2,
        hits1, hits2,
        phaseWinner,
        damage1, damage2,
        scenario
      }
    ];
    setCombatLog(newLog);
    
    // Simulate animation time
    setTimeout(() => {
      setIsAnimating(false);
      setShowingResults(true);
      
      // Check if combat is complete
      if (currentPhaseIndex === 3) {
        finalizeCombat(newLog);
      }
    }, 2000); // 2 seconds of animation
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
  
  // Move to next phase
  const nextPhase = () => {
    if (showingResults) {
      // Move to next phase
      if (currentPhaseIndex < combatPhases.length - 1) {
        setCurrentPhaseIndex(currentPhaseIndex + 1);
        setShowingResults(false);
        setCurrentScenario(null);
      }
    } else {
      // Resolve current phase
      resolveCombatPhase();
    }
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
        />
      </div>
      
      {/* Combat area */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Fighter 1 */}
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">{creature1.name}</h2>
            <FighterCard 
              fighter={creature1} 
              size={combatComplete ? 1 : 0.5}
              isWinner={winner === 1}
            />
            {!combatComplete && hits.length > 0 && (
              <div className="mt-2 font-bold">
                Hits: {hits[0]}
              </div>
            )}
          </div>
          
          {/* Fighter 2 */}
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">{creature2.name}</h2>
            <FighterCard 
              fighter={creature2} 
              size={combatComplete ? 1 : 0.5}
              isWinner={winner === 2}
            />
            {!combatComplete && hits.length > 0 && (
              <div className="mt-2 font-bold">
                Hits: {hits[1]}
              </div>
            )}
          </div>
        </div>
        
        {/* Combat gauge */}
        {!combatComplete && (
          <CombatGauge 
            randomNumbers={randomNumbers}
            probability1={combatLog.length > 0 ? combatLog[combatLog.length - 1].p1 : 0.5}
            probability2={combatLog.length > 0 ? combatLog[combatLog.length - 1].p2 : 0.5}
            isActive={isAnimating}
            fighter1Name={creature1.name}
            fighter2Name={creature2.name}
          />
        )}
        
        {/* Scenario display */}
        {showingResults && currentScenario && (
          <ScenarioDisplay 
            scenario={currentScenario}
            fighter1Name={creature1.name}
            fighter2Name={creature2.name}
            phaseWinner={combatPhases[currentPhaseIndex].bonusWinner}
          />
        )}
        
        {/* Combat result */}
        {combatComplete && (
          <div className="text-center p-4 bg-gray-100 rounded-lg mb-4">
            <h2 className="text-2xl font-bold mb-2">
              {winner === 1 ? creature1.name : creature2.name} Wins!
            </h2>
            <p className="text-gray-600">
              {winner === 1 ? creature1.name : creature2.name} has emerged victorious after an intense battle!
            </p>
          </div>
        )}
        
        {/* Combat controls */}
        <CombatControls 
          onNextPhase={nextPhase}
          onReset={resetCombat}
          onReturn={returnToSelection}
          isAnimating={isAnimating}
          showingResults={showingResults}
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
