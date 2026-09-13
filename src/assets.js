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
import bronzeEdgesArt from './assets/items/bronzeEdges.svg'
import spearheadsArt from './assets/items/spearheads.svg'
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
    bronzeArmor:bronzeArmorArt, bronzeEdges:bronzeEdgesArt, spearheads:spearheadsArt, edgedProjectiles:edgedProjectilesArt, slingPouch:slingPouchArt,
    leatherLamellar:leatherLamellarArt, warStandard:warStandardArt, ptolemaicCoin:ptolemaicCoinArt, bicorne:bicorneArt,
  }
}

// v0.13 reusable UI asset library
import uiCoin from './assets/ui-kit/icon-coin.svg'
import uiXp from './assets/ui-kit/icon-xp.svg'
import uiTp from './assets/ui-kit/icon-tp.svg'
import uiTrophy from './assets/ui-kit/icon-trophy.svg'
import uiCampaign from './assets/ui-kit/icon-campaign.svg'
import uiArtifacts from './assets/ui-kit/icon-artifacts.svg'
import uiPeople from './assets/ui-kit/icon-people.svg'
import uiArmies from './assets/ui-kit/icon-armies.svg'
import uiTechnology from './assets/ui-kit/icon-technology.svg'
import uiStore from './assets/ui-kit/icon-store.svg'
import uiCampaignActive from './assets/ui-kit/icon-campaign-active.svg'
import uiArtifactsActive from './assets/ui-kit/icon-artifacts-active.svg'
import uiPeopleActive from './assets/ui-kit/icon-people-active.svg'
import uiArmiesActive from './assets/ui-kit/icon-armies-active.svg'
import uiTechnologyActive from './assets/ui-kit/icon-technology-active.svg'
import uiStoreActive from './assets/ui-kit/icon-store-active.svg'
import uiLock from './assets/ui-kit/icon-lock.svg'
import uiStar from './assets/ui-kit/icon-star.svg'
import uiArrowLeft from './assets/ui-kit/icon-arrow-left.svg'
import uiArrowRight from './assets/ui-kit/icon-arrow-right.svg'
import uiClose from './assets/ui-kit/icon-close.svg'

import uiItemSlotEpic from './assets/ui-kit/item-slot-epic.svg'
import uiItemSlotRare from './assets/ui-kit/item-slot-rare.svg'
import uiItemSlotCommon from './assets/ui-kit/item-slot-common.svg'
import uiItemSlotLegend from './assets/ui-kit/item-slot-legend.svg'
import uiUpgradeReady from './assets/ui-kit/upgrade-ready.svg'

ASSETS.ui = {
  coin:uiCoin, xp:uiXp, tp:uiTp, trophy:uiTrophy,
  campaign:uiCampaign, artifacts:uiArtifacts, people:uiPeople, armies:uiArmies, technology:uiTechnology, store:uiStore,
  campaignActive:uiCampaignActive, artifactsActive:uiArtifactsActive, peopleActive:uiPeopleActive, armiesActive:uiArmiesActive, technologyActive:uiTechnologyActive, storeActive:uiStoreActive,
  lock:uiLock, star:uiStar, arrowLeft:uiArrowLeft, arrowRight:uiArrowRight, close:uiClose,
  itemSlotEpic:uiItemSlotEpic, itemSlotRare:uiItemSlotRare, itemSlotCommon:uiItemSlotCommon, itemSlotLegend:uiItemSlotLegend, upgradeReady:uiUpgradeReady,
}
