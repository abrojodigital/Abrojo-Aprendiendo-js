const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')
const pathThumb = path.join(__dirname, 'output')
const imgWidth = 768

let x = 0

const thumbImage = async (ruta) => {
  x ++
  const archivo = x.toString()
  const thumbPath = path.join(pathThumb, `${archivo}.thumb.jpg`)
  try {
     await sharp(ruta)
     .resize(imgWidth)
     .toFile(thumbPath)
   } catch (error) {
     console.warn(`El archivo '${archivo}' thumbnail no se generó. ${error.message}`)
   }
}

const recorrerDirectorio = async (rutaDir) => {
  const rutas = await fs.readdir(rutaDir)
  for (let index = 0; index < rutas.length; index++) {
    const rutaAbsoluta = path.join(rutaDir, rutas[index])
    try {
      await procesarRuta(rutaAbsoluta)
    } catch (_) {}
  }
};

const procesarRuta = async (ruta) => {
  const stats = await fs.stat(ruta)
  if (stats.isDirectory()) {
    return recorrerDirectorio(ruta)
  } else if (stats.isFile()) {
    return await thumbImage(ruta)
  }
}

(async (_) => {
  try {
    const imgsPath = path.normalize(process.argv[2])
    const imgsPathAbsoluto = path.isAbsolute(imgsPath)
      ? imgsPath
      : path.join(process.cwd(), imgsPath)
    await procesarRuta(imgsPathAbsoluto)
    process.stdout.cursorTo(0)
  } catch (error) {
    process.stdout.cursorTo(0)
    console.log(`ERROR: ${error.message}`)
  }
})();
