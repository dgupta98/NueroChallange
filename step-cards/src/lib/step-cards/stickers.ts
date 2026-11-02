/**
 * Sticker books (research doc 30: "a train sticker on completion").
 * A student picks the sticker they are working for before starting a set of cards,
 * from fun categories (trains, dinosaurs, sea creatures…). Finishing the cards adds it
 * to their sticker book. No points, no streaks, no ranking, nothing is ever taken
 * away — the book only grows.
 *
 * Pictures are ARASAAC pictograms (Sergio Palao, CC BY-NC-SA), checked by hand.
 */

export interface Sticker {
  id: string;
  name: string;
  pictogramId: number;
  tags: string[];
}

export interface StickerCategory {
  id: string;
  label: string;
  /** Sticker used as the cover picture of this book. */
  coverId: string;
  stickers: Sticker[];
}

type Raw = [string, number, string[]];

function category(id: string, label: string, raw: Raw[]): StickerCategory {
  const stickers = raw.map(([name, pictogramId, tags]) => ({
    id: `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    pictogramId,
    tags,
  }));
  return { id, label, coverId: stickers[0]!.id, stickers };
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  category("trains", "Trains", [
    ["Passenger train", 2603, ["Long", "Rails"]],
    ["Bullet train", 21399, ["Super fast"]],
    ["Underground train", 2472, ["Tunnels"]],
    ["Tram", 2602, ["City", "Rails"]],
    ["Toy train", 5094, ["Colourful"]],
    ["Cable car", 22119, ["Up high"]],
    ["Tourist train", 29008, ["Sightseeing"]],
  ]),
  category("dinosaurs", "Dinosaurs", [
    ["T. rex", 34981, ["Big teeth"]],
    ["Triceratops", 34593, ["Three horns"]],
    ["Brachiosaurus", 34441, ["Long neck"]],
    ["Velociraptor", 39827, ["Quick"]],
    ["Iguanodon", 34983, ["Plant eater"]],
    ["Baryonyx", 34439, ["Fish eater"]],
    ["Dacentrurus", 34595, ["Spiky back"]],
    ["Dinosaur nest", 34987, ["Eggs"]],
  ]),
  category("sea", "Sea creatures", [
    ["Whale", 2268, ["Huge"]],
    ["Dolphin", 2732, ["Jumps"]],
    ["Octopus", 3379, ["8 arms"]],
    ["Shark", 2589, ["Fins"]],
    ["Sea turtle", 10241, ["Swims far"]],
    ["Crab", 2312, ["Claws"]],
    ["Starfish", 3310, ["5 arms"]],
    ["Jellyfish", 2920, ["Floaty"]],
    ["Seahorse", 2672, ["Curly tail"]],
  ]),
  category("space", "Space", [
    ["Rocket", 2344, ["Blast off"]],
    ["Astronaut", 4569, ["Space walk"]],
    ["Planet", 2829, ["Rings"]],
    ["Moon", 2933, ["Night"]],
    ["Sun", 7252, ["Hot", "Bright"]],
    ["Star", 2752, ["Twinkle"]],
    ["Comet", 2711, ["Long tail"]],
    ["Flying saucer", 7191, ["Mystery"]],
    ["Saturn", 10300, ["Rings"]],
  ]),
  category("vehicles", "Big vehicles", [
    ["Fire engine", 4925, ["Ladder"]],
    ["Police car", 3426, ["Lights"]],
    ["Ambulance", 6899, ["Helps people"]],
    ["Tractor", 2600, ["Farm"]],
    ["Digger", 2390, ["Building"]],
    ["Bus", 2262, ["Many seats"]],
    ["Helicopter", 7126, ["Flies"]],
    ["Airplane", 6924, ["Flies"]],
    ["Racing car", 5070, ["Fast"]],
  ]),
  category("wild", "Wild animals", [
    ["Lion", 25187, ["Mane"]],
    ["Elephant", 2372, ["Trunk"]],
    ["Giraffe", 2437, ["Tall"]],
    ["Monkey", 2477, ["Climbs"]],
    ["Tiger", 2590, ["Stripes"]],
    ["Zebra", 2324, ["Stripes"]],
    ["Panda", 2869, ["Bamboo"]],
    ["Kangaroo", 2313, ["Hops"]],
    ["Koala", 2954, ["Sleepy"]],
  ]),
  category("pets", "Pets", [
    ["Dog", 7202, ["Friendly"]],
    ["Cat", 7114, ["Soft"]],
    ["Rabbit", 2351, ["Long ears"]],
    ["Horse", 2294, ["Gallops"]],
    ["Guinea pig", 3346, ["Small"]],
    ["Parrot", 2934, ["Talks"]],
    ["Tortoise", 26503, ["Slow"]],
  ]),
  category("food", "Yummy food", [
    ["Pizza", 2527, ["Cheesy"]],
    ["Ice cream", 39483, ["Cold"]],
    ["Cake", 2502, ["Sweet"]],
    ["Apple", 2462, ["Crunchy"]],
    ["Banana", 2530, ["Yellow"]],
    ["Strawberry", 2400, ["Red"]],
    ["Cookie", 8312, ["Crunchy"]],
    ["Popcorn", 5534, ["Pop"]],
    ["Watermelon", 2557, ["Juicy"]],
  ]),
  category("music", "Music", [
    ["Guitar", 2417, ["Strings"]],
    ["Drum", 2578, ["Boom"]],
    ["Piano", 2521, ["Keys"]],
    ["Trumpet", 2607, ["Toot"]],
    ["Violin", 2615, ["Strings"]],
    ["Xylophone", 2616, ["Colourful"]],
    ["Maracas", 2463, ["Shake"]],
    ["Microphone", 2912, ["Sing"]],
    ["Recorder", 2396, ["Blow"]],
  ]),
  category("sports", "Sports", [
    ["Football", 16743, ["Kick"]],
    ["Basketball", 10166, ["Bounce"]],
    ["Bicycle", 6935, ["Ride"]],
    ["Skateboard", 2507, ["Roll"]],
    ["Tennis", 10158, ["Racket"]],
    ["Swimming", 25038, ["Splash"]],
    ["Kite", 2350, ["Windy"]],
    ["Roller skates", 2506, ["Roll"]],
    ["Trophy", 3162, ["Shiny"]],
  ]),
];

export const DEFAULT_CATEGORY = "trains";

const BY_ID = new Map(STICKER_CATEGORIES.flatMap((c) => c.stickers.map((s) => [s.id, s] as const)));

export function stickerById(id: string | null | undefined): Sticker | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function categoryOf(stickerId: string): StickerCategory | undefined {
  return STICKER_CATEGORIES.find((c) => c.stickers.some((s) => s.id === stickerId));
}

export function findCategory(id: string | null | undefined): StickerCategory {
  return STICKER_CATEGORIES.find((c) => c.id === id) ?? STICKER_CATEGORIES.find((c) => c.id === DEFAULT_CATEGORY)!;
}

export function stickerImage(sticker: Sticker) {
  return `https://api.arasaac.org/v1/pictograms/${sticker.pictogramId}?color=true`;
}

/** How many of each sticker a student has collected. */
export function collectionCounts(stickerIds: (string | null | undefined)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of stickerIds) if (id && BY_ID.has(id)) counts[id] = (counts[id] ?? 0) + 1;
  return counts;
}

/** "Surprise me": the first sticker in the category not collected yet, or the next one round again. */
export function surpriseSticker(categoryId: string, counts: Record<string, number>): Sticker {
  const cat = findCategory(categoryId);
  const fresh = cat.stickers.find((s) => !counts[s.id]);
  if (fresh) return fresh;
  const owned = cat.stickers.reduce((sum, s) => sum + (counts[s.id] ?? 0), 0);
  return cat.stickers[owned % cat.stickers.length]!;
}

/** Sticker for finished cards from before students could choose: same position always gives the same one. */
export function legacySticker(index: number, categoryId: string): Sticker {
  const set = findCategory(categoryId).stickers;
  const i = ((Math.floor(index) % set.length) + set.length) % set.length;
  return set[i]!;
}

/** Steps a student did on their own: each help request counts against one step. Never below zero. */
export function stepsOnOwn(cards: { current_step: number; help_count: number }[]) {
  return cards.reduce((sum, c) => sum + Math.max(0, c.current_step - c.help_count), 0);
}
