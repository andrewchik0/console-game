import { name } from '@constants/general'

export const start = [
  'welcome, user!\n',
  `you are in ${name} game`,
  "you can start mining your first currency with 'miner' command",
  'first, you should exit this program'
]

export const guide = {
  start: "enter 'start' to start",
  enter_or_space: "press 'space' ot 'enter' to continue or speed up the output",
  ctrl_c: "now press 'ctr + c' to exit the program execution",
  miner: "to open up the miner use 'miner' command",
  miner_controls: "use 'space' key to mine",
  miner_first:
    "congratulations, you have earned your first money. now you can use 'go <location>' command. only location available yet is the shop",
  going_shop_guide: "use 'go shop' or 'cd shop' command",
  first_time_in_shop: "to list all available item use 'list' command",
  first_leave_from_shop: "to go back home use 'home' or 'back' command",
  not_enough_have_money: 'you do not have enough money to buy item',
  successfully_bought: 'successfully bought item'
}
