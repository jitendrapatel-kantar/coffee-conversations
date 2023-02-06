// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import {server} from 'test/server/test-server'
import * as auth from 'utils/auth'
import { cache } from "swr";

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = 150000


//general cleanup
afterEach(async () => {
  cache?.clear();
  await Promise.all([
    auth.logout()
  ])
})

