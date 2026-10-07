// src/services/nasaAPI.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project NEXUS-FRONTIER — NASA Exoplanet Archive API
// Real NASA data fetch (কোনো mock নেই, কোনো API key নেই)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// ⚠️ PROXY NOTE:
// Browser থেকে সরাসরি NASA TAP endpoint-এ fetch করলে CORS error আসে।
// তাই Vite dev server-এর proxy ব্যবহার করছি।
// vite.config.js-এ এই proxy setup থাকতে হবে:
//
//   server: {
//     proxy: {
//       '/nasa': {
//         target: 'https://exoplanetarchive.ipac.caltech.edu',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/nasa/, ''),
//       },
//     },
//   }
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Proxy-র মাধ্যমে relative path (host বাদ)
// Actual hit হবে: https://exoplanetarchive.ipac.caltech.edu/TAP/sync
const NASA_TAP_PATH = '/nasa/TAP/sync';

// ─────────────────────────────────────────────────────────
// ১. fetchPlanetData(planetName)
// NASA Exoplanet Archive থেকে একটা গ্রহের ডেটা আনে
// ─────────────────────────────────────────────────────────
//
// Return shape:
// {
//   name:        'Mars',
//   mass:        0.107,        // pl_masse  (Earth mass)
//   radius:      0.532,        // pl_rade   (Earth radius)
//   temperature: 210,          // pl_eqt    (Kelvin)
//   insolation:  0.43,         // pl_insol  (Earth flux)
//   starTemp:    5778,         // st_teff   (Kelvin)
//   gravity:     3.71,         // derived   (m/s²)
//   raw:         { ... }       // original NASA row (debug-এর জন্য)
// }
//
// ─────────────────────────────────────────────────────────

export async function fetchPlanetData(planetName) {
  // ── ইনপুট ভ্যালিডেশন ─────────────────────────────────
  if (!planetName || typeof planetName !== 'string') {
    throw new Error('fetchPlanetData: planetName must be a non-empty string');
  }

  // SQL injection এড়াতে single quote escape করি
  const safeName = planetName.replace(/'/g, "''");

  // ── TAP query তৈরি ────────────────────────────────────
  // pscomppars = Planetary Systems Composite Parameters
  const query = `
    SELECT pl_name, pl_masse, pl_rade, pl_eqt, pl_insol, st_teff
    FROM pscomppars
    WHERE pl_name = '${safeName}'
  `.trim();

  // ── URL encode করে query string বানাই ─────────────────
  const params = new URLSearchParams({
    query: query,
    format: 'json',
  });

  // ✅ Proxy path + encoded params (host বাদ)
  const url = `${NASA_TAP_PATH}?${params.toString()}`;

  // ── Fetch with error handling ─────────────────────────
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    // HTTP error check
    if (!response.ok) {
      throw new Error(
        `NASA TAP HTTP error: ${response.status} ${response.statusText}`
      );
    }

    // JSON parse
    const data = await response.json();

    // NASA result array খালি হলে মানে গ্রহটা পাওয়া যায়নি
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(
        `Planet "${planetName}" not found in NASA Exoplanet Archive`
      );
    }

    // প্রথম row নিই (pl_name unique)
    const row = data[0];

    // ── Raw values বের করি (null-safe) ────────────────
    const massEarth = numOrNull(row.pl_masse);   // Earth mass
    const radiusEarth = numOrNull(row.pl_rade);  // Earth radius
    const temperature = numOrNull(row.pl_eqt);   // Kelvin
    const insolation = numOrNull(row.pl_insol);  // Earth flux (S⊕)
    const starTemp = numOrNull(row.st_teff);     // Kelvin

    // ── Gravity derive করি (m/s²) ─────────────────────
    // g = G * M / R²  →  Earth-এর তুলনায়:
    // g_planet = (massEarth / radiusEarth²) * 9.81
    let gravity = null;
    if (massEarth !== null && radiusEarth !== null && radiusEarth > 0) {
      gravity = (massEarth / (radiusEarth * radiusEarth)) * 9.81;
    }

    // ── Final normalized object ──────────────────────
    return {
      name: row.pl_name,
      mass: massEarth,
      radius: radiusEarth,
      temperature,
      insolation,
      starTemp,
      gravity,
      raw: row, // original NASA response (debug/fallback-এর জন্য)
    };
  } catch (err) {
    console.error(`[NASA API] Failed to fetch "${planetName}":`, err.message);
    throw err; // caller কে জানাই (UI তে fallback দেখাবে)
  }
}

// ─────────────────────────────────────────────────────────
// ২. Helper — safe number parser
// NASA অনেক সময় null বা empty string দেয়
// ─────────────────────────────────────────────────────────

function numOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// ─────────────────────────────────────────────────────────
// ৩. Bonus — একাধিক গ্রহ একসাথে fetch
// 6 Planets screen-এ কাজে লাগবে
// ─────────────────────────────────────────────────────────

export async function fetchMultiplePlanets(planetNames = []) {
  if (!Array.isArray(planetNames) || planetNames.length === 0) {
    throw new Error(
      'fetchMultiplePlanets: planetNames must be a non-empty array'
    );
  }

  // Promise.allSettled — একটা fail করলেও বাকিগুলো আসবে
  const results = await Promise.allSettled(
    planetNames.map((name) => fetchPlanetData(name))
  );

  // সফল + ব্যর্থ আলাদা করি
  return results.map((res, idx) => {
    if (res.status === 'fulfilled') {
      return { name: planetNames[idx], data: res.value, error: null };
    }
    return { name: planetNames[idx], data: null, error: res.reason.message };
  });
}

// ─────────────────────────────────────────────────────────
// ৪. Export
// ─────────────────────────────────────────────────────────

export { NASA_TAP_PATH };