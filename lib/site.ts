const urlCruda =
	process.env.NEXT_PUBLIC_SITE_URL ||
	(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
	"http://localhost:3000"

export const siteUrl = urlCruda.trim().replace(/\/+$/, "")

export function urlAbsoluta(path: string): string {
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}
