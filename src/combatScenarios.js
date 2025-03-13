// Combat scenarios for different phases and outcomes
const combatScenarios = {
  takedown: {
    success: [
      { name: "Uchimata", description: "A powerful hip throw that sends the opponent flying!" },
      { name: "Ankle Pick", description: "A swift attack to the ankle, bringing the opponent down!" },
      { name: "Russian Tie", description: "Using the arm tie to control and take down the opponent!" },
      { name: "Tani Otoshi", description: "A valley drop throw executed with perfect timing!" },
      { name: "Double Leg", description: "A explosive shot to both legs, driving the opponent to the ground!" },
      { name: "Single Leg", description: "Grabbing one leg and lifting, the opponent loses balance!" },
      { name: "Seoi Nage", description: "A shoulder throw that flips the opponent over!" },
      { name: "Kata Guruma", description: "The wheel throw sends the opponent spinning through the air!" }
    ],
    draw: [
      { name: "Double Guard Pull", description: "Both fighters pull guard simultaneously, ending up on the ground!" },
      { name: "Mutual Clinch", description: "The fighters lock up in a tight clinch, neither gaining advantage!" },
      { name: "Scramble", description: "A wild scramble ensues with both fighters ending on the ground!" },
      { name: "Stalemate", description: "Neither fighter can secure a takedown in the standing position!" }
    ],
    failure: [
      { name: "Sprawl Defense", description: "A perfect sprawl shuts down the takedown attempt!" },
      { name: "Counter Balance", description: "Excellent balance prevents the takedown!" },
      { name: "Whizzer Counter", description: "The whizzer prevents the takedown and creates a scramble!" },
      { name: "Grip Fighting Win", description: "Superior grip fighting nullifies all takedown attempts!" }
    ]
  },
  
  passing: {
    success: [
      { name: "Knee Slice", description: "Slicing the knee through the guard with precision!" },
      { name: "Back Step", description: "A deceptive back step creates the perfect passing angle!" },
      { name: "Floating Pass", description: "Floating over the legs with weightless technique!" },
      { name: "Over-Under", description: "The over-under control leads to a smooth pass!" },
      { name: "Leg Drag", description: "Dragging the leg across creates an unstoppable passing sequence!" },
      { name: "Toreando Pass", description: "Bullfighter-style pass around the legs!" },
      { name: "Smash Pass", description: "Using pressure to crush through the guard!" },
      { name: "Stack Pass", description: "Stacking the opponent and walking around their guard!" }
    ],
    draw: [
      { name: "Half Guard Battle", description: "The pass is partially successful, ending in half guard!" },
      { name: "Scramble Reset", description: "A scramble leads back to a neutral position!" },
      { name: "Guard Recovery", description: "Almost passed, but the guard is recovered at the last moment!" },
      { name: "Mutual Grip Fight", description: "Both fighters grip fight to a stalemate!" }
    ],
    failure: [
      { name: "Guard Retention Mastery", description: "Incredible guard retention shuts down all passing attempts!" },
      { name: "Leg Dexterity", description: "Flexible legs create an impenetrable barrier!" },
      { name: "Frame Defense", description: "Perfect frames keep the passer at bay!" },
      { name: "Inversion Escape", description: "Inverting to escape creates an impossible passing puzzle!" }
    ]
  },
  
  pinning: {
    successAfterPass: [
      { name: "Side Control", description: "Securing a tight side control with shoulder pressure!" },
      { name: "Mount", description: "Climbing to mount and establishing dominant position!" },
      { name: "Back Control", description: "Taking the back with hooks in for complete control!" },
      { name: "Knee on Belly", description: "Applying knee on belly pressure that's unbearable!" },
      { name: "North-South", description: "Controlling from north-south position with heavy pressure!" },
      { name: "Kesa Gatame", description: "The scarf hold immobilizes the opponent completely!" },
      { name: "Crucifix", description: "Securing the crucifix position for maximum control!" }
    ],
    successAfterFailedPass: [
      { name: "Leg Entanglement", description: "Entangling the legs for a dangerous lower body control!" },
      { name: "Berimbolo Control", description: "Using the berimbolo to take the back in a surprising sequence!" },
      { name: "Reverse De La Riva Control", description: "Establishing dominant reverse De La Riva control!" },
      { name: "X-Guard Sweep to Control", description: "Sweeping from X-guard to a dominant position!" },
      { name: "Deep Half Control", description: "Controlling from deep half guard with underhooks!" }
    ],
    draw: [
      { name: "Scramble Position", description: "A dynamic scramble leads to an unclear position!" },
      { name: "Mutual Clinch on Ground", description: "Both fighters clinch on the ground, neutralizing each other!" },
      { name: "50/50 Position", description: "The 50/50 position creates a symmetrical stalemate!" },
      { name: "Turtle Stall", description: "Turtling up prevents any further advancement!" }
    ],
    failure: [
      { name: "Escape Artist", description: "Incredible escapes prevent any control from being established!" },
      { name: "Scramble King", description: "Constant scrambling makes pinning impossible!" },
      { name: "Defensive Wizard", description: "Defensive wizardry nullifies all pinning attempts!" },
      { name: "Explosive Movement", description: "Explosive hip movement prevents any control!" }
    ]
  },
  
  submission: {
    successAfterPin: [
      { name: "Arm Bar", description: "Isolating and hyperextending the arm for a clean submission!" },
      { name: "Triangle Choke", description: "Locking up a triangle choke that cuts off all blood flow!" },
      { name: "Kimura", description: "The shoulder lock is applied with perfect leverage!" },
      { name: "Rear Naked Choke", description: "Sinking in the rear naked choke for the finish!" },
      { name: "Guillotine", description: "A tight guillotine choke ends the fight!" },
      { name: "Americana", description: "The americana shoulder lock is applied with crushing pressure!" },
      { name: "D'arce Choke", description: "Threading the arm through for a deep d'arce choke!" },
      { name: "Ezekiel Choke", description: "The sleeve choke comes out of nowhere for the finish!" }
    ],
    successAfterFailedPin: [
      { name: "Kamikaze Leg Lock", description: "A last-ditch leg lock attempt pays off with a submission!" },
      { name: "Jumping Armbar", description: "Leaping into a flying armbar for a spectacular finish!" },
      { name: "Desperation Guillotine", description: "A hail mary guillotine choke secures the victory!" },
      { name: "Scramble Choke", description: "Finding a neck during the scramble leads to a quick tap!" },
      { name: "Surprise Wristlock", description: "An unexpected wristlock appears from nowhere!" }
    ],
    draw: [
      { name: "Submission Attempt Stalemate", description: "Submission attempts from both sides lead to a stalemate!" },
      { name: "Mutual Pain Compliance", description: "Both fighters apply painful techniques, neither willing to submit!" },
      { name: "Time Expires", description: "Time runs out during an intense submission battle!" },
      { name: "Double Submission Attempt", description: "Both fighters attempt submissions simultaneously!" }
    ],
    failure: [
      { name: "Submission Defense Mastery", description: "Incredible submission defense prevents any finish!" },
      { name: "Survived But Dominated", description: "Dominated but survived the submission onslaught!" },
      { name: "Stamina Drain", description: "Lost a lot of stamina but survived the submission attempts!" },
      { name: "Defensive Posture", description: "Defensive posturing makes submissions impossible to secure!" }
    ]
  }
};

export default combatScenarios; 