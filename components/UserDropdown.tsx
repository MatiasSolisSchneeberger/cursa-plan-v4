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
import type {PerfilUsuario} from "@/types/consultas"
import {isAdminRole} from "@/lib/permissions"
import {IconUser, IconSettings, IconLogout, IconShieldCheck, IconSelector, IconBell} from "@tabler/icons-react"
import {cn} from "@/lib/utils"

interface UserDropdownProps {
	user: Usuario | PerfilUsuario | null | undefined
	isSidebar?: boolean
}

export default function UserDropdown({user, isSidebar = false}: UserDropdownProps) {
	const router = useRouter()

	if (!user) return null

	const fullName = ("fullName" in user && user.fullName) ? user.fullName : ("full_name" in user && user.full_name) ? user.full_name : "Usuario"
	const username = user.username
	const avatarUrl = ("avatarUrl" in user && user.avatarUrl) ? user.avatarUrl : ("avatar_url" in user && user.avatar_url) ? user.avatar_url : null
	const role = user.role || "user"

	const normalizedUser: Usuario = {
		id: user.id || "",
		username: username,
		full_name: fullName,
		avatar_url: avatarUrl,
		updated_at: ("updated_at" in user && user.updated_at) ? user.updated_at : null,
		role: role,
		icon: ("icon" in user && user.icon) ? user.icon : null,
		email: ("email" in user && user.email) ? user.email : null,
	}

	const handleSignOut = async () => {
		await signOut()
		router.refresh()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					isSidebar ?
						<button className="flex items-center gap-3 w-full p-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/60 transition-all border border-sidebar-border/60 text-left cursor-pointer group">
							<UserAvatar user={normalizedUser} />
							<div className="flex flex-col min-w-0 leading-tight flex-1">
								<span className="text-xs font-semibold text-sidebar-foreground truncate">{fullName}</span>
								{username && <span className="text-[10px] text-muted-foreground truncate">@{username}</span>}
							</div>
							<IconSelector className="size-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
						</button>
					:	<button className="cursor-pointer">
							<UserAvatar user={normalizedUser} size="lg" />
						</button>
				}
			/>
			<DropdownMenuContent align={isSidebar ? "start" : "end"} className="w-56 p-1.5">
				<div className="flex flex-col space-y-1 p-2">
					<p className="text-sm font-semibold leading-none text-foreground">{fullName}</p>
					{username && <p className="text-xs leading-none text-muted-foreground">@{username}</p>}
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
							<Link
								href="/perfil/configuracion"
								className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5">
								<IconSettings className="size-4 text-muted-foreground" />
								<span>Configuración</span>
							</Link>
						}
					/>
					{isAdminRole(role) && (
						<DropdownMenuItem
							render={
								<Link
									href="/admin"
									className="flex flex-row items-center gap-2.5 w-full cursor-pointer py-1.5 font-medium text-amber-600 dark:text-amber-400">
									<IconShieldCheck className="size-4 text-amber-500" />
									<span>Panel de administración</span>
								</Link>
							}
						/>
					)}
					<DropdownMenuItem
						render={
							<div className="flex flex-row items-center gap-2.5 w-full cursor-default py-1.5">
								<IconBell className="size-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">No hay notificaciones</span>
							</div>
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
