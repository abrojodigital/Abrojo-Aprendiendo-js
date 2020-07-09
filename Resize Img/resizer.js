const fs = require('fs').promises
const path = require('path')
const sharp = require('sharp')

const resizeImg = (ruta) => {
  console.log(ruta)
}
/*
async sharp(ruta)
  .resize({width: 200, height: 100})
  .toFile('./output/archivo.jpg')
*/
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
    return await resizeImg(ruta)
  }
};

(async (_) => {
  try {
    const imgsPath = path.normalize(process.argv[2])
    const imgsPathAbsoluto = path.isAbsolute(imgsPath)
      ? imgsPath
      : path.join(process.cwd(), imgsPath)
    await procesarRuta(imgsPathAbsoluto)
    process.stdout.cursorTo(0)
    // console.log(imgsPathAbsoluto)
  } catch (error) {
    process.stdout.cursorTo(0)
    console.log(`ERROR: ${error.message}`)
  }
})();
