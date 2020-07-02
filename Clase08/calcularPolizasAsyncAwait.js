const fs = require("fs").promises
const path = require("path")

const directorioIn = path.join(__dirname, "input")
const archivoOut = path.join(__dirname, "totales.json")

const totales = {
  totalValorAutos: 0,
  totalSeguros: 0,
  cantAutosProcesados: 0,
}

const recorrerDirectorio = async (rutaDir) => {
  const rutas = await fs.readdir(rutaDir)
  for (let index = 0; index < rutas.length; index++) {
    const rutaAbsoluta = path.join(rutaDir, rutas[index])
    try {
      await procesarRuta(rutaAbsoluta)
    } catch (_) {}
  }
}

const validarEsAuto = async (ruta) => {
  if (ruta.endsWith(".json")) {
    const data = await fs.readFile(ruta)
    const auto = JSON.parse(data)
    if (!auto.hasOwnProperty("tipoSeguro")) {
      throw new Error("Al auto le falta Tipo de Seguro.")
    } else if (!auto.hasOwnProperty("valor")) {
      throw new Error("Al auto le falta Valor.")
    } else if (!auto.hasOwnProperty("valor")) {
      throw new Error("Al auto le falta Año.")
    } else {
        procesarAuto(auto)
    }
  }
  throw new Error("No es un archivo de auto válido")
}

const procesarRuta = async (ruta) => {
  const stats = await fs.stat(ruta)
  if (stats.isDirectory()) {
    return recorrerDirectorio(ruta)
  } else if (stats.isFile()) {
    return validarEsAuto(ruta)
  }
}

const procesarAuto = async (auto) => {
  totales.totalSeguros += await calcularSeguro(auto)
  totales.cantAutosProcesados++
  totales.totalValorAutos += auto.valor
}

const calcularSeguro = async (auto) => {
  const añoActual = new Date().getFullYear()
  let seguro = 0
  if (auto.tipoSeguro === "TR") {
    // Verifico si eligió Todo Riesgo
    if (añoActual - auto.año <= 10) {
      // verifico si el auto es mas viejo que 10 años
      seguro = auto.valor * 0.01 // calculo el 1% de valor del auto
    } else {
      seguro = 10000 //valor alto porque el auto es muy viejo
    }
  } else {
    if (auto.tipoSeguro === "TC") {
      seguro = auto.valor * 0.0025 // Terceros Completo
    } else {
      // Otro seguro. Ejemplo Contra Terceros
      seguro = 800
    }
  }
  return seguro;
};

const guardarObjeto = async (ruta, totales) => {
  const datos = JSON.stringify(totales)
  await fs.writeFile(ruta, datos)
  console.log(
    `Los totales acumulados de seguros quedaron guardados en ${archivoOut}.`
  )
}

(async (_) => {
  try {
    await procesarRuta(directorioIn)
    await guardarObjeto(archivoOut, totales)
  } catch (error) {
    console.log(`ERROR: ${error.message}`)
  }
})()
