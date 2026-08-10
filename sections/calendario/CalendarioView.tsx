"use client"

import {useState, useMemo} from "react"
import {CalendarEvent} from "@/utils/transformEventos"
import {PERIODOS_CALENDARIO, construirMeses} from "@/utils/calendario"
import {cn} from "@/lib/utils"
import {CalendarioHero} from "./CalendarioHero"
import {AnioSelector} from "./AnioSelector"
import {CalendarioTabs} from "./CalendarioTabs"
import {MesCard} from "./MesCard"

interface CalendarioViewProps {
	eventos: CalendarEvent[]
	anioActivo: number
	anios: number[]
}

export function CalendarioView({eventos, anioActivo, anios}: CalendarioViewProps) {
	const [tabPrimario, setTabPrimario] = useState("feriados")
	const [tabSecundario, setTabSecundario] = useState("cuatrimestre")

	const eventosPorCategoria = useMemo(() => {
		return eventos.filter(({categoria}) => categoria === tabPrimario)
	}, [eventos, tabPrimario])

	const periodosDisponibles = useMemo(() => {
		const conPeriodo = eventosPorCategoria.filter(({periodSlug}) => periodSlug)
		const slugs = new Set(conPeriodo.map(({periodSlug}) => periodSlug as string))
		return Array.from(slugs).sort()
	}, [eventosPorCategoria])

	const eventosFiltrados = useMemo(() => {
		if (periodosDisponibles.length === 0) {
			return eventosPorCategoria
		}
		return eventosPorCategoria.filter(({periodSlug}) => periodSlug === tabSecundario)
	}, [eventosPorCategoria, tabSecundario, periodosDisponibles])

	const meses = construirMeses(anioActivo)
	const esAnioPasado = anioActivo < new Date().getFullYear()

	const handleTabPrimarioChange = (nuevoTab: string) => {
		setTabPrimario(nuevoTab)

		const nuevaCategoria = eventos.filter(({categoria}) => categoria === nuevoTab)
		const nuevosPeridos = new Set(
			nuevaCategoria.filter(({periodSlug}) => periodSlug).map(({periodSlug}) => periodSlug as string),
		)

		const periodoExiste = nuevosPeridos.has(tabSecundario)
		if (!periodoExiste) {
			const disponibleEnOrden = PERIODOS_CALENDARIO.find(({id}) => nuevosPeridos.has(id))
			setTabSecundario(disponibleEnOrden?.id || "cuatrimestre")
		}
	}

	return (
		<div className="w-full space-y-6">
			<CalendarioHero eventos={eventosFiltrados} />

			<div className="flex flex-col items-center gap-3">
				<AnioSelector anioActivo={anioActivo} anios={anios} />
				<CalendarioTabs
					tabPrimario={tabPrimario}
					onTabPrimarioChange={handleTabPrimarioChange}
					tabSecundario={tabSecundario}
					onTabSecundarioChange={setTabSecundario}
					periodosDisponibles={periodosDisponibles}
				/>
			</div>

			<div
				className={cn(
					"grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
					esAnioPasado && "opacity-75",
				)}>
				{meses.map(({mes, nombre, dias}) => (
					<MesCard key={mes} mes={mes} nombre={nombre} dias={dias} eventos={eventosFiltrados} anioActivo={anioActivo} />
				))}
			</div>
		</div>
	)
}
