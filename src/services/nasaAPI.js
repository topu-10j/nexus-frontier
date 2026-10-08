const NASA_API = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

export async function fetchPlanetData(planetName) {
  try {
    const query = `SELECT pl_name, pl_masse, pl_eqt, pl_insol, st_teff FROM pscomppars WHERE pl_name = '${planetName}'`;
    const url = `${NASA_API}?query=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('NASA API failed');
    const data = await res.json();
    return data[0] || null;
  } catch (err) {
    console.warn('NASA API error:', err);
    return null;
  }
}

export function getMarsData() {
  return {
    temperature: -85,
    gravity: 3.71,
    distance: '225M km',
    dayLength: '24.6 hours',
    source: 'NASA Mars Fact Sheet',
  };
}