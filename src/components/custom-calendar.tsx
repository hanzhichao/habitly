"use client"

import {Calendar} from "@/components/ui/calendar";
import {zhCN} from "date-fns/locale";

interface CustomCalendarProps {
  selectedDate?: Date;
  setSelectedDate: (value: Date) => void;
  completedDates: Date[];
}
export const CustomCalendar = ({selectedDate,setSelectedDate,completedDates}:CustomCalendarProps) => {
  return (
    <Calendar
      mode="single"
      locale={zhCN}
      buttonVariant="default"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-md border-0 w-full px-0"
      captionLayout="label"
      showOutsideDays
      defaultMonth={new Date()} // June 2023
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
  )
}