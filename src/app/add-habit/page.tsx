"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ChevronLeft, ArrowRight, Book, Zap, Droplets, Heart, Edit3, Camera, PenLine, Moon, Pencil, FileText, Image, BookOpen, PenTool} from "lucide-react"
import {addHabit, deleteHabit, updateHabit} from "@/lib/habits";
import {cn} from "@/lib/utils";
import {useHabit} from "@/hooks/use-habit";

const iconOptions = [
  {icon: ArrowRight, color: "bg-blue-500", name: "arrow"},
  {icon: Book, color: "bg-purple-500", name: "book"},
  {icon: BookOpen, color: "bg-slate-500", name: "bookopen"},
  {icon: Zap, color: "bg-yellow-500", name: "zap"},
  {icon: Droplets, color: "bg-green-500", name: "droplets"},
  {icon: Heart, color: "bg-red-500", name: "heart"},
  {icon: Edit3, color: "bg-indigo-500", name: "edit"},
  {icon: Camera, color: "bg-cyan-500", name: "camera"},
  {icon: Image, color: "bg-sky-500", name: "image"},
  {icon: PenLine, color: "bg-neutral-500", name: "penline"},
  {icon: PenTool, color: "bg-stone-500", name: "pentool"},
  {icon: Moon, color: "bg-amber-500", name: "moon"},
]

const daysOfWeek = [
  {key: "1", label: "周一"},
  {key: "2", label: "周二"},
  {key: "3", label: "周三"},
  {key: "4", label: "周四"},
  {key: "5", label: "周五"},
  {key: "6", label: "周六"},
  {key: "7", label: "周日"},
]


// interface AddHabitPageProps {
//   habit?: Habit
// }


