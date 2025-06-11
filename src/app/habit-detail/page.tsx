"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {motion} from "framer-motion"
import {Card, CardContent} from "@/components/ui/card"
import {Edit, ArrowLeft, ArrowRight, Edit3, ChevronLeft, ChevronRight} from "lucide-react"
import {useHabit} from "@/hooks/use-habit";
import {getHabit} from "@/lib/habits"
import {Habit} from "@/lib/types";
import {Calendar} from "@/components/ui/calendar";

// import "react-day-picker/style.css";


export default function HabitDetailPage() {
  const router = useRouter()
  const habitId = useHabit((state) => state.habitId)
  const [habit, setHabit] = useState<Habit>()

  const completedDates = [
    new Date(2023, 5, 1),
    new Date(2023, 5, 2),
    new Date(2023, 5, 5),
    new Date(2023, 5, 6),
    new Date(2023, 5, 7),
    new Date(2023, 5, 8),
    new Date(2023, 5, 9),
    new Date(2023, 5, 12),
    new Date(2023, 5, 13),
    new Date(2023, 5, 14),
    new Date(2023, 5, 15),
    new Date(2023, 5, 16),
    new Date(2023, 5, 19),
    new Date(2023, 5, 20),
    new Date(2023, 5, 21),
    new Date(2023, 5, 22),
    new Date(2023, 5, 23),
    new Date(2023, 5, 26),
    new Date(2023, 5, 27),
    new Date(2023, 5, 28),
    new Date(2023, 5, 29),
    new Date(2023, 5, 30),
  ]

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2023, 5, 21)) // June 21, 2023

  useEffect(() => {
    void getHabit(habitId).then(r => {
      if (r !== null) {
        console.log(r)
        setHabit(r)
      }
    })
  }, [habitId]);

  const isDateCompleted = (date: Date) => {
    return completedDates.some(
      (completedDate) =>
        completedDate.getDate() === date.getDate() &&
        completedDate.getMonth() === date.getMonth() &&
        completedDate.getFullYear() === date.getFullYear(),
    )
  }

  const onEdit = (habit: Habit) => {
    router.push("/add-habit")
  }

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.5}}
        className="absolute w-full mx-auto min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-50"
      >
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className={`bg-gradient-to-br from-${habit?.color}-400 via-${habit?.color}-600 to-${habit?.color}-800 rounded-3xl mx-0 relative pb-12 shadow-md`}
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between p-6 pt-12 text-white">
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5"/>
            </motion.button>
            <h1 className="text-xl font-semibold">{habit?.name}</h1>
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => {
                onEdit(habit)
              }}
            >
              <Edit className="w-4 h-4"/>
            </motion.button>
          </div>

          {/* Habit Info */}
          <div className="px-6 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mr-4">
                <ArrowRight className="w-8 h-8 text-blue-500"/>
              </div>
              <div className="text-white">
                <p className="text-base opacity-90">Goal: {habit?.goal} • {habit?.reminder}</p>
                <p className="text-base opacity-90">{habit?.frequency}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Positioned at bottom of blue section */}
          <div className="absolute -bottom-16 left-6 right-6">
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2, duration: 0.5}}
              >
                <Card className="bg-white border-0 shadow-md h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">days</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3, duration: 0.5}}
              >
                <Card className="bg-white shadow-md border-0 h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">87</p>
                    <p className="text-xs text-gray-500">%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4, duration: 0.5}}
              >
                <Card className="bg-white shadow-md border-0 h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">Best Streak</p>
                    <p className="text-2xl font-bold text-gray-900">21</p>
                    <p className="text-xs text-gray-500">days</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

        </motion.div>

        {/* Header */}


        {/* Calendar */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.5, duration: 0.5}}
          className="flex-1 p-6 mt-15"
        >
          <Card className="bg-white w-full rounded-3xl border-0">
            <CardContent className="">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0 w-full px-0"
                captionLayout="label"
                showOutsideDays
                defaultMonth={new Date(2023, 5)} // June 2023
                modifiers={{
                  completed: completedDates,
                }}
                modifiersStyles={{
                  completed: {
                    backgroundColor: "#86efac",
                    color: "#166534",
                    borderRadius: "50%",
                  },
                }}
                classNames={{
                  day_selected: "bg-green-500 text-white hover:bg-green-600 hover:text-white focus:bg-green-500 focus:text-white rounded-full items-center",
                  day: "hover:bg-gray-100 transition-colors rounded-full mx-auto",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-md font-bold text-gray-700",
                  day_outside: "text-gray-300 opacity-50"
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-white w-full rounded-3xl border-0 mt-5 mb-5">
            <CardContent className="px-6">
              {/* Activity Stats */}
              <div className="">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Activity Stats</h3>
                  <span className="text-sm text-gray-500">This Month</span>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-35 h-35 transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background Ring */}
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                      {/* Progress Ring */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.75)}`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Stats Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700 mb-1">75%</div>
                        <p className="text-gray-500 text-xs">Complete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
