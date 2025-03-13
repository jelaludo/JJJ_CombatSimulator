import React, { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import CombatGauge from './CombatGauge';
import ScenarioDisplay from './ScenarioDisplay';
import CardSelector from './CardSelector';
import combatScenarios from './combatScenarios';
import { parseCardFromFilename } from './cardService';

const JJJCombat = () => {
  // Default creature cards
  const defaultCreature1 = parseCardFromFilename("Baby Swallow_1_4.png");
  const defaultCreature2 = parseCardFromFilename("POW Tiger_8_7.png");
  
  // Initial creature stats
  const [creature1, setCreature1] = useState(defaultCreature1);
  const [creature2, setCreature2] = useState(defaultCreature2);
  
  const phases = [
    { name: "倒", description: "Takedown", bonusWinner: null, complete: false },
    { name: "越", description: "Passing", bonusWinner: null, complete: false },
    { name: "制", description: "Pinning", bonusWinner: null, complete: false },
    { name: "極", description: "Submission", bonusWinner: null, complete: false }
  ];
  
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
  
  // Calculate probability of hit
  const calculateProbability = (attacker, defender, bonus = 0) => {
    const attackerStrength = attacker.attack + attacker.terrainAttack;
    const defenderStrength = defender.defense + defender.terrainDefense;
    const differential = attackerStrength - defenderStrength + bonus;
    
    let p = 0.05 * differential + 0.5;
    p = Math.max(0, Math.min(1, p)); // Clamp between 0 and 1
    
    return p;
  };
  
  // Generate random numbers for hit resolution
  const generateRandomNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 6; i++) {
      numbers.push(Math.random());
    }
    return numbers;
  };
  
  // Calculate hits based on probability
  const calculateHits = (randomNums, probability) => {
    return randomNums.filter(r => r < probability).length;
  };
  
  // Select a random scenario based on phase and outcome
  const selectScenario = (phase, outcome) => {
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
    const scenario = selectScenario(currentPhaseIndex, phaseWinner === 0 ? 'draw' : 'success');
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
  
  // Apply final combat results
  const finalizeCombat = (log) => {
    // Count phase wins
    const creature1Wins = log.filter(entry => entry.phaseWinner === 1).length;
    const creature2Wins = log.filter(entry => entry.phaseWinner === 2).length;
    
    // Determine winner
    const finalWinner = creature1Wins > creature2Wins ? 1 : 
                      creature2Wins > creature1Wins ? 2 : 0;
    
    setWinner(finalWinner);
    
    // Calculate total damage
    const totalDamage1 = log.reduce((sum, entry) => sum + entry.damage1, 0);
    const totalDamage2 = log.reduce((sum, entry) => sum + entry.damage2, 0);
    
    // Apply damage
    setCreature1(prev => ({
      ...prev,
      subunits: Math.max(0, prev.subunits - totalDamage1)
    }));
    
    setCreature2(prev => ({
      ...prev,
      subunits: Math.max(0, prev.subunits - totalDamage2)
    }));
    
    setCombatComplete(true);
  };
  
  // Move to next phase and automatically resolve it
  const nextPhase = () => {
    if (currentPhaseIndex < combatPhases.length - 1) {
      // Move to the next phase
      setCurrentPhaseIndex(prev => prev + 1);
      setShowingResults(false);
      setCurrentScenario(null);
      
      // Use setTimeout to allow the UI to update before resolving the next phase
      setTimeout(() => {
        // Automatically resolve the next phase
        resolveCombatPhase();
      }, 500);
    }
  };
  
  // Reset combat
  const resetCombat = () => {
    // Reset creature stamina but keep the selected cards
    setCreature1(prev => ({ ...prev, subunits: 10 }));
    setCreature2(prev => ({ ...prev, subunits: 10 }));
    
    setCombatPhases(phases);
    setCurrentPhaseIndex(0);
    setRandomNumbers([]);
    setHits([]);
    setShowingResults(false);
    setWinner(null);
    setCombatLog([]);
    setCombatComplete(false);
    setCurrentScenario(null);
    setIsAnimating(false);
  };
  
  // Return to card selection
  const returnToSelection = () => {
    setSelectionMode(true);
  };
  
  // Render card selection screen
  if (selectionMode) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gray-100 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Jiu Jitsu Jungle Combat</h1>
        <h2 className="text-xl text-center mb-8">Select Your Fighters</h2>
        
        <div className="flex justify-between mb-8">
          <div className="w-1/2 p-4">
            <h3 className="text-lg font-bold mb-4 text-center">Fighter 1</h3>
            <div className="flex justify-center">
              <CardSelector 
                onSelectCard={handleSelectCard1} 
                position="left"
                selectedCard={creature1}
              />
            </div>
          </div>
          
          <div className="w-1/2 p-4">
            <h3 className="text-lg font-bold mb-4 text-center">Fighter 2</h3>
            <div className="flex justify-center">
              <CardSelector 
                onSelectCard={handleSelectCard2} 
                position="right"
                selectedCard={creature2}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={startCombat}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
            disabled={!creature1 || !creature2}
          >
            Start Combat
          </button>
        </div>
      </div>
    );
  }
  
  // Render combat screen
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Jiu Jitsu Jungle Combat</h1>
      
      {/* Creatures display */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center">{creature1.name}</h2>
            <div className="flex justify-center">
              <div className="w-1/2">
                <img 
                  src={creature1.image} 
                  alt={creature1.name} 
                  className="w-full h-auto rounded-lg" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-100 p-1 rounded">Attack: {creature1.attack}</div>
              <div className="bg-blue-100 p-1 rounded">Defense: {creature1.defense}</div>
              <div className="bg-yellow-100 p-1 rounded">Terrain A: +{creature1.terrainAttack}</div>
              <div className="bg-purple-100 p-1 rounded">Terrain D: +{creature1.terrainDefense}</div>
              <div className="bg-red-100 p-1 rounded col-span-2">Stamina: {creature1.subunits}/10</div>
            </div>
          </div>
        </div>
        
        <div className="w-1/2 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center">{creature2.name}</h2>
            <div className="flex justify-center">
              <div className="w-1/2">
                <img 
                  src={creature2.image} 
                  alt={creature2.name} 
                  className="w-full h-auto rounded-lg" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-100 p-1 rounded">Attack: {creature2.attack}</div>
              <div className="bg-blue-100 p-1 rounded">Defense: {creature2.defense}</div>
              <div className="bg-yellow-100 p-1 rounded">Terrain A: +{creature2.terrainAttack}</div>
              <div className="bg-purple-100 p-1 rounded">Terrain D: +{creature2.terrainDefense}</div>
              <div className="bg-red-100 p-1 rounded col-span-2">Stamina: {creature2.subunits}/10</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Combat progression */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {combatPhases.map((phase, index) => (
            <div 
              key={index} 
              className={`text-center p-2 rounded-lg w-1/4 mx-1 ${
                currentPhaseIndex === index ? 'bg-yellow-200 font-bold' : 
                phase.complete ? 'bg-gray-200' : 'bg-gray-100'
              }`}
            >
              <div className="text-xl">{phase.name}</div>
              <div className="text-sm">{phase.description}</div>
              {phase.complete && (
                <div className="mt-1">
                  {phase.bonusWinner === 1 ? (
                    <div className="text-green-600 flex items-center justify-center">
                      <Check size={16} className="mr-1" /> {creature1.name}
                    </div>
                  ) : phase.bonusWinner === 2 ? (
                    <div className="text-green-600 flex items-center justify-center">
                      <Check size={16} className="mr-1" /> {creature2.name}
                    </div>
                  ) : (
                    <div className="text-gray-600 flex items-center justify-center">
                      <X size={16} className="mr-1" /> Draw
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current phase resolution */}
      {!combatComplete && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-center mb-2">
            Phase: {combatPhases[currentPhaseIndex].name} ({combatPhases[currentPhaseIndex].description})
          </h2>
          
          {/* Combat Gauge */}
          {(isAnimating || showingResults) && (
            <CombatGauge 
              randomNumbers={randomNumbers}
              probability1={combatLog[currentPhaseIndex]?.p1}
              probability2={combatLog[currentPhaseIndex]?.p2}
              isActive={isAnimating || showingResults}
            />
          )}
          
          {/* Scenario Display */}
          {showingResults && currentScenario && (
            <ScenarioDisplay 
              scenario={currentScenario}
              fighter1Name={creature1.name}
              fighter2Name={creature2.name}
              phaseWinner={combatLog[currentPhaseIndex].phaseWinner}
            />
          )}
          
          {!showingResults ? (
            <div className="text-center">
              <button 
                onClick={resolveCombatPhase}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isAnimating}
              >
                {isAnimating ? "Resolving..." : "Resolve Combat"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-2 rounded">
                <h3 className="font-bold text-center">{creature1.name}</h3>
                <div className="mb-2">
                  <div className="text-sm">Hit Probability: {(combatLog[currentPhaseIndex].p1 * 100).toFixed(0)}%</div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-4" 
                      style={{ width: `${combatLog[currentPhaseIndex].p1 * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {randomNumbers[0] && randomNumbers[0].map((num, i) => (
                    <div 
                      key={i} 
                      className={`p-1 text-center text-sm rounded ${
                        num < combatLog[currentPhaseIndex].p1 ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    >
                      {num.toFixed(2)}
                    </div>
                  ))}
                </div>
                
                <div className="text-center font-bold">
                  Hits: {hits[0]} / 6
                </div>
              </div>
              
              <div className="border p-2 rounded">
                <h3 className="font-bold text-center">{creature2.name}</h3>
                <div className="mb-2">
                  <div className="text-sm">Hit Probability: {(combatLog[currentPhaseIndex].p2 * 100).toFixed(0)}%</div>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-4" 
                      style={{ width: `${combatLog[currentPhaseIndex].p2 * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {randomNumbers[1] && randomNumbers[1].map((num, i) => (
                    <div 
                      key={i} 
                      className={`p-1 text-center text-sm rounded ${
                        num < combatLog[currentPhaseIndex].p2 ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    >
                      {num.toFixed(2)}
                    </div>
                  ))}
                </div>
                
                <div className="text-center font-bold">
                  Hits: {hits[1]} / 6
                </div>
              </div>
              
              <div className="col-span-2 text-center mt-2">
                <div className="font-bold mb-2">
                  {combatLog[currentPhaseIndex].phaseWinner === 1 ? 
                    `${creature1.name} wins this phase!` :
                   combatLog[currentPhaseIndex].phaseWinner === 2 ? 
                    `${creature2.name} wins this phase!` :
                    'This phase is a draw!'}
                </div>
                
                {currentPhaseIndex < 3 ? (
                  <button 
                    onClick={nextPhase}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mx-auto"
                  >
                    Next Phase <ArrowRight size={16} className="ml-1" />
                  </button>
                ) : (
                  <div className="text-lg font-bold text-purple-700">Combat Complete!</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Combat results */}
      {combatComplete && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">Combat Results</h2>
          
          <div className="text-center text-xl mb-4">
            {winner === 1 ? 
              <div className="text-green-600">{creature1.name} is victorious!</div> :
             winner === 2 ? 
              <div className="text-green-600">{creature2.name} is victorious!</div> :
              <div className="text-yellow-600">The match ends in a draw!</div>
            }
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="font-bold">{creature1.name}</div>
              <div className="text-red-600">
                Remaining Stamina: {creature1.subunits}/10
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-bold">{creature2.name}</div>
              <div className="text-red-600">
                Remaining Stamina: {creature2.subunits}/10
              </div>
            </div>
          </div>
          
          <div className="text-center flex justify-center space-x-4">
            <button 
              onClick={resetCombat}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              New Combat
            </button>
            
            <button 
              onClick={returnToSelection}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Change Fighters
            </button>
          </div>
        </div>
      )}
      
      {/* Combat log */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Combat Log</h2>
        
        <div className="text-sm">
          {combatLog.map((entry, index) => {
            // Get the correct phase name for this entry
            const phaseNames = ["Takedown", "Passing", "Pinning", "Submission"];
            const phaseName = phaseNames[entry.phase];
            
            // Get the winner name
            const winnerName = entry.phaseWinner === 1 ? creature1.name : 
                              entry.phaseWinner === 2 ? creature2.name : "No one";
            
            // Get the loser name
            const loserName = entry.phaseWinner === 1 ? creature2.name : 
                             entry.phaseWinner === 2 ? creature1.name : "No one";
            
            return (
              <div key={index} className="mb-2 p-2 border-b">
                <div className="font-bold">
                  Phase {index+1}: {combatPhases[index].name} ({combatPhases[index].description})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    {creature1.name}: {entry.hits1} hits (p={entry.p1.toFixed(2)})
                  </div>
                  <div>
                    {creature2.name}: {entry.hits2} hits (p={entry.p2.toFixed(2)})
                  </div>
                </div>
                <div>
                  Result: {entry.phaseWinner === 1 ? 
                    `${creature1.name} wins` : 
                    entry.phaseWinner === 2 ? 
                    `${creature2.name} wins` : 
                    'Draw'}
                  {entry.scenario && (
                    <div className="mt-1 pl-4 border-l-2 border-blue-300">
                      <div className="font-semibold">{phaseName} Phase:</div>
                      <div>{winnerName} executes {entry.scenario.name}: {entry.scenario.description.replace('the opponent', loserName)}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JJJCombat;
