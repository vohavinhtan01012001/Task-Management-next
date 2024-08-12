import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Section from './Section';

export default function page() {
    return (
        <div className='pl-14'>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
                <div className='grid row-span-2 grid-rows-subgrid '>
                    <div className="row-start-2" >
                        <p className='font-semibold text-2xl text-gray-600'>Inbox</p>
                    </div>
                </div>
                <div>
                    <Section />
                </div>
            </div>
        </div>
    )
}
