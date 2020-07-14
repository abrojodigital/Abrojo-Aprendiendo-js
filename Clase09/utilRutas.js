const fs = require('fs')
const path = require('path')

const crearDirectorio = (directoryPath) => {
  const directory = path.normalize(directoryPath)
  return new Promise((resolve, reject) => {
    fs.stat(directory, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.mkdir(directory, (error) => {
            if (error) {
              reject(error)
            } else {
              resolve(directory)
            } })
          } else {
            reject(error)
          }
        } else {
          resolve(directory)
        }
      })
    })
  }
  const directorioPath = `${__dirname}/test`
  crearDirectorio(directorioPath).then((path) => {
    console.log(`Directorio creado satisfactoriamente: '${path}'`)
  }).catch((error) => {
    console.log(`Hubo un problema al crear el directorio: ${error.message}`)
  })