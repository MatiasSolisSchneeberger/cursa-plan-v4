import type {Metadata} from "next"
import "./globals.css"
import {cn} from "@/lib/utils"
import {TooltipProvider} from "@/components/ui/tooltip"

import {Poppins, Montserrat, JetBrains_Mono} from "next/font/google"
import {ThemeProvider} from "@/components/theme-provider"

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-poppins",
})

const montserrat = Montserrat({
	weight: "600",
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
				poppins.variable,
				montserrat.variable,
				jetbrainsMono.variable,
				"font-sans",
			)}>
			<title>CursaPlan</title>
			<body className="min-h-full flex flex-col">
				<TooltipProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						{children}
					</ThemeProvider>
				</TooltipProvider>
			</body>
		</html>
	)
}
