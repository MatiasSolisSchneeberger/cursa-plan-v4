"use client"

import { useState } from "react"
import { Kbd } from "./ui/kbd"

export default function KbdMacShortcut() {
	const [isMac] = useState(() => {
		if (typeof window !== "undefined") {
			return navigator.userAgent.includes("Mac")
		}
		return false
	})

	return <Kbd>{isMac ? "⌘" : "Ctrl"} + B</Kbd>
}
