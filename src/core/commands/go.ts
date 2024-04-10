import { Location, locations } from '@constants/general'

import { getTrackedProgress, showTip, trackProgress } from '@core/tips'

import useStore from '@store/store'

import { multiplyString } from '@utils/utils'

import { isLocationAvailable, registerCommand } from '../commands'
import stream from '../iostream'

const renderTips = (arg: string) => {
  if (arg === 'shop' && !getTrackedProgress('first_time_in_shop')) {
    trackProgress('first_time_in_shop')
    showTip('first_time_in_shop')
  }
}

registerCommand({
  name: ['go', 'cd'],
  location: '',
  skipLocationChecking: true,
  description: 'go to certain location',
  showingName: 'go <location>',
  mainFunc: async (args) => {
    renderTips(args[0])

    if (args.length < 1 || args[0] == 'help') {
      await stream.writeGradually('available locations:')

      stream.writeLn(' .')
      let locName = ''
      const printLocationsRec = (locs: Location[], deepLvl = 1) => {
        locs.forEach((loc) => {
          locName += loc.name

          if (isLocationAvailable(locName)) {
            stream.writeLn(multiplyString(' |', deepLvl) + multiplyString('_', 2) + loc.name)
            if (loc.child) {
              locName += '/'
              printLocationsRec(loc.child, deepLvl + 1)
              locName = locName.substring(0, locName.length - 1)
            }
          }
          locName = locName.substring(0, locName.length - loc.name.length)
        })
      }
      printLocationsRec(locations)
      stream.writeLn(' ')
      return 0
    }
    const path = args[0].split('/')

    const found = (locs: Location[], path: string[]): boolean => {
      let flag = false
      locs.forEach((loc) => {
        if (loc.name == path[0]) {
          if (loc.child && path.length > 1) {
            path.shift()
            flag = found(loc.child, path)
          }
          flag = true
        }
      })
      return flag
    }

    if (found(locations, path) && isLocationAvailable(args[0])) {
      stream.setLocation(args[0])
      useStore.getState().game.setCommandAvailability('home')
    } else {
      await stream.writeGradually(`no such location: ${args[0]}`)
      await stream.writeGradually(`to list all available locations use 'go help'`)
    }
    return 0
  }
})
