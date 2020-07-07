const fs = require("fs").promises;
const path = require("path");

const recorrerDirectorio = async (rutaDir) => {
  const rutas = await fs.readdir(rutaDir);
  for (let index = 0; index < rutas.length; index++) {
    const rutaAbsoluta = path.join(rutaDir, rutas[index]);
    try {
      await procesarRuta(rutaAbsoluta);
    } catch (_) {}
  }
};

const procesarRuta = async (ruta) => {
  const stats = await fs.stat(ruta);
  if (stats.isDirectory()) {
    return recorrerDirectorio(ruta);
  } else if (stats.isFile()) {
    return resizeImg(ruta);
  }
};

module.exports = {
  recorrerDirectorio,
  procesarRuta,
};
