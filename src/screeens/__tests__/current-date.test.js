import React from 'react'
import App from 'App'
import {prettyDOM, render, screen, userEvent, within} from 'test/app-test-utils'

async function renderCurrentDate() {
  const route = '/current-date'
  const utils = await render(<App />, {route})
  return {...utils}
}

test('all elements are rendered currectly in current date page', async () => {
  await renderCurrentDate()
  
  const proposeDateButton = screen.getByRole('button', {name: /Propose new slot/i})
  expect(proposeDateButton).toBeInTheDocument()

  const memberList = screen.getAllByRole('listitem', {name:""})
  expect(memberList).toHaveLength(2)

  const createNoteTextBox = screen.getAllByRole('textbox', {name: /create new note/i})
  expect(createNoteTextBox).toHaveLength(1)
  expect(createNoteTextBox[0]).toBeInTheDocument()

  const existingNotesTextBox = screen.getAllByRole('textbox',{name: /note/i})
  expect(existingNotesTextBox).toHaveLength(3)
})

test("value of create note textbox is updating currently", async () => {
  await renderCurrentDate()
  
  const createNoteTextBox = screen.getByRole('textbox', {name: /create new note/i})
  expect(createNoteTextBox).toBeInTheDocument()

  const newNote = "This is a test note"
  await userEvent.type(createNoteTextBox, newNote)
  
  expect(createNoteTextBox.value).toBe(newNote)
})

test("confirmation appears on clicking delete note", async () => {
    await renderCurrentDate()
    
    const deleteNoteButton = screen.getAllByRole('button', {name: /delete note/i})[0]
    
    await userEvent.click(deleteNoteButton)
    const yesConfirmationButton = screen.getByRole('button', {name: 'Yes'})
    expect(yesConfirmationButton).toBeInTheDocument()
    const noConfirmationButton = screen.getByRole('button', {name: 'No'})
    expect(noConfirmationButton).toBeInTheDocument()
    
    await userEvent.click(noConfirmationButton)
    expect(yesConfirmationButton).not.toBeInTheDocument()
    expect(noConfirmationButton).not.toBeInTheDocument()
})
