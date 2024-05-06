'use client'

import { faGhost } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from './page404.module.scss'
export default function Page404() {
  return (
    <main className={styles.container}>
      <h1>
        4
        <span>
          <i>
            <FontAwesomeIcon icon={faGhost} className='w-[170px] h-[170px]'/>
          </i>
        </span>
        4
      </h1>
      <h2>Error: 404 page not found</h2>
      <p>Sorry, the page you're looking for cannot be accessed</p>
    </main>
  )
}
