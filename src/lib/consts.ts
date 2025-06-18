import {
  ArrowRight,
  Book,
  BookOpen,
  Camera,
  Droplets,
  Edit3,
  Heart,
  Image,
  Moon,
  PenLine,
  PenTool,
  Zap
} from "lucide-react";

export const daysOfWeek = [
  {key: "1", label: "周一"},
  {key: "2", label: "周二"},
  {key: "3", label: "周三"},
  {key: "4", label: "周四"},
  {key: "5", label: "周五"},
  {key: "6", label: "周六"},
  {key: "7", label: "周日"},
]

export const iconOptions = [
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

export const gradientBgColors: Record<string, string> = {
  "purple": "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800",
  "yellow": "bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800",
  "blue": "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800",
  "green": "bg-gradient-to-br from-green-400 via-green-600 to-green-800",
  "red": "bg-gradient-to-br from-red-400 via-red-600 to-red-800",
  "cyan": "bg-gradient-to-br from-cyan-400 via-cyan-600 to-cyan-800",
  "amber": "bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800",
  "indigo": "bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-800",
  "sky": "bg-gradient-to-br from-sky-400 via-sky-600 to-sky-800",
  "neutral": "bg-gradient-to-br from-neutral-400 via-neutral-600 to-neutral-800",
  "slate": "bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800",
  "stone": "bg-gradient-to-br from-stone-400 via-stone-600 to-stone-800",
}

export const textColors: Record<string, string>  = {
  "purple": "text-purple-500",
  "yellow": "text-yellow-500",
  "blue": "text-blue-500",
  "green": "text-green-500",
  "red": "text-red-500",
  "sky": "text-sky-500",
  "grey": "text-grey-500",
  "slate": "text-slate-500",
  "indigo": "text-indigo-500",
  "cyan": "text-cyan-500",
  "neutral": "text-neutral-500",
  "stone": "text-stone-500",
}