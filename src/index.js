import './scss/index.scss'
import headers from './data/headers'
import time from './data/time'
import users from './data/users'
import events from './data/events'
// import modal from './modal/modal'

const setToStorage = () => localStorage.setItem('events', JSON.stringify(events))
// const setToStorage = () => localStorage.setItem('events', JSON.stringify(events))

// COMMON VARIABLES
const WHITE = '#fff'

const table = document.createElement('table')
table.classList.add('table')
const schedule = document.querySelector('#schedule')

// SELECTION USER BLOCK
const selectUser = document.querySelector('#select-user')

const optionsUser = (opt) => `<option value="${opt.name}">${opt.name}</option>`

const setOptionsUser = () => {
  const html = events.map(optionsUser).join('')
  selectUser.innerHTML = html
}
setOptionsUser()

// RENDERING TABLE

const render = () => {
  for (let y = 0; y < time.length; y++) {
    const row = table.insertRow(y)
    row.id = time[y].id

    for (let x = 0; x < headers.length; x++) {
      const cell = row.insertCell(x)
      if (y === 0 && x === 0) {
        cell.style.background = WHITE
        cell.innerHTML = 'Time / Day'
      } else if (y === 0 && x > 0) {
        cell.classList.add('table__title')
        cell.innerHTML = headers[x].title
      } else if (y > 0 && x === 0) {
        cell.classList.add('table__title')
        cell.innerHTML = time[y].title
      } else {
        cell.classList.add('table__for-event')
        cell.id = headers[x].id + time[y].id
      }
    }
  }
  schedule.append(table)
}
render()

// FILLING TABLE
const cells = document.querySelectorAll('.table__for-event')
const eventInner = (el, name, id) => `<div class="table__event">${el}, ${name} <span class="material-icons" data-delete="${id}">delete_forever</span></div>`
export const freeDates = () => [...cells].filter(cell => !cell.hasChildNodes())
freeDates()

const clearCells = (arr) => arr.forEach(cell => {
  const itemCell = cell
  itemCell.innerHTML = ''
})

const setSchedule = (arr, ev, el) => {
  const { value } = el
  for (const i of arr) {
    for (const j of ev) {
      if (i.id === j.id && value === 'All') {
        i.innerHTML = eventInner(j.title, j.name, j.id)
        freeDates()
        // setToStorage()
      } else if (i.id === j.id && j.name === value) {
        clearCells(arr)
        i.innerHTML = eventInner(j.title, j.name, j.id)
        freeDates()
        // setToStorage()
      }
    }
  }
}

export const setScheduleWithParams = () => setSchedule(cells, events, selectUser)

setScheduleWithParams()

selectUser.addEventListener('change', () => {
  setScheduleWithParams()
})

// eslint-disable-next-line max-len
const removeFromEvents = e => { events = events.filter((item) => item.id !== e.target.dataset.delete) }

table.addEventListener('click', (e) => {
  if (e.target.dataset.delete) {
    removeFromEvents(e)
    clearCells(cells)
    setScheduleWithParams()
    setToStorage()
  }
})

const destroyElement = (el) => el.parentNode.removeChild(el)

const modalButtons = [
  {
    id: 'close',
    class: 'main-btn main-btn_secondary',
    value: 'Cancel',
    icon: 'cancel',
  },
  {
    id: 'create',
    class: 'main-btn',
    value: 'Create',
    icon: 'done',
  },
]

const optionsTimes = opt => `<option value="${opt.id}">${opt.id.split('1').join(' 1')}</option>`
const optionsNames = opt => `<option value="${opt.name}">${opt.name}</option>`
const setOptionModal = (el, arr, template) => {
  const html = arr.map(template).join('')
  const item = el
  item.innerHTML = html
}

const newEvent = {
  id: '',
  title: '',
  name: users[0].name,
}
const modalButtonsHtml = button => `<button type="button" class="${button.class}" data-id="${button.id}"><span class="material-icons" data-id="${button.id}">${button.icon} </span>${button.value}</button>`

const modalRender = () => {
  const modal = document.createElement('div')
  modal.classList.add('modal')
  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal-container')
  modal.append(modalContainer)
  const h2 = document.createElement('h2')
  h2.innerHTML = 'Create New Event'
  modalContainer.append(h2)
  const selectTime = document.createElement('select')
  selectTime.id = '#modal-select-time'
  modalContainer.append(selectTime)
  selectTime.onchange = () => {
    newEvent.id = selectTime.value
    console.log(newEvent);
  }
  setOptionModal(selectTime, freeDates(), optionsTimes)
  newEvent.id = selectTime.value
  const selectUserModal = document.createElement('select')
  selectUserModal.id = '#modal-select-user'
  modalContainer.append(selectUserModal)
  selectUserModal.onchange = () => {
    newEvent.name = selectUserModal.value
    console.log(newEvent);
  }
  setOptionModal(selectUserModal, users, optionsNames)
  const inputName = document.createElement('input')
  inputName.id = 'event-name'
  modalContainer.append(inputName)
  inputName.onchange = () => {
    newEvent.title = inputName.value
    console.log(newEvent);
  }
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('modal__buttons')
  modalContainer.append(buttonContainer)
  const buttonHtml = modalButtons.map(modalButtonsHtml).join('')
  buttonContainer.innerHTML = buttonHtml
  document.body.append(modal)
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.id === 'create') {
      events.push(newEvent)
      console.log(events);
      destroyElement(modal)
      setToStorage()
      setScheduleWithParams()
    } else if (e.target.dataset.id === 'close') {
      destroyElement(modal)
    }
  })
}

const buttonCreate = document.querySelector('#create-event')

export default buttonCreate.addEventListener('click', modalRender)
