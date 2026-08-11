"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { buildLoginUrl } from "@/utils/redirect"

interface LoginButtonProps {
	variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "warning" | "link"
	size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
	className?: string
	children?: React.ReactNode
}

export default function LoginButton({
	children,
	variant = "default",
	size = "default",
	className,
}: LoginButtonProps) {
	const pathname = usePathname()
	const loginUrl = buildLoginUrl(pathname)

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			render={
				<Link href={loginUrl}>
					{children}
				</Link>
			}
		/>
	)
}
