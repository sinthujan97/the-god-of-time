"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "playing" | "done";

type RunResult = {
  runNumber: number; date: string; stageReached: number; apples: number;
  solved: number; attempted: number; answerLog: boolean[];
};
type SavedData = {
  totalRuns: number; bestApples: number; bestStage: number; history: RunResult[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN  = "#52C4A0";
const GOLD   = "#F0A830";
const RED    = "#E87C7C";
const LS_KEY = "chronal-arborist-v1";
const TOTAL_TIME = 600;

const STAGE_NAMES = [
  "The Chrono-Seed",       "The Emergent Radicle",  "The First Cotyledon",
  "The Temporal Plumule",  "The Quantum Sapling",   "The Ironwood Branching",
  "The Verdant Canopy",    "The Ancestral Blossom", "The Pollinated Ovary",
  "The Golden Maturity ✨",
];

// ─── Puzzles (easy – intuitive ordering, no deep knowledge required) ──────────

const PUZZLES: [string, string, string][] = [
  // Nature sequences
  ["A caterpillar hatches from an egg", "The caterpillar spins itself into a cocoon", "A butterfly bursts free from the cocoon"],
  ["A tiny seed is planted in the soil", "A green sprout pushes through the dirt", "A tall flower blooms in the sunlight"],
  ["Dark clouds gather in the sky", "Heavy rain pours down on the earth", "A bright rainbow arches after the storm"],
  ["An egg sits warm in a nest", "A chick pecks its way through the shell", "The chick grows into a full-grown hen"],
  ["A small blossom opens on the apple tree", "A tiny green apple begins to form", "A big red apple falls from the branch"],
  ["A seed drifts on the wind", "The seed lands and roots into the ground", "A towering oak stands where it landed"],
  ["Snowflakes fall and settle on the ground", "Ice and snow begin to melt in the warm sun", "Flowers push through the soft spring earth"],

  // Daily life sequences
  ["The sun rises over the horizon at dawn", "The sun sits high in the midday sky", "The sun dips below the horizon at dusk"],
  ["Flour, eggs, and butter are measured out", "The batter is mixed and poured into a tin", "A golden cake comes out of the oven"],
  ["Coffee beans are roasted dark and fragrant", "Hot water is poured through the grounds", "A fresh cup of coffee sits ready to drink"],
  ["Grapes hang heavy on the vine in autumn", "The grapes are picked and crushed for juice", "Wine rests in barrels, slowly maturing"],
  ["A candle is lit as the evening begins", "The candle burns low through the night", "The candle flickers out before the morning"],
  ["A photo is taken on a sunny afternoon", "The photo is developed and printed on paper", "The printed photo is placed in a frame on the wall"],

  // Human life stages
  ["A newborn baby takes its very first breath", "A toddler wobbles and takes its first steps", "A child runs and plays freely in the park"],
  ["A child learns to ride a bike with training wheels", "A teenager passes their driving test", "An adult buys their very first car"],
  ["Two strangers meet and go on a first date", "The couple get engaged after falling in love", "Friends and family gather to celebrate their wedding"],
  ["A student finishes their last exam of the year", "The student anxiously waits for results to arrive", "The student opens the envelope and reads their grade"],
  ["An athlete trains every morning before sunrise", "The athlete competes in the big championship race", "The athlete stands on the podium holding a gold medal"],

  // Very obvious historical – huge time gaps
  ["Dinosaurs roam a lush prehistoric Earth", "Early humans hunt with simple stone tools", "Astronauts walk on the surface of the Moon"],
  ["Ancient Egyptians build the great pyramids", "The Roman Empire conquers most of Europe", "The Second World War comes to an end"],
  ["People travel everywhere by horse and cart", "Steam-powered trains cross entire continents", "Jet planes carry passengers across the Atlantic in hours"],
  ["Hunters gather around a fire in a cave", "Farmers grow wheat in the first villages", "Merchants trade goods in bustling ancient cities"],
  ["The first wheel is carved from a log", "The printing press spreads knowledge across Europe", "The internet connects billions of people worldwide"],
  ["Humans write messages on clay tablets", "Letters are carried by messengers on horseback", "Emails are sent instantly to the other side of the world"],

  // Technology – clearly ordered
  ["A telegraph sends the first long-distance message", "A telephone call is made for the first time", "A text message pings on a pocket-sized smartphone"],
  ["Silent black-and-white films flicker in theaters", "Colour television sets arrive in living rooms", "Viewers stream any show they want on a laptop"],
  ["Vinyl records spin on a turntable in the living room", "Cassette tapes let music play in the car", "Earbuds stream millions of songs from the cloud"],
  ["A hand-written letter is sealed and posted", "A fax machine sends pages across a phone line", "A video call connects two people face-to-face in real time"],
  ["The first photographs are blurry and take hours to expose", "Colour film cameras become affordable for families", "Digital cameras let people snap and share a photo in seconds"],

  // Simple cause-and-effect
  ["A chef cracks an egg into a hot pan", "The clear egg white turns bright white", "A perfectly fried egg sits on the plate"],
  ["A bowler runs up and releases the ball", "The ball skids fast down the polished lane", "The ball strikes the pins with a loud crash"],
  ["A gardener waters a dry, wilting plant", "The plant perks up and new leaves unfold", "The plant flowers and fills the room with scent"],
  ["A chef chops vegetables and meat", "Everything simmers together in a big pot", "A steaming bowl of soup is ladled and served"],
  ["An author has an idea and begins to write", "The manuscript is edited and sent to a publisher", "The finished book appears on shelves in the bookshop"],

  // Seasons
  ["Bare branches stand silent in the winter frost", "Pink and white blossoms burst open in spring", "Crisp leaves of red and gold carpet the autumn ground"],
  ["A river begins as a tiny mountain spring", "The river widens as it flows through the valley", "The river empties into the broad blue ocean"],

  // Simple modern life
  ["A musician writes a song in a small bedroom", "The song is recorded in a studio with headphones on", "Millions of people stream the song on their phones"],
  ["A chef plants herbs in a pot on the windowsill", "The herbs grow tall and fragrant in the sun", "Fresh herbs are snipped into a bubbling pot of soup"],
  ["A player kicks off and the game begins", "The score remains tied deep into the second half", "A last-minute goal wins the match for the home team"],
  ["A pilot checks the plane before the flight", "The plane accelerates and lifts off the runway", "Passengers arrive and collect their bags at the carousel"],
];

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const EMPTY: SavedData = { totalRuns: 0, bestApples: 0, bestStage: 0, history: [] };
function loadData(): SavedData { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "null") ?? EMPTY; } catch { return EMPTY; } }
function saveData(d: SavedData) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} }

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Tree SVG — 10 beautiful cumulative stages ────────────────────────────────

