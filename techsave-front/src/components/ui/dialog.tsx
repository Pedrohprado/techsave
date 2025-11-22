import * as React from "react"

import { cn } from "@/lib/utils"

function Dialog({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog" className={cn("fixed inset-0 z-50 flex items-center justify-center", className)} {...props} />
  )
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 bg-black/40 backdrop-blur-sm", className)}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-content"
      className={cn(
        "relative w-full max-w-md rounded-lg bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-header" className={cn("p-4 border-b", className)} {...props} />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 data-slot="dialog-title" className={cn("text-lg font-semibold", className)} {...props} />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-description" className={cn("text-sm text-muted-foreground p-4 pt-2", className)} {...props} />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-footer" className={cn("flex items-center justify-end gap-2 p-4 border-t", className)} {...props} />
  )
}

export {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}

export default Dialog
