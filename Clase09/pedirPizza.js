const fs = require('fs').promises
const path = require('path')
const inquirer = require('inquirer')
const fecha = require('./utilFecha')

const directorioSalida = path.join(__dirname, 'pedidos')

let preguntas = [
  {
    type: 'confirm',
    name: 'paraEnviar',
    message: 'Se la enviamos?',
    default: false,
  },
  {
    type: 'input',
    name: 'telefono',
    message: "Cual es su número de teléfono?",
    validate: (numero) => {
      inquirer      let pass = numero.match(
        /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
      );
      if (pass) {
        return true
      }
      return 'Por favor, ingrese un número de teléfono válido'
    },
  },
  {
    type: 'input',
    name: 'domicilio',
    message: 'Domicilio de entrega',
  },
  {
    type: 'list',
    name: 'tipoMasa',
    message: 'Que tipo de pizza quiere encargar?',
    choices: ['Media masa', 'A la pieGra'],
  },
  {
    type: 'list',
    name: 'tamaño',
    message: 'Qué tamaño de pizza quiere encargar?',
    choices: ['Grande', 'Chica'],
    filter: (val) => {
      return val.toLowerCase();
    },
  },
  {
    type: 'input',
    name: 'cantidad',
    message: 'Cuantas unidades quiere?',
    validate: (valor) =>{
      let valido = !isNaN(parseFloat(valor));
      return valido || 'Por favor, ingrese un valor numérico';
    },
    filter: Number,
  },
  {
    type: 'rawlist',
    name: 'tipoPizza',
    message: 'Tipos de pizza?',
    choices: ['Muzzarella', 'Fugazzeta', 'Jamón y Queso', 'Calabresa', 'Napolitana'],
  },
  {
    type: 'rawlist',
    name: 'bebida',
    message: 'Le regalamos una gaseosa de 2L.\nCual prefiere?',
    choices: ['Pepsi', '7up', 'Coca Cola', 'Fanta', 'Manaos uva'],
  }
]

const crearDirectorio = async (directorio) => {
  await fs.mkdir(directorio, { recursive: true })
}

const guardarPedido = async (pedido) => {
  const archivoPedido = fecha.fechaParaArchivo()+'.json'
  const datos = JSON.stringify(pedido)
  const ruta = path.join(directorioSalida, archivoPedido)
  await fs.writeFile(ruta, datos)
  console.log(`El pedido quedó guardado en ${ruta}.`)
}

const main = async () => {
  console.log('Pedido de pizza')
  try {
    await crearDirectorio(directorioSalida)
    const pedido = await inquirer.prompt(preguntas)
    await guardarPedido(pedido)
  } catch (error) {
    console.log(`ERROR: ${error.message}`)
  }
}

main()