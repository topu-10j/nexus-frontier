// src/data/ambientFacts.js
// Educational watermark facts — rotate during calm moments
// Real NASA data, kid-friendly English

export const AMBIENT_FACTS = [
  // ═══════════════════════════════════════════════════════
  // MARS FACTS
  // ═══════════════════════════════════════════════════════
  'Mars is 225 million km away from Earth.',
  'Mars is called the Red Planet because of rust in its soil.',
  'A day on Mars lasts 24 hours and 37 minutes.',
  'Mars is very cold — average temperature is -85°C.',
  'Olympus Mons on Mars is 3 times taller than Mount Everest!',
  'Mars has 2 moons: Phobos and Deimos.',
  'Gravity on Mars is only 38% of Earth gravity.',
  'Mars atmosphere is 95% carbon dioxide.',
  'Dust storms on Mars can cover the entire planet.',
  'Mars has polar ice caps made of water and dry ice.',

  // ═══════════════════════════════════════════════════════
  // SPACE & ASTRONAUTS
  // ═══════════════════════════════════════════════════════
  'The Sun is 150 million km away from Earth.',
  'Sunlight takes 8 minutes and 20 seconds to reach us.',
  'Astronauts grow 5 cm taller in space due to no gravity!',
  'The Moon is slowly moving away from Earth — 3.8 cm per year.',
  'It rains diamonds on Saturn and Jupiter!',
  'The International Space Station orbits Earth at 28,000 km/h.',
  'Jupiter has 95 known moons.',
  'A year on Mercury is only 88 Earth days.',
  'Venus is the hottest planet — 465°C!',
  'Space is completely silent — no air to carry sound.',

  // ═══════════════════════════════════════════════════════
  // NASA & MISSIONS
  // ═══════════════════════════════════════════════════════
  'NASA was founded in 1958.',
  'The Perseverance rover landed on Mars in 2021.',
  'Curiosity rover has been exploring Mars since 2012.',
  'NASA plans to send humans to Mars by the 2030s.',
  'Apollo 11 landed on the Moon on July 20, 1969.',
  '12 astronauts have walked on the Moon.',
  'NASA stands for National Aeronautics and Space Administration.',
  'The Space Launch System (SLS) is NASA\'s most powerful rocket.',

  // ═══════════════════════════════════════════════════════
  // INSPIRATIONAL
  // ═══════════════════════════════════════════════════════
  'The universe is 13.8 billion years old.',
  'There are more stars than grains of sand on Earth.',
  'You are made of stardust — elements from exploded stars.',
  'The nearest star to Earth is Proxima Centauri — 4.2 light-years away.',
  'Astronauts drink recycled water — even their own urine!',
  'One light-year is about 9.46 trillion km.',
  'Our galaxy, the Milky Way, has 100-400 billion stars.',
  'Black holes have gravity so strong, even light cannot escape.',

  // ═══════════════════════════════════════════════════════
  // MARS EXPLORATION
  // ═══════════════════════════════════════════════════════
  'Rovers on Mars are controlled from Earth with 20-minute delay.',
  'Ancient Mars had rivers, lakes, and possibly oceans.',
  'Scientists found organic molecules on Mars.',
  'Future Mars colonies will use local ice for water.',
  'Mars soil contains iron, magnesium, and calcium.',
  'Mars has the largest volcano in the solar system.',
  'A Mars day is called a "sol".',
  'Mars is half the size of Earth.',

  // ═══════════════════════════════════════════════════════
  // SPACE TECHNOLOGY
  // ═══════════════════════════════════════════════════════
  'Spacesuits cost about $12 million each.',
  'Astronauts sleep in sleeping bags strapped to walls.',
  'Satellites help us predict weather and GPS.',
  'Space telescopes like Hubble see billions of years into the past.',
  'James Webb Space Telescope launched in 2021.',
  'Solar panels power most spacecraft.',
  'Rockets burn 11,000 kg of fuel per second at liftoff.',
];

// ═══════════════════════════════════════════════════════
// ROTATION SETTINGS
// ═══════════════════════════════════════════════════════
export const FACT_ROTATION_INTERVAL = 12000; // 12 seconds per fact

// ═══════════════════════════════════════════════════════
// HELPER — get random fact
// ═══════════════════════════════════════════════════════
export const getRandomFact = (excludeText = null) => {
  const pool = excludeText
    ? AMBIENT_FACTS.filter((f) => f !== excludeText)
    : AMBIENT_FACTS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const TOTAL_FACTS = AMBIENT_FACTS.length;