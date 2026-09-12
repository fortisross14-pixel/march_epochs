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
import elderMini from './assets/minis/elder.svg'
import merchantMini from './assets/minis/merchant.svg'
import veteranMini from './assets/minis/veteran.svg'
import hunterMini from './assets/minis/hunter.svg'
import narmerMini from './assets/minis/narmer.svg'
import sargonMini from './assets/minis/sargon.svg'
import thutmoseMini from './assets/minis/thutmose.svg'
import ramessesMini from './assets/minis/ramesses.svg'
import cyrusMini from './assets/minis/cyrus.svg'
import warriorMini from './assets/minis/warrior.png'
import spearMini from './assets/minis/spear.png'
import slingerMini from './assets/minis/slinger.png'
import archerMini from './assets/minis/archer.png'
import cavalryMini from './assets/minis/cavalry.png'
import warElephantMini from './assets/minis/warElephant.png'
import firstWarsArt from './assets/campaigns/first-wars.png'
import bronzeEmpiresArt from './assets/campaigns/bronze-empires.svg'

import fireArt from './assets/tech/fire.svg'
import archeryArt from './assets/tech/archery.svg'
import wheelArt from './assets/tech/wheel.svg'
import agricultureArt from './assets/tech/agriculture.svg'
import domesticationArt from './assets/tech/domestication.svg'
import writingArt from './assets/tech/writing.svg'
import copperArt from './assets/tech/copper.svg'
import bronzeArt from './assets/tech/bronze.svg'
import irrigationArt from './assets/tech/irrigation.svg'
import organizationArt from './assets/tech/organization.svg'
import roadsArt from './assets/tech/roads.svg'
import fortificationArt from './assets/tech/fortification.svg'
import ironArt from './assets/tech/iron.svg'
import metallurgyArt from './assets/tech/metallurgy.svg'
import gunpowderArt from './assets/tech/gunpowder.svg'
import firearmsArt from './assets/tech/firearms.svg'
import industrialArt from './assets/tech/industrial.svg'
import machinegunArt from './assets/tech/machinegun.svg'
import ballisticsArt from './assets/tech/ballistics.svg'
import rocketryArt from './assets/tech/rocketry.svg'

import bronzeArmorArt from './assets/items/bronzeArmor.svg'
import edgedProjectilesArt from './assets/items/edgedProjectiles.svg'
import slingPouchArt from './assets/items/slingPouch.svg'
import leatherLamellarArt from './assets/items/leatherLamellar.svg'
import warStandardArt from './assets/items/warStandard.svg'
import ptolemaicCoinArt from './assets/items/ptolemaicCoin.svg'
import bicorneArt from './assets/items/bicorne.svg'

export const ASSETS = {
  logo,
  people: {
    elder:{mini:elderMini}, merchant:{mini:merchantMini}, veteran:{mini:veteranMini}, hunter:{mini:hunterMini},
    narmer:{mini:narmerMini}, sargon:{mini:sargonMini}, thutmose:{mini:thutmoseMini}, ramesses:{mini:ramessesMini}, cyrus:{mini:cyrusMini},
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
  },
  tech: {
    fire:fireArt, archery:archeryArt, wheel:wheelArt, agriculture:agricultureArt, domestication:domesticationArt,
    writing:writingArt, copper:copperArt, bronze:bronzeArt, irrigation:irrigationArt, organization:organizationArt,
    roads:roadsArt, fortification:fortificationArt, iron:ironArt, metallurgy:metallurgyArt, gunpowder:gunpowderArt,
    firearms:firearmsArt, industrial:industrialArt, machinegun:machinegunArt, ballistics:ballisticsArt, rocketry:rocketryArt,
  },
  campaigns: { firstWars:firstWarsArt, bronzeEmpires:bronzeEmpiresArt },
  items: {
    bronzeArmor:bronzeArmorArt, edgedProjectiles:edgedProjectilesArt, slingPouch:slingPouchArt,
    leatherLamellar:leatherLamellarArt, warStandard:warStandardArt, ptolemaicCoin:ptolemaicCoinArt, bicorne:bicorneArt,
  }
}
