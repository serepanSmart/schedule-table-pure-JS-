import { freeDates, setScheduleWithParams, cells, setToStorage} from '../index'
import users from '../data/users'
import {events, newEvents} from '../data/events'

events = JSON.parse(localStorage.getItem('events')) || newEvents

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

let newEvent = {
  id: '',
  title: '',
  name: ''
}

const modalButtonsHtml = button => `<button type="button" class="${button.class}" data-id="${button.id}"><span class="material-icons" data-id="${button.id}">${button.icon} </span>${button.value}</button>`

const destroyElement = (el) => {
  el.parentNode.removeChild(el)
  isModal = false
} 

const removeFromEvents = (e) => {
  events = events.filter((item) => item.id !== e.target.dataset.delete)
}

const optionsTimes = opt => `<option value="${opt.id}">${opt.id.split('ay').join('ay ')}</option>`
const optionsNames = opt => `<option value="${opt.name}">${opt.name}</option>`
const setOptionModal = (el, arr, template) => {
  const html = arr.map(template).join('')
  const item = el
  item.innerHTML = html
}

const buttonsContainer = (container, parent) => {
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('modal__buttons')
  container.append(buttonContainer)
  const buttonHtml = modalButtons.map(modalButtonsHtml).join('')
  buttonContainer.innerHTML = buttonHtml
  document.body.append(parent)
}

let isModal = false

// Modal Renders

const modalRender = () => {
  if (!isModal) {
    const resetNewEvent = {
      id: '',
      title: '',
      name: '',
    }
    newEvent = { ...resetNewEvent }
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
    }
    setOptionModal(selectTime, freeDates(), optionsTimes)
    newEvent.id = selectTime.value
    const selectUserModal = document.createElement('select')
    selectUserModal.id = '#modal-select-user'
    modalContainer.append(selectUserModal)
    selectUserModal.onchange = () => {
      newEvent.name = selectUserModal.value
    }
    setOptionModal(selectUserModal, users, optionsNames)
    newEvent.name = selectUserModal.value
    const inputName = document.createElement('input')
    inputName.id = 'event-name'
    modalContainer.append(inputName)
    inputName.placeholder = 'Type event name here...'
    inputName.onchange = () => {
      newEvent.title = inputName.value
    }
    buttonsContainer(modalContainer, modal)
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.id === 'confirm') {
        events.push(newEvent)
        destroyElement(modal)
        setToStorage()
        setScheduleWithParams()
      } else if (e.target.dataset.id === 'close') {
        destroyElement(modal)
      }
    })
    isModal = true
  }
}

export const confirmDeleteRender = (target) => {
  if(!isModal) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container')
    modal.append(modalContainer)
    const h2 = document.createElement('h2')
    h2.innerHTML = 'Are you really crazy you want to remove this event?'
    modalContainer.append(h2)
    buttonsContainer(modalContainer, modal)
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
    isModal = true
  }
}

const createEvent = modalRender

const buttonCreate = document.querySelector('#create-event')

buttonCreate.addEventListener('click', createEvent)

export default createEvent
