const axios = require('axios')
const logger = require('../logger')
const POKE_API = process.env.POKE_API

class helperPokemonClass {
  static async get_pokemons_count () {
    return await axios.get(`${POKE_API}pokemon/?limit=1`).then(result => {
      logger.info(`statusCode for get total count in third party api: ${result.status}`)
      return result.data.count
    }).catch(error => {
      logger.error(`error for get total count in third party api: ${error}`)
      throw new Error(error)
    })
  }

  static async get_pokemons (limit, offset) {
    return await axios.get(`${POKE_API}pokemon/?limit=${limit}&offset=${offset}`).then(result => {
      logger.info(`statusCode for get pokemons in third party api: ${result.status}`)
      return result.data
    }).catch(error => {
      logger.error(`error for get pokemons in third party api: ${error}`)
      throw new Error(error)
    })
  }

  static async get_all_pokemons (cache, offset) {
    try {
      let PokemonsCount = cache.get('pokemonsCount')
      if (!PokemonsCount) {
        PokemonsCount = await this.get_pokemons_count()
        cache.set('pokemonsCount', PokemonsCount)
      }
      const pokemonData = await this.get_pokemons(PokemonsCount, offset)
      cache.set('allPokemons', pokemonData)
      return pokemonData
    } catch (error) {
      throw new Error(error)
    }
  }

  static sort_strings_values (string1, string2, type = 'asc') {
    const fa = string1.toLowerCase()
    const fb = string2.toLowerCase()
    if (fa < fb) return (type === 'asc') ? -1 : 1
    if (fa > fb) return (type === 'asc') ? 1 : -1
    return 0
  }
}
module.exports = helperPokemonClass
