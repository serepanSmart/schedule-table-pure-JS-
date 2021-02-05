import './scss/index.scss'
import headers from './data/headers'
import time from './data/time'
// import events from './data/events'
import createEvent from './modal/modal'

const initEvents = [
  {
    id: 'All',
    title: '',
    name: 'All',
  },
  {
    id: 'Monday10.00',
    title: 'meeting-1',
    name: 'Juan',
  },
  {
    id: 'Tuesday12.00',
    title: 'meeting-2',
    name: 'John',
  },
  {
    id: 'Friday13.00',
    title: 'meeting-3',
    name: 'Ivan',
  },
]
const newEvents = initEvents
localStorage.setItem('events', JSON.stringify(newEvents))

let events = JSON.parse(localStorage.getItem('events')) || []


const setToStorage = () => localStorage.setItem('events', JSON.stringify(events))

// COMMON VARIABLES
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
  time.forEach((hour, y) => {
    const row = table.insertRow(y)
    row.id = hour.id
    headers.forEach((header, x) => {
      const cell = row.insertCell(x)
      if (y === 0 && x === 0) {
        cell.style.background = '#fff'
        cell.innerHTML = 'Time / Day'
      } else if (y === 0 && x > 0) {
        cell.classList.add('table__title')
        cell.innerHTML = header.title
      } else if (y > 0 && x === 0) {
        cell.classList.add('table__title')
        cell.innerHTML = hour.title
      } else {
        cell.classList.add('table__for-event')
        cell.id = header.id + hour.id
      }
    })
  })
  schedule.append(table)
}
render()

// FILLING TABLE
const cells = document.querySelectorAll('.table__for-event')
const eventTemplate = (el, name, id) => `<div class="table__event">${el}, ${name} <span class="material-icons" data-delete="${id}">delete_forever</span></div>`
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
        i.innerHTML = eventTemplate(j.title, j.name, j.id)
        freeDates()
      } else if (i.id === j.id && j.name === value) {
        clearCells(arr)
        i.innerHTML = eventTemplate(j.title, j.name, j.id)
        freeDates()
      }
    }
  }
}


export const setScheduleWithParams = () => setSchedule(cells, events, selectUser)

setScheduleWithParams()

selectUser.addEventListener('change', () => {
  setScheduleWithParams()
})

const removeFromEvents = e => { events = events.filter((item) => item.id !== e.target.dataset.delete) }

table.addEventListener('click', (e) => {
  if (e.target.dataset.delete) {
    removeFromEvents(e)
    clearCells(cells)
    setScheduleWithParams()
    setToStorage(events)
  }
})

