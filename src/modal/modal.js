import { freeDates, setScheduleWithParams } from '../index'
import users from '../data/users'

const events = JSON.parse(localStorage.getItem('events')) || []
const setToStorage = () => localStorage.setItem('events', JSON.stringify(events))

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
  name: ''
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
