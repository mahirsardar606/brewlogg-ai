"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Checkbox({ className, checked, onCheckedChange, ...props }: React.ComponentProps<"input"> & { onCheckedChange?: (checked: boolean) => void }) {
  return (
    <input
      type="checkbox"
      role="checkbox"
      aria-checked={checked}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        "group/checkbox inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors cursor-pointer",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[checked=true]:bg-primary data-[checked=true]:border-primary data-[checked=true]:text-primary-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Checkbox }
