const got = require('got')
const configTelegram = require('./config.telegram')

;(async _ => {
  try {
    const urlBase = 'https://coronavirus-tracker-api.herokuapp.com'
    const telegramBase = `https://api.telegram.org/bot${configTelegram.botToken}`
    const options = { responseType: 'json' }

    console.log('Obteniendo ubicaciones de stats...')
    const locationsURL = `${urlBase}/v2/locations`
    const responseLocations = await got.get(locationsURL, options)
    const locations = responseLocations && responseLocations.body && responseLocations.body.locations && responseLocations.body.locations.filter(location => location.country_code === 'AR')
    const argentinaLocation = locations && locations.length && locations[0]

    if (argentinaLocation) {
      console.log('Obtenida Argentina, obteniendo stats...')
      const argentinaLocationURL = `${locationsURL}/${argentinaLocation.id.toString()}`
      const responseArgentinaStats = await got.get(argentinaLocationURL, options)
      const latestStats = responseArgentinaStats.body.location.latest

      console.log('Enviando información a Telegram')
      const sendMessageTelegramURL = `${telegramBase}/sendMessage`
      const sendMessage = {
        json: {
          chat_id: configTelegram.chatId,
          text: `COVID-19 UPDATE de Argentina:\nConfirmados:${latestStats.confirmed}\nMuertes:${latestStats.deaths}`
        }
      }
      const sendMessageOptions = Object.assign({}, options, sendMessage)
      await got.post(sendMessageTelegramURL, sendMessageOptions)
    }
  } catch (error) {
    console.log(JSON.stringify(error))
    console.log(`EPA: ${error}`)
  } finally {
  }
})()
