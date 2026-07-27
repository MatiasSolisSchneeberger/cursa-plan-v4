"use client"

import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {IconMoon, IconSun} from "@tabler/icons-react"

import {useEffect} from "react"

export function ThemeButton() {
	const {setTheme, resolvedTheme} = useTheme()

	const changeThemeWithTransition = (newTheme: string) => {
		if (typeof document !== "undefined" && "startViewTransition" in document) {
			;(document as Document & {startViewTransition: (cb: () => void) => void}).startViewTransition(() => {
				setTheme(newTheme)
			})
		} else {
			setTheme(newTheme)
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
				e.preventDefault()
				const targetTheme = resolvedTheme === "dark" ? "light" : "dark"
				changeThemeWithTransition(targetTheme)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [resolvedTheme, setTheme])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="outline" size="icon">
						<IconSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<IconMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => changeThemeWithTransition("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeThemeWithTransition("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeThemeWithTransition("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
