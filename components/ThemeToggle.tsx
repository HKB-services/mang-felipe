"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const id = React.useId();
  const isLight = resolvedTheme === "light";

  return (
    <label
      htmlFor={id}
      className="relative inline-block h-[2.2em] w-[4em] shrink-0 rounded-[30px] text-[8.5px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="sr-only">Toggle theme</span>
      <input
        id={id}
        type="checkbox"
        className="peer h-0 w-0 opacity-0"
        checked={isLight}
        onChange={() => setTheme(isLight ? "dark" : "light")}
        suppressHydrationWarning
      />
      <span
        className={cn(
          "absolute inset-0 cursor-pointer overflow-hidden rounded-[30px] bg-[#2a2a2a] transition-[background-color] duration-[0.4s]",
          "before:absolute before:bottom-[0.5em] before:left-[0.5em] before:h-[1.2em] before:w-[1.2em] before:rounded-[20px]",
          "before:shadow-[inset_8px_-4px_0px_0px_#fff] before:transition-[box-shadow,transform] before:duration-[0.4s]",
          "before:[transition-timing-function:cubic-bezier(0.81,-0.04,0.38,1.5)]",
          "peer-checked:bg-primary",
          "peer-checked:before:translate-x-[1.8em]",
          "peer-checked:before:shadow-[inset_15px_-4px_0px_15px_#ffcf48]",
          "peer-checked:[&_.theme-star]:opacity-0",
          "peer-checked:[&_.theme-cloud]:opacity-100",
          "peer-focus-visible:ring-ring/50 peer-focus-visible:ring-3 peer-focus-visible:outline-none",
        )}
      >
        <span className="theme-star absolute top-[0.5em] left-[2.5em] size-[2.5px] rounded-full bg-white transition-opacity duration-[0.4s]" />
        <span className="theme-star absolute top-[1.2em] left-[2.2em] size-[2.5px] rounded-full bg-white transition-opacity duration-[0.4s]" />
        <span className="theme-star absolute top-[0.9em] left-[3em] size-[2.5px] rounded-full bg-white transition-opacity duration-[0.4s]" />
        <svg
          viewBox="0 0 16 16"
          className="theme-cloud absolute -bottom-[1.4em] -left-[1.1em] w-[3.5em] opacity-0 transition-opacity duration-[0.4s]"
          aria-hidden
        >
          <path
            transform="matrix(.77976 0 0 .78395 -299.99 -418.63)"
            className="fill-primary-foreground"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </svg>
      </span>
    </label>
  );
}
