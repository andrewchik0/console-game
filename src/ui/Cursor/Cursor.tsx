'use client'
import React, { CSSProperties } from 'react'

import styles from './Cursor.module.scss'

type Props = {
  className?: string
  style?: CSSProperties
}

const Cursor = ({ className, style }: Props) => {
  return <div className={`${styles.className} ${styles.cursor} ${className}`} style={style}></div>
}

export default Cursor
