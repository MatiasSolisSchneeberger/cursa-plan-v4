import * as React from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import type {EstadoMateria} from "@/types/materiaTypes"
import {IconCircleDashed, IconHourglass, IconCircleDashedCheck, IconCircleCheck, IconCircleX} from "@tabler/icons-react"

export const ESTADO_OPTS = [
	{value: "Sin cursar", label: "Sin cursar", icon: IconCircleDashed, colorClass: "text-muted-foreground"},
	{value: "Cursando", label: "Cursando", icon: IconHourglass, colorClass: "text-info"},
	{value: "Regular", label: "Regular", icon: IconCircleDashedCheck, colorClass: "text-warning"},
	{value: "Aprobado", label: "Aprobado", icon: IconCircleCheck, colorClass: "text-success"},
	{value: "Libre", label: "Libre", icon: IconCircleX, colorClass: "text-destructive"},
] as const

interface MateriaEstadoSelectProps {
	value: EstadoMateria
	onValueChange: (value: EstadoMateria) => void
	disabledOptions?: Partial<Record<EstadoMateria, boolean>>
	className?: string
	disabled?: boolean
}

export function MateriaEstadoSelect({
	value,
	onValueChange,
	disabledOptions = {},
	className = "w-full sm:w-auto min-w-35",
	disabled = false,
}: MateriaEstadoSelectProps) {
	const currentOpt = ESTADO_OPTS.find((opt) => opt.value === value)
	const Icon = currentOpt?.icon

	return (
		<Select value={value} onValueChange={(val) => onValueChange(val as EstadoMateria)} disabled={disabled}>
			<SelectTrigger className={className} size="sm">
				<SelectValue placeholder="Sin cursar">
					{currentOpt && (
						<span className="flex items-center gap-2">
							{Icon && <Icon className={`size-4 ${currentOpt.colorClass}`} />}
							<span>{currentOpt.label}</span>
						</span>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent align="start">
				{ESTADO_OPTS.map((opt) => {
					const OptIcon = opt.icon
					const isDisabled = disabledOptions[opt.value]
					return (
						<SelectItem key={opt.value} value={opt.value} disabled={isDisabled}>
							<span className="flex items-center gap-2">
								<OptIcon className={`size-4 ${opt.colorClass}`} />
								<span>{opt.label}</span>
							</span>
						</SelectItem>
					)
				})}
			</SelectContent>
		</Select>
	)
}
