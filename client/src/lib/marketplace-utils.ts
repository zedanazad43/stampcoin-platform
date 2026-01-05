export type Stamp = {
  id: number;
  title: string;
  country: string;
  year: number;
  rarity: string;
  price: string;
  imageUrl?: string | null;
};

export function formatRarity(rarity: string): string {
  const map: Record<string, string> = {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    very_rare: "Very Rare",
    legendary: "Legendary",
  };
  return map[rarity] || rarity;
}

export function getDisplayStamps(options: {
  stamps: Stamp[] | undefined;
  featured: Stamp[];
  isLoading: boolean;
}): { display: Stamp[]; isEmpty: boolean } {
  const { stamps, featured, isLoading } = options;
  const display = stamps && stamps.length > 0 ? stamps : featured;
  const isEmpty = !isLoading && (!stamps || stamps.length === 0);
  return { display, isEmpty };
}
