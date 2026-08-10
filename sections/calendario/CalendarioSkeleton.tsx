import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function CalendarioSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-full mt-2" />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="[--cell-radius:var(--radius-md)]">
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="flex-1 h-6" />
                  ))}
                </div>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, k) => (
                      <Skeleton key={k} className="aspect-square flex-1" />
                    ))}
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
