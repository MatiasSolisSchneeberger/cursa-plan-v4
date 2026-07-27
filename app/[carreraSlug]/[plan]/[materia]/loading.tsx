import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@/components/ui/item"

export default function Loading() {
	return (
		<section className="flex flex-col gap-6 py-6 max-w-7xl px-3 sm:px-4 md:px-5 mx-auto w-full animate-pulse">
			{/* Botón Volver Skeleton */}
			<div className="flex items-center gap-2">
				<Skeleton className="h-9 w-32 bg-muted-foreground/10" />
			</div>

			{/* HERO CARD Skeleton */}
			<Card>
				<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
					<div className="w-full sm:w-2/3">
						<Skeleton className="h-8 w-3/4 bg-muted-foreground/10 mt-1" />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-14 bg-muted-foreground/10" />
						<Skeleton className="h-9 w-28 bg-muted-foreground/10 rounded-lg" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-row flex-wrap gap-3 *:flex-1 *:min-w-xs *:max-w-lg">
						{[1, 2, 3, 4].map((i) => (
							<Item key={i} variant="outline" size="sm" className="pointer-events-none">
								<ItemMedia>
									<Skeleton className="size-5 rounded-md bg-muted-foreground/10" />
								</ItemMedia>
								<ItemContent className="space-y-1.5">
									<Skeleton className="h-3 w-12 bg-muted-foreground/10" />
									<Skeleton className="h-4 w-20 bg-muted-foreground/10" />
								</ItemContent>
							</Item>
						))}
					</div>
				</CardContent>
			</Card>

			{/* DOCUMENTOS Skeleton */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-56 bg-muted-foreground/10 px-1" />
				<div className="flex flex-col gap-2">
					{[1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card/50">
							<div className="flex items-center gap-3">
								<Skeleton className="size-9 rounded bg-muted-foreground/10" />
								<div className="space-y-1.5">
									<Skeleton className="h-4 w-40 bg-muted-foreground/10" />
									<Skeleton className="h-3 w-20 bg-muted-foreground/10" />
								</div>
							</div>
							<Skeleton className="h-8 w-20 bg-muted-foreground/10 rounded" />
						</div>
					))}
				</div>
			</div>

			{/* EQUIPO DOCENTE Skeleton */}
			<div className="flex flex-col gap-3">
				<Skeleton className="h-6 w-24 bg-muted-foreground/10 px-1" />
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card/50">
							<Skeleton className="size-10 rounded-full bg-muted-foreground/10" />
							<div className="space-y-1.5 flex-1">
								<Skeleton className="h-4 w-32 bg-muted-foreground/10" />
								<Skeleton className="h-3 w-24 bg-muted-foreground/10" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
