"use client"

import {useState} from "react"
import Link from "next/link"
import {IconMenu2} from "@tabler/icons-react"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Separator} from "@/components/ui/separator"
import {cn, acortarNombreCarrera} from "@/lib/utils"
import type {Links} from "@/lib/navigation"

interface MobileNavSheetProps {
	primaryLinks: Links[]
	secondaryLinks: Links[]
}

export default function MobileNavSheet({primaryLinks, secondaryLinks}: MobileNavSheetProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger
				render={
					<Button variant="secondary" size="icon-lg">
						<IconMenu2 />
					</Button>
				}
			/>
			<SheetContent side="right" className="w-64 overflow-y-auto p-0">
				<SheetHeader className="border-b border-border/80 p-4">
					<SheetTitle>Navegación</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col gap-1 p-4">
					{/* Primary links */}
					{primaryLinks.map((link) => {
						const href = link.label === "Carreras" ? "/carreras" : link.href
						return (
							<Link
								key={link.label}
								href={href || "#"}
								onClick={() => setIsOpen(false)}
								className="flex flex-row items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
								<span className="size-4 shrink-0">{link.icon}</span>
								<span>{link.label}</span>
							</Link>
						)
					})}

					{/* Carreras list (if Carreras has subtabs) */}
					{primaryLinks[1]?.subtabs && (
						<>
							<Separator className="my-2" />
							<div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
								Carreras
							</div>
							{primaryLinks[1].subtabs.map(({label, href, icon, slug}) => (
								<Link
									key={label}
									href={href}
									onClick={() => setIsOpen(false)}
									className={cn(
										"flex flex-row items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors",
										slug && `theme-${slug}`,
									)}>
									<span className="size-4 shrink-0">{icon}</span>
									<span className="truncate">{acortarNombreCarrera(label)}</span>
								</Link>
							))}
						</>
					)}

					{/* Secondary links (Más) */}
					{secondaryLinks.length > 0 && (
						<>
							<Separator className="my-2" />
							<div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">Más</div>
							{secondaryLinks.map((link) => (
								<Link
									key={link.label}
									href={link.href || "#"}
									onClick={() => setIsOpen(false)}
									className="flex flex-row items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
									<span className="size-4 shrink-0">{link.icon}</span>
									<span>{link.label}</span>
								</Link>
							))}
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
