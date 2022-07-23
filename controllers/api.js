const express = require('express')
const axios = require('axios')
const router = express.Router()
const logger = require('../logger')
const NodeCache = require('node-cache')
const pokemonCache = new NodeCache()
const pokemonHelper = require('../helpers')

router.get('/', async (request, response) => {
  try {
    const limit = request.query.limit ? request.query.limit : 20
    const offset = request.query.offset ? request.query.offset : 0
    const getAll = request.query.offset ? request.query.getAll : false
    logger.info(JSON.stringify(request.url))
    if (getAll) {
      const pokemonData = await pokemonHelper.get_all_pokemons(pokemonCache, offset)
      return response.status(200).json(pokemonData)
    }
    const pokemonData = await pokemonHelper.get_pokemons(limit, offset)
    return response.status(200).json(pokemonData)
  } catch (e) {
    logger.error(e)
    return response.status(500).json({
      error: 'error to get pokemons'
    })
  }
})

router.get('/:keyword', async (request, response) => {
  try {
    const limit = request.query.limit ? request.query.limit : 20
    const offset = request.query.offset ? request.query.offset : 20
    const keyword = request.params.keyword
    logger.debug(`search by: ${keyword}`)
    logger.info(JSON.stringify(request.url))
    let allPokemons = pokemonCache.get('allPokemons')
    if (!allPokemons) {
      allPokemons = await pokemonHelper.get_all_pokemons(pokemonCache, offset)
    }
    const matchedPokemons = allPokemons.results.filter((pokemon) => {
      return pokemon.name.includes(keyword)
    })
    return response.status(200).json(matchedPokemons)
  } catch (e) {
    logger.error(e)
    return response.status(500).json({
      error: 'error to get pokemons by keyword'
    })
  }
})

module.exports = router
