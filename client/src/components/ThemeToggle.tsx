"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/Button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-10 h-10 hover:bg-transparent transition-transform duration-500 ease-in-out active:scale-95"
            title="Toggle theme"
        >
            <div className="relative flex items-center justify-center w-full h-full">
                <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 opacity-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 dark:opacity-0 text-foreground" />
                <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 opacity-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:opacity-100 text-foreground" />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
