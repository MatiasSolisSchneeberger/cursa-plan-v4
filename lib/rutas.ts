export function rutaPlan(carreraSlug: string, plan: string | number): string {
	return `/carreras/${carreraSlug}/${plan}`
}

export function rutaMateria(carreraSlug: string, plan: string | number, materiaSlug: string): string {
	return `/carreras/${carreraSlug}/${plan}/${materiaSlug}`
}
