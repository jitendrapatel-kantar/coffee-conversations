/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import * as colors from 'styles/colors'
import Avatar from 'boring-avatars'
import {Button} from './lib'
import {useAuth} from 'context/auth-context'
import {useLocation, Link as RouterLink} from 'react-router-dom'

function Header() {
  const {user} = useAuth()
  
  const currentPath = useLocation().pathname
  return (
    <header
      css={{
        display: 'flex',
        position: 'fixed',
        top: 0,
        padding: '1rem 1rem',
        backgroundColor: `${colors.black}`,
        width: '100%',
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <span css={{width: '104px'}}>
        <RouterLink to='/'><img alt="kantar-logo" src="/images/KANTAR_Small_Logo_White_RGB.png" /></RouterLink>
      </span>
      <div css={{display: 'flex', gap: '32px', marginLeft: 'auto'}}>
        {user?.Role.toLowerCase() === 'admin' &&
          (currentPath === '/admin' ? (
            <RouterLink to="/">
              <Button variant={'white'}>User Dashboard</Button>
            </RouterLink>
          ) : (
            <RouterLink to="/admin">
              <Button variant={'white'}>Admin Panel</Button>
            </RouterLink>
          ))}

        <Avatar
          size={40}
          name={user.name}
          variant="beam"
          colors={['#B7F0AD', '#D2FF96', '#EDFF7A', '#E8D33F', '#D17B0F']}
        />
      </div>
    </header>
  )
}

export {Header}
