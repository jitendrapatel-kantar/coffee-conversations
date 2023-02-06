import React from 'react'
import { Header } from 'components/Header'
import { render, waitForLoadingToFinish, screen} from 'test/app-test-utils'

test('Header displays admin panel button on home page for admin user', async () => {
  render(<Header />, {route: '/'})
  await waitForLoadingToFinish()

  const toAdminPanelButton = screen.getByRole(/button/i, {name: /Admin panel/i})
  expect(toAdminPanelButton).toBeInTheDocument()
})

test('Header displays User dashboard button on admin panel for admin user', async () => {
  render(<Header />, {route: '/admin'})
  await waitForLoadingToFinish()

  const toUserDashboardButton = screen.getByRole(/button/i, {name: /User dashboard/i})
  expect(toUserDashboardButton).toBeInTheDocument()
})
