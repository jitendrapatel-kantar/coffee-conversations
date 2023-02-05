/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import {
  Button,
  Card,
  Modal,
  hoverUnderlineAnimation,
  BlackTooltip,
} from 'components/lib'
import {motion, AnimatePresence} from 'framer-motion'
import * as colors from 'styles/colors'
import useSWR, {useSWRConfig} from 'swr'
import {client} from 'utils/api-client'
import {useAuth} from 'context/auth-context'
import {Link as RouterLink} from 'react-router-dom'

function IntroCard() {
  const {user} = useAuth()
  const {data: currentDate} = useSWR(
    `coffeedate/${user.ID}/getCurrentCoffeeDateForUser`,
    client,
  )

  const coffeeDateMembers = currentDate?.Users.map(member => (
    <BlackTooltip key={member.ID} title={member.Email}>
      <motion.span {...hoverUnderlineAnimation({variant: 'initial'})}>
        {member.Name}
      </motion.span>
    </BlackTooltip>
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
      <h2>Hello {user.Name}, Welcome to Coffee Conversations</h2>
      <section
        css={{
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
        >
          Register for the coffee date
        </motion.p>
        <InfoButton />
        <Button variant="black" onClick={() => register()}>
          Register
        </Button>
      </section>
      {currentDate && (
        <>
          <section
            css={{
              marginTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 32,
              alignItems: 'baseline',
            }}
          >
            <motion.p css={{fontSize: '1.25rem'}}>
              This week's coffee date group is:
            </motion.p>
            {coffeeDateMembers}
          </section>
          <section css={{marginTop: 16}}>
            <p>
              To accept proposals, propose new date and time, edit/create note
              for the date click on current date and to see all the notes and
              information about previous dates click on previous dates.
            </p>
            <div
              css={{marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 16}}
            >
              <RouterLink to="current-date">
                <Button variant={'black'}>Current Date</Button>
              </RouterLink>
              <RouterLink to="previous-dates">
                <Button variant={'gray80'}>previous Dates</Button>
              </RouterLink>
            </div>
          </section>
        </>
      )}
    </Card>
  )
}

function InfoButton() {
  const [isopen, setIsopen] = React.useState(false)
  const open = () => {
    setIsopen(true)
  }
  const close = () => {
    setIsopen(false)
  }
  return (
    <>
      <Button
        variant="white"
        onClick={() => open()}
        layoutId="button-to-modal"
        transition={{type: 'spring', stiffness: 100, damping: 15}}
        css={{
          boxShadow: 'var(--shadow-elevation-low)',
          transition: 'box-shadow 200ms',
          ':hover': {
            boxShadow: 'var(--shadow-elevation-high)',
          },
          zIndex: 2,
        }}
      >
        More info
      </Button>
      {isopen && (
        <AnimatePresence>
          <Modal
            variant="white"
            onClose={close}
            isOpen={isopen}
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
        scale: 1.05,
        outline: week.Active
          ? `2px solid ${colors.black}`
          : `2px solid ${colors.gray80}`,
      }}
    >
      <span css={{fontSize: '1.25rem', marginRight: 8, marginLeft: 8}}>
        Week {week.Week}
      </span>
      {week.Active ? (
        <AnimatePresence>
          <Button
            variant="black"
            onClick={() => deactivate()}
            layoutId={`activate-deactivate-${week.ID}`}
          >
            Deactivate
          </Button>
        </AnimatePresence>
      ) : (
        <Button
          variant="gray80"
          onClick={() => activate()}
          layoutId={`activate-deactivate-${week.ID}`}
        >
          Activate
        </Button>
      )}
    </motion.div>
  )
}

function FutureWeeks() {
  const {user} = useAuth()
  const {data: futureWeeksData, mutate: revalidateFutureWeeks} = useSWR(
    `coffeedate/${user.ID}/getFutureRegistriesForUser`,
    client,
  )

  if (futureWeeksData?.length === 0) {
    return null
  }
  const toolTipText =
    'These are all the upcoming weeks and their status for the date. You can opt in / opt out at anytime from participating in a date in the following weeks.'
  return (
    <Card css={{marginTop: 16}}>
      <BlackTooltip title={toolTipText} placement="top-start">
        <motion.h2
          css={{width: 'fit-content'}}
          {...hoverUnderlineAnimation({variant: 'initial'})}
        >
          Upcoming weeks
        </motion.h2>
      </BlackTooltip>
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
          <WeekCard
            key={week.ID}
            week={week}
            revalidate={revalidateFutureWeeks}
            css={{opacity: 0.7}}
          />
        ))}
      </div>
    </Card>
  )
}
function DashBoard() {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{delay: 0.4}}
    >
      <IntroCard /> <FutureWeeks />
    </motion.div>
  )
}

export {DashBoard}