const APPLE_POSITIONS = [
  { x: 88,  y: 148 }, { x: 192, y: 148 },
  { x: 118, y: 128 }, { x: 162, y: 128 },
  { x: 140, y: 112 }, { x: 72,  y: 164 },
  { x: 208, y: 164 }, { x: 106, y: 140 },
  { x: 174, y: 140 }, { x: 140, y: 152 },
  { x: 96,  y: 172 }, { x: 184, y: 172 },
  { x: 130, y: 120 }, { x: 150, y: 120 },
];

function TreeSVG({ stage, appleCount }: { stage: number; appleCount: number }) {
  const cx = 140;
  const gy = 296;
  const isGolden = stage >= 9;

  // Colour palette shifts gold at stage 9
  const trunkDark    = isGolden ? "#7A4A00" : "#4A2C0A";
  const trunkMid     = isGolden ? "#B87800" : "#7B5220";
  const trunkLight   = isGolden ? "#D4A020" : "#A07840";
  const leafDeep     = isGolden ? "#A06A00" : "#145A30";
  const leafMid      = isGolden ? "#C88A10" : "#1E7A40";
  const leafBright   = isGolden ? "#E8A820" : "#2A9A55";
  const leafLight    = isGolden ? "#F8CC50" : "#42BC70";
  const leafHighlight= isGolden ? "#FFE070" : "#60D888";
  const groundBase   = isGolden ? "#140900" : "#080502";
  const groundSurf   = isGolden ? "#2E1800" : "#120900";
  const grassCol     = isGolden ? "#6A4500" : "#164A14";
  const bloomCol     = "#D060C0";
  const fruitUnripe  = "#2A8840";

  const show  = (s: number): React.CSSProperties => ({ opacity: stage >= s ? 1 : 0, transition: "opacity 0.75s ease" });
  const showAt = (s: number): React.CSSProperties => ({ opacity: stage === s ? 1 : 0, transition: "opacity 0.65s ease" });
  const showFrom = (lo: number, hi: number): React.CSSProperties => ({ opacity: stage >= lo && stage <= hi ? 1 : 0, transition: "opacity 0.65s ease" });

  return (
    <svg viewBox="0 48 280 268" className="w-full h-full select-none" aria-hidden>
      <defs>
        <radialGradient id="cag-goldglow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#F0B830" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F0B830" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cag-trunk-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={trunkDark} />
          <stop offset="38%"  stopColor={trunkLight} />
          <stop offset="100%" stopColor={trunkDark} />
        </linearGradient>
        <radialGradient id="cag-leaf-r" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={leafHighlight} stopOpacity="1" />
          <stop offset="100%" stopColor={leafDeep} stopOpacity="1" />
        </radialGradient>
        <filter id="cag-softshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={leafDeep} floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ── Golden atmosphere (stage 9) ── */}
      <g style={{ opacity: isGolden ? 1 : 0, transition: "opacity 1.2s" }}>
        <ellipse cx={cx} cy={gy - 110} rx={130} ry={118} fill="url(#cag-goldglow)" />
      </g>

      {/* ── Ground ── */}
      <rect x="0" y={gy} width="280" height="44" fill={groundBase} />
      <path d={`M 0 ${gy} Q 68 ${gy - 3} 140 ${gy} Q 212 ${gy + 3} 280 ${gy} L 280 ${gy + 5} L 0 ${gy + 5} Z`}
            fill={groundSurf} />
      {/* Soil texture */}
      <ellipse cx="75"  cy={gy + 13} rx="6"  ry="2.5" fill={groundSurf} opacity="0.7" />
      <ellipse cx="165" cy={gy + 20} rx="8"  ry="2.5" fill={groundSurf} opacity="0.5" />
      <ellipse cx="220" cy={gy + 11} rx="5"  ry="2"   fill={groundSurf} opacity="0.6" />
      <ellipse cx="45"  cy={gy + 22} rx="4"  ry="2"   fill={groundSurf} opacity="0.5" />

      {/* ── Grass tufts (stage 2+) ── */}
      <g style={show(2)}>
        {[53, 59, 65].map((x, i) => (
          <path key={`gl${i}`}
                d={`M ${x} ${gy} C ${x - 2 + i} ${gy - 9 - i} ${x - 3 + i} ${gy - 11 - i} ${x - 4 + i} ${gy - 7}`}
                stroke={grassCol} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.75 - i * 0.05} />
        ))}
        {[207, 213, 219].map((x, i) => (
          <path key={`gr${i}`}
                d={`M ${x} ${gy} C ${x + 2 - i} ${gy - 9 - i} ${x + 3 - i} ${gy - 11 - i} ${x + 4 - i} ${gy - 7}`}
                stroke={grassCol} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.75 - i * 0.05} />
        ))}
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 0 — Seed in soil
      ══════════════════════════════════════════════════════ */}
      <g style={showAt(0)}>
        {/* Glow */}
        <ellipse cx={cx} cy={gy + 15} rx={28} ry={13} fill={GOLD} opacity="0.08" style={{ filter: "blur(7px)" }} />
        {/* Seed body */}
        <ellipse cx={cx} cy={gy + 15} rx={13} ry={8} fill={trunkMid} />
        <ellipse cx={cx} cy={gy + 14} rx={10} ry={6} fill={trunkLight} />
        <ellipse cx={cx - 3} cy={gy + 12} rx={4} ry={2.5} fill="#F0C860" opacity="0.5" />
        {/* Seed crack */}
        <path d={`M ${cx} ${gy + 8} Q ${cx + 1.5} ${gy + 15} ${cx} ${gy + 22}`}
              stroke={trunkDark} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 1 — Tiny sprout
      ══════════════════════════════════════════════════════ */}
      <g style={show(1)}>
        {/* Stem */}
        <path d={`M ${cx} ${gy} C ${cx - 2} ${gy - 8} ${cx + 2} ${gy - 18} ${cx} ${gy - 25}`}
              stroke="#5CBF5C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* Left cotyledon */}
        <ellipse cx={cx - 10} cy={gy - 22} rx={11} ry={5.5} fill="#80D870"
                 transform={`rotate(-34 ${cx - 10} ${gy - 22})`} />
        <path d={`M ${cx - 3} ${gy - 20} Q ${cx - 10} ${gy - 22} ${cx - 18} ${gy - 27}`}
              stroke="#48A848" strokeWidth="0.7" fill="none" />
        {/* Right cotyledon */}
        <ellipse cx={cx + 10} cy={gy - 22} rx={11} ry={5.5} fill="#6DD060"
                 transform={`rotate(34 ${cx + 10} ${gy - 22})`} />
        <path d={`M ${cx + 3} ${gy - 20} Q ${cx + 10} ${gy - 22} ${cx + 18} ${gy - 27}`}
              stroke="#48A848" strokeWidth="0.7" fill="none" />
        {/* Growing tip */}
        <ellipse cx={cx} cy={gy - 27} rx={4.5} ry={4} fill="#9AE880" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 2 — Seedling (thicker, more leaves)
      ══════════════════════════════════════════════════════ */}
      <g style={show(2)}>
        {/* Stem thickening */}
        <path d={`M ${cx} ${gy} C ${cx - 3} ${gy - 18} ${cx + 3} ${gy - 38} ${cx} ${gy - 54}`}
              stroke={trunkMid} strokeWidth="3.8" fill="none" strokeLinecap="round" />
        {/* Leaf pair 1 */}
        <ellipse cx={cx - 18} cy={gy - 36} rx={15} ry={6.5} fill={leafBright} opacity="0.93"
                 transform={`rotate(-42 ${cx - 18} ${gy - 36})`} />
        <ellipse cx={cx + 18} cy={gy - 36} rx={15} ry={6.5} fill={leafMid}    opacity="0.93"
                 transform={`rotate(42 ${cx + 18} ${gy - 36})`} />
        {/* Midribs */}
        <path d={`M ${cx - 3} ${gy - 32} L ${cx - 28} ${gy - 44}`} stroke={leafDeep} strokeWidth="0.7" opacity="0.6" />
        <path d={`M ${cx + 3} ${gy - 32} L ${cx + 28} ${gy - 44}`} stroke={leafDeep} strokeWidth="0.7" opacity="0.6" />
        {/* Leaf pair 2 */}
        <ellipse cx={cx - 13} cy={gy - 50} rx={12} ry={5.5} fill={leafLight} opacity="0.88"
                 transform={`rotate(-30 ${cx - 13} ${gy - 50})`} />
        <ellipse cx={cx + 13} cy={gy - 50} rx={12} ry={5.5} fill={leafBright} opacity="0.88"
                 transform={`rotate(30 ${cx + 13} ${gy - 50})`} />
        {/* Tip bud */}
        <ellipse cx={cx} cy={gy - 57} rx={5.5} ry={4.5} fill={leafHighlight} opacity="0.95" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 3 — Young sapling (brown trunk, more branches)
      ══════════════════════════════════════════════════════ */}
      <g style={show(3)}>
        {/* Trunk extended */}
        <path d={`M ${cx - 1} ${gy} C ${cx - 5} ${gy - 35} ${cx + 5} ${gy - 70} ${cx} ${gy - 95}`}
              stroke="url(#cag-trunk-grad)" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Side branch left */}
        <path d={`M ${cx - 1} ${gy - 72} Q ${cx - 30} ${gy - 78} ${cx - 44} ${gy - 96}`}
              stroke={trunkMid} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Side branch right */}
        <path d={`M ${cx + 1} ${gy - 72} Q ${cx + 30} ${gy - 78} ${cx + 44} ${gy - 96}`}
              stroke={trunkMid} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Left cluster */}
        <ellipse cx={cx - 44} cy={gy - 102} rx={22} ry={13} fill={leafDeep}   opacity="0.75" style={{ filter: "url(#cag-softshadow)" }} />
        <ellipse cx={cx - 50} cy={gy - 108} rx={16} ry={10} fill={leafMid}    opacity="0.88" />
        <ellipse cx={cx - 36} cy={gy - 104} rx={13} ry={9}  fill={leafBright} opacity="0.85" />
        {/* Right cluster */}
        <ellipse cx={cx + 44} cy={gy - 102} rx={22} ry={13} fill={leafDeep}   opacity="0.75" style={{ filter: "url(#cag-softshadow)" }} />
        <ellipse cx={cx + 50} cy={gy - 108} rx={16} ry={10} fill={leafMid}    opacity="0.88" />
        <ellipse cx={cx + 36} cy={gy - 104} rx={13} ry={9}  fill={leafBright} opacity="0.85" />
        {/* Top tuft */}
        <ellipse cx={cx} cy={gy - 100} rx={18} ry={12} fill={leafBright} opacity="0.9" />
        <ellipse cx={cx} cy={gy - 108} rx={12} ry={9}  fill={leafLight}  opacity="0.85" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 4 — Sapling with roots
      ══════════════════════════════════════════════════════ */}
      <g style={show(4)}>
        {/* Surface roots */}
        <path d={`M ${cx - 7} ${gy} Q ${cx - 34} ${gy + 6} ${cx - 52} ${gy + 4}`}
              stroke={trunkDark} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d={`M ${cx + 7} ${gy} Q ${cx + 34} ${gy + 6} ${cx + 52} ${gy + 4}`}
              stroke={trunkDark} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d={`M ${cx - 5} ${gy} Q ${cx - 20} ${gy + 16} ${cx - 26} ${gy + 22}`}
              stroke={trunkDark} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.65" />
        <path d={`M ${cx + 5} ${gy} Q ${cx + 20} ${gy + 16} ${cx + 26} ${gy + 22}`}
              stroke={trunkDark} strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.65" />
        {/* Taller trunk section */}
        <path d={`M ${cx - 2} ${gy} C ${cx - 7} ${gy - 50} ${cx + 7} ${gy - 100} ${cx} ${gy - 138}`}
              stroke="url(#cag-trunk-grad)" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* More branches */}
        <path d={`M ${cx - 2} ${gy - 105} Q ${cx - 38} ${gy - 116} ${cx - 60} ${gy - 144}`}
              stroke={trunkMid} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 2} ${gy - 105} Q ${cx + 38} ${gy - 116} ${cx + 60} ${gy - 144}`}
              stroke={trunkMid} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={`M ${cx} ${gy - 118} Q ${cx} ${gy - 142} ${cx} ${gy - 160}`}
              stroke={trunkMid} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Expanded canopy base */}
        <ellipse cx={cx - 62} cy={gy - 152} rx={26} ry={16} fill={leafDeep}   opacity="0.72" style={{ filter: "url(#cag-softshadow)" }} />
        <ellipse cx={cx - 68} cy={gy - 160} rx={20} ry={13} fill={leafMid}    opacity="0.86" />
        <ellipse cx={cx - 54} cy={gy - 156} rx={16} ry={11} fill={leafBright} opacity="0.82" />
        <ellipse cx={cx + 62} cy={gy - 152} rx={26} ry={16} fill={leafDeep}   opacity="0.72" style={{ filter: "url(#cag-softshadow)" }} />
        <ellipse cx={cx + 68} cy={gy - 160} rx={20} ry={13} fill={leafMid}    opacity="0.86" />
        <ellipse cx={cx + 54} cy={gy - 156} rx={16} ry={11} fill={leafBright} opacity="0.82" />
        <ellipse cx={cx}      cy={gy - 166} rx={22} ry={15} fill={leafBright} opacity="0.9"  />
        <ellipse cx={cx}      cy={gy - 174} rx={15} ry={11} fill={leafLight}  opacity="0.85" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 5 — Ironwood (thick trunk + more branching)
      ══════════════════════════════════════════════════════ */}
      <g style={show(5)}>
        {/* Thick main trunk */}
        <path d={`M ${cx - 3} ${gy} C ${cx - 9} ${gy - 52} ${cx + 9} ${gy - 108} ${cx} ${gy - 158}`}
              stroke="url(#cag-trunk-grad)" strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* Bark texture lines */}
        <path d={`M ${cx - 5} ${gy - 20} Q ${cx - 3} ${gy - 45} ${cx - 5} ${gy - 70}`}
              stroke={trunkDark} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
        <path d={`M ${cx + 5} ${gy - 30} Q ${cx + 3} ${gy - 55} ${cx + 5} ${gy - 80}`}
              stroke={trunkDark} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* Lower left branch */}
        <path d={`M ${cx - 4} ${gy - 122} Q ${cx - 52} ${gy - 132} ${cx - 76} ${gy - 168}`}
              stroke={trunkMid} strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Lower right branch */}
        <path d={`M ${cx + 4} ${gy - 122} Q ${cx + 52} ${gy - 132} ${cx + 76} ${gy - 168}`}
              stroke={trunkMid} strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Upper left sub-branch */}
        <path d={`M ${cx - 76} ${gy - 168} Q ${cx - 90} ${gy - 186} ${cx - 84} ${gy - 204}`}
              stroke={trunkLight} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Upper right sub-branch */}
        <path d={`M ${cx + 76} ${gy - 168} Q ${cx + 90} ${gy - 186} ${cx + 84} ${gy - 204}`}
              stroke={trunkLight} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Top branch */}
        <path d={`M ${cx} ${gy - 148} Q ${cx} ${gy - 178} ${cx} ${gy - 198}`}
              stroke={trunkLight} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 6 — Verdant Canopy (rich dense crown)
      ══════════════════════════════════════════════════════ */}
      <g style={show(6)}>
        {/* Deep shadow mass */}
        <ellipse cx={cx}      cy={gy - 192} rx={88}  ry={68}  fill={leafDeep}   opacity="0.55" style={{ filter: "url(#cag-softshadow)" }} />
        {/* Mid-layer masses */}
        <ellipse cx={cx - 72} cy={gy - 182} rx={36}  ry={24}  fill={leafDeep}   opacity="0.78" />
        <ellipse cx={cx - 60} cy={gy - 204} rx={30}  ry={20}  fill={leafMid}    opacity="0.82" />
        <ellipse cx={cx + 72} cy={gy - 182} rx={36}  ry={24}  fill={leafDeep}   opacity="0.78" />
        <ellipse cx={cx + 60} cy={gy - 204} rx={30}  ry={20}  fill={leafMid}    opacity="0.82" />
        {/* Bright upper masses */}
        <ellipse cx={cx - 44} cy={gy - 214} rx={28}  ry={18}  fill={leafBright} opacity="0.86" />
        <ellipse cx={cx + 44} cy={gy - 214} rx={28}  ry={18}  fill={leafBright} opacity="0.86" />
        <ellipse cx={cx}      cy={gy - 218} rx={34}  ry={22}  fill={leafBright} opacity="0.90" />
        <ellipse cx={cx}      cy={gy - 200} rx={28}  ry={18}  fill={leafMid}    opacity="0.72" />
        {/* Light highlight clusters */}
        <ellipse cx={cx - 24} cy={gy - 228} rx={20}  ry={13}  fill={leafLight}  opacity="0.82" />
        <ellipse cx={cx + 24} cy={gy - 228} rx={20}  ry={13}  fill={leafLight}  opacity="0.82" />
        <ellipse cx={cx}      cy={gy - 234} rx={22}  ry={14}  fill={leafLight}  opacity="0.88" />
        {/* Rim highlight specular */}
        <ellipse cx={cx - 58} cy={gy - 196} rx={14}  ry={9}   fill={leafHighlight} opacity="0.55" />
        <ellipse cx={cx + 58} cy={gy - 196} rx={14}  ry={9}   fill={leafHighlight} opacity="0.55" />
        <ellipse cx={cx}      cy={gy - 240} rx={14}  ry={8}   fill={leafHighlight} opacity="0.65" />
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 7 — Ancestral Blossom (pink flowers)
      ══════════════════════════════════════════════════════ */}
      <g style={showAt(7)}>
        {/* Blossom clusters replacing/overlaying leaf tips */}
        {[
          [-72, -182, 13], [-60, -207, 10], [-44, -218, 11], [-22, -230, 9],
          [  0, -240, 13], [ 22, -230, 9],  [ 44, -218, 11], [ 60, -207, 10],
          [ 72, -182, 13], [  0, -200, 10], [-30, -210, 8],  [ 30, -210, 8],
        ].map(([dx, dy, r], i) => (
          <g key={i}>
            <circle cx={cx + dx} cy={gy + dy} r={r + 3} fill={bloomCol} opacity="0.18" />
            <circle cx={cx + dx} cy={gy + dy} r={r}     fill={bloomCol} opacity="0.88" />
            {/* Petal detail */}
            <circle cx={cx + dx - r * 0.4} cy={gy + dy - r * 0.4} r={r * 0.28} fill="#F0A0E0" opacity="0.6" />
            <circle cx={cx + dx} cy={gy + dy} r={r * 0.3} fill="#FFF0F8" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 8 — Pollinated Ovary (green unripe fruit)
      ══════════════════════════════════════════════════════ */}
      <g style={showAt(8)}>
        {[
          [-70, -178, 9], [-56, -204, 8], [-40, -214, 9], [-18, -228, 7],
          [  0, -238, 10],[  18, -228, 7],[ 40, -214, 9], [ 56, -204, 8],
          [ 70, -178, 9], [  0, -198, 8], [-28, -208, 7], [ 28, -208, 7],
        ].map(([dx, dy, r], i) => (
          <g key={i}>
            <circle cx={cx + dx} cy={gy + dy} r={r} fill={fruitUnripe} opacity="0.92" />
            <circle cx={cx + dx - r * 0.35} cy={gy + dy - r * 0.35} r={r * 0.32} fill="#60CC70" opacity="0.55" />
            {/* Tiny stem */}
            <path d={`M ${cx + dx} ${gy + dy - r} C ${cx + dx + 2} ${gy + dy - r - 5} ${cx + dx + 4} ${gy + dy - r - 4} ${cx + dx + 3} ${gy + dy - r - 2}`}
                  stroke="#1A5A20" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* ══════════════════════════════════════════════════════
          STAGE 9 — Golden Maturity (golden orbs + ripe apples)
      ══════════════════════════════════════════════════════ */}
      <g style={{ opacity: isGolden ? 1 : 0, transition: "opacity 0.9s" }}>
        {/* Golden orbs in canopy */}
        {[
          [-70, -178, 10], [-56, -204, 8], [-40, -214, 10], [-18, -228, 8],
          [  0, -238, 11], [ 18, -228, 8], [ 40, -214, 10], [ 56, -204, 8],
          [ 70, -178, 10], [  0, -198, 9], [-28, -208, 7],  [ 28, -208, 7],
        ].map(([dx, dy, r], i) => (
          <g key={i}>
            <circle cx={cx + dx} cy={gy + dy} r={r + 2} fill={GOLD} opacity="0.12" style={{ filter: "blur(3px)" }} />
            <circle cx={cx + dx} cy={gy + dy} r={r}     fill={GOLD} opacity="0.94" />
            <circle cx={cx + dx - r * 0.35} cy={gy + dy - r * 0.35} r={r * 0.3} fill="#FFEE90" opacity="0.55" />
          </g>
        ))}
        {/* Ripe apples */}
        {APPLE_POSITIONS.slice(0, Math.min(appleCount, APPLE_POSITIONS.length)).map((ap, i) => (
          <g key={`a${i}`}>
            {/* Apple shadow */}
            <circle cx={ap.x} cy={ap.y + 2} r={12} fill="#000" opacity="0.18" style={{ filter: "blur(3px)" }} />
            {/* Apple body */}
            <circle cx={ap.x} cy={ap.y} r={11} fill="#CC2A2A" opacity="0.97" />
            <circle cx={ap.x} cy={ap.y} r={11} fill="url(#cag-apple-grad)" opacity="0.6" />
            {/* Specular highlight */}
            <ellipse cx={ap.x - 3.5} cy={ap.y - 3.5} rx={4} ry={3} fill="white" opacity="0.28" transform={`rotate(-25 ${ap.x - 3.5} ${ap.y - 3.5})`} />
            {/* Stem + leaf */}
            <path d={`M ${ap.x} ${ap.y - 11} C ${ap.x + 4} ${ap.y - 18} ${ap.x + 8} ${ap.y - 16} ${ap.x + 5} ${ap.y - 12}`}
                  stroke="#4A2800" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx={ap.x + 6} cy={ap.y - 18} rx={5} ry={3} fill="#2A7A30" opacity="0.9"
                     transform={`rotate(30 ${ap.x + 6} ${ap.y - 18})`} />
          </g>
        ))}
      </g>
      {/* Apple gradient (defined here so it renders last) */}
      <defs>
        <radialGradient id="cag-apple-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF6060" />
          <stop offset="100%" stopColor="#880000" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ─── Ad Slot ─────────────────────────────────────────────────────────────────

function AdSlot({ height = 64, className = "" }: { height?: number; className?: string }) {
  return (
    <div className={`w-full rounded-lg border border-dashed border-border flex items-center justify-center ${className}`}
         style={{ height, background: "var(--bg-surface)" }}>
      <span className="font-sans text-[8px] font-semibold text-text-faint uppercase tracking-[0.22em]">Advertisement</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChronalArborist() {
  const [hydrated,  setHydrated]  = useState(false);
  const [saved,     setSaved]     = useState<SavedData>(EMPTY);

  useEffect(() => { setSaved(loadData()); setHydrated(true); }, []);

  const [phase,       setPhase]       = useState<Phase>("idle");
  const [growth,      setGrowth]      = useState(0);
  const [apples,      setApples]      = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(TOTAL_TIME);
  const [arrangement, setArrangement] = useState<number[]>([0, 1, 2]);
  const [puzzleQueue, setPuzzleQueue] = useState<[string,string,string][]>([]);
  const [qIdx,        setQIdx]        = useState(0);
  const [solved,      setSolved]      = useState(0);
  const [attempted,   setAttempted]   = useState(0);
  const [answerLog,   setAnswerLog]   = useState<boolean[]>([]);
  const [feedback,    setFeedback]    = useState<"correct" | "wrong" | null>(null);
  const [showModal,   setShowModal]   = useState(false);

  const phaseRef   = useRef<Phase>("idle");
  const growthRef  = useRef(0);
  const applesRef  = useRef(0);
  const solvedRef  = useRef(0);
  const attemptRef = useRef(0);
  const logRef     = useRef<boolean[]>([]);

  const stage     = Math.min(9, Math.floor(growth / 10));
  const isHarvest = growth >= 100;

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { endGame(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  });

  const buildQueue = (): [string,string,string][] =>
    [...PUZZLES].sort(() => Math.random() - 0.5);

  const getArrangement = (): number[] => {
    const a = [0, 1, 2];
    for (let i = 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startGame = () => {
    const q = buildQueue();
    growthRef.current  = 0;
    applesRef.current  = 0;
    solvedRef.current  = 0;
    attemptRef.current = 0;
    logRef.current     = [];
    phaseRef.current   = "playing";
    setPuzzleQueue(q);
    setQIdx(0);
    setArrangement(getArrangement());
    setGrowth(0);
    setApples(0);
    setSolved(0);
    setAttempted(0);
    setAnswerLog([]);
    setTimeLeft(TOTAL_TIME);
    setFeedback(null);
    setShowModal(false);
    setPhase("playing");
  };

  const endGame = useCallback(() => {
    phaseRef.current = "done";
    setPhase("done");
    setShowModal(true);

    const cur = loadData();
    const newRun: RunResult = {
      runNumber:    cur.totalRuns + 1,
      date:         todayKey(),
      stageReached: Math.min(9, Math.floor(growthRef.current / 10)),
      apples:       applesRef.current,
      solved:       solvedRef.current,
      attempted:    attemptRef.current,
      answerLog:    logRef.current.slice(-20),
    };
    const nd: SavedData = {
      totalRuns:  cur.totalRuns + 1,
      bestApples: Math.max(cur.bestApples, applesRef.current),
      bestStage:  Math.max(cur.bestStage, newRun.stageReached),
      history:    [newRun, ...cur.history].slice(0, 30),
    };
    saveData(nd);
    setSaved(nd);
  }, []);

  const submitPuzzle = () => {
    if (feedback || phase !== "playing") return;

    const correct = arrangement[0] === 0 && arrangement[1] === 1 && arrangement[2] === 2;
    const isHarv  = growthRef.current >= 100;

    if (correct) {
      solvedRef.current += 1;
      setSolved(p => p + 1);
      if (isHarv) {
        applesRef.current += 1;
        setApples(p => p + 1);
      } else {
        const ng = Math.min(100, growthRef.current + 10);
        growthRef.current = ng;
        setGrowth(ng);
      }
    } else {
      if (isHarv) {
        applesRef.current = Math.max(0, applesRef.current - 1);
        setApples(p => Math.max(0, p - 1));
      } else {
        const ng = Math.max(0, growthRef.current - 10);
        growthRef.current = ng;
        setGrowth(ng);
      }
    }
    attemptRef.current += 1;
    setAttempted(p => p + 1);
    logRef.current = [...logRef.current, correct];
    setAnswerLog(prev => [...prev, correct]);
    setFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      setFeedback(null);
      const next = (qIdx + 1) % puzzleQueue.length;
      setQIdx(next);
      setArrangement(getArrangement());
    }, 700);
  };

  const moveCard = (pos: number, dir: -1 | 1) => {
    const target = pos + dir;
    if (target < 0 || target > 2) return;
    const a = [...arrangement];
    [a[pos], a[target]] = [a[target], a[pos]];
    setArrangement(a);
  };

  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    if (!saved.history[0]) return;
    const r = saved.history[0];
    const emojiRow = r.answerLog.map(b => b ? "🟩" : "🟥").join("") || "—";
    const stageStr = r.stageReached >= 9 ? "Stage 10 Golden Maturity 🌳" : `Stage ${r.stageReached + 1}`;
    const text = [
      `🍎 Chronal Arborist Run #${r.runNumber} | The God of Time`,
      ``,
      r.stageReached >= 9
        ? `I cultivated the Seed of Eons into a Golden Orchard!`
        : `I grew the Seed to ${stageStr}.`,
      ``,
      `⏱️ Time Survived: 10:00`,
      `⚡ Correct: ${r.solved} / ${r.attempted} attempts`,
      `🍏 Chronal Apples Yielded: ${r.apples}`,
      ``,
      emojiRow,
      ``,
      `Can you grow further? thegodoftime.com/games/chronal-arborist`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [saved]);

  const currentPuzzle = puzzleQueue[qIdx] ?? PUZZLES[0];
  const stageColor    = isHarvest ? GOLD : GREEN;

  function fmt(s: number) { return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* Stats bar */}
      <div className="w-full border-b border-border" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-text-faint">Best Apples</span>
              <span className="font-mono text-base font-bold text-text-primary">{saved.bestApples}</span>
            </div>
            <div className="w-px h-3.5 bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-text-faint">Runs</span>
              <span className="font-mono text-sm font-bold" style={{ color: GOLD }}>{saved.totalRuns}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-text-faint tabular-nums">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pt-6 pb-16 max-w-2xl mx-auto w-full">

        {/* Title */}
        <div className="mb-5 text-center">
          <h1 className="font-display font-light italic text-text-primary leading-tight mb-1"
              style={{ fontSize: "clamp(1.7rem, 5vw, 2.5rem)", letterSpacing: "-0.025em" }}>
            Chronal Arborist
          </h1>
          <p className="font-sans text-sm text-text-muted">
            Grow the Seed of Eons. Order events. Harvest time.
          </p>
        </div>

        {/* ── IDLE ─────────────────────────────────────────────────────────── */}
        {phase === "idle" && (
          <>
            <AdSlot height={56} className="mb-6" />

            <div className="w-full mb-5 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border overflow-hidden"
                 style={{ background: "var(--bg-card)", height: 260, boxShadow: "var(--shadow-offset-lg) var(--shadow-color)" }}>
              <TreeSVG stage={0} appleCount={0} />
            </div>

            {hydrated && saved.history.length > 0 && (
              <div className="w-full mb-5 flex gap-2 flex-wrap">
                {saved.history.slice(0, 8).map((r, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-[var(--radius-sm)] border-[length:var(--border-width)] border-border text-center"
                       style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-sm) var(--shadow-color)" }}
                       title={`Run #${r.runNumber} · ${r.apples} apples`}>
                    <span className="text-base">{r.stageReached >= 9 ? "🌳" : "🌱"}</span>
                    <span className="font-mono text-[9px] text-text-faint tabular-nums">{r.apples}🍎</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={startGame}
                    className="w-full h-16 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-bold text-base uppercase tracking-[0.12em] cursor-pointer select-none mb-4"
                    style={{ background: GREEN, color: "#06060A", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
                    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}>
              Plant the Seed
            </button>

            <p className="font-sans text-xs text-text-faint text-center mb-6">
              10-minute session · Put events in order · Grow through 10 stages · Harvest Chronal Apples
            </p>

            <div className="w-full border-t border-border pt-6">
              <p className="font-display font-light italic text-text-primary mb-4 leading-tight"
                 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
                How to Play
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "A 10-minute timer begins. Three events appear in a jumbled order.",
                  "Use the ▲ ▼ buttons to arrange them: earliest event on top, latest on bottom.",
                  "Correct answer: Growth +10%. Watch the tree grow through 10 beautiful stages.",
                  "Wrong answer: Growth −10%. The tree shrinks back a stage!",
                  "Reach 100% to unlock The Golden Maturity and the Harvest Phase.",
                  "In harvest mode, each correct answer yields a Chronal Apple 🍎. Wrong = one rots.",
                  "When the timer expires your run is saved. Beat your best apple count!",
                ].map((t, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-mono text-[9px] text-text-faint mt-0.5 flex-shrink-0 w-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-sm text-text-muted leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <AdSlot height={80} className="mt-8" />
          </>
        )}

        {/* ── PLAYING ──────────────────────────────────────────────────────── */}
        {phase === "playing" && (
          <>
            {/* Timer + harvest indicator */}
            <div className="w-full mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold tabular-nums"
                      style={{ color: timeLeft <= 60 ? RED : timeLeft <= 120 ? GOLD : "var(--text-primary)" }}>
                  {fmt(timeLeft)}
                </span>
                {isHarvest && (
                  <span className="px-2.5 py-0.5 rounded-none font-sans text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: `color-mix(in srgb, ${GOLD} 15%, transparent)`, color: GOLD, border: `1px solid color-mix(in srgb, ${GOLD} 30%, transparent)` }}>
                    🌟 Harvest Unlocked
                  </span>
                )}
              </div>
              {isHarvest && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🍎</span>
                  <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: GOLD }}>{apples}</span>
                </div>
              )}
            </div>

            {/* Tree */}
            <div className="w-full rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border overflow-hidden mb-3 relative"
                 style={{ background: "var(--bg-card)", height: 280, boxShadow: "var(--shadow-offset-lg) var(--shadow-color)" }}>
              <TreeSVG stage={stage} appleCount={apples} />
              <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-none font-sans text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: "rgba(0,0,0,0.55)", color: stageColor, backdropFilter: "blur(4px)" }}>
                  {STAGE_NAMES[stage]}
                </span>
              </div>
            </div>

            {/* Growth meter */}
            <div className="w-full mb-1 flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex-1 h-2.5 rounded-sm transition-all duration-500"
                     style={{ background: i < stage ? stageColor : i === stage ? `color-mix(in srgb, ${stageColor} 40%, var(--border))` : "var(--border)" }} />
              ))}
            </div>
            <p className="font-sans text-[9px] text-text-faint text-center mb-4 tabular-nums">
              {growth}% · Stage {stage + 1} of 10 · {solved} correct · {attempted - solved} wrong
            </p>

            <AdSlot height={52} className="mb-4" />

            {/* Puzzle cards */}
            <div className="w-full mb-4">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-text-faint mb-2">
                Arrange first → last (top to bottom)
              </p>
              <div className="flex flex-col gap-1.5">
                {arrangement.map((eventIdx, pos) => (
                  <div key={`${qIdx}-${pos}`}
                       className="flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] transition-colors duration-150"
                       style={{
                         background: feedback === "correct"
                           ? `color-mix(in srgb, ${GREEN} 9%, var(--bg-card))`
                           : feedback === "wrong"
                           ? `color-mix(in srgb, ${RED} 9%, var(--bg-card))`
                           : "var(--bg-card)",
                         borderColor: feedback === "correct" ? GREEN : feedback === "wrong" ? RED : "var(--border)",
                         boxShadow: "var(--shadow-offset-sm) var(--shadow-color)",
                       }}>
                    <span className="font-mono text-[10px] font-bold flex-shrink-0 w-5 text-center"
                          style={{ color: pos === 0 ? "var(--text-faint)" : pos === 2 ? stageColor : "var(--text-faint)" }}>
                      {pos === 0 ? "1ST" : pos === 2 ? "3RD" : "2ND"}
                    </span>
                    <span className="font-sans text-sm text-text-primary leading-snug flex-1">
                      {currentPuzzle[eventIdx]}
                    </span>
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button onClick={() => moveCard(pos, -1)} disabled={pos === 0 || !!feedback}
                              className="w-7 h-6 rounded flex items-center justify-center font-bold text-xs cursor-pointer select-none disabled:opacity-20 disabled:cursor-default transition-all hover:bg-bg-surface active:scale-90"
                              style={{ color: "var(--text-muted)" }}>
                        ▲
                      </button>
                      <button onClick={() => moveCard(pos, 1)} disabled={pos === 2 || !!feedback}
                              className="w-7 h-6 rounded flex items-center justify-center font-bold text-xs cursor-pointer select-none disabled:opacity-20 disabled:cursor-default transition-all hover:bg-bg-surface active:scale-90"
                              style={{ color: "var(--text-muted)" }}>
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={submitPuzzle} disabled={!!feedback}
                    className="w-full h-14 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-black text-base uppercase tracking-[0.15em] cursor-pointer disabled:opacity-50 disabled:cursor-default select-none"
                    style={{
                      background: feedback === "correct" ? GREEN : feedback === "wrong" ? RED : stageColor,
                      color: "#06060A",
                      boxShadow: "var(--shadow-offset-lg) var(--shadow-color)",
                      animation: !feedback ? "ca-pulse 1.8s ease-in-out infinite" : "none",
                      transition: "transform 120ms ease, box-shadow 120ms ease",
                    }}
                    onMouseEnter={e => { if (!feedback) { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
                    onMouseDown={e => { if (!feedback) { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; } }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}>
              {feedback === "correct" ? "✓ Perfect Order!" : feedback === "wrong" ? "✗ Wrong Order!" : "⚡ Lock In Order"}
            </button>
          </>
        )}

        {phase === "done" && !showModal && (
          <div className="w-full flex items-center justify-center py-20">
            <span className="font-display font-light italic text-2xl text-text-muted">Sealing the timeline…</span>
          </div>
        )}
      </div>

      {/* ── RESULT MODAL ──────────────────────────────────────────────────────── */}
      {showModal && saved.history[0] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: "rgba(6,6,10,0.88)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border overflow-hidden"
               style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-xl) var(--shadow-color)" }}>
            <div className="px-6 pt-6 pb-4 border-b border-border text-center"
                 style={{ background: `color-mix(in srgb, ${stageColor} 5%, var(--bg-card))` }}>
              <div className="text-5xl mb-2">{saved.history[0].stageReached >= 9 ? "🌳" : "🌱"}</div>
              <p className="font-display font-light italic text-text-primary mb-1"
                 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", letterSpacing: "-0.02em" }}>
                {saved.history[0].stageReached >= 9
                  ? "Timeline Anchored — Golden Orchard!"
                  : `Timeline Stable — ${STAGE_NAMES[saved.history[0].stageReached]}`}
              </p>
              <p className="font-sans text-xs text-text-faint">
                🍎 The God of Time: Chronal Arborist Run #{saved.history[0].runNumber}
              </p>
            </div>

            <div className="px-6 py-4 grid grid-cols-3 gap-3">
              {[
                { label: "Apples Yielded", value: saved.history[0].apples.toString(), emoji: "🍏" },
                { label: "Correct",        value: `${saved.history[0].solved}/${saved.history[0].attempted}`, emoji: "⚡" },
                { label: "Stage Reached",  value: `${saved.history[0].stageReached + 1}/10`, emoji: "🌿" },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 py-3 rounded-[var(--radius-sm)] border-[length:var(--border-width)] border-border"
                     style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-offset-sm) var(--shadow-color)" }}>
                  <span className="text-lg">{emoji}</span>
                  <span className="font-mono text-base font-bold text-text-primary tabular-nums">{value}</span>
                  <span className="font-sans text-[9px] text-text-faint uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>

            {saved.history[0].answerLog.length > 0 && (
              <div className="px-6 pb-2">
                <div className="flex flex-wrap gap-1 justify-center">
                  {saved.history[0].answerLog.map((b, i) => (
                    <span key={i} className="text-sm">{b ? "🟩" : "🟥"}</span>
                  ))}
                </div>
              </div>
            )}

            <AdSlot height={64} className="mx-6 mb-4" />

            <div className="px-6 pb-6 flex flex-col gap-2">
              <button onClick={handleShare}
                      className="w-full h-11 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-semibold text-sm cursor-pointer"
                      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}>
                {copied ? "Copied to clipboard ✓" : "Share result →"}
              </button>
              <button onClick={() => { setShowModal(false); setPhase("idle"); }}
                      className="w-full h-11 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-bold text-sm cursor-pointer"
                      style={{ background: GREEN, color: "#06060A", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}>
                Plant Again
              </button>
            </div>
          </div>
        </div>
      )}

      {phase !== "playing" && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-8">
          <AdSlot height={80} />
        </div>
      )}

      <style>{`
        @keyframes ca-pulse {
          0%, 100% { box-shadow: 4px 4px 0px 0px rgba(82,196,160,0.35); }
          50%       { box-shadow: 4px 4px 0px 0px rgba(82,196,160,0.35), 0 0 28px rgba(82,196,160,0.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ca-pulse"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
