import { MutableRefObject, useEffect, useRef, useState } from 'react'

// Returns ref to element that will be observed, boolean isInFocus and setFocus callback
const useFocus = <T extends HTMLElement>(
  defaultState = false
): [MutableRefObject<T | null>, boolean, (value?: boolean) => void] => {
  const ref = useRef<T>(null)
  const [state, setState] = useState(defaultState)

  const setFocus = () => {
    setState(true)
    ref.current && ref.current.focus()
  }

  const setBlur = () => {
    setState(false)
    ref.current && ref.current.blur()
  }

  useEffect(() => {
    ref.current && ref.current.addEventListener('focus', setFocus)
    ref.current && ref.current.addEventListener('blur', setBlur)

    return () => {
      ref.current && ref.current.removeEventListener('focus', setFocus)
      ref.current && ref.current.removeEventListener('blur', setBlur)
    }
  }, [])

  return [ref, state, (value = true) => (value ? setFocus() : setBlur())]
}

export default useFocus
