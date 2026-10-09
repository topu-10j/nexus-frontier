// ============ BUILDINGS DATA ============
// 6 Buildings with Game Effects

export const buildings = [
  {
    id: 'oxygen',
    name: 'Oxygen Generator',
    icon: '🫧',
    color: '#4FC3F7',
    cost: 800,
    oxygen: 30,        // Oxygen +30
    power: -20,        // Power -20
    description: 'Generates breathable oxygen',
  },
  {
    id: 'power',
    name: 'Power Grid',
    icon: '🔋',
    color: '#FFD54F',
    cost: 600,
    power: 40,         // Power +40
    description: 'Produces colony electricity',
  },
  {
    id: 'thermal',
    name: 'Thermal Regulator',
    icon: '🌡️',
    color: '#FF7043',
    cost: 700,
    temp: 25,          // Temperature +25
    power: -15,        // Power -15
    description: 'Controls temperature',
  },
  {
    id: 'shield',
    name: 'Magnetic Shield',
    icon: '🛡️',
    color: '#9575CD',
    cost: 900,
    radiation: -30,    // Radiation -30
    power: -25,        // Power -25
    description: 'Protects from radiation',
  },
  {
    id: 'bio',
    name: 'Bio-Dome',
    icon: '🌱',
    color: '#66BB6A',
    cost: 1200,
    oxygen: 10,        // Oxygen +10
    power: -15,        // Power -15
    description: 'Grows food supply',
  },
  {
    id: 'water',
    name: 'Water Extractor',
    icon: '💧',
    color: '#4DD0E1',
    cost: 800,
    water: 40,         // Water +40
    power: -20,        // Power -20
    description: 'Extracts water from soil',
  },
];