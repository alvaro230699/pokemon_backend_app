const supertest = require('supertest')
const { app, server } = require('../app')
const { dataExample } = require('./helper')

const api = supertest(app)
const DOMAIN = process.env.DOMAIN
const TOTALPOKEMONS = 1154

describe('GET pokemons', () => {
  test('response are returned as json', async () => {
    await api.get('/api/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('returns all pokemons correctly', async () => {
    const response = await api.get('/api/?getAll=true')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.count).toBe(TOTALPOKEMONS)
  })
  test('limit works correctly', async () => {
    const limit = 10
    const response = await api.get(`/api/?limit=${limit}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.results).toHaveLength(10)
  })
  test('offset works correctly', async () => {
    const offset = 10
    const response = await api.get(`/api/?offset=${offset}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.results[0].name).toBe(dataExample.results[10].name)
  })
})
describe('GET pokemons by name', () => {
  test('response are returned as json', async () => {
    await api.get('/api/mew')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('returns nextPage correctly', async () => {
    const limit = 20
    const offset = 20
    const response = await api.get(`/api/m?limit=${limit}&offset=${offset}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.nextPage).toBe(`${DOMAIN}/api/m?limit=${limit}&offset=${limit + offset}`)
  })
  test('returns pageCount correctly', async () => {
    const limit = 1
    const totalPokemonsByMewtwo = 3
    const keyword = 'mewtwo'
    const pageCount = Math.ceil(totalPokemonsByMewtwo / limit)
    const response = await api.get(`/api/${keyword}?limit=${limit}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(pageCount)
  })
  test('returns 1 pageCount when getAll is true', async () => {
    const response = await api.get('/api/m?getAll=true')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(1)
    expect(response.body.nextPage).toBe(null)
  })
  test('returns correctly pokemon', async () => {
    const totalMatchedPokemonsByMewtwo = 3
    const keyword = 'mewtwo'
    const response = await api.get(`/api/${keyword}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pokemons).toHaveLength(totalMatchedPokemonsByMewtwo)
  })
  test('not find keyword', async () => {
    const keyword = '`421`'
    const response = await api.get(`/api/${keyword}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(0)
    expect(response.body.nextPage).toBe(null)
    expect(response.body.pokemons).toHaveLength(0)
  })
})
describe('GET pokemons by including name', () => {
  test('response are returned as json', async () => {
    await api.get('/api/includes/mew')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('returns nextPage correctly', async () => {
    const limit = 20
    const offset = 20
    const response = await api.get(`/api/includes/m?limit=${limit}&offset=${offset}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.nextPage).toBe(`${DOMAIN}/api/includes/m?limit=${limit}&offset=${limit + offset}`)
  })
  test('returns pageCount correctly', async () => {
    const limit = 1
    const totalPokemonsByMewtwo = 3
    const keyword = 'mewtwo'
    const pageCount = Math.ceil(totalPokemonsByMewtwo / limit)
    const response = await api.get(`/api/includes/${keyword}?limit=${limit}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(pageCount)
  })
  test('returns 1 pageCount when getAll is true', async () => {
    const response = await api.get('/api/includes/m?getAll=true')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(1)
    expect(response.body.nextPage).toBe(null)
  })
  test('returns correctly pokemon', async () => {
    const totalMatchedPokemonsByEw = 16
    const keyword = 'ew'
    const response = await api.get(`/api/includes/${keyword}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pokemons).toHaveLength(totalMatchedPokemonsByEw)
  })
  test('not find keyword', async () => {
    const keyword = '`421`'
    const response = await api.get(`/api/${keyword}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pageCount).toBe(0)
    expect(response.body.nextPage).toBe(null)
    expect(response.body.pokemons).toHaveLength(0)
  })
})
describe('Bad request', () => {
  test('not reach endpoint', async () => {
    await api.get('/apiV2/includes/m?getAll=true')
      .expect(404)
  })
})
afterAll(() => {
  server.close()
})
