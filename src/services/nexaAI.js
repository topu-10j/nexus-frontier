const TIPS = {
  oxygenLow: [
    "Captain! Oxygen levels dropping fast. Build an Oxygen Generator!",
    "Warning — oxygen below 30%. Your crew can't breathe. Act now!",
    "Oxygen critical! Build Oxygen Generator immediately!",
  ],
  powerLow: [
    "Power grid failing, Captain! Build a Power Grid to stabilize!",
    "Warning — power below 30%. All systems at risk!",
    "Captain! Power is critical. Deploy a Power Grid now!",
  ],
  tempLow: [
    "Temperature dropping! Build a Thermal Regulator now!",
    "Cold alert! Hypothermia risk. Thermal Regulator needed!",
  ],
  radiationHigh: [
    "Radiation spiking! Build a Magnetic Shield immediately!",
    "Warning — radiation above 70%. Your crew is at risk!",
  ],
  budgetLow: [
    "Budget running low, Captain. Prioritize strategically!",
  ],
  good: [
    "All systems stable, Captain. Well done!",
    "Colony operating at optimal parameters. Keep it up!",
  ],
  start: [
    "Captain! Welcome to Mars. Build an Oxygen Generator first!",
    "First priority, Captain: Oxygen Generator. Then Power Grid.",
  ],
  disaster: {
    sandstorm: "Sandstorm incoming! Power Grid needed!",
    solarFlare: "Solar flare detected! Deploy Magnetic Shield!",
    meteor: "Meteor shower! Oxygen Generator needed!",
  },
  victory: "Mission accomplished, Captain. Colony established!",
  defeat: "Mission failed. Colony systems collapsed.",
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getNEXAMessage(state) {
  const { oxygen, power, temperature, radiation, budget, buildings } = state;
  if (buildings.length === 0) return pickRandom(TIPS.start);
  if (oxygen < 25) return pickRandom(TIPS.oxygenLow);
  if (power < 25) return pickRandom(TIPS.powerLow);
  if (temperature < 20) return pickRandom(TIPS.tempLow);
  if (radiation > 70) return pickRandom(TIPS.radiationHigh);
  if (budget < 1000) return pickRandom(TIPS.budgetLow);
  if (oxygen > 70 && power > 70 && temperature > 60 && radiation < 40) {
    return pickRandom(TIPS.good);
  }
  return null;
}

export function getDisasterMessage(type) {
  return TIPS.disaster[type] || 'Disaster detected! Take action!';
}

export function getVictoryMessage() {
  return TIPS.victory;
}

export function getDefeatMessage(reason) {
  return `Mission failed. Reason: ${reason || 'Colony systems collapsed'}.`;
}