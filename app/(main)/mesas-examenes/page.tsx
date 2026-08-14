import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Mesas de Exámenes",
	description: "Información sobre las mesas de exámenes disponibles.",
}

export default function MesasExamenesPage() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12">
			<div className="space-y-3 text-center max-w-md">
				<h1 className="text-3xl font-bold tracking-tight">Próximamente</h1>
				<p className="text-muted-foreground">
					La sección de mesas de exámenes está en desarrollo. Volvé pronto.
				</p>
			</div>
		</div>
	)
}
