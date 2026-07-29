// Definimos los tipos para la entrada de datos (según lo que devuelve Supabase)
type FechaObjeto = { fecha: string }

/**
 * Convierte un string "YYYY-MM-DD" a un objeto Date local (00:00hs)
 * para evitar problemas de zonas horarias (UTC vs Local).
 */
const parseLocal = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split("-").map(Number)
    return new Date(y, m - 1, d)
}

/**
 * Verifica si un día es "hábil" (No es finde ni feriado)
 */
const esDiaHabil = (fecha: Date, listaFeriadosStrings: string[]): boolean => {
    const diaSemana = fecha.getDay() // 0 = Domingo, 6 = Sábado

    // 1. Descartar fin de semana
    if (diaSemana === 0 || diaSemana === 6) return false

    // 2. Descartar feriados
    // Convertimos la fecha actual a string YYYY-MM-DD para comparar
    const fechaIso = fecha.toLocaleDateString("en-CA") // Formato YYYY-MM-DD local
    if (listaFeriadosStrings.includes(fechaIso)) return false

    return true
}

export function fechaProxima(
    fechasExamenes: FechaObjeto[] | null,
    feriados: FechaObjeto[] | null,
    fechaReferencia: string | Date = new Date() // Por defecto es HOY
) {
    if (!fechasExamenes || fechasExamenes.length === 0) {
        return { proxima: null, isUrgent: false, status: null, tooltip: null }
    }

    // 1. Normalizar fecha de referencia (Hoy)
    const hoy = typeof fechaReferencia === "string"
        ? parseLocal(fechaReferencia)
        : new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), fechaReferencia.getDate())

    // 2. Preparar lista de feriados (Set para búsqueda rápida)
    // Asumimos que los feriados vienen en formato YYYY-MM-DD
    const setFeriados = new Set(feriados?.map(({ fecha }) => fecha) || [])
    const feriadosArray = Array.from(setFeriados) // Para usar en nuestra helper si hiciera falta

    // 3. Encontrar la próxima fecha válida
    // Convertimos a objetos Date, filtramos las pasadas y ordenamos
    const fechasFuturas = fechasExamenes
        .map(({ fecha }) => parseLocal(fecha))
        .filter(date => date >= hoy) // Solo fechas futuras o de hoy
        .sort((a, b) => a.getTime() - b.getTime())

    const proxima = fechasFuturas[0] || null

    if (!proxima) {
        return { proxima: null, isUrgent: false, status: null, tooltip: null }
    }

    // 4. Calcular urgencia (Días hábiles restantes)
    // Contamos cuántos días hábiles hay desde mañana hasta el día del examen (inclusive)
    let diasHabilesRestantes = 0

    // Clonamos la fecha para iterar sin modificar 'hoy'
    const cursor = new Date(hoy)

    // Avanzamos al día siguiente para empezar a contar "cuánto falta"
    // (Si el examen es hoy, el bucle no corre y faltan 0 días -> Urgente)
    cursor.setDate(cursor.getDate() + 1)

    // Bucle: Mientras el cursor sea menor o igual a la fecha del examen
    while (cursor <= proxima) {
        if (esDiaHabil(cursor, feriadosArray)) {
            diasHabilesRestantes++
        }

        // Si ya pasamos de 7 días, cortamos para optimizar (ya no es urgente ni nada)
        if (diasHabilesRestantes > 7) break

        cursor.setDate(cursor.getDate() + 1)
    }

    // Lógica de estados solicitada:
    // 1. Menos de 3 días: "inscripcion cerrada", tooltip: "el minimo son 3 dias"
    // 2. Entre 3 y 7 días: "urgente", tooltip: "el minimo son 3 dias"

    let status: string | null = null
    let tooltip: string | null = null
    let isUrgent = false

    if (diasHabilesRestantes < 3) {
        status = "inscripcion cerrada"
        tooltip = "el minimo son 3 dias"
        isUrgent = true
    } else if (diasHabilesRestantes <= 7) {
        status = "urgente"
        tooltip = "el minimo son 3 dias"
        isUrgent = true
    }

    return { proxima, isUrgent, status, tooltip }
}

export function parseLocalExamen(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number)
    return new Date(y, m - 1, d)
}

export function calcularDiasHabiles(fechaExamen: Date, hoy: Date): number {
    if (fechaExamen <= hoy) return 0

    let count = 0
    const cursor = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    cursor.setDate(cursor.getDate() + 1)

    const target = new Date(fechaExamen.getFullYear(), fechaExamen.getMonth(), fechaExamen.getDate())

    while (cursor <= target) {
        const day = cursor.getDay()
        if (day !== 0 && day !== 6) { // Excluir Sábado (6) y Domingo (0)
            count++
        }
        cursor.setDate(cursor.getDate() + 1)
    }
    return count
}

export function calcularDiasCalendario(fechaExamen: Date, hoy: Date): number {
    const d1 = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const d2 = new Date(fechaExamen.getFullYear(), fechaExamen.getMonth(), fechaExamen.getDate())
    const diffTime = d2.getTime() - d1.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

