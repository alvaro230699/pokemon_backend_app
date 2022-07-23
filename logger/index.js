const pokemonLogger = require('./pokemonLogger')
const productionLogger = require('./productionLogger')
let logger = null

if (process.env.NODE_ENV !== 'production') {
  logger = pokemonLogger()
} else {
  logger = productionLogger()
}
module.exports = logger
