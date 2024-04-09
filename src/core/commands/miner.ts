import useStore, { Store } from '@store/store'

import { renderLoading, renderUnknownHex } from '@utils/utils'

import { registerCommand } from '../commands'
import stream from '../iostream'

let game = useStore.getState().game
useStore.subscribe((state: Store) => (game = state.game))

registerCommand({
  name: 'miner',
  location: '',
  description: 'mining manually',
  stats: [
    {
      fieldName: 'amountOfHashPerClick',
      showingText: 'blocks/click',
      condition: 'console.amountOfHashPerClick > 1'
    },
    {
      fieldName: 'decryptingSpeed',
      showingText: 'decrypting speed'
    }
  ],
  help: [
    {
      showingText: "'space' - mine blockchain"
    }
  ],
  mainFunc: async () => {
    await stream.writeGradually('press or hold space to start')
    stream.writeLn('\n')
    let length = 0

    while (true) {
      let key = ''

      while (key !== ' ') {
        key = await stream.readKey()
      }
      await renderUnknownHex(
        stream,
        1 / Math.pow(game.decryptingSpeed, 0.35),
        game.amountOfHashPerClick
      )
      length += game.amountOfHashPerClick

      if (length >= 16) {
        length = 0
        game.increaseMoney(game.moneyPerBlock)
        useStore.getState().game.setCommandAvailability('go', true)
        useStore.getState().game.setLocationsAvailability('shop', true)
        stream.writeLn('')
        await renderLoading(
          stream,
          'downloading new block: ',
          16 / Math.pow(game.internetSpeed, 0.5)
        )
      }
    }
    return 0
  }
})
