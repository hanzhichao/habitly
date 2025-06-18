"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Card, CardContent} from "@/components/ui/card"
import {
  Edit,
  ArrowLeft,
  ArrowRight,
  LucideIcon
} from "lucide-react"
import {useHabit} from "@/hooks/use-habit";
import {getCompletedRecords, getHabit} from "@/lib/habits"
import {Habit} from "@/lib/types";
import {CustomCalendar} from "@/components/custom-calendar";
import {differenceInDays, endOfMonth, isAfter, isBefore, isEqual, startOfMonth} from "date-fns";
import {iconOptions, textColors, gradientBgColors} from "@/lib/consts"



export default function HabitDetailPage() {
  const router = useRouter()
  const habitId = useHabit((state) => state.habitId)
  const setHabit = useHabit((state) => state.setHabit)
  const habit = useHabit((state) => state.habit)
  // const [habit, setHabit] = useState<Habit>()
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  const [Icon, setIcon] = useState<LucideIcon>(ArrowRight)
  const [color, setColor] = useState<string>("text-white")
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [monthlyCompletionRate, setMonthlyCompletionRate] = useState(0)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 5, 21)) // June 21, 2023

  useEffect(() => {
    void getHabit(habitId).then(r => {
      if (r !== null && typeof r !== "undefined") {
        let iconIndex = 0
        for (let index= 1; index < iconOptions.length; index ++){
          if (iconOptions[index].name == r.icon){
            iconIndex = index
            break
          }
        }
        setIcon(iconOptions[iconIndex].icon)
        const baseColor = iconOptions[iconIndex].color.split("-")[1]
        setColor(textColors[baseColor])
        setHabit(r)

      }
    })
  }, [habitId]);


  useEffect(() => {
    void getCompletedRecords(habitId).then(r => {
      if (r.length >0 ) {
        const dates = r.map(item=>new Date(item.record_date))
        console.log('setCompletedDates')
        console.log(dates)
        setCompletedDates(dates)

        const now = new Date();
        const recordStart = new Date(r[0].record_date)
        let totalDays = Math.abs(differenceInDays(now, recordStart))
        totalDays = totalDays === 0 ? 1 : totalDays
        console.log('recordStart', recordStart)
        console.log('r.length', r.length)
        console.log('totalDays', totalDays)
        const completionRate = Math.round(r.length / totalDays * 100)
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        let monthlyRecordCount = 0
        if ((isEqual(recordStart, monthStart) || isAfter(recordStart, monthStart) &&
          (isEqual(recordStart, monthEnd) || isBefore(recordStart, monthEnd)))){
          monthlyRecordCount ++
        }

        let currentStreak = 1;
        let longestStreak = 1;

        let lastRecordDate = new Date(r[0].record_date)
        for (const record of r.slice(1)) {
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

        setCurrentStreak(currentStreak)
        setLongestStreak(longestStreak)
        setCompletionRate(completionRate)
        setMonthlyCompletionRate(monthlyCompletionRate)
      }
    })
  }, [habitId]);


  useEffect(() => {
    void getCompletedRecords(habitId).then(r => {
      if (r.length >0 ) {
        const dates = r.map(item=>new Date(item.record_date))
        setCompletedDates(dates)
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

  const onEdit = (habit?: Habit) => {
    if (typeof habit !== "undefined"){
      router.push("/add-habit")
    }
  }

  const colorKey = habit?.color.split("-")[1] ?? "blue"
  const bgColor = gradientBgColors[colorKey] ?? ""

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(monthlyCompletionRate, 100));

  return (
    <div className="relative min-h-screen">
      <div className="absolute w-full mx-auto min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-50">
        <div className={`${bgColor} rounded-3xl mx-0 relative pb-12 shadow-md`}>
          {/* Header Navigation */}
          <div className="flex items-center justify-between p-6 pt-12 text-white">
            <button
              onClick={() => {router.back()}}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <h1 className="text-2xl font-semibold">{habit?.name}</h1>
            <button
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => {onEdit(habit)}}
            >
              <Edit className="w-4 h-4"/>
            </button>
          </div>

          {/* Habit Info */}
          <div className="px-6 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mr-4">
                <Icon className={`w-8 h-8 ${color}`}/>
              </div>
              <div className="text-white">
                <p className="text-base opacity-90">目标: {habit?.goal} • {habit?.reminder}</p>
                <p className="text-base opacity-90">{habit?.frequency}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Positioned at bottom of blue section */}
          <div className="absolute -bottom-16 left-6 right-6">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Card className="bg-white border-0 shadow-md h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">当前持续</p>
                    <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
                    <p className="text-xs text-gray-500">天</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white shadow-md border-0 h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">完成率</p>
                    <p className="text-2xl font-bold text-gray-900">{completionRate}</p>
                    <p className="text-xs text-gray-500">%</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white shadow-md border-0 h-30">
                  <CardContent className="px-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">最佳持续</p>
                    <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
                    <p className="text-xs text-gray-500">天</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        </div>

        {/* Header */}


        {/* Calendar */}
        <div className="flex-1 p-6 mt-15">
          <Card className="bg-white w-full rounded-3xl border-0">
            <CardContent className="">
              <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} completedDates={completedDates} />
            </CardContent>
          </Card>

          <Card className="bg-white w-full rounded-3xl border-0 mt-5 mb-5">
            <CardContent className="px-6">
              {/* Activity Stats */}
              <div className="">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">活动统计</h3>
                  <span className="text-sm text-gray-500">本月</span>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-35 h-35 transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background Ring */}
                      <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                      {/* Progress Ring */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - percent / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Stats Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700 mb-1">{monthlyCompletionRate}%</div>
                        <p className="text-gray-500 text-xs">完成率</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
