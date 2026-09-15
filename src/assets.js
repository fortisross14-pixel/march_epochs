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

import elderAge1 from './assets/people_age1/elder.png'
import merchantAge1 from './assets/people_age1/merchant.png'
import veteranAge1 from './assets/people_age1/veteran.png'
import hunterAge1 from './assets/people_age1/hunter.png'
import narmerAge1 from './assets/people_age1/narmer.png'
import sargonAge1 from './assets/people_age1/sargon.png'
import elderAge1Card from './assets/people_age1/elder-card.png'
import merchantAge1Card from './assets/people_age1/merchant-card.png'
import veteranAge1Card from './assets/people_age1/veteran-card.png'
import hunterAge1Card from './assets/people_age1/hunter-card.png'
import narmerAge1Card from './assets/people_age1/narmer-card.png'
import sargonAge1Card from './assets/people_age1/sargon-card.png'
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

import tcFire from './assets/tech_cards_age1/fire.png'
import tcArchery from './assets/tech_cards_age1/archery.png'
import tcWheel from './assets/tech_cards_age1/wheel.png'
import tcAgriculture from './assets/tech_cards_age1/agriculture.png'
import tcDomestication from './assets/tech_cards_age1/domestication.png'
import tcWriting from './assets/tech_cards_age1/writing.png'
import tcCopper from './assets/tech_cards_age1/copper.png'
import tcBronze from './assets/tech_cards_age1/bronze.png'
import tcIrrigation from './assets/tech_cards_age1/irrigation.svg'
import tcOrganization from './assets/tech_cards_age1/organization.svg'
import tcRoads from './assets/tech_cards_age1/roads.svg'
import tcFortification from './assets/tech_cards_age1/fortification.svg'
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
import stoneAxeGripArt from './assets/items/stoneAxeGrip.svg'
import boneCharmArt from './assets/items/boneCharm.svg'
import warStandardArt from './assets/items/warStandard.svg'
import ptolemaicCoinArt from './assets/items/ptolemaicCoin.svg'
import bicorneArt from './assets/items/bicorne.svg'

import age1LeatherCard from './assets/artifact_cards_age1/leatherLamellar.png'
import age1AxeCard from './assets/artifact_cards_age1/stoneAxeGrip.png'
import age1BoneCard from './assets/artifact_cards_age1/boneCharm.png'
import age1BronzeArmorCard from './assets/artifact_cards_age1/bronzeArmor.png'
import age1BronzeEdgesCard from './assets/artifact_cards_age1/bronzeEdges.png'
import age1SpearheadsCard from './assets/artifact_cards_age1/spearheads.png'
import age1ProjectilesCard from './assets/artifact_cards_age1/edgedProjectiles.png'
import age1SlingCard from './assets/artifact_cards_age1/slingPouch.png'

export const ASSETS = {
  logo,
  people: {
    elder:{mini:elderAge1,front:elderAge1Card,dynamic:true}, merchant:{mini:merchantAge1,front:merchantAge1Card,dynamic:true}, veteran:{mini:veteranAge1,front:veteranAge1Card,dynamic:true}, hunter:{mini:hunterAge1,front:hunterAge1Card,dynamic:true},
    narmer:{mini:narmerAge1,front:narmerAge1Card,dynamic:true}, sargon:{mini:sargonAge1,front:sargonAge1Card,dynamic:true}, thutmose:{mini:thutmoseMini}, ramesses:{mini:ramessesMini}, cyrus:{mini:cyrusMini},
    cleopatra: { front: cleopatraFront, back: cleopatraBack, mini: cleopatraMini },
    hannibal: { front: hannibalFront, back: hannibalBack, mini: hannibalMini },
    napoleon: { front: napoleonFront, back: napoleonBack, mini: napoleonMini },
  },
  units: {
    warrior: warriorMini,
    spear: spearMini,
    slinger: slingerMini,
    archer: archerMini,
    hunterBand: archerMini,
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
    leatherLamellar:leatherLamellarArt, stoneAxeGrip:stoneAxeGripArt, boneCharm:boneCharmArt, warStandard:warStandardArt, ptolemaicCoin:ptolemaicCoinArt, bicorne:bicorneArt,
  },
  techCards:{fire:tcFire,archery:tcArchery,wheel:tcWheel,agriculture:tcAgriculture,domestication:tcDomestication,writing:tcWriting,copper:tcCopper,bronze:tcBronze,irrigation:tcIrrigation,organization:tcOrganization,roads:tcRoads,fortification:tcFortification},
  artifactCards:{leatherLamellar:age1LeatherCard,stoneAxeGrip:age1AxeCard,boneCharm:age1BoneCard,bronzeArmor:age1BronzeArmorCard,bronzeEdges:age1BronzeEdgesCard,spearheads:age1SpearheadsCard,edgedProjectiles:age1ProjectilesCard,slingPouch:age1SlingCard},
  commandCards:{rally:cmdRallyAge1,focus:cmdFocusAge1,reinforce:cmdReinforceAge1,special:cmdSpecialAge1},
  statIcons:{health:statHealthAge1,damage:statDamageAge1,armor:statArmorAge1,speed:statSpeedAge1,range:statRangeAge1}
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
import uiChestBronze from './assets/ui-kit/chest-bronze.svg'
import uiChestBlue from './assets/ui-kit/chest-blue.svg'
import uiChestPurple from './assets/ui-kit/chest-purple.svg'
import uiChestGold from './assets/ui-kit/chest-gold.svg'

import cmdRallyAge1 from './assets/command_cards_age1/rally.png'
import cmdFocusAge1 from './assets/command_cards_age1/focus.png'
import cmdReinforceAge1 from './assets/command_cards_age1/reinforce.png'
import cmdSpecialAge1 from './assets/command_cards_age1/special.png'
import statHealthAge1 from './assets/ui_age1/stat-health.svg'
import statDamageAge1 from './assets/ui_age1/stat-damage.svg'
import statArmorAge1 from './assets/ui_age1/stat-armor.svg'
import statSpeedAge1 from './assets/ui_age1/stat-speed.svg'
import statRangeAge1 from './assets/ui_age1/stat-range.svg'

ASSETS.ui = {
  coin:uiCoin, xp:uiXp, tp:uiTp, trophy:uiTrophy,
  campaign:uiCampaign, artifacts:uiArtifacts, people:uiPeople, armies:uiArmies, technology:uiTechnology, store:uiStore,
  campaignActive:uiCampaignActive, artifactsActive:uiArtifactsActive, peopleActive:uiPeopleActive, armiesActive:uiArmiesActive, technologyActive:uiTechnologyActive, storeActive:uiStoreActive,
  lock:uiLock, star:uiStar, arrowLeft:uiArrowLeft, arrowRight:uiArrowRight, close:uiClose,
  itemSlotEpic:uiItemSlotEpic, itemSlotRare:uiItemSlotRare, itemSlotCommon:uiItemSlotCommon, itemSlotLegend:uiItemSlotLegend, upgradeReady:uiUpgradeReady, chestBronze:uiChestBronze, chestBlue:uiChestBlue, chestPurple:uiChestPurple, chestGold:uiChestGold,
}
