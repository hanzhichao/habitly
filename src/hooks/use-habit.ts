import { create } from "zustand";
import {Habit} from "@/lib/types";

interface HabitStore {
  habitId: number;
  habit?: Habit,
  setHabitId: (id: number)  => void;
  setHabit: (habit: Habit)  => void;
}

export const useHabit = create<HabitStore>((set) => ({
  habitId: 0,
  habit: undefined,
  setHabitId: (id: number) => { set({ habitId: id }) },
  setHabit: (habit: Habit) => { set({ habit: habit }) }
}));
