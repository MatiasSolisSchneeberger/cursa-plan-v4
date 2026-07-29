import {getPlanEstudio, getMiCarrera} from "@/lib/carreras"
import {getCurrentUser} from "@/lib/auth"
import {isPlanFavorito} from "@/lib/actions"
import {PlanView} from "@/sections/plan/PlanView"
import {FavoritePlanButton} from "@/sections/plan/FavoritePlanButton"
import {Card, CardContent, CardHeader, CardAction} from "@/components/ui/card"
import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item"
import {IconInfoCircle} from "@tabler/icons-react"
import type {EstadoMateria} from "@/types/materiaTypes"

interface PageProps {
	params: Promise<{
		carreraSlug: string
		plan: string
	}>
}

export default async function PlanPage({params}: PageProps) {
	const resolvedParams = await params
	const {carreraSlug, plan} = resolvedParams

	const planData = await getPlanEstudio(plan, carreraSlug)
	const userRes = await getCurrentUser()
	const userId = userRes.data?.user?.id

	let initialAvances: Record<number, EstadoMateria> = {}
	let isFav = false

	if (userId) {
		try {
			const [seguimiento, favStatus] = await Promise.all([
				getMiCarrera(userId, planData.id),
				isPlanFavorito(userId, planData.id),
			])
			isFav = favStatus
			seguimiento.anios.forEach((a) => {
				a.periodos.forEach((p) => {
					p.materias.forEach((m) => {
						if (m.estadoMateria) {
							initialAvances[m.idMateriaPlan] = m.estadoMateria
						}
					})
				})
			})
		} catch (e) {
			console.error("Error al obtener avances e información inicial del usuario:", e)
		}
	}

	return (
		<section className="flex flex-col gap-6 py-4 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto">
			<Card>
				<CardHeader className="typeset">
					<h1 className="text-3xl font-bold tracking-tight">{planData.carrera.nombre}</h1>
					<CardAction>
						<FavoritePlanButton planId={planData.id} initialIsFavorite={isFav} userId={userId} />
					</CardAction>
				</CardHeader>
				<CardContent className="text-muted-foreground text-lg">
					<div className="flex flex-row flex-wrap gap-3">
						<Item variant="outline" size="sm" className="flex-1 min-w-50 max-w-sm">
							<ItemMedia>
								<IconInfoCircle className="size-5" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>
									Plan de estudio: {planData.anioInicio}
									{planData.anioFin && <> - {planData.anioFin}</>}
								</ItemTitle>
							</ItemContent>
						</Item>
					</div>
				</CardContent>
			</Card>

			<PlanView
				planData={planData}
				carreraSlug={carreraSlug}
				planIdOrYear={plan}
				initialAvances={initialAvances}
				userId={userId}
			/>
		</section>
	)
}
