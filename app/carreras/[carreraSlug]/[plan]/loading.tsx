import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
	return (
		<div className="p-6 space-y-4">
			<Skeleton className="h-6 w-1/4 bg-muted-foreground/10" />
			<Skeleton className="h-4 w-3/4 bg-muted-foreground/10" />
			<Skeleton className="h-4 w-1/2 bg-muted-foreground/10" />
			<Skeleton className="h-4 w-2/3 bg-muted-foreground/10" />
			<div className="space-y-2 pt-4">
				<Skeleton className="h-10 w-full bg-muted-foreground/10" />
				<Skeleton className="h-10 w-full bg-muted-foreground/10" />
				<Skeleton className="h-10 w-full bg-muted-foreground/10" />
			</div>
		</div>
	)
}
