import { start } from '@constants/dialogues'

import stream from '@core/iostream'
import { showTip } from '@core/tips'

import useStore from '@store/store'

import { registerCommand } from '../commands'
import renderDialogue from '../dialogueRenderer'

registerCommand({
  name: 'start',
  location: '',
  description: 'start the journey',
  onExit: () => {
    showTip('miner')
  },
  mainFunc: async () => {
    useStore.getState().game.addKeyToProgress('start')
    showTip('enter_or_space')
    await renderDialogue(start)
    showTip('ctrl_c')
    useStore.getState().game.setCommandAvailability('miner')
    useStore.getState().game.setCommandAvailability('start', false)
    while (true) await stream.readKey()
    return 0
  }
})
