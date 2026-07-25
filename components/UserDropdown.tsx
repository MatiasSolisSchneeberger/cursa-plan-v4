"use client"

import Link from "next/link"
import {useRouter} from "next/navigation"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/UserAvatar"
import {signOut} from "@/lib/auth"
import type {Usuario} from "@/types/auth"
import {IconUser, IconSettings, IconHeart, IconLogout} from "@tabler/icons-react"

interface UserDropdownProps {
	user: Usuario
}

export default function UserDropdown({user}: UserDropdownProps) {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut()
		router.refresh()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button>
						<UserAvatar user={user} />
					</button>
				}
			/>
			<DropdownMenuContent align="end" className="w-56 p-1.5">
				<div className="flex flex-col space-y-1 p-2">
					{user.full_name && <p className="text-sm font-semibold leading-none text-foreground">{user.full_name}</p>}
					{user.username ?
						<p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
					:	null}
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						render={
							<Link href="/perfil" className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5">
								<IconUser className="size-4 text-muted-foreground" />
								<span>Ir a mi perfil</span>
							</Link>
						}
					/>
					<DropdownMenuItem
						render={
							<Link href="/configuracion" className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5">
								<IconSettings className="size-4 text-muted-foreground" />
								<span>Configuración</span>
							</Link>
						}
					/>
					<DropdownMenuItem
						render={
							<Link
								href="/carreras/favoritas"
								className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5">
								<IconHeart className="size-4 text-muted-foreground" />
								<span>Mis carreras favoritas</span>
							</Link>
						}
					/>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={handleSignOut}
					className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5">
					<IconLogout className="size-4" />
					<span>Cerrar sesión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
