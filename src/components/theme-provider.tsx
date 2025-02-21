
"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        const checkNairobiTime = () => {
            const nairobiTime = toZonedTime(new Date(), "Africa/Nairobi");
            const hours = nairobiTime.getHours();
            return hours >= 18 || hours < 8 ? "dark" : "light";
        };

        const systemTheme = checkNairobiTime();
        const effectiveTheme = theme === "system" ? systemTheme : theme;
        root.classList.add(effectiveTheme);

        // Set up interval to check time every minute
        const interval = setInterval(() => {
            if (theme === "system") {
                root.classList.remove("light", "dark");
                const newSystemTheme = checkNairobiTime();
                root.classList.add(newSystemTheme);
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value} {...props}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
