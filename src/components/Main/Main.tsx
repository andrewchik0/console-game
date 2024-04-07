import React from 'react'

import styles from './Main.module.scss'

import Console from '@components/Console/Console'
import Help from '@components/Help/Help'
import Stats from '@components/Stats/Stats'

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.main__container}>
        <Console />
        <div className={styles.main__info}>
          <Stats />
          <Help />
        </div>
      </div>
    </main>
  )
}

export default Main
