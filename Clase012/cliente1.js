const got = require('got')
const readline = require('readline')
const querystring = require('querystring')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

;(async _ => {
  try {
    const urlBase = 'https://api.mercadolibre.com'
    const sitesURLBase = `${urlBase}/sites/MLA`
    const options = { responseType: 'json' }

    // const sitesURL = `${urlBase}/sites`
    // const { body } = await got.get(sitesURL, options)

    // const categoriesURL = `${sitesURLBase}/categories`
    // const { body } = await got.get(categoriesURL, options)

    const searchString = await new Promise((resolve, reject) => {
      rl.question('Dame la búsqueda: ', resolve)
    })
    const searchQueryObject = {
      q: searchString,
      // offset: 10,
      limit: 10
    }
    const searchQueryString = querystring.stringify(searchQueryObject)
    const searchURL = `${sitesURLBase}/search?${searchQueryString}`
    console.log(searchURL)
    const { body } = await got.get(searchURL, options)
    // console.log(JSON.stringify(body, null, 4))
    const results = body && body.results && Array.isArray(body.results) && body.results.length && body.results.map(result => { return { title: result.title, price: result.price } })
    console.log(results)
  } catch (error) {
    console.log(`EPA: ${error}`)
  } finally {
    rl.close()
  }
})()
