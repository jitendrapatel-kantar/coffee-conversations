import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AppProviders} from 'context'
import { mockUser } from './data/mock-user'

async function render(ui, {route = '/list', user, ...renderOptions} = {}) {
  user = typeof user === 'undefined' ? mockUser : user
  window.history.pushState({}, 'Test page', route)

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions,
    }),
    user,
  }

  await waitForLoadingToFinish()

  return returnValue
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )

export * from '@testing-library/react'
export {render, userEvent, waitForLoadingToFinish}
