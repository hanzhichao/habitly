import Database from "@tauri-apps/plugin-sql";
import {Habit, Record} from "@/lib/types";
import * as path from "@tauri-apps/api/path";
import {ArrowRight, Book, Droplets, Zap} from "lucide-react";

let tableCreated = false;

async function getDb() {
  const dbFile = await path.join(await path.homeDir(), "Habitly/db.sqlite")
  const db = await Database.load("sqlite:" + dbFile);
  if (!tableCreated) {
    await db.execute(`CREATE TABLE IF NOT EXISTS "habits"
            (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            VARCHAR(64) NOT NULL,
                description     VARCHAR(64) DEFAULT "",
                goal            VARCHAR(255),
                frequency       VARCHAR(64) DEFAULT "Daily",
                reminder        VARCHAR(64),
                icon            VARCHAR(20) DEFAULT "arrow-right",
                color           VARCHAR(20) DEFAULT "blue",
                start_date      DATE NOT NULL,
                end_date        DATE,
                create_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                update_at       DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "records"
            (
                record_id       INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id        INTEGER,
                record_date     DATE DEFAULT CURRENT_TIMESTAMP,
                state           TINYINT DEFAULT 1,
                note            VARCHAR(64) DEFAULT "",
                create_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                update_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (habit_id) REFERENCES habits (id)
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
            color: "blue",
          },
          {
            id: 2,
            name: "Read a Book",
            goal: "30 minutes",
            frequency: "daily",
            reminder: "Evening",
            icon: "book",
            color: "purple",
          },
          {
            id: 3,
            name: "Meditation",
            goal: "15 minutes",
            frequency: "daily",
            reminder: "Before bed",
            icon: "zap",
            color: "yellow",
          },
          {
            id: 4,
            name: "Drink Water",
            goal: "2 liters",
            frequency: "daily",
            reminder: "Throughout day",
            icon: "droplets",
            color: "green",
          },
        ]
        // for (const habit of habits){
        //   await db.execute(`INSERT INTO "habits" (id,name,goal,frequency,reminder,icon,color,start_date)
        //   VALUES ($1,$2,$3,$4,$5,$6,$7,date('now'));`,
        //   [habit.id,habit.name,habit.goal,habit.frequency,habit.reminder,habit.icon,habit.color,habit])
        // }
    tableCreated = true
  }
  return db;
}

export async function getHabits(){
  const db = await getDb();
  const results = await db.select<Habit[]>(`SELECT id,name,goal,frequency,reminder,icon,color,CASE WHEN records.completed IS NULL THEN false ELSE records.completed END AS completed 
    FROM habits 
    LEFT JOIN records ON habits.id = records.habit_id AND record_date=date('now');`);
  console.log(results)
  return results
}

export async function getHabit(id: number){
  const db = await getDb();
  const result = await db.select<Habit[]>("SELECT * FROM habits WHERE id = $1;", [id]);
  return result.length > 0? result[0]: null
}

export async function addHabit(name: string, goal: string, frequency: string, reminder: string, icon: string, color: string){
  const db = await getDb();
  return await db.execute("INSERT INTO habits (name,goal,frequency,reminder,icon,color,start_date) VALUES ($1,$2,$3,$4,$5,$6,date('now'));", [name, goal,frequency,reminder, icon,color]);
}

export async function setHabitComplete(id: string, completed: boolean){
  const db = await getDb();
  return await db.execute("UPDATE habits SET completed=$2 WHERE id=$1;", [id,completed]);
}

export async function deleteHabit(id: number){
  const db = await getDb();
  return await db.execute("DELETE FROM habits WHERE id=$1;", [id]);
}

export async function getRecords(habitId: number){
  const db = await getDb();
  return db.select<Record[]>("SELECT * FROM records WHERE habit_id = $1 ORDER BY id;", [habitId]);
}

export async function addOrUpdateRecord(habitId: number, completed: boolean){
  const db = await getDb();
  const result = await db.select<Record[]>("SELECT * FROM records WHERE habit_id=$1 AND records.record_date=date('now');", [habitId])
  if (result.length > 0){

    const record = result[0]
    return db.execute(`UPDATE records 
        SET completed=$1 
        WHERE record_id=$2`, [!record.completed, record.record_id]);
  }
  return db.execute("INSERT INTO records (habit_id,record_date) VALUES ($1,date('now'))", [habitId]);
}

