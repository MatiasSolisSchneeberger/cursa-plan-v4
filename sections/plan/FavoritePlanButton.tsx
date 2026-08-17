"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"
import {setToggleFavoritoPlan} from "@/lib/actions"
import {IconHeart, IconHeartFilled} from "@tabler/icons-react"
import {cn} from "@/lib/utils"

interface FavoritePlanButtonProps {
	planId: number | string
	initialIsFavorite?: boolean
	isAuthenticated?: boolean
	className?: string
}

export function FavoritePlanButton({
	planId,
	initialIsFavorite = false,
	isAuthenticated = false,
	className,
}: FavoritePlanButtonProps) {
	const [isFavorite, setIsFavorite] = React.useState<boolean>(() => {
		if (initialIsFavorite) return true
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem(`cursa_plan_fav_${planId}`)
				if (saved !== null) return saved === "true"
			} catch {}
		}
		return initialIsFavorite
	})
	const [isPending, startTransition] = React.useTransition()
	const storageKey = `cursa_plan_fav_${planId}`

	const handleToggle = () => {
		const nextState = !isFavorite
		setIsFavorite(nextState)

		try {
			localStorage.setItem(storageKey, String(nextState))
		} catch (e) {
			console.error("Error al guardar favorito en localStorage:", e)
		}

		if (!isAuthenticated) return

		startTransition(async () => {
			const success = await setToggleFavoritoPlan(planId)
			if (!success) {
				setIsFavorite(!nextState)
				try {
					localStorage.setItem(storageKey, String(!nextState))
				} catch (e) {}
			}
		})
	}

	return (
		<Button
			variant={isFavorite ? "secondary" : "outline"}
			size="sm"
			onClick={handleToggle}
			disabled={isPending}
			className={cn(
				"gap-2 transition-all duration-200 cursor-pointer font-medium",
				isFavorite && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
				className
			)}
			title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
			{isFavorite ? (
				<IconHeartFilled className="size-4 text-rose-500 animate-in zoom-in-75 duration-150" />
			) : (
				<IconHeart className="size-4 text-muted-foreground transition-colors group-hover:text-rose-500" />
			)}
			<span>{isFavorite ? "Favorito" : "Favorito"}</span>
		</Button>
	)
}
