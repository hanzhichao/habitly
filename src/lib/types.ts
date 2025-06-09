
export interface Habit {
  id: number
  name: string,
  goal: string,
  frequency: string,
  reminder: string,
  icon: string,
  color: string,
  completed?: boolean
}