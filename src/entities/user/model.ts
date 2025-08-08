import { create } from "zustand";
export type User = { id: string; name: string; email: string; };
type State = { current: User | null; setUser: (u: User | null) => void; };
export const useUserStore = create<State>((set) => ({ current: null, setUser: (u) => set({ current: u }) }));
