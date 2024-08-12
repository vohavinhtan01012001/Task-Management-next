'use client'

import { faLeaf, faListCheck, faSignOut, faEllipsisVertical, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SidebarLogo from './SidebarLogo'
import './sidebar.css'
import MenuList from './MenuList'
import initMenu from '../menu/menu'
import { useRouter } from 'next/navigation'
import authApiRequest from '@/apiRequests/auth'
import { useAppContext } from '@/app/app-provider'
import { toast } from 'react-toastify'
import { Avatar } from 'antd'
import AvatarCus from '@/components/Avatar'

function Sidebar({ ...props }) {
  const [menus, setMenus] = useState(initMenu)
  const [scButton, setScButton] = useState(false)
  const router = useRouter()
  const { setUser } = useAppContext()
  const [showListView, setShowListView] = useState<boolean>(false)
  const [showProfile, setShowProfile] = useState<boolean>(false)
  const [userAvatar, setUserAvatar] = useState<any>();

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user') && localStorage.getItem('user')
      const userObject = user && JSON.parse(user)
      setUserAvatar(userObject)
    }
  }, [])


  const handleChange = (e: any) => {
    if (e.target.value) {
      setScButton(true)
      setMenus(
        menus.filter((el: any) => {
          return el.label.toLowerCase().includes(e.target.value.toLowerCase())
        })
      )
    } else {
      setScButton(false)
      setMenus(initMenu)
    }
  }

  const logout = async () => {
    await authApiRequest.logoutFromNextClientToNextServer(true)
      .then(() => {
        setUser(null)
        router.push('/')
        toast.success(
          "User logged out successfully",
          {
            position: toast.POSITION.TOP_RIGHT
          }
        )
      })
  }

  return (
    <>
      <div
        id='sidebar'
        className={`sidebarWrapper no-scrollbar z-50 -translate-x-full md:z-0 md:translate-x-0 shadow-lg ${props.className}`}
      >
        {/* Sidebar wrapper */}
        <div className='flex h-full flex-shrink-0 flex-col border-r-2 border-gray-100 md:w-64'>
          {/* Logo */}
          <SidebarLogo setShowAddTask={props.setShowAddTask} /* toggle={props.toggle} */ icon={faListCheck} text='Task manager' />

          {/* Search Menu */}
          {/*  <SidebarSearch clearSearch={clearSearch} handleChange={handleChange} scButton={scButton} search={search} /> */}

          {/* Menu */}
          <MenuList menus={menus} toggle={props.toggle} />

          {/* Profile */}
          <div className='border-t border-gray-300 pt-2'>
            <div className=' px-4 py-2 flex justify-between items-center'>
              <div className='relative'>
                <AvatarCus user={userAvatar} />
                {
                  <ul className={`absolute -top-[50%] left-0 w-[100px] h-[35px] z-[999] rounded-lg pt-2 translate-y-0 opacity-0 duration-300 transition-all ${showListView ? '-translate-y-7 opacity-100 mt-3' : ''}`} style={{ background: 'rgb(187, 247, 208)' }}>
                    <li className='text-start pl-2 text-sm hover:text-red-500 hover:cursor-pointer' onClick={() => setShowProfile(true)}>Profile</li>
                  </ul>
                }
              </div>
              {/* Logout Button */}
              <button
                className='relative justify-end px-3 py-2 text-sm  text-green-700 hover:bg-slate-100 rounded-full'
                onClick={() => logout()}
              >
                {/* <FontAwesomeIcon icon={faEllipsisVertical} className='text-xl' />
                {
                  showListView && <ul className='absolute -top-full right-full w-[100px] h-[35px] z-[999] font-bold rounded-lg animate-show-box pt-2' style={{ background: 'rgb(187, 247, 208)' }}>
                    <li className='text-start pl-2' onClick={() => logout()}>Log out</li>
                  </ul>
                } */}
                <FontAwesomeIcon icon={faRightFromBracket} className='text-xl' />
              </button>
            </div>
          </div>
        </div>
      </div >

      {
        props.className === 'mobile' && (
          <div
            id='overlaySidebar'
            onClick={props.toggle}
            className='absolute inset-0 z-10 hidden h-screen w-full bg-black opacity-60'
          >
            <div></div>
          </div>
        )
      }
    </>
  )
}

export default Sidebar
