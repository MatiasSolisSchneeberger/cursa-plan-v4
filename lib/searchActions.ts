"use server"

import { getMateriasPlanSearchData } from "@/lib/carreras"
import type { SearchDataResponse } from "@/types/consultas"

/**
 * Server Action para obtener los datos de materias_plan de forma segura desde componentes de cliente.
 */
export async function fetchMateriasPlanSearchAction(): Promise<SearchDataResponse> {
	return await getMateriasPlanSearchData()
}
