// src/mocks/handlers.js
import {rest} from 'msw'
import { mockUser } from 'test/data/mock-user'
import { mockCurrentDateData, mockFutureWeeksData } from 'test/data/mock-coffeedate-data'

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({mockUser})
    )
  }),
  rest.get(`${apiUrl}/coffeedate/${mockUser.ID}/getCurrentCoffeeDateForUser`, (req, res, ctx) => {
    return res(ctx.json(mockCurrentDateData))
  }),
  rest.get(`${apiUrl}/coffeedate/${mockUser.ID}/getFutureRegistriesForUser`, (req, res, ctx) => {
    return res(ctx.json(mockFutureWeeksData))
  })
]

export {handlers}

