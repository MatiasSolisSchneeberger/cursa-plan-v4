import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Acorta el nombre de una carrera reemplazando prefijos comunes:
 * - "Ingeniería" / "Ingenieria" -> "Ing."
 * - "Licenciatura" -> "Lic."
 * - "Profesorado" -> "Prof."
 */
export function acortarNombreCarrera(nombre: string): string {
  if (!nombre) return ""
  return nombre
    .replace(/Ingenier[íi]a/g, "Ing.")
    .replace(/Licenciatura/g, "Lic.")
    .replace(/Profesorado/g, "Prof.")
}

