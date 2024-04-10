import { getTrackedProgress, showTip, trackProgress } from '@core/tips'

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
      condition: 'game.amountOfHashPerClick > 1'
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
  onExit: () => {
    if (!getTrackedProgress('going_shop_guide')) {
      showTip('going_shop_guide')
      trackProgress('going_shop_guide')
    }
  },
  mainFunc: async () => {
    stream.writeGradually('\n')
    showTip('miner_controls')
    let length = 0

    while (true) {
      let key = ''

      while (key !== ' ') {
        key = await stream.readKey()
      }
      await renderUnknownHex(
        stream,
        1 / Math.pow(game.decryptingSpeed, 0.35),
        useStore.getState().isDev ? 16 : game.amountOfHashPerClick
      )
      length += useStore.getState().isDev ? 16 : game.amountOfHashPerClick

      if (length >= 16) {
        length = 0
        game.increaseMoney(game.moneyPerBlock)

        useStore.getState().game.setCommandAvailability('go')
        useStore.getState().game.setLocationsAvailability('shop')
        useStore.getState().game.setCommandAvailability('shop/list')
        if (!getTrackedProgress('miner_start')) {
          showTip('miner_first')
          trackProgress('miner_start')
        }

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
