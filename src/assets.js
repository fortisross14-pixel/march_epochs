import logo from './assets/logo.png'
import cleopatraFront from './assets/cards/cleopatra-front.png'
import cleopatraBack from './assets/cards/cleopatra-back.png'
import hannibalFront from './assets/cards/hannibal-front.png'
import hannibalBack from './assets/cards/hannibal-back.png'
import napoleonFront from './assets/cards/napoleon-front.png'
import napoleonBack from './assets/cards/napoleon-back.png'
import cleopatraMini from './assets/minis/cleopatra.png'
import hannibalMini from './assets/minis/hannibal.png'
import napoleonMini from './assets/minis/napoleon.png'
import warriorMini from './assets/minis/warrior.png'
import spearMini from './assets/minis/spear.png'
import slingerMini from './assets/minis/slinger.png'
import archerMini from './assets/minis/archer.png'
import cavalryMini from './assets/minis/cavalry.png'
import warElephantMini from './assets/minis/warElephant.png'

export const ASSETS = {
  logo,
  people: {
    cleopatra: { front: cleopatraFront, back: cleopatraBack, mini: cleopatraMini },
    hannibal: { front: hannibalFront, back: hannibalBack, mini: hannibalMini },
    napoleon: { front: napoleonFront, back: napoleonBack, mini: napoleonMini },
  },
  units: {
    warrior: warriorMini,
    spear: spearMini,
    slinger: slingerMini,
    archer: archerMini,
    cavalry: cavalryMini,
    warElephant: warElephantMini,
  }
}
