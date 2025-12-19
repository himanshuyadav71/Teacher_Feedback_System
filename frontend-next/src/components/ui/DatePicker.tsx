"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/Calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DatePickerProps {
    value?: string
    onChange?: (date: string) => void
    placeholder?: string
    className?: string
    icon?: React.ReactNode
}

export function DatePicker({ value, onChange, placeholder = "Select date", className, icon }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    )
    const [month, setMonth] = React.useState<Date>(selectedDate || new Date())
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date && onChange) {
            // Format as YYYY-MM-DD for backend compatibility
            const formattedDate = format(date, "yyyy-MM-dd")
            onChange(formattedDate)
        }
        setIsOpen(false)
    }

    const handleMonthChange = (newMonth: Date) => {
        setMonth(newMonth)
    }

    // Generate year options (from 1950 to current year)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handleYearChange = (year: number) => {
        const newDate = new Date(month)
        newDate.setFullYear(year)
        setMonth(newDate)
    }

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(month)
        newDate.setMonth(monthIndex)
        setMonth(newDate)
    }

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative flex items-center group w-full">
                {icon && (
                    <div className="absolute left-3 text-slate-400 group-focus-within:text-white transition-colors duration-200 z-10">
                        {icon}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base ring-offset-background transition-all duration-200",
                        "hover:bg-white/10 hover:border-white/20",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0",
                        icon ? "pl-11" : "pl-4",
                        "pr-10 text-left",
                        selectedDate ? "text-white" : "text-slate-400",
                        className
                    )}
                >
                    {selectedDate ? format(selectedDate, "PPP") : placeholder}
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 z-50 w-full min-w-[350px] rounded-2xl border border-white/20 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-3 animate-in fade-in-0 zoom-in-95">
                    {/* Month and Year Selectors */}
                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                            <select
                                value={month.getMonth()}
                                onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                                className="w-full h-10 px-3 pr-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium appearance-none cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                {months.map((m, i) => (
                                    <option key={m} value={i} className="bg-slate-800">
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                            <select
                                value={month.getFullYear()}
                                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                                className="w-full h-10 px-3 pr-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium appearance-none cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year} className="bg-slate-800">
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Calendar */}
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        month={month}
                        onMonthChange={handleMonthChange}
                        initialFocus
                        className="rounded-lg"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDate(undefined)
                                onChange?.("")
                                setIsOpen(false)
                            }}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date()
                                setSelectedDate(today)
                                setMonth(today)
                                onChange?.(format(today, "yyyy-MM-dd"))
                                setIsOpen(false)
                            }}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
