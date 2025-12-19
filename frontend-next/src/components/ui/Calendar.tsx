"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-0", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-3",
                caption: "flex justify-center pt-1 relative items-center px-2",
                caption_label: "text-sm font-bold text-white",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-8 w-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-0 transition-all duration-200 text-slate-400 hover:text-white inline-flex items-center justify-center"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-slate-400 rounded-md w-9 font-semibold text-xs uppercase",
                row: "flex w-full mt-1.5",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-medium rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200 text-slate-300 aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-blue-600 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white font-bold shadow-lg shadow-blue-600/20",
                day_today: "bg-white/10 text-white font-bold border border-white/20",
                day_outside:
                    "day-outside text-slate-600 opacity-40 aria-selected:bg-blue-600/50 aria-selected:text-white aria-selected:opacity-30",
                day_disabled: "text-slate-700 opacity-30 cursor-not-allowed hover:bg-transparent",
                day_range_middle:
                    "aria-selected:bg-white/5 aria-selected:text-white",
                day_hidden: "invisible",
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
