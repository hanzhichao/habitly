"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {Plus, ArrowRight, Book, Zap, Droplets, CheckCircle2, Circle, LucideIcon, Heart, Edit3} from "lucide-react"
import {useHabit} from "@/hooks/use-habit";
import {useRouter, usePathname} from "next/navigation";
import {
  toggleRecordStatusOfToday,
  getTodayHabits,
  getWeeklyData
} from "@/lib/habits";
import {Habit} from "@/lib/types";



function getIcons() {
  const icons = new Map<string, LucideIcon>();
  icons.set("arrow-right", ArrowRight);
  icons.set("zap", Zap);
  icons.set("droplets", Droplets);
  icons.set("edit", Edit3);
  icons.set("heart", Heart);
  icons.set("book", Book);
  return icons
}

const colorMap = {
  purple: "bg-purple-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  zink: "bg-zink-500",
  grey: "bg-grey-500",
  slate: "bg-slate-500",
  indigo: "bg-indigo-500",
  cyan: "bg-cyan-500",
  neutral: "bg-neutral-500",
  // ...
}


export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [count, setCount] = useState(0)
  const [weeklyData, setWeeklyData] = useState<{ day: string, progress: number, completed: boolean }[]>([])
  const setHabitId = useHabit((state) => state.setHabitId)
  const setHabit = useHabit((state) => state.setHabit)
  const icons = getIcons()
  const router = useRouter()
  const pathname = usePathname();


  useEffect(() => {
    void getWeeklyData().then(data => {
      console.log('weeklydata')
      console.log(data)
      setWeeklyData(data)
    })
  }, [count]);

  useEffect(() => {
    setHabit(undefined)
    void getTodayHabits().then(habits => {
      setHabits(habits)
      console.log('habits')
      console.log(habits)
    })
  }, [pathname]);


  const toggleHabit = (id: number) => {
    setHabits(habits.map((habit) => (habit.id === id ? {...habit, status: habit.status === 1 ? 0 : 1} : habit)))
    void toggleRecordStatusOfToday(id)
    setCount(count+1)
  }

  const onSelectHabit = (habitId: number) => {
    console.log("click: " + habitId.toString())
    setHabitId(habitId)
    router.push("/habit-detail")
  }

  const totalDays = weeklyData.length; // 通常为7
  const completedDays = weeklyData.filter(d => d.completed).length;
  const percent = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-100 to-indigo-50 min-h-screen rounded-3xl pb-25">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">我的习惯</h1>
            <p className="text-gray-500 text-sm mt-1">追踪你的每日进程</p>
          </div>
          <Avatar className="w-12 h-12 shadow-md cursor-pointer">
            {/* <AvatarImage src="/placeholder.svg"/> */}
            <AvatarFallback className="bg-blue-500 text-white">石</AvatarFallback>
          </Avatar>
        </div>

        {/* Weekly Progress */}
        <div className="mx-6 mb-6">
          <Card className="border-white bg-white shadow-md rounded-2xl">
            <CardContent className="px-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">每周进度</h2>
                <span className="text-gray-500">{percent}%</span>
              </div>
              <div className="flex items-end justify-between gap-3 h-28">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={`${day.day}-${day.progress}-${day.completed}`}
                    initial={{height: 0}}
                    animate={{height: `100%`}}
                    transition={{delay: 0.2 + index * 0.1, duration: 0.6}}
                    className="flex flex-col justify-end items-center gap-2 flex-1 bg-neutral-100 rounded-full"
                  >
                    <div
                      className={`w-full rounded-full ${
                        day.completed
                          ? "bg-gradient-to-b from-blue-500 to-blue-400"
                          : "bg-gradient-to-b from-blue-200 to-blue-300"
                      } transition-colors duration-300`}
                      style={{height: `${day.progress}%`}}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d, i) => (
                  <span key={i} className="text-xs text-gray-500 font-medium flex-1 text-center">{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits */}
        <div className="px-6">
          <h2 className="font-semibold text-gray-900 mb-4">{"今日习惯"}</h2>
          <div className="space-y-3">
            {habits.map((habit, index) => {
              const Icon = icons.get(habit.icon) ?? ArrowRight;
              return (
                <div key={index}>
                  <Card className="overflow-hidden border-white bg-white shadow-md rounded-2xl hover:bg-neutral-50 hover:border-neutral-50">
                    <CardContent className="p-0">
                      <div className="flex items-center px-4">
                        <div
                          className={`flex w-12 h-12 rounded-4xl items-center justify-center mr-4 cursor-pointer ${habit.color} `}
                          onClick={() => {
                            onSelectHabit(habit.id)
                          }}>
                          <Icon className="w-6 h-6 text-white"/>
                        </div>
                        <div className="flex-1">
                          <div>
                            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                            <p className="text-sm text-gray-500">{habit.goal} • {habit.reminder}</p>
                          </div>
                        </div>

                        <button onClick={() => {toggleHabit(habit.id)}} className="ml-4">
                          {Number(habit.status) === 1 ? (
                            <CheckCircle2 className="w-7 h-7 text-green-500"/>
                          ) : (
                            <Circle className="w-7 h-7 text-gray-300"/>
                          )}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-5 right-7">
          <Link href="/add-habit">
            <Button size="lg" className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md cursor-pointer">
              <Plus className="w-8 h-8 text-white"/>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
