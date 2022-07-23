const express = require('express')
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
    const offset = request.query.offset ? parseInt(request.query.offset) : 0
    const keyword = request.params.keyword
    const getAll = request.query.getAll ? request.query.getAll : false
    const re = new RegExp(`^${keyword}`, 'i')
    let limit = request.query.limit ? parseInt(request.query.limit) : 20
    logger.debug(`search by: ${keyword}`)
    logger.info(JSON.stringify(request.url))
    let allPokemons = pokemonCache.get('allPokemons')
    if (!allPokemons) {
      allPokemons = await pokemonHelper.get_all_pokemons(pokemonCache, offset)
    }
    if (getAll) {
      limit = pokemonCache.get('pokemonsCount')
    }
    let nextPage = `${process.env.DOMAIN}/api/${keyword}?limit=${limit}&offset=${limit + offset}`
    const matchedPokemons = allPokemons.results.filter((pokemon) => {
      return pokemon.name.match(re)
    })
    const pageCount = Math.ceil(matchedPokemons.length / limit)
    if (pageCount === 1) {
      nextPage = null
    }
    matchedPokemons.sort((a, b) => {
      return pokemonHelper.sort_strings_values(a.name, b.name, 'asc')
    })
    return response.status(200).json({
      pageCount,
      nextPage,
      pokemons: matchedPokemons.slice(offset, limit + offset)
    })
  } catch (e) {
    logger.error(e)
    return response.status(500).json({
      error: 'error to get pokemons by keyword'
    })
  }
})

router.get('/includes/:keyword', async (request, response) => {
  try {
    const offset = request.query.offset ? parseInt(request.query.offset) : 0
    const getAll = request.query.getAll ? request.query.getAll : false
    const keyword = request.params.keyword
    let limit = request.query.limit ? parseInt(request.query.limit) : 20
    logger.debug(`search by: ${keyword}`)
    logger.info(JSON.stringify(request.url))
    let allPokemons = pokemonCache.get('allPokemons')
    if (!allPokemons) {
      allPokemons = await pokemonHelper.get_all_pokemons(pokemonCache, offset)
    }
    if (getAll) {
      limit = pokemonCache.get('pokemonsCount')
    }
    let nextPage = `${process.env.DOMAIN}/api/includes/${keyword}?limit=${limit}&offset=${limit + offset}`
    const matchedPokemons = allPokemons.results.filter((pokemon) => {
      return pokemon.name.includes(keyword)
    })
    matchedPokemons.sort((a, b) => {
      return pokemonHelper.sort_strings_values(a.name, b.name, 'asc')
    })
    const pageCount = Math.ceil(matchedPokemons.length / limit)
    if (pageCount === 1) {
      nextPage = null
    }
    return response.status(200).json({
      pageCount,
      nextPage,
      pokemons: matchedPokemons.slice(offset, limit + offset)
    })
  } catch (e) {
    logger.error(e)
    return response.status(500).json({
      error: 'error to get pokemons by keyword'
    })
  }
})

module.exports = router
