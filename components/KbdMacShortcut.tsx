"use client"

import { useEffect, useState } from "react"
import { Kbd } from "./ui/kbd"

export default function KbdMacShortcut() {
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		setIsMac(navigator.userAgent.includes("Mac"))
	}, [])

	return <Kbd>{isMac ? "⌘" : "Ctrl"} + B</Kbd>
}
