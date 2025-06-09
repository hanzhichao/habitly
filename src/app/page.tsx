"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {Plus, ArrowRight, Book, Zap, Droplets, CheckCircle2, Circle, LucideIcon, Heart, Edit3} from "lucide-react"
import {useHabit} from "@/hooks/use-habit";
import {useRouter}  from "next/navigation";
import {getHabit, getHabits} from "@/lib/habits";
import {Habit} from "@/lib/types";

const weeklyData = [
  { day: "M", progress: 85, completed: true },
  { day: "T", progress: 90, completed: true },
  { day: "W", progress: 100, completed: true },
  { day: "T", progress: 75, completed: true },
  { day: "F", progress: 80, completed: true },
  { day: "S", progress: 60, completed: false },
  { day: "S", progress: 40, completed: false },
]

function getIcons() {
  const icons = new Map<string, LucideIcon>();
  icons.set("arrow-right", ArrowRight);
  icons.set("arrow-right", ArrowRight);
  icons.set("zap", Zap);
  icons.set("droplets", Droplets);
  icons.set("droplets", Droplets);
  icons.set("edit", Edit3);
  icons.set("heart", Heart);
  icons.set("book", Book);
  return icons
}

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  // const [icon, setIcon] = useState<LucideIcon>(ArrowRight)
  const setHabitId = useHabit((state)=>state.setHabitId)
  const icons = getIcons()
  const router = useRouter()


  const toggleHabit = (id: number) => {
    setHabits(habits.map((habit) => (habit.id === id ? {...habit, completed: !habit.completed} : habit)))
  }


  useEffect(() => {
    void getHabits().then(habits => {setHabits(habits)})
  }, []);

  const onSelectHabit = (habitId: number)=> {
      console.log("click: " + habitId.toString())
      setHabitId(habitId)
      router.push("/habit-detail")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="max-w-md mx-auto bg-white min-h-screen"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
            <p className="text-gray-500 text-sm">Track your daily progress</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg"/>
            <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
          </Avatar>
        </div>

        {/* Weekly Progress */}
        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.1, duration: 0.5}}
          className="mx-6 mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Weekly Progress</h2>
                <span className="text-2xl font-bold text-blue-600">75%</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-24">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{height: 0}}
                    animate={{height: `${day.progress}%`}}
                    transition={{delay: 0.2 + index * 0.1, duration: 0.6}}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className={`w-full rounded-full ${
                        day.completed ? "bg-blue-500" : "bg-blue-200"
                      } transition-colors duration-300`}
                      style={{height: `${day.progress}%`}}
                    />
                    <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Habits */}
        <div className="px-6">
          <h2 className="font-semibold text-gray-900 mb-4">{"Today's Habits"}</h2>
          <div className="space-y-3">
            {habits.map((habit, index) => {
              const Icon = icons.get(habit.icon) ?? ArrowRight;
              return (
                <motion.div
                  key={habit.id}
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.3 + index * 0.1, duration: 0.5}}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4" onClick={() => {
                        onSelectHabit(habit.id)
                      }}>
                        <div className={`w-12 h-12 rounded-xl ${habit.color} flex items-center justify-center mr-4`}>
                          <Icon className="w-6 h-6 text-white"/>
                        </div>
                        <div className="flex-1">
                          <div>
                            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                            <p className="text-sm text-gray-500">{habit.goal} • {habit.reminder}</p>
                          </div>
                        </div>
                        <motion.button
                          whileScale={{scale: 0.95}}
                          whileTap={{scale: 0.9}}
                          onClick={() => toggleHabit(habit.id)}
                          className="ml-4"
                        >
                          {habit.completed ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500"/>
                          ) : (
                            <Circle className="w-8 h-8 text-gray-300"/>
                          )}
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                )
            })}
          </div>
        </div>

        {/* Floating Add Button */}
        <motion.div
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{delay: 0.8, type: "spring", stiffness: 200}}
          className="fixed bottom-8 right-8"
        >
          <Link href="/add-habit">
            <Button size="lg" className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg">
              <Plus className="w-6 h-6"/>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
