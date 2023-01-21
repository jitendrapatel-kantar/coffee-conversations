/** @jsx jsx */
import {css, jsx} from '@emotion/react'

import React from 'react'
import styled from '@emotion/styled'
import * as colors from 'styles/colors'
import {CoffeeIcon, GoogleIcon} from 'assets/icons'
import {Button} from 'components/lib'
import {motion} from 'framer-motion'
import {GoogleLogin} from '@react-oauth/google'
import { login } from 'utils/auth'

function UnauthenticatedApp() {
  const googleButton = document.querySelector('#google-button')
  return (
    <Container>
      <motion.div>
        <CoffeeIcon size={80} animation={true} />
        <h1>Coffee Conversations</h1>
      </motion.div>
      <motion.div
        initial={{scale: 1.4}}
      >
        <GoogleLogin
          onSuccess={credentialResponse => login({idtoken: credentialResponse.credential})}
          onError={(error) => {
            console.log('Login Failed', error)
          }}
          size="medium"
          theme="filled_black"
        />
      </motion.div>
    </Container>
  )
}

const Container = styled.div({
  height: '100%',
  backgroundColor: colors.light,
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  justifyContent: 'center',
  alignItems: 'center',
  '& > div': {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
})

// const HeadingContainer = styled.div({
//     display: 'flex',

// })

export {UnauthenticatedApp}
