"use client"

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
	const isActive = pathname === href

	return (
		<SidebarMenuButton isActive={isActive} className={className} render={<Link href={href} />}>
			{icon}
			<span>{children}</span>
		</SidebarMenuButton>
	)
}