export default function AddHabitPage() {
  const router = useRouter()
  const [habitName, setHabitName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(0)
  const [frequency, setFrequency] = useState("每天")
  const [selectedDays, setSelectedDays] = useState(["1", "2", "3", "4", "5"])
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("7:00:00")
  const [goal, setGoal] = useState("")
  const habit = useHabit((state) => state.habit)
  // const [goalUnit, setGoalUnit] = useState("km")

  useEffect(() => {
    if (typeof habit !== "undefined") {
      let iconIndex = 0
      for (let index= 1; index < iconOptions.length; index ++){
        if (iconOptions[index].name == habit.icon){
          iconIndex = index
          break
        }
      }
      setHabitName(habit.name)
      setSelectedIcon(iconIndex)
      if (habit.frequency.startsWith("weekly")){
        setFrequency('每周')
      }
      setReminderTime(habit.reminder)
      setGoal(habit.goal)
    }
  }, [habit?.id]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const onAddHabit = () => {
    const iconOption = iconOptions[selectedIcon]
    let dbFrequency = "daily"
    if (frequency === "每周") {
      dbFrequency = "weekly:" + selectedDays.sort().join(",")
    }
    // 保存到数据库
    void addHabit(habitName, goal, dbFrequency, reminderTime, iconOption.name, iconOption.color)
    router.push("/")
  }

  const onUpdateHabit = () => {
    if (typeof habit === "undefined") return
    const iconOption = iconOptions[selectedIcon]
    let dbFrequency = "daily"
    if (frequency === "每周") {
      dbFrequency = "weekly:" + selectedDays.sort().join(",")
    }
    // 保存到数据库
    void updateHabit(habit.id, habitName, goal, dbFrequency, reminderTime, iconOption.name, iconOption.color)
    router.push("/")
  }

  const onDeleteHabit = () => {
    if (typeof habit === "undefined") return
    // 保存到数据库
    void deleteHabit(habit.id)
    router.push("/")
  }


  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-100 to-indigo-50 min-h-screen rounded-3xl">
        {/* Header */}
        <div className="flex items-center p-6 pt-12">
          <button
            onClick={() => {
              router.back();
            }}
            className="p-2 mr-4 text-white bg-white shadow-sm rounded-4xl"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700"/>
          </button>
          {typeof habit === "undefined" ? (
            <h1 className="text-2xl font-semibold text-gray-700">添加新习惯</h1>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-700">修改习惯</h1>
          )}
        </div>
        <Card className="border-white bg-white shadow-md rounded-2xl mx-6">
          <CardContent>
            <div className="space-y-6">
              {/* Habit Name */}
              <div>
                <Label htmlFor="habit-name" className="text-base font-medium text-gray-700">
                  习惯名称
                </Label>
                <Input
                  id="habit-name"
                  placeholder=""
                  value={habitName}
                  onChange={(e) => {
                    setHabitName(e.target.value);
                  }}
                  className="mt-2 border-gray-300 rounded-lg"
                />
              </div>

              {/* Choose Icon */}
              <div>
                <Label className="text-base font-medium text-gray-700">选择图标</Label>
                <div className="grid grid-cols-6 gap-3 mt-3">
                  {iconOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedIcon(index);
                      }}
                      className={`w-12 h-12 rounded-4xl flex items-center justify-center ${option.color} ${
                        selectedIcon === index ? "ring-2 ring-blue-500 ring-offset-2" : ""
                      }`}
                    >
                      <option.icon className="w-6 h-6 text-white"/>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-base font-medium text-gray-700">频率</Label>
                <div className="flex gap-2 mt-3">
                  {["每天", "每周"].map((freq) => (
                    <Button
                      key={freq}
                      variant={frequency === freq ? "default" : "outline"}
                      onClick={() => {
                        setFrequency(freq);
                      }}
                      className={cn("flex-1 rounded-lg border-0 shadow-sm", frequency === freq && "bg-blue-500 text-white")}
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Days of Week */}
              {frequency === "每周" && (
                <div>
                  {/*<Label className="text-base font-medium text-gray-700">星期</Label>*/}
                  <div className="flex gap-2 mt-3">
                    {daysOfWeek.map((day, index) => (
                      <Button
                        key={`${day.key}-${index}`}
                        variant={selectedDays.includes(day.key) ? "default" : "outline"}
                        onClick={() => {
                          toggleDay(day.key);
                        }}
                        className={cn("w-10 h-10 rounded-full p-0 border-0", selectedDays.includes(day.key) ? "bg-blue-500 text-white" : "bg-neutral-200")}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {/* Reminder */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-gray-700 mb-2">提醒</Label>
                  <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled}
                          className="bg-neutral-100 right-2 border-neutral-50"/>
                </div>
                {reminderEnabled && (
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger className="border-gray-300 w-full">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-50 border-0">
                      <SelectItem value="6:00:00">6:00 AM</SelectItem>
                      <SelectItem value="7:00:00">7:00 AM</SelectItem>
                      <SelectItem value="8:00:00">8:00 AM</SelectItem>
                      <SelectItem value="9:00:00">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Goal */}
              <div>
                <Label className="text-base font-medium text-gray-700">目标 (可选)</Label>
                <div className="flex gap-2 mt-3">
                  <Input placeholder="" value={goal} onChange={(e) => {
                    setGoal(e.target.value);
                  }} className="flex-1 border-gray-300 w-full"/>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                {typeof habit === "undefined" ? (
                  <Button onClick={onAddHabit} className="w-full h-12 bg-blue-500 font-bold rounded-xl text-white" disabled={!habitName.trim()}>
                    创建习惯
                  </Button>
                ):(
                    <div className="flex gap-x-2 items-center justify-between">
                    <Button onClick={onUpdateHabit} className="w-[49%] h-12 bg-blue-500 font-bold rounded-xl text-white" disabled={!habitName.trim()}>
                      修改习惯
                    </Button>
                    <Button onClick={onDeleteHabit} className="w-[49%] h-12 bg-red-500 font-bold rounded-xl text-white" disabled={!habitName.trim()}>
                      删除习惯
                    </Button>
                    </div>
                  )
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
