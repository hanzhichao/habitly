import {ChevronLeft, Edit, LucideIcon} from "lucide-react";
import {useRouter} from "next/navigation";

interface NavbarProps {
    title: string
    Icon?: LucideIcon
    onClickIcon?: () => void
}

export const Navbar = ({title, Icon, onClickIcon}: NavbarProps) => {
    const router = useRouter()
    return (
        <nav className="flex items-center justify-between p-6 pt-12 text-white">
            <button onClick={() => {router.back();}}
                className="p-2 mr-4 text-white bg-white shadow-sm rounded-4xl">
                <ChevronLeft className="w-6 h-6 text-gray-700"/>
            </button>
            <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
            {!!Icon && !!onClickIcon && (
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    onClick={() => {onClickIcon()}}
                >
                    <Icon className="w-4 h-4"/>
                </button>
            )}

        </nav>
    )
}
