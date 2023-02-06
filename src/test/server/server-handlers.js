// src/mocks/handlers.js
import {rest} from 'msw'
import { mockUser } from 'test/data/mock-user'

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({mockUser})
    )
  }),
]

export {handlers}

