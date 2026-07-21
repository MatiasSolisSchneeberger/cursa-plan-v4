
import { type GrupoCorrelativa, type Condicion, type Requisito } from "@/types/carrera";

export const isGroupSatisfied = (
    grupo: GrupoCorrelativa,
    getEstado: (id: number) => string | undefined
) => {
    // Verificamos cada condición del grupo
    return grupo.condiciones.every((cond: Condicion) => {
        if (cond.tipo === "materia") {
            // Verificamos cada requisito dentro de la condición
            return cond.requisitos.every((req: Requisito) => {
                if ("id" in req && req.id) {
                    const est = getEstado(req.id);
                    if (!est || est === "Sin cursar") return false;

                    const condicionRequerida = cond.condicion?.toLowerCase();
                    // Si no tiene condición explicita, asumimos que con tener algún estado positivo basta?
                    // O asumimos Regular? Por seguridad y consistencia con lo anterior:
                    if (condicionRequerida === "aprobado") {
                        return est === "Aprobado";
                    } else {
                        // Default o 'regular' -> Regular o Aprobado
                        return est === "Regular" || est === "Aprobado";
                    }
                }
                // Si es otro tipo de requisito (nota, porcentaje), asumimos true por ahora o lo ignoramos
                return true;
            });
        }
        return true;
    });
};

export const getMateriaAvailability = (
    correlativas: GrupoCorrelativa[] | undefined,
    getEstado: (id: number) => string | undefined
) => {
    if (!correlativas) {
        // Si no hay correlativas, ¿está todo OK? Asumiremos que si.
        return {
            cursarSatisfied: true,
            rendirSatisfied: true,
            isBloqueado: false,
            isSoloCursar: false,
            isDesbloqueado: true
        }
    }

    const checkGroup = (tipo: string) => {
        const grupo = correlativas.find(g => g.tipo === tipo);
        if (!grupo) return true;
        return isGroupSatisfied(grupo, getEstado);
    }

    const cursarSatisfied = checkGroup("cursar");
    const rendirSatisfied = checkGroup("rendir");

    const isBloqueado = !cursarSatisfied;
    const isSoloCursar = cursarSatisfied && !rendirSatisfied;
    const isDesbloqueado = cursarSatisfied && rendirSatisfied;

    return {
        cursarSatisfied,
        rendirSatisfied,
        isBloqueado,
        isSoloCursar,
        isDesbloqueado,
    };
};
