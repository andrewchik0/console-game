import React from 'react'

import styles from './Footer.module.scss'

import { githubLink } from '@constants/general'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href={githubLink}
        className={styles.footer__link}
        target='_blank'
        rel='noopener noreferrer'
      >
        source
      </a>
    </footer>
  )
}

export default Footer
