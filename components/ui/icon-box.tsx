import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const iconBoxVariants = cva(
	"inline-flex shrink-0 items-center justify-center transition-colors [&_svg:not([class*='size-'])]:shrink-0",
	{
		variants: {
			variant: {
				primary: "bg-primary/10 text-primary border border-primary/20",
				secondary: "bg-secondary text-secondary-foreground border border-border",
				outline: "bg-background text-foreground border border-border",
				destructive: "bg-destructive/10 text-destructive border border-destructive/20",
				warning: "bg-warning/10 text-warning border border-warning/20",
				ghost: "bg-muted/50 text-muted-foreground border border-transparent",
			},
			size: {
				xs: "size-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
				sm: "size-9 rounded-lg [&_svg:not([class*='size-'])]:size-4.5",
				default: "size-10 rounded-lg [&_svg:not([class*='size-'])]:size-5",
				lg: "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-6",
				xl: "size-14 rounded-2xl [&_svg:not([class*='size-'])]:size-7",
			},
			shape: {
				default: "",
				circle: "rounded-full!",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
			shape: "default",
		},
	},
)

function IconBox({
	className,
	variant = "primary",
	size = "default",
	shape = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof iconBoxVariants>) {
	return (
		<div
			data-slot="icon-box"
			className={cn(iconBoxVariants({variant, size, shape, className}))}
			{...props}
		/>
	)
}

export {IconBox, iconBoxVariants}
