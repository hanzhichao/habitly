import { create } from "zustand";

interface HabitStore {
  habitId: number;
  setHabitId: (id: number)  => void;
}

export const useHabit = create<HabitStore>((set) => ({
  habitId: 0,
  setHabitId: (id: number) => { set({ habitId: id }) }
}));
