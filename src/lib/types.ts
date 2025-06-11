
export interface Habit {
  id: number
  name: string,
  description: string,
  goal: string,
  frequency: string,
  reminder: string,
  icon: string,
  color: string,
  start_date: string,
  end_date: string,
  create_at: string,
  update_at: string,
  completed?: boolean
}

export interface Record {
  record_id: number,
  habit_id: number,
  record_date: string,
  completed: boolean
  note: string,
  create_at: string,
  update_at: string,
}