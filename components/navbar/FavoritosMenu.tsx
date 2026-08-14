import { Suspense } from "react"
import Link from "next/link"
import { IconHeart } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Icon from "@/components/Icon"
import { getDashboardUsuario } from "@/lib/carreras"
import { rutaPlan } from "@/lib/rutas"
import type { Usuario } from "@/types/auth"

interface FavoritosMenuProps {
	user: Usuario | null | undefined
}

async function FavoritosList({ userId }: { userId: string }) {
	const { carrerasFavoritas } = await getDashboardUsuario(userId)

	if (carrerasFavoritas.length === 0) {
		return (
			<div className="px-3 py-6 text-center text-xs text-muted-foreground">
				Sin carreras favoritas
			</div>
		)
	}

	return (
		<>
			{carrerasFavoritas.map(({ carrera, anioInicio }) => (
				<DropdownMenuItem
					key={`${carrera.slug}-${anioInicio}`}
					render={
						<Link
							href={rutaPlan(carrera.slug, anioInicio.toString())}
							className="flex flex-row items-center gap-2.5 w-full">
							<Icon icon={carrera.icon} className="size-4 shrink-0" />
							<span className="text-sm">{carrera.nombre}</span>
						</Link>
					}
				/>
			))}
			<DropdownMenuSeparator />
			<DropdownMenuItem
				render={
					<Link href="/perfil" className="flex flex-row items-center gap-2.5 w-full text-xs">
						Ver todas en mi perfil
					</Link>
				}
			/>
		</>
	)
}

export default function FavoritosMenu({ user }: FavoritosMenuProps) {
	if (!user) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon-lg" aria-label="Carreras favoritas">
						<IconHeart className="size-4" />
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-56">
				<div className="px-2 py-1.5">
					<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Favoritas
					</p>
				</div>
				<Suspense
					fallback={
						<div className="px-3 py-6 text-center text-xs text-muted-foreground">
							Cargando...
						</div>
					}>
					<FavoritosList userId={user.id} />
				</Suspense>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
