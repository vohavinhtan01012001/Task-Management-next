import { faEdit, faPlus, faSquarePlus, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Section from './Section'
import { motion } from "framer-motion"
export default function page() {
    return (
        <div>
            <div className='flex items-center justify-between duration-300'>
                <div className='pl-4'>
                    <button className='text-sm font-semibold text-gray-600 hover:bg-white py-2 px-2 rounded-xl hover:shadow-sm'>My Project /</button>
                </div>
                <div className='flex items-center justify-end mr-6 py-4'>
                    <button className='px-4 text-green-700 hover:text-green-900 hover:bg-white py-2 rounded-xl hover:shadow-sm'><FontAwesomeIcon icon={faUserPlus} className='text-xl' /> <span className='text-sm'>Share</span></button>
                    <button className='px-4 text-green-700 hover:text-green-900 hover:bg-white py-2 rounded-xl hover:shadow-sm'><FontAwesomeIcon icon={faEdit} className='text-xl' /> </button>
                    <button className='px-4 text-green-700 hover:text-green-900 hover:bg-white py-2 rounded-xl hover:shadow-sm'><FontAwesomeIcon icon={faTrash} className='text-xl' /></button>
                </div>
            </div>
            <div className='pl-8'>
                <Section />
            </div>
        </div>
    )
}
