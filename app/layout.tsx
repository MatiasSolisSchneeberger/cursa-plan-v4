import type { Metadata } from "next"
import "./globals.css"
import {cn} from "@/lib/utils"
import {TooltipProvider} from "@/components/ui/tooltip"

import {/*Poppins, */ Montserrat, JetBrains_Mono} from "next/font/google"
import {ThemeProvider} from "@/components/theme-provider"

export const metadata: Metadata = {
	title: "CursaPlan",
	description: "Plan de estudios interactivo para carreras universitarias",
}

/*const poppins = Poppins({
	weight: ["100,200,300,400,500,600,700,800,900"],
	subsets: ["latin"],
	variable: "--font-poppins",
})*/

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
})

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			suppressHydrationWarning
			lang="es"
			className={cn(
				"h-full",
				"antialiased",
				/*poppins.variable,*/
				montserrat.variable,
				jetbrainsMono.variable,
				"font-sans",
			)}>
			<body suppressHydrationWarning className="min-h-full flex flex-col">
				<TooltipProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</TooltipProvider>
			</body>
		</html>
	)
}

