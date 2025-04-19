import { create } from "zustand"

export const useThemeStore = create((set) =>({
    // Try to get the theme from local storage first
    theme: localStorage.getItem("chat-theme") || "cupcake",
    // setTheme function sets local storage first and then theme varialbe
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme)
        set({ theme })
    }
}))