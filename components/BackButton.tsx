"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "nextjs-toploader/app"
import { cn } from "@/lib/utils"
import { IconArrowLeft } from "@tabler/icons-react"

type BackButtonProps = {
  className?: string
  variant?: "outline" | "ghost" | "default" | "secondary" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  path?: string
  label?: string
}

const BackButton = ({
  className,
  variant = "link",
  size = "default",
  path,
  label = "Back",
}: BackButtonProps) => {
  const router = useRouter()

  const navigateBack = () => {
    if (path) {
      router.push(path)
    } else {
      router.back()
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={navigateBack}
      aria-label={label}
      className={cn("flex w-fit cursor-pointer items-center gap-2", className)}
    >
      <IconArrowLeft className="size-4" aria-hidden />
      {label}
    </Button>
  )
}

export default BackButton
export { BackButton }
