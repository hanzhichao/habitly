
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
  end_date: string | null,
  create_at: string,
  update_at: string,
  status?: number
}

export interface Record {
  record_id: number,
  habit_id: number,
  record_date: string,
  status: number
  note: string,
  create_at: string,
  update_at: string,
}