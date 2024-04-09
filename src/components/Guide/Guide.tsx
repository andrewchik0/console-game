'use client'
import React, { useState } from 'react'

import styles from './Guide.module.scss'

import useStore from '@store/store'

import { clamp } from '@utils/utils'

const Guide = () => {
  const guides = useStore((state) => state.guides)

  const [index, setIndex] = useState(guides.length - 1)

  return (
    <div className={styles.guide}>
      <p>{guides[index]}</p>
      <div className={styles.guide__controls}>
        <button
          className={styles.guide__controls_button}
          disabled={index === 0}
          onClick={() => setIndex(clamp(index - 1, 0, guides.length - 1))}
        >
          {'<'}
        </button>
        <span>{index + 1}</span>
        <button
          className={styles.guide__controls_button}
          disabled={index === guides.length - 1}
          onClick={() => setIndex(clamp(index + 1, 0, guides.length - 1))}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default Guide
