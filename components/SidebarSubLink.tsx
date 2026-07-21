"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuSubButton } from "./ui/sidebar"

interface SidebarSubLinkProps {
	href: string
	children: React.ReactNode
	className?: string
}

export default function SidebarSubLink({ href, children, className }: SidebarSubLinkProps) {
	const pathname = usePathname()
	const isActive = pathname === href

	return (
		<SidebarMenuSubButton isActive={isActive} className={className} render={<Link href={href} />}>
			{children}
		</SidebarMenuSubButton>
	)
}
