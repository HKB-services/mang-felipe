import Image from "next/image"
import Link from "next/link"

import APP_DETAILS from "@/constants/app.details"
import { ROUTES } from "@/constants/app.routes"
import { cn } from "@/lib/utils"

interface AppLogoProps {
  width?: number
  height?: number
  className?: string
  linkClassName?: string
  nameClassName?: string
  /** Show brand name beside the mark (footer, sheet title). */
  showName?: boolean
  /** When false, render mark without linking home (e.g. sheet header). */
  asLink?: boolean
  priority?: boolean
}

const AppLogo = ({
  width = 40,
  height = 40,
  className,
  linkClassName,
  nameClassName,
  showName = false,
  asLink = true,
  priority,
}: AppLogoProps) => {
  const content = (
    <>
      <Image
        src={APP_DETAILS.logo}
        alt={showName ? "" : APP_DETAILS.name}
        width={width}
        height={height}
        priority={priority}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
      {showName ? (
        <span className={cn("font-semibold tracking-tight", nameClassName)}>
          {APP_DETAILS.name}
        </span>
      ) : null}
    </>
  )

  const shellClassName = cn(
    "inline-flex items-center gap-2",
    showName && "gap-3",
    linkClassName
  )

  if (!asLink) {
    return <span className={shellClassName}>{content}</span>
  }

  return (
    <Link href={ROUTES.HOME} className={shellClassName}>
      {content}
    </Link>
  )
}

export default AppLogo
