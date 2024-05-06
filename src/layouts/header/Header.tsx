'use client'


import { useState } from 'react'
import logo from '../../assets/frontend/img/logo/imageLogo.png'

export default function NavbarWithDropdown() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  console.log(isMenuOpen)

  return <div className=''>He</div>
}
