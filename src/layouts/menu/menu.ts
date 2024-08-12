import { faPage4, faWindows } from '@fortawesome/free-brands-svg-icons'
import {
  faBox,
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
  {
    label: 'Box',
    path: '/box',
    icon: faBox
  },
]

export default initMenu
