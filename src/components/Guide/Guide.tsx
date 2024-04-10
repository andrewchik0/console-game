'use client'
import React, { useEffect, useState } from 'react'

import styles from './Guide.module.scss'

import useStore from '@store/store'

import { clamp } from '@utils/utils'

const Guide = () => {
  const guides = useStore((state) => state.guides)

  const pageCount = Math.max(guides.length - 1, 0)

  const [index, setIndex] = useState(pageCount)

  useEffect(() => setIndex(pageCount), [guides])

  return (
    <div className={styles.guide}>
      <p>{guides[index]}</p>
      <div className={styles.guide__controls}>
        <button
          className={styles.guide__controls_button}
          disabled={index === 0}
          onClick={() => setIndex(clamp(index - 1, 0, pageCount))}
        >
          {'<'}
        </button>
        <span>{index + 1}</span>
        <button
          className={styles.guide__controls_button}
          disabled={index === pageCount}
          onClick={() => setIndex(clamp(index + 1, 0, pageCount))}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default Guide
