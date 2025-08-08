export type Player = { id: string; name: string };

export type Settings = {
  roundSeconds: number;
  spies: "auto" | "one" | "two";
  allowSecondSpyThreshold: number;
  includeCategories: Array<"classic" | "travel" | "fun">;
  customLocationsRaw: string;
  revealMode: "private" | "public";
  allowSpyGuess: boolean;
};

export type Phase = "lobby" | "playing" | "voting" | "ended";

export type Vote = {
  accusedId: string | null;
  votes: Record<string, boolean>; // voterId -> approve?
};

export type RoundResult = {
  winner: "spies" | "civilians";
  reason: "time" | "spy_guess" | "accused_spy" | "accused_civil";
};
