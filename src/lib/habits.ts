import Database from "@tauri-apps/plugin-sql";
import {Habit} from "@/lib/types";
import * as path from "@tauri-apps/api/path";
import {ArrowRight, Book, Droplets, Zap} from "lucide-react";

let tableCreated = false;

async function getDb() {
  const dbFile = await path.join(await path.homeDir(), "Habitly/db.sqlite")
  const db = await Database.load("sqlite:" + dbFile);
  if (!tableCreated) {
    await db.execute(`CREATE TABLE IF NOT EXISTS "habits"
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        VARCHAR(64) NOT NULL,
                goal        VARCHAR(255),
                frequency  VARCHAR(64),
                reminder    VARCHAR(64),
                icon        VARCHAR(20),
                color       VARCHAR(20),
                completed BOOLEAN  DEFAULT false
            );`
    )

    const habits:Habit[] = [
      {
        id: 1,
        name: "Morning Run",
        goal: "5km",
        frequency: "daily",
        reminder: "7:00 AM",
        icon: "arrow-right",
        color: "bg-blue-500",
        completed: true,
      },
      {
        id: 2,
        name: "Read a Book",
        goal: "30 minutes",
        frequency: "daily",
        reminder: "Evening",
        icon: "book",
        color: "bg-purple-500",
        completed: false,
      },
      {
        id: 3,
        name: "Meditation",
        goal: "15 minutes",
        frequency: "daily",
        reminder: "Before bed",
        icon: "zap",
        color: "bg-yellow-500",
        completed: false,
      },
      {
        id: 4,
        name: "Drink Water",
        goal: "2 liters",
        frequency: "daily",
        reminder: "Throughout day",
        icon: "droplets",
        color: "bg-green-500",
        completed: true,
      },
    ]
    // for (const habit of habits){
    //   await db.execute(`INSERT INTO "habits" (id,name,goal,frequency,reminder,icon,color,completed)
    //   VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,
    //   [habit.id,habit.name,habit.goal,habit.frequency,habit.reminder,habit.icon,habit.color,habit.completed])
    // }
    tableCreated = true
  }
  return db;
}

export async function getHabits(){
  const db = await getDb();
  return await db.select<Habit[]>("SELECT * FROM habits ORDER BY id;");
}

export async function getHabit(id: number){
  const db = await getDb();
  const result = await db.select<Habit[]>("SELECT * FROM habits WHERE id = $1;", [id]);
  return result.length > 0? result[0]: null
}

export async function addHabit(name: string, goal: string, frequency: string, reminder: string, icon: string, color: string){
  const db = await getDb();
  return await db.execute("INSERT INTO habits (name,goal,frequency,reminder,icon,color) VALUES ($1,$2,$3,$4,$5,$6);", [name, goal,frequency,reminder, icon,color]);
}

export async function setHabitComplete(id: string, complete: boolean){
  const db = await getDb();
  return await db.execute("UPDATE habits SET complete=$2 WHERE id=$1;", [id,complete]);
}

export async function deleteHabit(id: number){
  const db = await getDb();
  return await db.execute("DELETE FROM habits WHERE id=$1;", [id]);
}
