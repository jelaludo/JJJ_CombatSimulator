// Combat scenarios organized by phase number for clarity
const combatScenarios = {
  // PHASE 1: TAKEDOWN PHASE
  takedown: {
    success: [
      { name: "Double Leg Takedown", description: "A powerful shot drives through both legs!" },
      { name: "Single Leg Takedown", description: "A swift attack to one leg breaks the balance!" },
      { name: "Hip Throw", description: "A beautiful hip throw sends the opponent flying!" },
      { name: "Ankle Pick", description: "A sneaky grab at the ankle causes the fall!" },
      { name: "Blast Double", description: "An explosive takedown drives straight through!" }
    ],
    draw: [
      { name: "Clinch Battle", description: "Both fighters remain locked in the clinch!" },
      { name: "Scramble Position", description: "A wild scramble leads to no advantage!" },
      { name: "Mutual Guard Pull", description: "Both fighters pull guard simultaneously!" }
    ],
    failure: [
      { name: "Sprawl Defense", description: "A perfect sprawl stops the takedown cold!" },
      { name: "Takedown Counter", description: "The takedown attempt is expertly defended!" },
      { name: "Sprawl and Spin", description: "A quick sprawl denies the takedown attempt!" }
    ]
  },

  // PHASE 2: GUARD PASSING PHASE
  passing: {
    success: [
      { name: "Knee Slice Pass", description: "The knee slices through the guard like butter!" },
      { name: "Toreando Pass", description: "A swift bullfighter pass gets around the legs!" },
      { name: "Double Under Pass", description: "Using double underhooks to power through guard!" },
      { name: "Long Step Pass", description: "A technical long step secures the pass!" },
      { name: "X-Pass", description: "A quick x-pass breaks through the defense!" }
    ],
    draw: [
      { name: "Half Guard Battle", description: "The pass is stopped at half guard!" },
      { name: "Guard Recovery", description: "The guard is quickly recovered!" },
      { name: "Leg Entanglement", description: "Both fighters get tangled in a leg battle!" }
    ],
    failure: [
      { name: "Guard Retention", description: "Excellent guard retention prevents the pass!" },
      { name: "Sweep Counter", description: "The passing attempt leads to a sweep attempt!" },
      { name: "Technical Stand-up", description: "A technical stand-up nullifies the pass!" }
    ]
  },

  // PHASE 3: PINNING PHASE
  pinning: {
    successAfterPass: [
      { name: "Side Control", description: "Heavy side control pressure pins the opponent!" },
      { name: "Mount Position", description: "A strong mount position is established!" },
      { name: "North-South Pin", description: "Controlling from the north-south position!" },
      { name: "Knee on Belly", description: "Knee on belly pressure keeps opponent pinned!" }
    ],
    successAfterFailedPass: [
      { name: "Back Control", description: "Taking the back with both hooks in!" },
      { name: "Turtle Control", description: "Maintaining control over the turtle position!" },
      { name: "Front Headlock", description: "Securing a tight front headlock position!" }
    ],
    draw: [
      { name: "Transitional Battle", description: "Both fighters transition without advantage!" },
      { name: "Mutual Scramble", description: "Neither fighter can establish control!" },
      { name: "Stalemate Position", description: "The position reaches a stalemate!" }
    ],
    failure: [
      { name: "Pin Defense", description: "The pin attempt is skillfully defended!" },
      { name: "Escape Artist", description: "A beautiful escape from the pin attempt!" },
      { name: "Technical Stand", description: "Standing up to avoid being pinned!" }
    ]
  },

  // PHASE 4: SUBMISSION PHASE
  submission: {
    successAfterPin: [
      { name: "Armbar", description: "An armbar is locked in for the finish!" },
      { name: "Triangle Choke", description: "A triangle choke secures the victory!" },
      { name: "Kimura Lock", description: "The kimura grip leads to submission!" },
      { name: "Rear Naked Choke", description: "A rear naked choke ends the fight!" }
    ],
    successAfterFailedPin: [
      { name: "Heel Hook", description: "A lightning-fast heel hook appears!" },
      { name: "Flying Armbar", description: "An unexpected flying armbar succeeds!" },
      { name: "Guillotine Choke", description: "A quick guillotine finds its mark!" }
    ],
    draw: [
      { name: "Submission Defense", description: "The submission attempt is defended!" },
      { name: "Escape Sequence", description: "A series of submission attempts are escaped!" },
      { name: "Time Expires", description: "Time runs out during the submission battle!" }
    ],
    failure: [
      { name: "Submission Counter", description: "The submission attempt is reversed!" },
      { name: "Defense Mastery", description: "Perfect defense stops all submission attempts!" },
      { name: "Survival Skills", description: "Surviving an onslaught of submission attempts!" }
    ]
  }
};

export default combatScenarios; 