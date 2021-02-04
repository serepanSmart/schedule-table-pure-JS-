const events = [
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

localStorage.setItem('events', JSON.stringify(events))
const dbEvents = JSON.parse(localStorage.getItem('events')) || []

export default dbEvents
