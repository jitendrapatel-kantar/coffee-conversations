/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import styled from '@emotion/styled'
import {useAuth} from 'context/auth-context'
import {
  BlackTooltip,
  Button,
  Card,
  hoverUnderlineAnimation,
  GridContainer,
  InfoCard,
  ButtonContainer, Confirmation
} from 'components/lib'
import {Link as RouterLink} from 'react-router-dom'
import useSWR, {useSWRConfig} from 'swr'
import {motion} from 'framer-motion'
import {client} from 'utils/api-client'
import * as colors from 'styles/colors'
import {formateDateTime} from 'utils/utils'

function UserList() {
  const {user} = useAuth()
  const {data: allUsers} = useSWR(`${user.ID}/getallusers`, client)
  const normalUsers = allUsers?.filter(
    item => item.Role.toLowerCase() === 'normal' && item.ID !== user.ID,
  )
  const adminUsers = allUsers?.filter(
    item => item.Role.toLowerCase() === 'admin' && item.ID !== user.ID,
  )
  return (
    <Card>
      <BlackTooltip
        title="Here you will find all the platform users divided in two categories based on the type of their role. You can either delete an user or make a 'normal' user 'admin'"
        placement="top-start"
        arrow
      >
        <motion.h2
          css={{width: 'fit-content'}}
          {...hoverUnderlineAnimation({variant: 'initial'})}
        >
          User Management Panel
        </motion.h2>
      </BlackTooltip>
      <section>
        <SectionHeading>Normal Users</SectionHeading>
        <GridContainer minWidth="350px">
          {normalUsers?.map(normalUser => (
            <UserInfoCard key={normalUser.ID} userData={normalUser}>
              {normalUser.Name}
            </UserInfoCard>
          ))}
        </GridContainer>
      </section>
      {adminUsers?.length > 0 && (
        <section css={{marginTop: 32}}>
          <SectionHeading>Admin Users</SectionHeading>
          <GridContainer minWidth="350px">
            {adminUsers?.map(adminUser => (
              <UserInfoCard key={adminUser.ID} userData={adminUser}>
                {adminUser.Name}
              </UserInfoCard>
            ))}
          </GridContainer>
        </section>
      )}
    </Card>
  )
}

function UserInfoCard({userData}) {
  const {mutate} = useSWRConfig()
  const {user} = useAuth()
  let {formatedDate} = formateDateTime(userData.CreatedAt)

  async function removeUser() {
    await client(`${user.ID}/removeuser`, {
      data: {
        UserID: userData.ID,
        Action: 'Remove User',
      },
    })
    mutate(`${user.ID}/getallusers`)
  }
  async function makeAdmin() {
    await client(`${user.ID}/assignadminrole`, {
      data: {
        UserID: userData.ID,
        Action: 'Assign Admin Role',
      },
    })
    mutate(`${user.ID}/getallusers`)
  }

  const [removeUserConfirmation, setremoveUserConfirmation] =
    React.useState(false)
  const [makeAdminConfirmation, setMakeAdminConfirmation] =
    React.useState(false)
  return (
    <InfoCard
      layout
      layoutId={`user-info-card-${userData.ID}`}
      transition={{ease: 'easeOut', bounce: 0}}
    >
      <h3>{userData.Name}</h3>
      <p>{userData.Email}</p>
      <p>
        <span css={{fontWeight: 500}}>Created on: </span>
        {formatedDate}
      </p>

      {removeUserConfirmation ? (
        <Confirmation
          title="Remove User"
          onYes={removeUser}
          onNo={() => setremoveUserConfirmation(false)}
          yesLayoutId={`Button-to-yes-confirmation-${userData.ID}`}
          noLayoutId={`Button-to-no-confirmation-${userData.ID}`}
        />
      ) : makeAdminConfirmation ? (
        <Confirmation
          title="Make admin"
          onYes={makeAdmin}
          onNo={() => setMakeAdminConfirmation(false)}
          yesLayoutId={`Button-to-yes-confirmation-${userData.ID}`}
          noLayoutId={`Button-to-no-confirmation-${userData.ID}`}
        />
      ) : (
        <ButtonContainer layout>
          <Button
            variant="danger"
            onClick={() => setremoveUserConfirmation(true)}
            layoutId={`Button-to-yes-confirmation-${userData.ID}`}
            layout
            transition={{ease: 'backOut', bounce: 0}}
          >
            Delete user
          </Button>
          {userData.Role.toLowerCase() === 'normal' && (
            <Button
              variant="black"
              onClick={() => setMakeAdminConfirmation(true)}
              layoutId={`Button-to-no-confirmation-${userData.ID}`}
              transition={{ease: 'backOut', bounce: 0}}
            >
              Make user Admin
            </Button>
          )}
        </ButtonContainer>
      )}
    </InfoCard>
  )
}

function AdminPanel() {
  const {user} = useAuth()
  if (user?.Role.toLowerCase() !== 'admin') {
    return (
      <div>
        <span>You do not have permission to visit this page</span>
        <RouterLink to="/">
          <Button variant={'black'} css={{marginLeft: 16}}>
            Go Home
          </Button>
        </RouterLink>
      </div>
    )
  }
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{delay: 0.4}}
    >
      <UserList />
    </motion.div>
  )
}

const SectionHeading = styled.h3({
  marginBottom: 8,
})

export {AdminPanel}
