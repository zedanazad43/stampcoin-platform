import { describe, expect, it } from "vitest";
import { formatRarity, getDisplayStamps, type Stamp } from "./marketplace-utils";

describe("marketplace-utils", () => {
  const featured: Stamp[] = [
    { id: 1, title: "Featured", country: "X", year: 2000, rarity: "legendary", price: "100" },
  ];

  it("formats rarity labels to friendly text", () => {
    expect(formatRarity("very_rare")).toBe("Very Rare");
    expect(formatRarity("legendary")).toBe("Legendary");
    expect(formatRarity("custom")).toBe("custom");
  });

  it("returns API stamps when available", () => {
    const stamps: Stamp[] = [
      { id: 10, title: "API", country: "Y", year: 1999, rarity: "rare", price: "50" },
    ];

    const { display, isEmpty } = getDisplayStamps({ stamps, featured, isLoading: false });
    expect(display).toEqual(stamps);
    expect(isEmpty).toBe(false);
  });

  it("falls back to featured stamps when API returns empty", () => {
    const { display, isEmpty } = getDisplayStamps({ stamps: [], featured, isLoading: false });
    expect(display).toEqual(featured);
    expect(isEmpty).toBe(true);
  });

  it("does not mark empty while loading", () => {
    const { isEmpty } = getDisplayStamps({ stamps: [], featured, isLoading: true });
    expect(isEmpty).toBe(false);
  });
});
