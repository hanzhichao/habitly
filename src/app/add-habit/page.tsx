"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Book, Zap, Droplets, Heart, Edit3 } from "lucide-react"
import {addHabit} from "@/lib/habits";

const iconOptions = [
  { icon: ArrowRight, color: "bg-blue-500", name: "arrow" },
  { icon: Book, color: "bg-purple-500", name: "book" },
  { icon: Zap, color: "bg-yellow-500", name: "zap" },
  { icon: Droplets, color: "bg-green-500", name: "droplets" },
  { icon: Heart, color: "bg-red-500", name: "heart" },
  { icon: Edit3, color: "bg-indigo-500", name: "edit" },
]

const daysOfWeek = [
  { key: "M", label: "Mon" },
  { key: "T", label: "Tue" },
  { key: "W", label: "Wed" },
  { key: "T", label: "Thu" },
  { key: "F", label: "Fri" },
  { key: "S", label: "Sat" },
  { key: "S", label: "Sun" },
]

export default function AddHabitPage() {
  const router = useRouter()
  const [habitName, setHabitName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(0)
  const [frequency, setFrequency] = useState("Daily")
  const [selectedDays, setSelectedDays] = useState(["M", "T", "W", "T", "F"])
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("7:00 AM")
  const [goal, setGoal] = useState("")
  const [goalUnit, setGoalUnit] = useState("km")

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSubmit = () => {
    const iconOption = iconOptions[selectedIcon]
    // Here you would typically save the habit
    void addHabit(habitName, goal, frequency, reminderTime, iconOption.name, iconOption.color)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white min-h-screen"
      >
        {/* Header */}
        <div className="flex items-center p-6 pt-12 border-b">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { router.back(); }}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          <h1 className="text-xl font-semibold text-gray-900">Add New Habit</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Habit Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Label htmlFor="habit-name" className="text-base font-medium text-gray-900">
              Habit Name
            </Label>
            <Input
              id="habit-name"
              placeholder="e.g. Morning Run"
              value={habitName}
              onChange={(e) => { setHabitName(e.target.value); }}
              className="mt-2"
            />
          </motion.div>

          {/* Choose Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Label className="text-base font-medium text-gray-900">Choose Icon</Label>
            <div className="grid grid-cols-6 gap-3 mt-3">
              {iconOptions.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedIcon(index); }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color} ${
                    selectedIcon === index ? "ring-2 ring-blue-500 ring-offset-2" : ""
                  }`}
                >
                  <option.icon className="w-6 h-6 text-white" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Frequency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Label className="text-base font-medium text-gray-900">Frequency</Label>
            <div className="flex gap-2 mt-3">
              {["Daily", "Weekly", "Custom"].map((freq) => (
                <Button
                  key={freq}
                  variant={frequency === freq ? "default" : "outline"}
                  onClick={() => { setFrequency(freq); }}
                  className="flex-1"
                >
                  {freq}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Days of Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label className="text-base font-medium text-gray-900">Days of Week</Label>
            <div className="flex gap-2 mt-3">
              {daysOfWeek.map((day, index) => (
                <Button
                  key={`${day.key}-${index}`}
                  variant={selectedDays.includes(day.key) ? "default" : "outline"}
                  onClick={() => { toggleDay(day.key); }}
                  className="w-10 h-10 rounded-full p-0"
                >
                  {day.key}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Reminder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-gray-900">Reminder</Label>
              <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
            </div>
            {reminderEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-3"
              >
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                    <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                    <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </motion.div>

          {/* Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Label className="text-base font-medium text-gray-900">Goal (optional)</Label>
            <div className="flex gap-2 mt-3">
              <Input placeholder="e.g. 5" value={goal} onChange={(e) => { setGoal(e.target.value); }} className="flex-1" />
              <Select value={goalUnit} onValueChange={setGoalUnit}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="min">min</SelectItem>
                  <SelectItem value="times">times</SelectItem>
                  <SelectItem value="pages">pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-6"
          >
            <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium" disabled={!habitName.trim()}>
              Create Habit
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
