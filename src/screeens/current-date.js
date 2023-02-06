/** @jsx jsx */
import {jsx} from '@emotion/react'

import React from 'react'
import styled from '@emotion/styled'
import {
  Card,
  hoverUnderlineAnimation,
  BlackTooltip,
  Button,
  GridContainer,
  InfoCard,
  Alert,
  ButtonContainer,
  Confirmation,
  FullPageErrorFallback,
  FullPageLoading,
} from 'components/lib'
import {useAuth} from 'context/auth-context'
import useSWR, {useSWRConfig} from 'swr'
import {motion} from 'framer-motion'
import {client} from 'utils/api-client'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'

import * as colors from 'styles/colors'
import {formateDateTime} from 'utils/utils'

function useCurrentDate() {
  const {user} = useAuth()
  const {
    data: currentDate,
    error,
    isLoading,
  } = useSWR(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`, client)
  return {currentDate, error, isLoading}
}
function IntroSection() {
  const {currentDate, error, isLoading} = useCurrentDate()
  const coffeeDateMembers = currentDate?.Users.map(user => (
    <li key={user.ID}>
      {user.Name} <em css={{color: colors.gray80}}>({user.Email})</em>
    </li>
  ))
  if (isLoading) {
    return <FullPageLoading />
  }
  if (error) {
    return <FullPageErrorFallback error={error} />
  }
  return (
    <>
      <BlackTooltip
        title="Here you can find information about your current date, accept proposed time slot or propose a new time slot."
        placement="bottom-end"
      >
        <motion.h2 {...hoverUnderlineAnimation({variant: 'initial'})}>
          Current week: {currentDate?.Week}
        </motion.h2>
      </BlackTooltip>
      <section
        css={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'baseline',
        }}
      >
        <motion.p css={{fontSize: '1.25rem'}}>
          This week's coffee date group is
        </motion.p>
        <ul>{coffeeDateMembers}</ul>
      </section>
    </>
  )
}

function Proposals() {
  const {mutate} = useSWRConfig()
  const {user} = useAuth()
  const {currentDate, error, isLoading} = useCurrentDate()

  const [alertOpen, setAlertOpen] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState('')
  if (isLoading) {
    return <FullPageLoading />
  }
  if (error) {
    return <FullPageErrorFallback error={error} />
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }

  async function proposeSlot() {
    const inputValue = document.getElementById('new-proposal-date-time').value
    const selectedDate = inputValue.slice(0, inputValue.indexOf('T'))
    const selectedTime = inputValue.slice(
      inputValue.indexOf('T') + 1,
      inputValue.length,
    )

    try {
      await client(`coffeedate/${currentDate?.ID}/ProposeDateAndTime`, {
        data: {
          Date: selectedDate,
          Time: selectedTime,
          UserID: user.ID,
        },
      })
      mutate(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`)
    } catch (err) {
      setErrorMsg(err.msg)
      setAlertOpen(true)
    }
  }
  function getCurrentTime() {
    let tzoffset = new Date().getTimezoneOffset() * 60000
    let currentTime = new Date(Date.now() - tzoffset).toISOString()
    currentTime = currentTime.slice(0, currentTime.lastIndexOf(':'))
    return currentTime
  }
  return (
    <Section>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
          {errorMsg}
        </Alert>
      </Snackbar>
      <h3>Proposals</h3>
      <p css={{margin: '16px 0 32px'}}>
        Here you can accept a proposed slot or propose a new one. If you propose
        a new slot all other pending proposals will be rejected automatically.
      </p>
      <div css={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
        <input
          type="datetime-local"
          id="new-proposal-date-time"
          defaultValue={getCurrentTime()}
        />
        <Button variant={'black'} onClick={() => proposeSlot()}>
          Propose new slot
        </Button>
      </div>
      <GridContainer minWidth={'300px'} css={{marginTop: 32}}>
        {currentDate?.ProposedDates.map(proposal => (
          <ProposedDatesInfoCard key={proposal.ID} proposalData={proposal} />
        ))}
      </GridContainer>
    </Section>
  )
}

