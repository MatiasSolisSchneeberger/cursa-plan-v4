import fs from "fs"
import path from "path"
import {procesarFechasExamenes} from "../lib/procesarFechasExamenes"

// Cargar .env.local de forma manual para ejecución local en Node
function cargarEnvLocal() {
	const envPath = path.resolve(process.cwd(), ".env.local")
	if (fs.existsSync(envPath)) {
		const envContent = fs.readFileSync(envPath, "utf-8")
		envContent.split("\n").forEach((line) => {
			const trimmed = line.trim()
			if (!trimmed || trimmed.startsWith("#")) return
			const firstEquals = trimmed.indexOf("=")
			if (firstEquals !== -1) {
				const key = trimmed.slice(0, firstEquals).trim()
				const value = trimmed
					.slice(firstEquals + 1)
					.trim()
					.replace(/^"|"$/g, "")
				process.env[key] = value
			}
		})
	}
}

async function main() {
	cargarEnvLocal()

	const args = process.argv.slice(2)
	if (args.length < 1) {
		console.error("Uso: npx tsx scripts/procesar-csv.ts <ruta_csv_entrada> [ruta_csv_salida]")
		process.exit(1)
	}

	const inputPath = path.resolve(process.cwd(), args[0])
	let outputPath = args[1] ? path.resolve(process.cwd(), args[1]) : path.resolve(process.cwd(), "fechas_examenes_salida.csv")

	if (fs.existsSync(outputPath) && fs.statSync(outputPath).isDirectory()) {
		outputPath = path.join(outputPath, "fechas_examenes_salida.csv")
	}

	if (!fs.existsSync(inputPath)) {
		console.error(`Error: El archivo de entrada no existe en la ruta: ${inputPath}`)
		process.exit(1)
	}

	const startIdArg = args[2] ? parseInt(args[2], 10) : 1461
	const startId = isNaN(startIdArg) ? 1461 : startIdArg

	const csvContent = fs.readFileSync(inputPath, "utf-8")
	const resultado = await procesarFechasExamenes(csvContent, undefined, startId)

	if (!resultado.success) {
		console.error("\n❌ Se encontraron los siguientes errores al procesar el archivo CSV:\n")
		resultado.errors.forEach(({lineNumber, message}) => {
			if (lineNumber) {
				console.error(` [Línea ${lineNumber}] ${message}`)
			} else {
				console.error(` ${message}`)
			}
		})
		console.error("\nProceso cancelado. No se generó el archivo de salida.")
		process.exit(1)
	}

	fs.writeFileSync(outputPath, resultado.csvOutput, "utf-8")
	console.log(`\n✅ Procesamiento exitoso!`)
	console.log(`- Registros generados: ${resultado.recordsCount}`)
	console.log(`- Archivo de salida creado en: ${outputPath}\n`)
}

main().catch((err) => {
	console.error("Error inesperado:", err)
	process.exit(1)
})
