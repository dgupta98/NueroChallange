import { describe, expect, it } from "vitest";

import { collectionCounts, legacySticker, STICKER_CATEGORIES, stepsOnOwn, stickerById, surpriseSticker } from "./stickers";
import { removeSpace, spaceIdFor, upsertSpace, type StudentSpace } from "./student-spaces";

describe("sticker books", () => {
  it("has several kinds of trains in the trains book", () => {
    const trains = STICKER_CATEGORIES.find((c) => c.id === "trains")!;
    expect(trains.stickers.map((s) => s.name)).toContain("Bullet train");
    expect(trains.stickers.length).toBeGreaterThanOrEqual(6);
  });

  it("gives every sticker a unique id", () => {
    const ids = STICKER_CATEGORIES.flatMap((c) => c.stickers.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("counts duplicates in the collection and ignores unknown stickers", () => {
    expect(collectionCounts(["trains-tram", "trains-tram", "nope", null])).toEqual({ "trains-tram": 2 });
  });

  it("'Surprise me' picks a sticker the student doesn't have yet", () => {
    expect(surpriseSticker("trains", { "trains-passenger-train": 1 }).id).toBe("trains-bullet-train");
  });

  it("'Surprise me' goes round again once the whole book is collected", () => {
    const trains = STICKER_CATEGORIES.find((c) => c.id === "trains")!;
    const all = Object.fromEntries(trains.stickers.map((s) => [s.id, 1]));
    expect(stickerById(surpriseSticker("trains", all).id)).toBeDefined();
  });

  it("old finished cards keep the same sticker each time", () => {
    expect(legacySticker(0, "trains").id).toBe(legacySticker(7, "trains").id);
  });

  it("counts steps done on your own, minus help requests, never below zero", () => {
    expect(stepsOnOwn([{ current_step: 4, help_count: 1 }, { current_step: 1, help_count: 3 }])).toBe(3);
  });
});

describe("classes on one tablet", () => {
  const a: StudentSpace = { id: "s1", token: "t1", nickname: "Leo", className: "Room 4", avatar: "star" };
  const b: StudentSpace = { id: "s2", token: "t2", nickname: "Leo", className: "Art", avatar: "star" };

  it("keeps several classes, newest first", () => {
    expect(upsertSpace([a], b).map((s) => s.id)).toEqual(["s2", "s1"]);
  });

  it("replaces a class joined again instead of listing it twice", () => {
    expect(upsertSpace([a, b], { ...a, token: "new" })).toHaveLength(2);
  });

  it("removes only the chosen class", () => {
    expect(removeSpace([a, b], "s1").map((s) => s.id)).toEqual(["s2"]);
  });

  it("uses the student id as the class id when known", () => {
    expect(spaceIdFor("abc", "token123")).toBe("abc");
  });
});
