const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const { parse } = require("path")

let archivosCreados = 0;
const archivosMaximosACrear = 200;
const maximaProfundidadDirectorios = 5;
const directorioSalida = path.join(process.cwd(), "input");

let marcas = [];
let modelos = [];

const cargarMarcasModelos = async () => {
  try {
    const archivo = path.resolve(__dirname, "MarcasModelos.json");
    const archivoMarcasModelos = await fs.readFile(archivo);
    const MarcasModelos = JSON.parse(archivoMarcasModelos);
    marcas = MarcasModelos.marcas;
    modelos = MarcasModelos.modelos;
  } catch (error) {
    console.log(error);
  }
};

const tipoSeguros = ["TR", "CT", "TC"];

const incrementarArchivosCreados = (_) => {
  archivosCreados++;
  process.stdout.cursorTo(0);
  process.stdout.write(`${archivosCreados} / ${archivosMaximosACrear}`);
};

const archivoDataRandom = (_) => {
  let aleatorioMarca = Math.floor(Math.random() * marcas.length);
  let marca = marcas[aleatorioMarca];
  let modelo =
    modelos[aleatorioMarca][
      Math.floor(Math.random() * modelos[aleatorioMarca].length)
    ];
  let aleatorioSeguro =
    tipoSeguros[Math.floor(Math.random() * tipoSeguros.length)];

  return {
    marca: marca,
    modelo: modelo,
    valor: parseFloat((Math.random() * 2000000).toFixed(2)),
    año: parseInt(Math.random() * 10 + 2010),
    tipoSeguro: aleatorioSeguro,
  };
};

const archivoDirectorioRandomico = async (directorioActual) => {
  if (archivosCreados < archivosMaximosACrear) {
    const random = Math.random();
    if (random < 0.8) {
      incrementarArchivosCreados();
      const archivoRandom =
        "auto" +
        crypto.randomBytes(parseInt(Math.random() * 20) + 1).toString("hex");
      const archivoPathAbsoluto = path.join(
        directorioActual,
        `${archivoRandom}.json`
      );
      const archivoData = archivoDataRandom();
      await fs.mkdir(directorioActual, { recursive: true });
      await fs.writeFile(
        archivoPathAbsoluto,
        Buffer.from(JSON.stringify(archivoData, null, 4))
      );
      await archivoDirectorioRandomico(directorioActual);
    } else {
      const profundidad = path
        .relative(directorioSalida, directorioActual)
        .split(path.sep).length;
      if (random < 0.9 && profundidad < maximaProfundidadDirectorios) {
        const directorioRandom = crypto
          .randomBytes(parseInt(Math.random() * 11) + 1)
          .toString("hex");
        const directorioPathAbsoluto = path.join(
          directorioActual,
          directorioRandom
        );
        await archivoDirectorioRandomico(directorioPathAbsoluto);
      } else if (profundidad > 1) {
        await archivoDirectorioRandomico(path.join(directorioActual, ".."));
      } else {
        await archivoDirectorioRandomico(directorioActual);
      }
    }
  } else {
    process.stdout.cursorTo(0);
    console.log(
      `Creados ${archivosMaximosACrear} archivos de pólizas de autos`
    );
  }
};

(async (_) => {
  await cargarMarcasModelos();
  await fs.rmdir(directorioSalida, { recursive: true });
  await archivoDirectorioRandomico(directorioSalida);
})();
