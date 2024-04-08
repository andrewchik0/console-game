import React, { CSSProperties } from 'react'

export const renderWithBackground = (str: string, style?: CSSProperties, className?: string) => {
  let opened = false
  let text = ''
  const items: React.ReactNode[] = []

  for (const [idx, ch] of [...str].entries()) {
    if (idx == str.length - 1) {
      text += ch
    }
    if (ch == "'" || idx == str.length - 1) {
      if (opened) {
        opened = false
        items.push(
          <span style={style} className={className}>
            {text}
          </span>
        )
        text = ''
      } else {
        opened = true
        items.push(text)
        text = ''
      }
    } else {
      text += ch
    }
  }
  return (
    <>
      {items.map((el, idx) => (
        <React.Fragment key={idx}>{el}</React.Fragment>
      ))}
    </>
  )
}
