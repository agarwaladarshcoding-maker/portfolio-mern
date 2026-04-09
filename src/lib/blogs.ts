export type BlogEntry = {
  id: string;
  day: number;
  title: string;
  topics: string[];
};

export const blogEntries: BlogEntry[] = [
  {
    id: "entry-01",
    day: 1,
    title: "Memory Arenas & Cache Locality",
    topics: ["Systems Design", "Performance"],
  },
];
