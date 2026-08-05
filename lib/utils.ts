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

/**
 * Genera un slug uniforme a partir de un texto (remueve acentos, convierte a minúsculas,
 * elimina caracteres especiales y reemplaza espacios por guiones).
 */
export function generarSlug(str: string): string {
  if (!str) return ""
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Normaliza un texto convirtiéndolo a minúsculas y removiendo acentos/diacríticos.
 */
export function normalizeText(str: string): string {
  if (!str) return ""
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}
