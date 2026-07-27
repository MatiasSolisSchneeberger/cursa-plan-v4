import type { CarreraJSON, Condicion, Requisito } from '../types/carrera';

// --- FUNCIÓN AUXILIAR PARA AGRUPAR CORRELATIVAS ---
export interface CorrelativaRaw {
    tipo_requisito: string;
    condicion: string;
    requisito_plan?: {
        id: number;
        materia: {
            nombre: string;
            slug: string;
        };
    };
    porcentaje?: number;
    notas?: string;
}

export const formatearCorrelativas = (correlativasRaw: CorrelativaRaw[]) => {
    // Mapa principal: Clave = "cursar" | "rendir"
    const gruposPrincipales = new Map();

    correlativasRaw.forEach((item) => {
        const tipoRequisito = item.tipo_requisito; // "cursar" o "rendir"

        // 1. Crear el grupo principal si no existe (ej: "cursar")
        if (!gruposPrincipales.has(tipoRequisito)) {
            gruposPrincipales.set(tipoRequisito, {
                tipo: tipoRequisito,
                condicionesMap: new Map() // Sub-mapa para agrupar por condición interna
            });
        }

        const grupo = gruposPrincipales.get(tipoRequisito);

        // 2. Determinar la clave de agrupación interna (ej: "materia-regular", "porcentaje", "nota")
        let keyInterna = "";
        let estructuraBase: Condicion | undefined;
        let nuevoRequisito: Requisito | undefined;

        if (item.requisito_plan) {
            // Es una materia (obtenida via materia_plan)
            keyInterna = `materia-${item.condicion}`; // ej: "materia-regular"
            estructuraBase = {
                tipo: "materia",
                condicion: item.condicion,
                requisitos: []
            };
            // item.requisito_plan tiene { id, materia: { nombre, slug } }
            nuevoRequisito = {
                id: item.requisito_plan.id,
                nombre: item.requisito_plan.materia.nombre,
                slug: item.requisito_plan.materia.slug
            };
        } else if (item.porcentaje) {
            // Es un porcentaje
            keyInterna = "porcentaje";
            estructuraBase = {
                tipo: "porcentaje",
                requisitos: []
            };
            nuevoRequisito = { porcentaje: item.porcentaje };
        } else if (item.notas) {
            // Es una nota o texto
            keyInterna = "nota";
            estructuraBase = {
                tipo: "nota",
                requisitos: []
            };
            nuevoRequisito = { nota: item.notas };
        }


        // 3. Crear el sub-grupo si no existe y agregar el requisito
        if (keyInterna && estructuraBase && nuevoRequisito) {
            if (!grupo.condicionesMap.has(keyInterna)) {
                grupo.condicionesMap.set(keyInterna, estructuraBase);
            }
            // Agregamos el item específico a la lista de requisitos
            grupo.condicionesMap.get(keyInterna).requisitos.push(nuevoRequisito);
        }
    });

    // 4. Transformar los Mapas a Arrays para el JSON final
    return Array.from(gruposPrincipales.values()).map(({ tipo, condicionesMap }: any) => ({
        tipo,
        condiciones: Array.from(condicionesMap.values())
    }));
};


// --- TRANSFORMADOR PRINCIPAL ---
export const transformarDatos = (data: any): CarreraJSON => {
    return {
        carrera: data.nombre,
        id: data.id,
        icon: data.icon,
        planes: data.planes.map(({ id, anio_inicio, anio_fin, materias_plan }: any) => {

            const aniosMap = new Map();
            const orientacionesSet = new Map();

            materias_plan.forEach((item: any) => {

                // A. Orientaciones
                if (item.orientacion) {
                    if (!orientacionesSet.has(item.orientacion.id)) {
                        orientacionesSet.set(item.orientacion.id, {
                            nombre: item.orientacion.nombre,
                            slug: item.orientacion.slug,
                            id: item.orientacion.id
                        });
                    }
                }

                // B. Años
                if (!aniosMap.has(item.anio)) {
                    aniosMap.set(item.anio, { anio: item.anio, periodosMap: new Map() });
                }
                const anioObj = aniosMap.get(item.anio);

                // C. Periodos
                const periodoId = item.periodo?.id || 0;
                const periodoKey = `${item.nro_periodo}-${periodoId}`;

                if (!anioObj.periodosMap.has(periodoKey)) {
                    anioObj.periodosMap.set(periodoKey, {
                        id: item.nro_periodo, // Keep nro_periodo for sorting
                        nroPeriodo: item.nro_periodo,
                        tipoPeriodo: item.periodo ? {
                            id: item.periodo.id,
                            slug: item.periodo.slug,
                            nombre: item.periodo.nombre
                        } : {
                            id: 0,
                            slug: "no-definido", // fallback default
                            nombre: "No definido"
                        },
                        materias: []
                    });
                }

                const periodoActual = anioObj.periodosMap.get(periodoKey);

                // Evitar duplicados por idMateriaPlan (el item del plan), no por materia.id
                const materiaYaExiste = periodoActual.materias.some((m: any) => m.idMateriaPlan === item.id);

                if (!materiaYaExiste) {
                    periodoActual.materias.push({
                        id: item.materia.id,
                        idMateriaPlan: item.id,
                        nombre: item.materia.nombre,
                        slug: item.materia.slug,

                        // Si tiene un número, es true. Si es null, es false.
                        esOptativa: !!item.nro_optativa,
                        // Opcional: si quieres mostrar "Optativa 1", guarda el número también
                        nroOptativa: item.nro_optativa,

                        orientacion: item.orientacion ? {
                            nombre: item.orientacion.nombre,
                            slug: item.orientacion.slug
                        } : null,

                        // AQUÍ LLAMAMOS A LA NUEVA LÓGICA DE AGRUPACIÓN vvv
                        correlativas: formatearCorrelativas(item.correlativas)
                    });
                }
            });

            // Ordenamiento final
            const anios = Array.from(aniosMap.values())
                .sort((a: any, b: any) => a.anio - b.anio)
                .map(({ anio, periodosMap }: any) => ({
                    anio,
                    periodosMap,
                    periodos: Array.from(periodosMap.values())
                        .sort((p1: any, p2: any) => p1.nroPeriodo - p2.nroPeriodo)
                }));

            return {
                id,
                anioInicio: anio_inicio,
                anioFin: anio_fin,
                listaOrientaciones: Array.from(orientacionesSet.values()),
                anios: anios
            };
        })
    };
};
