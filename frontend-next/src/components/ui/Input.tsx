import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative flex items-center group w-full">
                {icon && (
                    <div className="absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 text-foreground",
                        icon ? "pl-11" : "pl-4",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
