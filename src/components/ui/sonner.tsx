"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:border-l-4 group-[.toast]:border-l-green-500 group-[.toast]:bg-green-50 dark:group-[.toast]:bg-green-900/20",
          error: "group-[.toast]:border-l-4 group-[.toast]:border-l-red-500 group-[.toast]:bg-red-50 dark:group-[.toast]:bg-red-900/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
