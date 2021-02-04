const headers = [
  {
    id: '',
    title: '',
  },
  {
    id: 'Monday',
    title: 'Monday',
  },
  {
    id: 'Tuesday',
    title: 'Tuesday',
  },
  {
    id: 'Wednesday',
    title: 'Wednesday',
  },
  {
    id: 'Thursday',
    title: 'Thursday',
  },
  {
    id: 'Friday',
    title: 'Friday',
  },
]

const time = [
  {
    id: '',
    title: '',
  },
  {
    id: '10.00',
    title: '10.00',
  },
  {
    id: '11.00',
    title: '11.00',
  },
  {
    id: '12.00',
    title: '12.00',
  },
  {
    id: '13.00',
    title: '13.00',
  },
  {
    id: '14.00',
    title: '14.00',
  },
  {
    id: '15.00',
    title: '15.00',
  },
]

let events = [
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
let users = [
  {
    id: 'Juan',
    name: 'Juan',
  },
  {
    id: 'John',
    name: 'John',
  },
  {
    id: 'Ivan',
    name: 'Ivan',
  },
]

// COMMON VARIABLES
const WHITE = '#fff'
const ORANGE = '#e14f00'

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

//FILLING TABLE
const cells = document.querySelectorAll('.table__for-event')
const eventInner = (el, name, id) =>
  `<div class="table__event">${el}, ${name} <span class="material-icons" data-delete="${id}">delete_forever</span></div>`
const freeDates = () => [...cells].filter((cell) => !cell.hasChildNodes())
freeDates()

const setSchedule = (arr, ev, el) => {
  let value = el.value
  for (let i of arr) {
    for (let j of ev) {
      if (i.id === j.id && value === 'All') {
        i.innerHTML = eventInner(j.title, j.name, j.id)
        freeDates()
      } else if (i.id === j.id && j.name === value) {
        arr.forEach((item) => (item.innerHTML = ''))
        i.innerHTML = eventInner(j.title, j.name, j.id)
        freeDates()
      }
    }
  }
}

const setScheduleWithParams = () => setSchedule(freeDates(), events, selectUser)

setScheduleWithParams()

selectUser.addEventListener('change', function () {
  setScheduleWithParams()
})

const removeFromEvents = (e) => {
  events = events.filter((item) => item.id !== e.target.dataset.delete)
}

const modalButtons = [
  {
    id: 'close',
    class: 'main-btn main-btn_secondary',
    value: 'Cancel',
    icon: 'cancel',
  },
  {
    id: 'confirm',
    class: 'main-btn',
    value: 'Confirm',
    icon: 'done',
  },
]

const modalButtonsHtml = (button) =>
  `<button type="button" data-delete class="${button.class}" data-id="${button.id}"><span class="material-icons" data-id="${button.id}">${button.icon} </span>${button.value}</button>`

const confirmDeleteRender = (target) => {
  const modal = document.createElement('div')
  modal.classList.add('modal')
  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal-container')
  modal.append(modalContainer)
  const h2 = document.createElement('h2')
  h2.innerHTML = 'Are you really crazy you want to remove this event?'
  modalContainer.append(h2)
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('modal__buttons')
  modalContainer.append(buttonContainer)
  const buttonHtml = modalButtons.map(modalButtonsHtml).join('')
  buttonContainer.innerHTML = buttonHtml
  document.body.append(modal)
  modal.querySelector('[data-id="confirm"]').setAttribute('data-delete', target)
  modal.addEventListener('click', function (e) {
    if (e.target.dataset.delete === target) {
      cells.forEach((item) => (item.innerHTML = ''))
      removeFromEvents(e)
      setScheduleWithParams()
      destroyElement(modal)
    } else if (e.target.dataset.id === 'close') {
      destroyElement(modal)
    }
  })
}

table.addEventListener('click', function (e) {
  const trashTarget = e.target.dataset.delete
  if (trashTarget) {
    confirmDeleteRender(trashTarget)
  }
})

// MODAL

const buttonCreate = document.querySelector('#create-event')

const destroyElement = (el) => el.parentNode.removeChild(el)

const optionsTimes = (opt) =>
  `<option value="${opt.id}">${opt.id.split('ay').join('ay, ')}</option>`
const optionsNames = (opt) => `<option value="${opt.name}">${opt.name}</option>`
const setOptionModal = (el, arr, template) => {
  const html = arr.map(template).join('')
  el.innerHTML = html
}

let newEvent = {
  id: '',
  title: '',
  name: users[0].name,
}

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
  selectTime.onchange = function () {
    newEvent.id = selectTime.value
    console.log(newEvent)
  }
  setOptionModal(selectTime, freeDates(), optionsTimes)
  newEvent.id = freeDates()[0].id
  const selectUser = document.createElement('select')
  selectUser.id = '#modal-select-user'
  modalContainer.append(selectUser)
  selectUser.onchange = function () {
    newEvent.name = selectUser.value
    console.log(newEvent)
  }
  setOptionModal(selectUser, users, optionsNames)
  const inputName = document.createElement('input')
  inputName.id = 'event-name'
  modalContainer.append(inputName)
  inputName.onchange = function () {
    newEvent.title = inputName.value
    console.log(newEvent)
  }
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('modal__buttons')
  modalContainer.append(buttonContainer)
  const buttonHtml = modalButtons.map(modalButtonsHtml).join('')
  buttonContainer.innerHTML = buttonHtml
  document.body.append(modal)
  modal.addEventListener('click', function (e) {
    if (e.target.dataset.id === 'confirm') {
      events.push(newEvent)
      console.log(events)
      console.log(newEvent)
      destroyElement(modal)
      setScheduleWithParams()
    } else if (e.target.dataset.id === 'close') {
      destroyElement(modal)
    }
  })
}

buttonCreate.onclick = modalRender
