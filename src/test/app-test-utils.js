import React from 'react'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AppProviders} from 'context'
import {mockUser} from './data/mock-user'
import {SWRConfig} from 'swr'

const Wrapper = ({children}) => {
  return (
    <SWRConfig value={{dedupingInterval: 0}}>
      <AppProviders>{children}</AppProviders>
    </SWRConfig>
  )
}
async function render(ui, {route = '/', user, ...renderOptions} = {}) {
  user = typeof user === 'undefined' ? mockUser : user
  window.history.pushState({}, 'Test page', route)

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: Wrapper,
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
    {timeout: 10000},
  )

export * from '@testing-library/react'
export {render, userEvent, waitForLoadingToFinish}
