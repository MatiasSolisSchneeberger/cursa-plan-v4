"use client"

import React from "react"
import { IconFolder, IconChevronRight } from "@tabler/icons-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible"
import { SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuSub } from "./ui/sidebar"
import { cn } from "@/lib/utils"

interface SidebarFolderProps {
	title: string
	icon?: React.ReactNode
	children: React.ReactNode
	defaultOpen?: boolean
	className?: string
}

export default function SidebarFolder({
	title,
	icon = <IconFolder className="size-4 shrink-0 text-muted-foreground" />,
	children,
	defaultOpen = false,
	className,
}: SidebarFolderProps) {
	return (
		<SidebarMenuSubItem>
			<Collapsible defaultOpen={defaultOpen} className="group/collapsible w-full">
				<CollapsibleTrigger
					render={
						<SidebarMenuSubButton
							className={cn(
								"w-full justify-between cursor-pointer text-xs font-normal text-sidebar-foreground hover:text-sidebar-foreground",
								className
							)}
						>
							<div className="flex items-center gap-2 min-w-0">
								{icon}
								<span className="truncate">{title}</span>
							</div>
							<IconChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground shrink-0" />
						</SidebarMenuSubButton>
					}
				/>
				<CollapsibleContent>
					<SidebarMenuSub className="mx-0 px-0 ml-2.5 pl-2 border-l border-sidebar-border/30 flex flex-col gap-1 mt-0.5">
						{children}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuSubItem>
	)
}
