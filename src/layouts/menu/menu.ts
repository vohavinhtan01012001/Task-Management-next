import { faPage4, faWindows } from '@fortawesome/free-brands-svg-icons'
import {
  faCalendar,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons'

const initMenu = [
  {
    label: 'Today',
    path: '/today',
    icon: faCalendar
  },
  {
    label: 'Upcoming',
    path: '/upcoming',
    icon: faCalendarDays
  },
]

export default initMenu
