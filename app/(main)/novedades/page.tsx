import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Novedades",
	description: "Últimas novedades y actualizaciones.",
}

export default function NovedadesPage() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12">
			<div className="space-y-3 text-center max-w-md">
				<h1 className="text-3xl font-bold tracking-tight">Próximamente</h1>
				<p className="text-muted-foreground">
					La sección de novedades está en desarrollo. Volvé pronto.
				</p>
			</div>
		</div>
	)
}
