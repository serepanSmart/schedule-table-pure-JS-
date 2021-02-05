import './scss/index.scss'
import headers from './data/headers'
import time from './data/time'
import {events, newEvents} from './data/events'
import {confirmDeleteRender} from './modal/modal'

events = JSON.parse(localStorage.getItem('events')) || newEvents

const toStorage = () => localStorage.setItem('events', JSON.stringify(events))

export const setToStorage = toStorage

// COMMON VARIABLES
const table = document.createElement('table')
table.classList.add('table')
const schedule = document.querySelector('#schedule')

// SELECTION USER BLOCK
const selectUser = document.querySelector('#select-user')

const optionsUser = (opt) => `<option value="${opt}">${opt}</option>`

const uniqueNames = []

const setOptionsUser = () => {
  const names = events.map(item => item.name)
  new Set(names).forEach(item => uniqueNames.push(item))
  const html = uniqueNames.map(optionsUser).join('')
  selectUser.innerHTML = html
}

setOptionsUser()

// RENDERING TABLE

const render = () => {
  time.forEach((hour, y) => {
    const row = table.insertRow(y)
    row.id = hour.id
    headers.forEach((day, x) => {
      const cell = row.insertCell(x)
      if (y === 0 && x === 0) {
        cell.style.background = '#fff'
        cell.innerHTML = 'Time / Day'
      } else if (y === 0 && x > 0) {
        cell.classList.add('table__title')
        cell.innerHTML = day.title
      } else if (y > 0 && x === 0) {
        cell.classList.add('table__title')
        cell.innerHTML = hour.title
      } else {
        cell.classList.add('table__for-event')
        cell.id = day.id + hour.id
      }
    })
  })
  schedule.append(table)
}
render()

// FILLING TABLE
export const cells = document.querySelectorAll('.table__for-event')
const eventTemplate = (el, name, id) => `<div class="table__event">${el}, ${name} <span class="material-icons" data-delete="${id}">delete_forever</span></div>`
const setFreeDates = () => [...cells].filter(cell => !cell.hasChildNodes())
export const freeDates = setFreeDates
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
      } else if (i.id === j.id && value === j.name) {
        clearCells(arr)
        i.innerHTML = eventTemplate(j.title, j.name, j.id)
        freeDates()
      }
    }
  }
}

const newSetSchedule = () => setSchedule(cells, events, selectUser)
export const setScheduleWithParams = newSetSchedule

setScheduleWithParams()

// FILTER BY USER

selectUser.addEventListener('change', () => {
  const newArr = events.filter(item => item.name === selectUser.value)
  clearCells(cells)
  selectUser.value === 'All' ? setScheduleWithParams() :
  newArr.forEach(item => {
    cells.forEach(cell => {
      if (cell.id === item.id) {
        cell.innerHTML = eventTemplate(item.title, item.name, item.id)
      }
    })
  })
})

// REMOVE EVENT

table.addEventListener('click', (e) => {
  const trashTarget = e.target.dataset.delete
  if (trashTarget) {
    confirmDeleteRender(trashTarget)
  }
})
