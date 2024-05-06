'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { Avatar, Button } from 'antd'
import ButtonCustom from '@/components/ButtonCustom'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
interface PropsLogo {
  icon: any
  text: string
  setShowAddTask: any
}
function SidebarLogo({ icon, text, setShowAddTask/* ...props */ }: PropsLogo) {
  return (
    <div>
      <div className='relative mb-5 flex flex-row justify-between p-4 text-2xl font-semibold text-green-700 md:mx-auto md:items-center top-[20px]'>
        <Link href={'/'}>
          <FontAwesomeIcon icon={icon} /> {text}
        </Link>
      </div>
      <button
        className={`outline-none m-auto ml-4 border-none flex justify-start text-sm font-mono font-bold items-center pl-4 text-red-400 pb-2 pt-2 cursor-pointer hover:text-red-700`}
        onClick={() => setShowAddTask(true)}
      >
        <FontAwesomeIcon icon={faPlusCircle} className='pr-4 text-2xl' /> Add Task
      </button>
    </div >
  )
}

export default SidebarLogo