function ProposedDatesInfoCard({proposalData}) {
  const {mutate} = useSWRConfig()
  const {user} = useAuth()
  const {currentDate, error, isLoading} = useCurrentDate()
  if (isLoading) {
    return <FullPageLoading />
  }
  if (error) {
    return <FullPageErrorFallback error={error} />
  }
  const {formatedDate, formatedTime} = formateDateTime(
    proposalData?.ProposedDate,
  )

  const proposedByUserDetails = currentDate?.Users.find(
    user => user?.ID === proposalData?.UserID,
  )

  const proposedByUser =
    proposedByUserDetails.ID === user.ID ? 'You' : proposedByUserDetails.Name
  const status = proposalData?.Status

  async function acceptProposal() {
    await client(`coffeedate/${proposalData.ID}/AcceptProposal`, {
      data: {
        UserID: user.ID,
      },
    })
    mutate(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`)
  }
  return (
    <InfoCard css={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <div>
        <Bold>Date:</Bold> {formatedDate}
      </div>
      <div>
        <Bold>Time</Bold>: {formatedTime}
      </div>
      <div>
        <Bold>Proposed by</Bold>: {proposedByUser}
      </div>
      <div>
        <Bold>Status</Bold>: {status}
      </div>
      {status.toLowerCase() === 'pending' &&
        proposedByUserDetails.ID !== user.ID && (
          <Button variant={'black'} onClick={() => acceptProposal()}>
            Accept
          </Button>
        )}
    </InfoCard>
  )
}

function Notes() {
  const {currentDate, error, isLoading} = useCurrentDate()
  const {mutate} = useSWRConfig()
  const {user} = useAuth()
  if (isLoading) {
    return <FullPageLoading />
  }
  if (error) {
    return <FullPageErrorFallback error={error} />
  }
  async function createNewNote() {
    const enteredText = document.getElementById('create-new-note').value
    await client(`coffeedate/${currentDate.ID}/AddNote`, {
      data: {
        NoteType: 'personal',
        NoteText: enteredText,
      },
    })
    document.getElementById('create-new-note').value = ''
    mutate(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`)
  }
  return (
    <Section>
      <h3 css={{marginBottom: 16}}>Notes</h3>
      <GridContainer minWidth={'500px'}>
        <InfoCard>
          <TextField
            id="create-new-note"
            label="Create new note"
            fullWidth
            multiline
            rows={3}
          />
          <ButtonContainer>
            <Button variant={'black'} onClick={() => createNewNote()}>
              Create new Note
            </Button>
          </ButtonContainer>
        </InfoCard>
        {currentDate?.Notes.map(note => (
          <NoteCard key={note.ID} noteData={note} />
        ))}
      </GridContainer>
    </Section>
  )
}

function NoteCard({noteData}) {
  const {mutate} = useSWRConfig()
  const {user} = useAuth()
  const [deleteNoteConfirmation, setDeleteNotesConfirmation] =
    React.useState(false)

  async function deleteNote() {
    await client(`coffeedate/${noteData.ID}/DeleteNote`, {
      method: 'DELETE',
    })
    mutate(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`)
  }
  async function editNote() {
    const enteredText = document.getElementById(
      `edit-note-${noteData.ID}`,
    ).value
    await client(`coffeedate/${noteData.ID}/EditNote`, {
      data: {
        NoteType: 'personal',
        NoteText: enteredText,
      },
    })
    mutate(`coffeedate/${user.ID}/getCurrentCoffeeDateForUser`)
  }
  return (
    <InfoCard
      layout
      layoutId={`note-info-card-${noteData.ID}`}
      transition={{ease: 'easeOut', bounce: 0}}
    >
      <TextField
        id={`edit-note-${noteData.ID}`}
        label="Note"
        fullWidth
        defaultValue={noteData.Text}
        multiline
        rows={3}
      />
      {deleteNoteConfirmation ? (
        <Confirmation
          title="Delete note"
          onYes={deleteNote}
          onNo={() => setDeleteNotesConfirmation(false)}
          yesLayoutId={`Button-to-yes-confirmation-${noteData.ID}`}
          noLayoutId={`Button-to-no-confirmation-${noteData.ID}`}
        />
      ) : (
        <ButtonContainer layout>
          <Button
            variant="danger"
            onClick={() => setDeleteNotesConfirmation(true)}
            layoutId={`Button-to-yes-confirmation-${noteData.ID}`}
            layout
            transition={{ease: 'backOut', bounce: 0}}
          >
            Delete Note
          </Button>
          <Button
            variant="black"
            onClick={() => editNote()}
            layoutId={`Button-to-no-confirmation-${noteData.ID}`}
            transition={{ease: 'backOut', bounce: 0}}
          >
            Edit Note
          </Button>
        </ButtonContainer>
      )}
    </InfoCard>
  )
}

function CurrentDate() {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{delay: 0.4}}
    >
      <Card>
        <IntroSection />
        <Proposals />
        <Notes />
      </Card>
    </motion.div>
  )
}

const Bold = styled.span({
  fontWeight: 500,
})

const Section = styled.section({
  marginTop: 32,
})

export {CurrentDate}
