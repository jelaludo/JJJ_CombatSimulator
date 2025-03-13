import React, { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

const JJJCombat = () => {
  // Initial creature stats
  const [creature1, setCreature1] = useState({
    name: "Gorilla Warrior",
    attack: 3,
    defense: 8,
    terrainAttack: 1,
    terrainDefense: 1,
    subunits: 10,
    image: "https://via.placeholder.com/230x300/3498db/ffffff?text=Gorilla+Warrior"
  });
  
  const [creature2, setCreature2] = useState({
    name: "Thunder Bull",
    attack: 7,
    defense: 2,
    terrainAttack: 1,
    terrainDefense: 1,
    subunits: 10,
    image: "https://via.placeholder.com/230x300/e74c3c/ffffff?text=Thunder+Bull"
  });
  
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
  
  // Handle combat resolution for a phase
  const resolveCombatPhase = () => {
    if (currentPhaseIndex >= combatPhases.length) return;
    
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
    
    // Update combat log
    const newLog = [
      ...combatLog,
      {
        phase: currentPhaseIndex,
        p1, p2,
        hits1, hits2,
        phaseWinner,
        damage1, damage2
      }
    ];
    setCombatLog(newLog);
    
    setShowingResults(true);
    
    // Check if combat is complete
    if (currentPhaseIndex === 3) {
      finalizeCombat(newLog);
    }
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
  
  // Move to next phase
  const nextPhase = () => {
    if (currentPhaseIndex < combatPhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setShowingResults(false);
    }
  };
  
  // Reset combat
  const resetCombat = () => {
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
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 p-4 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Jiu Jitsu Jungle Combat</h1>
      
      {/* Creatures display */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2 p-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center">{creature1.name}</h2>
            <img src={creature1.image} alt={creature1.name} className="mx-auto my-2 rounded" />
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
            <img src={creature2.image} alt={creature2.name} className="mx-auto my-2 rounded" />
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
          
          {!showingResults ? (
            <div className="text-center">
              <button 
                onClick={resolveCombatPhase}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Resolve Combat
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
          
          <div className="text-center">
            <button 
              onClick={resetCombat}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              New Combat
            </button>
          </div>
        </div>
      )}
      
      {/* Combat log */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Combat Log</h2>
        
        <div className="text-sm">
          {combatLog.map((entry, index) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JJJCombat;
