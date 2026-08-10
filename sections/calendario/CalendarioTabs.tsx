"use client"

import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {TABS_CALENDARIO, PERIODOS_CALENDARIO} from "@/utils/calendario"

interface CalendarioTabsProps {
	tabPrimario: string
	onTabPrimarioChange: (tab: string) => void
	tabSecundario: string
	onTabSecundarioChange: (tab: string) => void
	periodosDisponibles: string[]
}

export function CalendarioTabs({
	tabPrimario,
	onTabPrimarioChange,
	tabSecundario,
	onTabSecundarioChange,
	periodosDisponibles,
}: CalendarioTabsProps) {
	const mostrarSecundario = periodosDisponibles.length > 0
	const periodosOrdenados = PERIODOS_CALENDARIO.filter(({id}) => periodosDisponibles.includes(id))

	return (
		<div className="space-y-3">
			<Tabs value={tabPrimario} onValueChange={onTabPrimarioChange}>
				<TabsList className="w-fit">
					{TABS_CALENDARIO.map(({id, label}) => (
						<TabsTrigger key={id} value={id} className="text-xs sm:text-sm">
							{label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			{mostrarSecundario && (
				<Tabs value={tabSecundario} onValueChange={onTabSecundarioChange}>
					<TabsList className="w-fit">
						{periodosOrdenados.map(({id, label}) => (
							<TabsTrigger key={id} value={id} className="text-xs sm:text-sm">
								{label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			)}
		</div>
	)
}
