import React from 'react'
import { Header } from 'components/Header'
import { render, waitForLoadingToFinish, screen } from 'test/app-test-utils'

test('Header displays current button depending on current path', async () => {
  render(<Header />, {route: '/admin'})
  await waitForLoadingToFinish()
  screen.debug()
})
