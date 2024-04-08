export const name = 'The Console Miner'
export const githubLink = 'https://github.com/andrewchik0/console-game'

export type HelpUnit = {
  showingText: string
  condition?: string
}
export type StatUnit = {
  fieldName: string
  showingText: string
  condition?: string
}

export type Location = {
  name: string
  stats?: StatUnit[]
  child?: Location[]
}
export type Locations = Location[]
export const locations: Locations = [
  {
    name: 'shop'
  },
  {
    name: 'farm'
  }
]
