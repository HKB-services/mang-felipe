"use client"

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react"

type BreadcrumbLabelContextValue = {
  labels: Map<string, string>
  setLabel: (segment: string, label: string) => void
}

const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextValue>({
  labels: new Map(),
  setLabel: () => {},
})

export function useBreadcrumbLabels() {
  return use(BreadcrumbLabelContext)
}

/** Lets a page register the display label for a dynamic route segment (e.g. a cuid) once its data loads. */
export function BreadcrumbLabelProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Map<string, string>>(new Map())

  const setLabel = useCallback((segment: string, label: string) => {
    setLabels((previous) => {
      if (previous.get(segment) === label) return previous
      return new Map(previous).set(segment, label)
    })
  }, [])

  const value = useMemo(() => ({ labels, setLabel }), [labels, setLabel])

  return <BreadcrumbLabelContext value={value}>{children}</BreadcrumbLabelContext>
}
