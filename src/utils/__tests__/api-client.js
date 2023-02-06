import {server, rest} from 'test/server/test-server'
import {client, Loginclient} from '../api-client'

const apiURL = process.env.REACT_APP_API_URL

test('makes GET requests to the given endpoint', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(endpoint)

  expect(result).toEqual(mockResult)
})

test('allows for config overrides', async () => {
  let request
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  const customConfig = {
    method: 'PUT',
    headers: {'Content-Type': 'fake-type'},
  }

  await client(endpoint, customConfig)

  expect(request.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  )
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body))
    }),
  )
  const data = {a: 'b'}
  const result = await client(endpoint, {data})

  expect(result).toEqual(data)
})

test('loginClient returns null user when response is not ok', async () => {
  const endpoint = 'login'
  const mockResult = {mockValue: 'VALUE'}
  const token = 'fake-token'
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult))
    }),
  )

  const user = await Loginclient({idtoken: token})
  expect(user).toBe(null)
})
test('loginClient returns user when response is ok', async () => {
    const endpoint = 'login'
    server.use(
        rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
          return res(ctx.json(req.body))
        }),
      )
    const token = {idtoken: 'fake-token'}
    const user = await Loginclient(token)
    expect(user).toEqual(token)
  })

  test('correctly rejects the promise if there is an error', async () => {
    const endpoint = 'test-endpoint'
    const testError = {message: 'Test error'}
    server.use(
      rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
        return res(ctx.status(400), ctx.json(testError))
      }),
    )
  
    await expect(client(endpoint)).rejects.toEqual(testError)
  })
