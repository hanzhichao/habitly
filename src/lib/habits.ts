import Database from "@tauri-apps/plugin-sql";
import {Habit, Record} from "@/lib/types";
import * as path from "@tauri-apps/api/path";
import {
  addDays,
  differenceInDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import {exists} from "@tauri-apps/plugin-fs";


async function createTable() {
  // const dbFile = await path.join(await path.homeDir(), "Habitly/db.sqlite")
  const dbFile = await path.join(await path.appDataDir(), 'db.sqlite');
  const db = await Database.load("sqlite:" + dbFile);
  await db.execute(`CREATE TABLE IF NOT EXISTS "habits"
                      (
                          id          INTEGER PRIMARY KEY AUTOINCREMENT,
                          name        VARCHAR(64) NOT NULL,
                          description VARCHAR(64) DEFAULT "",
                          goal        VARCHAR(255),
                          frequency   VARCHAR(64) DEFAULT "daily",
                          reminder    VARCHAR(64),
                          icon        VARCHAR(20) DEFAULT "arrow-right",
                          color       VARCHAR(20) DEFAULT "bg-blue-500",
                          start_date  DATE        NOT NULL,
                          end_date    DATE,
                          create_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
                          update_at   DATETIME    DEFAULT CURRENT_TIMESTAMP
                      );

            CREATE TABLE IF NOT EXISTS "records"
            (
                record_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id    INTEGER,
                record_date DATE        DEFAULT CURRENT_TIMESTAMP,
                status      TINYINT     DEFAULT 1,
                note        VARCHAR(64) DEFAULT "",
                create_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
                update_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (habit_id) REFERENCES habits (id)
            );`
    )
  await db.close()
}

async function getDb() {
  // const dbFile = await path.join(await path.homeDir(), "Habitly/db.sqlite")
  const dbFile = await path.join(await path.appDataDir(), 'db.sqlite');
  const dbFileExists = await exists(dbFile);
  if(!dbFileExists){
    await createTable()
  }
  return await Database.load("sqlite:" + dbFile);
}

// export async function getHabitsWithStatus(){
//   const db = await getDb();
//   const results = await db.select<Habit[]>(`SELECT id,name,goal,frequency,reminder,icon,color,COALESCE(records.status, 0) AS status
//     FROM habits
//     LEFT JOIN records ON habits.id = records.habit_id;`);
//   console.log(results)
//   return results
// }


export async function getHabitsWithStatusToday() {
  const db = await getDb();
  const results = await db.select<Habit[]>(`SELECT id,
                                                   name,
                                                   goal,
                                                   frequency,
                                                   reminder,
                                                   icon,
                                                   color,
                                                   start_date,
                                                   end_date,
                                                   CASE WHEN records.status= 1 THEN 1 ELSE 0 END AS status
                                                   FROM habits
                                                   LEFT JOIN records ON habits.id = records.habit_id AND record_date = DATE('now');`);
  // console.log(results)
  return results
}

export async function getHabitsWithStatus(day: string) {
  const db = await getDb();
  const habits: Habit[] = []
  const result = await db.select<Habit[]>(`
      SELECT id,
             name,
             goal,
             frequency,
             reminder,
             icon,
             color,
             start_date,
             end_date,
             CASE WHEN records.status = 1 THEN 1 ELSE 0 END AS status
      FROM habits 
          LEFT JOIN records ON habits.id = records.habit_id AND record_date = $1;`, [day])

  // 筛选 start_date <= day <= end_date范围内的
  if (result.length > 0){
    const now = new Date()
    for (const item of result){
      const startDate = new Date(item.start_date)
      const endDate = item.end_date === null ? now : new Date(item.end_date)
      const dayDate = new Date(day)
      if (
        (isEqual(dayDate, startDate) || isAfter(dayDate, startDate)) &&  (isEqual(dayDate, endDate) || isBefore(dayDate, endDate))
      ){
        habits.push(item)
      }
    }
    console.log('getHabitsWithStatus')
    console.log(habits)
    return habits
  }
}


export async function getTodayHabits() {
  const result = await getHabitsWithStatusToday()
  console.log('getHabitsWithStatus')
  console.log(result)
  const habits: Habit[] = [];
  const now = new Date();
  for (const item of result) {
    if (item.frequency === 'daily') {
      habits.push(item)
    } else if (item.frequency.startsWith('weekly:')) {
      const nums = item.frequency.slice(7).split(",")
      if (nums.includes(now.getDay().toString())) {
        habits.push(item)
      }
    } else if (item.frequency.startsWith('monthly:')) {
      const nums = item.frequency.slice(8).split(",")
      if (nums.includes(now.getDate().toString())) {
        habits.push(item)
      }
    }
  }
  return habits
}

export async function getCompleteCountOfDate(date: string) {
  const db = await getDb();
  const result = await db.select<{
    count: number
  }[]>("SELECT COUNT(record_id) as count FROM `records` WHERE record_date = $1;", [date]);
  if (result.length === 0) return 0
  return result[0].count
}


export async function getHabit(id: number) {
  const db = await getDb();
  const result = await db.select<Habit[]>("SELECT * FROM `habits` WHERE id = $1;", [id]);
  return result.length > 0 ? result[0] : null
}

export async function addHabit(name: string, goal: string, frequency: string, reminder: string, icon: string, color: string) {
  const db = await getDb();
  return await db.execute("INSERT INTO `habits` (name,goal,frequency,reminder,icon,color,start_date) VALUES ($1,$2,$3,$4,$5,$6,date('now'));", [name, goal, frequency, reminder, icon, color]);
}

export async function updateHabit(habbitId: number, name: string, goal: string, frequency: string, reminder: string, icon: string, color: string) {
  const db = await getDb();
  return await db.execute("UPDATE `habits` SET name=$1,goal=$2,frequency=$3,reminder=$4,icon=$5,color=$6 WHERE id=$7;", [name, goal, frequency, reminder, icon, color, habbitId]);
}
export async function deleteHabit(id: number) {
  const db = await getDb();
  return await db.execute("DELETE FROM `habits` WHERE id=$1;", [id]);
}


// 查询习惯所有记录列表
export async function getRecords(habitId: number) {
  const db = await getDb();
  return db.select<Record[]>("SELECT * FROM `records` WHERE habit_id = $1 ORDER BY record_date;", [habitId]);
}

// 查询习惯完成记录列表
export async function getCompletedRecords(habitId: number) {
  const db = await getDb();
  return db.select<Record[]>("SELECT * FROM `records` WHERE habit_id = $1 AND status = 1 ORDER BY record_date;", [habitId]);
}


// 查询习惯今日完成记录
export async function getRecordOfToday(habitId: number) {
  const db = await getDb();
  const records = await db.select<Record[]>("SELECT * FROM records WHERE habit_id=$1 AND records.record_date=date('now');", [habitId])
  if (records.length === 0) return
  return records[0]
}

// 添加习惯今日完成记录
export async function addRecordOfToday(habitId: number) {
  const db = await getDb();
  return db.execute("INSERT INTO records (habit_id,record_date) VALUES ($1,date('now'))", [habitId]);
}


// 更新习惯今日完成记录
export async function updateRecordOfToday(recordId: number, status: number) {
  const db = await getDb();
  return db.execute(`UPDATE records
                     SET status=$1
                     WHERE record_id = $2`, [status, recordId]);
}


// 切换习惯今日完成记录完成状态
export async function toggleRecordStatusOfToday(habitId: number) {
  const record = await getRecordOfToday(habitId)
  if (typeof record !== "undefined") {
    const newStatus = record.status === 1 ? 0 : 1
    return await updateRecordOfToday(record.record_id, newStatus)
  }
  return addRecordOfToday(habitId)
}


// 统计习惯完成记录
export async function getRecordStats(habitId: number) {
  const records = await getCompletedRecords(habitId)
  if (records.length === 0) return {completionRate: 0, currentStreak: 0, longestStreak: 0, monthlyCompletionRate: 0}

  const now = new Date();
  const recordStart = new Date(records[0].record_date)
  const totalDays = Math.abs(differenceInDays(now, recordStart))
  const completionRate = Math.round(records.length / totalDays * 100)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  let monthlyRecordCount = 0
  if ((isEqual(recordStart, monthStart) || isAfter(recordStart, monthStart) &&
      (isEqual(recordStart, monthEnd) || isBefore(recordStart, monthEnd)))){
    monthlyRecordCount ++
  }

  let currentStreak = 1;
  let longestStreak = 1;

  let lastRecordDate = new Date(records[0].record_date)
  for (const record of records.slice(1)) {
    const recordDate = new Date(record.record_date)
    if ((isEqual(recordDate, monthStart) || isAfter(recordDate, monthStart) &&
      (isEqual(recordDate, monthEnd) || isBefore(recordDate, monthEnd)))){
      monthlyRecordCount ++
    }
    const daysDiff = differenceInDays(recordDate, lastRecordDate);
    if (daysDiff === 1) {
      currentStreak++
    } else {
      currentStreak = 1
    }
    lastRecordDate = recordDate
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  const monthlyCompletionRate = Math.round(monthlyRecordCount / monthEnd.getDate() * 100)
  console.log('completionRate', completionRate)
  console.log('currentStreak', currentStreak)
  console.log('longestStreak', longestStreak)
  console.log('monthlyCompletionRate', monthlyCompletionRate)
  return {completionRate: completionRate, currentStreak: currentStreak, longestStreak: longestStreak, monthlyCompletionRate: monthlyCompletionRate}

}

export async function getWeeklyData() {
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const now = new Date();
  const startOfWeekDate = startOfWeek(now, {weekStartsOn: 1});
  const data: { day: string, progress: number, completed: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    if (i < now.getDay()) {
      const date = addDays(startOfWeekDate, i);
      const dateStr = format(date, 'yyyy-MM-dd')
      const habits = await getHabitsWithStatus(dateStr)
      if (typeof habits === "undefined") continue
      const completeHabits = habits.filter(item => item.status == 1)
      const progress = habits.length !== 0 ? Math.round(completeHabits.length / habits.length * 100) : 0
      const completed = progress === 100
      data.push({day: days[i], progress: progress, completed: completed});
    } else {
      data.push({day: days[i], progress: 0, completed: false});
    }
  }
  return data
}
