"use client"

import { useScroll, useMotionValueEvent } from "motion/react"
import { motion } from "motion/react"
import { useState, useEffect } from "react"

interface NavbarShellProps {
	children: React.ReactNode
}

export default function NavbarShell({ children }: NavbarShellProps) {
	const { scrollY } = useScroll()
	const [condensed, setCondensed] = useState(false)
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
		setPrefersReducedMotion(mq.matches)
		const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
		mq.addEventListener("change", handler)
		return () => mq.removeEventListener("change", handler)
	}, [])

	useMotionValueEvent(scrollY, "change", (latest) => {
		// Hiéresis: bajar a 24px para condensar, subir a 8px para expandir
		if (latest > 24 && !condensed) {
			setCondensed(true)
		} else if (latest < 8 && condensed) {
			setCondensed(false)
		}
	})

	const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }

	return (
		<motion.header
			className="sticky top-0 z-40 pt-2 w-full"
			animate={{
				paddingTop: condensed ? "0.25rem" : "0.5rem",
			}}
			transition={transition}>
			<motion.section
				className="bg-card/50 border-border flex flex-row gap-4 rounded-3xl border p-3 shadow-md backdrop-blur-md transition-colors duration-300"
				animate={{
					borderRadius: condensed ? "1rem" : "1.5rem",
					boxShadow: condensed
						? "0 10px 15px -3px rgb(0 0 0 / 0.15)"
						: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
				}}
				transition={transition}>
				{children}
			</motion.section>
		</motion.header>
	)
}
