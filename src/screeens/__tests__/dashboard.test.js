import React from 'react'
import App from 'App'
import {
  render,
  screen,
  userEvent,
  within,
} from 'test/app-test-utils'

async function renderDashboard() {
  const route = '/'
  const utils = await render(<App />, {route})
  return {...utils}
}
test('Modal opening on clicking more info and closing again', async () => {
  await renderDashboard()
  const moreInfoButton = screen.getByRole(/button/i, {name: /more info/i})

  //initial modal not present
  let infoDialog = screen.queryByRole(/dialog/i)
  expect(infoDialog).not.toBeInTheDocument()

  //open modal
  await userEvent.click(moreInfoButton)
  infoDialog = screen.queryByRole(/dialog/i)
  expect(infoDialog).toBeInTheDocument()

  //modal rendered currectly
  const inModal = within(infoDialog)
  const closeButton = inModal.getByLabelText(/dialog-close-button/i)
  expect(closeButton).toBeInTheDocument()
  //body have overflow hidden
  const body = document.querySelector('body')
  let bodyStyles = window.getComputedStyle(body)
  expect(bodyStyles.overflow).toBe('hidden')

  //close dialog and assert that it is not present
  await userEvent.click(closeButton)
  infoDialog = screen.queryByRole(/dialog/i)
  expect(infoDialog).not.toBeInTheDocument()
  
  //reverse body overflow
  bodyStyles = window.getComputedStyle(body)
  expect(bodyStyles.overflow).toBe('auto')
})

