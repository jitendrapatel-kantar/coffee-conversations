/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import styled from '@emotion/styled'
import {Button, Card, Modal} from 'components/lib'
import {motion, AnimatePresence} from 'framer-motion'
import * as colors from 'styles/colors'
import useSWR, { useSWRConfig } from 'swr'
import {client} from 'utils/api-client'
import {useAuth} from 'context/auth-context'

function IntroCard() {
  const {user} = useAuth()
  const {data: currentDate} = useSWR(
    `coffeedate/${user.ID}/getCurrentCoffeeDateForUser`,
    client,
  )

  const coffeeDateMembers = currentDate?.Users.map(member => (
    <li key={member.ID}>{member.Name}</li>
  ))
  
  const {mutate} = useSWRConfig()
  async function register() {
    await client('coffeedate/register', {
      data: {
        userID: user.ID,
      },
    })
    mutate(`coffeedate/${user.ID}/getFutureRegistriesForUser`)
  }
  return (
    <Card>
      <h2 css={{fontWeight: 600}}>
        Hello {user.Name}, Welcome to Coffee Conversations
      </h2>
      <section
        css={{
          marginTop: '16px',
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <motion.p
          css={{
            fontSize: '1.5rem',
          }}
          {...hoverAnimation}
        >
          Register for the coffee date
        </motion.p>
        <InfoButton />
        <Button variant="black" onClick={() => register()}>
          Register
        </Button>
      </section>
      {currentDate && (
        <section css={{marginTop: '16px'}}>
          <motion.p css={{fontSize: '1.25rem'}}>
            This week's coffee date group is:
          </motion.p>
          <ul>{coffeeDateMembers}</ul>
        </section>
      )}
    </Card>
  )
}

const hoverAnimation = {
  initial: {
    textDecoration: 'none',
    textUnderlineOffset: '24px',
  },
  whileHover: {
    textDecoration: 'underline',
    textDecorationThickness: '2px',
    textUnderlineOffset: '8px',
  },
  transition: {
    type: 'spring',
    stiffness: 2000,
    damping: 100,
  },
}

function InfoButton() {
  const [isopen, setIsopen] = React.useState(false)
  const open = () => {
    setIsopen(true)
    document.body.style.overflow = 'hidden'
  }
  const close = () => {
    setIsopen(false)
    document.body.style.overflow = 'auto'
  }
  return (
    <>
      <Button
        variant="white"
        onClick={open}
        layoutId="button-to-modal"
        transition={{type: 'spring', stiffness: 100, damping: 15}}
        initial={{boxShadow: 'var(--shadow-elevation-low)'}}
      >
        More info
      </Button>
      {isopen && (
        <AnimatePresence>
          <Modal
            variant="white"
            onClose={close}
            modalHeading="App description"
            animationVariant="fadeIn"
            layoutId="button-to-modal"
            css={{fontSize: '1.1rem'}}
          >
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
            >
              <p>
                Click Register to register for a coffee date. You only need to
                register once per year, and you will be automatically registered
                for all weeks until the end of the year. You can also
                re-register again next year or un-register yourself when going
                on holiday.
              </p>
              <p css={{marginTop: '8px'}}>
                Every week, at the beggining of the week, you can see here who
                your coffee date partners is/are. You will also get an email in
                relation to this.
              </p>
              <p css={{marginTop: '8px'}}>
                It is up to you to then talk and make this happen.
              </p>
            </motion.div>
          </Modal>
        </AnimatePresence>
      )}
    </>
  )
}

function WeekCard({week}) {
  const {user} = useAuth()
  const {mutate} = useSWRConfig()
  async function deactivate() {
    await client(`coffeedate/${week.ID}/deactivate`, {
      data: {
        userID: user.ID,
      },
    })
    mutate(`coffeedate/${user.ID}/getFutureRegistriesForUser`)
  }
  async function activate() {
    await client(`coffeedate/${week.ID}/activate`, {
      data: {
        userID: user.ID,
      },
    })
    mutate(`coffeedate/${user.ID}/getFutureRegistriesForUser`)
  }
  return (
    <motion.div
      css={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: `${colors.white}`,
        borderRadius: '2px',
      }}
      whileHover={{
        scale: 1.1,
      }}
    >
      <span css={{fontSize: '1.25rem', marginRight: 8, marginLeft: 8}}>
        Week {week.Week}
      </span>
      {week.Active ? (
        <Button variant="black" onClick={() => deactivate()}>Deactivate</Button>
      ) : (
        <Button variant="black" onClick={() => activate()}>Activate</Button>
      )}
    </motion.div>
  )
}

function FutureWeeks() {
  const {user} = useAuth()
  const {data: futureWeeksData} = useSWR(
    `coffeedate/${user.ID}/getFutureRegistriesForUser`,
    client,
  )
  console.log(futureWeeksData, 'futureWeeks')
  if (futureWeeksData?.length === 0) {
    return null
  }
  return (
    <Card css={{marginTop: 16}}>
      <h2 css={{fontWeight: 600}}>Here are all the future weeks</h2>
      <div
        css={{
          display: 'grid',
          gap: 32,
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
          filter: 'drop-shadow(0px 2px 8px hsl(0deg 0% 0% / 0.25))',
        }}
      >
        {futureWeeksData?.map(week => (
          <WeekCard key={week.ID} week={week} />
        ))}
      </div>
    </Card>
  )
}
function DashBoard() {
  return (
    <>
      <IntroCard /> <FutureWeeks />
    </>
  )
}

export {DashBoard}
