// src/services/nexaAI.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project NEXUS-FRONTIER — NEXA AI Service
// DeepSeek API দিয়ে in-game AI companion বানানো
// NEXA গেম স্টেট বুঝে বাচ্চাদের ছোট friendly টিপ দেবে
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

// ─────────────────────────────────────────────────────────
// ১. System Prompt — NEXA-র personality
// এটা সবসময় fixed থাকবে, প্রতিটা request-এ পাঠাবে
// ─────────────────────────────────────────────────────────

const NEXA_SYSTEM_PROMPT = `
You are NEXA, a friendly AI companion inside a Mars colonization 
survival game for children (ages 10-14) built for NASA Space Apps 
Challenge 2026.

Your job:
- Give ONE short, actionable survival tip based on the current game state.
- Speak like a helpful astronaut buddy — warm, encouraging, never scary.
- Maximum 2 short sentences. Total under 30 words.
- Always include ONE relevant emoji at the start or end.
- Use simple English that a 10-year-old understands.
- Never mention you are an AI or a language model.
- Never ask questions back — just give the tip.

Focus on the MOST critical resource that is low:
- If oxygen < 30 → warn about oxygen first
- Else if power < 30 → warn about power
- Else if radiation > 70 → warn about radiation shielding
- Else if temperature outside safe range → warn about temperature
- Else → encourage them to build or explore

Respond with ONLY the tip. No intro, no "NEXA:", no quotes.
`.trim();

// ─────────────────────────────────────────────────────────
// ২. askNEXA(gameState)
// গেম স্টেট নিয়ে DeepSeek-এ পাঠায়, ছোট টিপ ফেরত দেয়
// ─────────────────────────────────────────────────────────
//
// gameState shape:
// {
//   planet:      'Mars',
//   oxygen:      45,      // 0-100 %
//   power:       30,      // 0-100 %
//   temperature: -60,     // Celsius
//   radiation:   65,      // 0-100 (higher = worse)
//   buildings:   ['Habitat', 'Solar Panel'],   // optional
//   day:         3,                            // optional
// }
//
// Returns: string (the tip)
//
// ─────────────────────────────────────────────────────────

export async function askNEXA(gameState = {}) {
  // ── API key check ────────────────────────────────────
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error('[NEXA] Missing VITE_DEEPSEEK_API_KEY in .env');
    return fallbackTip(gameState); // graceful degradation
  }

  // ── gameState থেকে relevant data বের করি ─────────────
  const {
    planet = 'Mars',
    oxygen = 100,
    power = 100,
    temperature = 0,
    radiation = 0,
    buildings = [],
    day = 1,
  } = gameState;

  // ── User prompt তৈরি করি (গেম স্টেট সহ) ──────────────
  const userPrompt = `
Current game state:
- Planet: ${planet}
- Day: ${day}
- Oxygen: ${oxygen}%
- Power: ${power}%
- Outside temperature: ${temperature}°C
- Radiation level: ${radiation}%
- Buildings built: ${buildings.length > 0 ? buildings.join(', ') : 'none yet'}

Give one short survival tip for this exact situation.
  `.trim();

  // ── DeepSeek API call ────────────────────────────────
  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: NEXA_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 80,     // ছোট response
        temperature: 0.8,   // একটু creative, কিন্তু consistent
      }),
    });

    // ── HTTP error handling ────────────────────────────
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(
        `DeepSeek HTTP ${response.status}: ${response.statusText} ${errText}`
      );
    }

    // ── Response parse ─────────────────────────────────
    const data = await response.json();

    const tip =
      data?.choices?.[0]?.message?.content?.trim();

    if (!tip) {
      throw new Error('DeepSeek returned empty response');
    }

    // ── Sanitize — extra quotes/intro বাদ দিই ──────────
    return sanitizeTip(tip);

  } catch (err) {
    console.error('[NEXA] API call failed:', err.message);
    // গেম যেন না থামে — fallback টিপ দিই
    return fallbackTip(gameState);
  }
}

// ─────────────────────────────────────────────────────────
// ৩. sanitizeTip() — AI response পরিষ্কার করি
// মাঝে মাঝে AI "NEXA:" বা quotes দেয়, সেগুলো বাদ
// ─────────────────────────────────────────────────────────

function sanitizeTip(text) {
  return text
    .replace(/^["'`]+|["'`]+$/g, '')          // শুরু/শেষের quotes
    .replace(/^(NEXA|Tip|Advice)\s*:\s*/i, '') // "NEXA:" prefix
    .replace(/\s+/g, ' ')                      // extra whitespace
    .trim();
}

// ─────────────────────────────────────────────────────────
// ৪. fallbackTip() — API fail হলে deterministic টিপ
// Priority: oxygen > power > radiation > temperature > default
// ─────────────────────────────────────────────────────────

function fallbackTip(gameState = {}) {
  const {
    oxygen = 100,
    power = 100,
    radiation = 0,
    temperature = 0,
  } = gameState;

  if (oxygen < 30) {
    return '🚨 Oxygen is critical, Commander! Check your life support right now.';
  }
  if (power < 30) {
    return '⚡ Power is running low — build another solar panel before nightfall.';
  }
  if (radiation > 70) {
    return '☢️ Radiation is high outside! Stay inside the habitat or add shielding.';
  }
  if (temperature < -40) {
    return '🥶 It is freezing out there — keep your suit heaters on, Commander.';
  }
  if (temperature > 40) {
    return '🔥 Extreme heat outside! Stay in the shade and hydrate your suit.';
  }
  return '🛠️ Colony is stable — great job! Time to build something new.';
}

// ─────────────────────────────────────────────────────────
// ৫. Export
// ─────────────────────────────────────────────────────────

export { DEEPSEEK_ENDPOINT, MODEL, NEXA_SYSTEM_PROMPT };