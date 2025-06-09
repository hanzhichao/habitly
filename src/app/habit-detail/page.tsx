"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Edit3, ChevronLeft, ChevronRight } from "lucide-react"
import {useHabit} from "@/hooks/use-habit";
import {getHabit} from "@/lib/habits"
import {Habit} from "@/lib/types";

const calendarData = {
  month: "June 2023",
  days: [
    { date: 29, completed: false, isCurrentMonth: false },
    { date: 30, completed: false, isCurrentMonth: false },
    { date: 31, completed: false, isCurrentMonth: false },
    { date: 1, completed: true, isCurrentMonth: true },
    { date: 2, completed: true, isCurrentMonth: true },
    { date: 3, completed: false, isCurrentMonth: true },
    { date: 4, completed: false, isCurrentMonth: true },
    { date: 5, completed: true, isCurrentMonth: true },
    { date: 6, completed: true, isCurrentMonth: true },
    { date: 7, completed: true, isCurrentMonth: true },
    { date: 8, completed: true, isCurrentMonth: true },
    { date: 9, completed: true, isCurrentMonth: true },
    { date: 10, completed: false, isCurrentMonth: true },
    { date: 11, completed: false, isCurrentMonth: true },
    { date: 12, completed: true, isCurrentMonth: true },
    { date: 13, completed: true, isCurrentMonth: true },
    { date: 14, completed: true, isCurrentMonth: true },
    { date: 15, completed: true, isCurrentMonth: true },
    { date: 16, completed: true, isCurrentMonth: true },
    { date: 17, completed: false, isCurrentMonth: true },
    { date: 18, completed: false, isCurrentMonth: true },
    { date: 19, completed: true, isCurrentMonth: true },
    { date: 20, completed: true, isCurrentMonth: true },
    { date: 21, completed: true, isCurrentMonth: true },
    { date: 22, completed: true, isCurrentMonth: true },
    { date: 23, completed: true, isCurrentMonth: true },
    { date: 24, completed: false, isCurrentMonth: true },
    { date: 25, completed: false, isCurrentMonth: true },
    { date: 26, completed: true, isCurrentMonth: true },
    { date: 27, completed: true, isCurrentMonth: true },
    { date: 28, completed: true, isCurrentMonth: true },
    { date: 29, completed: true, isCurrentMonth: true },
    { date: 30, completed: true, isCurrentMonth: true },
    { date: 1, completed: false, isCurrentMonth: false },
    { date: 2, completed: false, isCurrentMonth: false },
  ],
}

export default function HabitDetailPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(21)
  const habitId = useHabit((state)=>state.habitId)
  const [habit, setHabit] = useState<Habit>()

  useEffect(() => {
    void getHabit(habitId).then(r => {
      if(r!==null){
        console.log(r)
        setHabit(r)
      }
    })
  }, [habitId]);


  return (
    <div className={"min-h-screen " + habit?.color}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto min-h-screen"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12 text-white">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {router.back()}}>
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-xl font-semibold">{habit?.name}</h1>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Edit3 className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Habit Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-6 mb-6"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm opacity-80">Goal: {habit?.goal} • {habit?.reminder}</p>
                  <p className="text-sm opacity-80">{habit?.frequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Current Streak</p>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-white/60">days</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">87</p>
                  <p className="text-xs text-white/60">%</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Best Streak</p>
                  <p className="text-2xl font-bold text-white">21</p>
                  <p className="text-xs text-white/60">days</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-t-3xl flex-1 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{calendarData.month}</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {calendarData.days.map((day, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                  ${!day.isCurrentMonth ? "text-gray-300" : ""}
                  ${day.completed && day.isCurrentMonth ? "bg-green-500 text-white" : ""}
                  ${!day.completed && day.isCurrentMonth ? "text-gray-700 hover:bg-gray-100" : ""}
                  ${selectedDate === day.date && day.isCurrentMonth ? "ring-2 ring-blue-500" : ""}
                `}
              >
                {day.date}
              </motion.button>
            ))}
          </div>

          {/* Activity Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Activity Stats</h3>
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
                <p className="text-gray-500">Complete</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
