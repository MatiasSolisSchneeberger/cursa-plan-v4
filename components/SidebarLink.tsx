"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton } from "./ui/sidebar"

interface SidebarLinkProps {
	href: string
	children: React.ReactNode
	icon?: React.ReactNode
	className?: string
}

export default function SidebarLink({ href, children, icon, className }: SidebarLinkProps) {
	const pathname = usePathname()
	const [currentHash, setCurrentHash] = React.useState("")

	React.useEffect(() => {
		setCurrentHash(window.location.hash)

		const handleHashChange = () => {
			setCurrentHash(window.location.hash)
		}

		window.addEventListener("hashchange", handleHashChange)
		window.addEventListener("popstate", handleHashChange)
		return () => {
			window.removeEventListener("hashchange", handleHashChange)
			window.removeEventListener("popstate", handleHashChange)
		}
	}, [])

	const [targetPath, targetHash] = href.split("#")
	const isPathMatch = pathname === targetPath
	let isActive = false

	if (isPathMatch) {
		if (!targetHash || targetHash === "informacion") {
			isActive = !currentHash || currentHash === "#" || currentHash === "#informacion"
		} else {
			isActive = currentHash === `#${targetHash}`
		}
	}

	return (
		<SidebarMenuButton isActive={isActive} className={className} render={<Link href={href} />}>
			{icon}
			<span>{children}</span>
		</SidebarMenuButton>
	)
}

