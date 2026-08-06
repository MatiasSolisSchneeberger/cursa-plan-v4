export type ContentCategory = "Legal" | "Privacidad" | "Ayuda" | "Información" | "Contacto"

export interface ContentFrontmatter {
	title: string
	description: string
	/** Fecha ISO corta: "YYYY-MM-DD" */
	lastUpdated: string
	category: ContentCategory
}
