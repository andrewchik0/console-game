import { guide } from '@constants/dialogues'

import useStore from '@store/store'

import { getObjectKey } from '@utils/utils'

export const showTip = (key: string, additionalInfo: string = '') => {
  getObjectKey(guide, key) &&
    useStore.getState().pushGuide(guide[key as keyof typeof guide] + additionalInfo)
}

export const popTip = () => {
  const newGuides = useStore.getState().guides
  newGuides.pop()
  useStore.setState((store) => ({ ...store, newGuides }))
}

export const trackProgress = (key: string, value: boolean = true) => {
  useStore.getState().game.addKeyToProgress(key, value)
}

export const getTrackedProgress = (key: string) => {
  return useStore.getState().game.progressTracker[key] || false
}
