const addZero = (i) => {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

const fechaParaArchivo = () => {
  const fecha = new Date()
  const añoActual = fecha.getFullYear()
  const mesActual = addZero(fecha.getMonth()+1)
  const diaActual = addZero(fecha.getDate())
  const horaActual = fecha.getHours()
  const minutosActual = fecha.getMinutes()
  return añoActual + mesActual + diaActual + horaActual + minutosActual
}

module.exports = {
  fechaParaArchivo
}