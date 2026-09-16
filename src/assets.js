import logo from './assets/logo.png'
import { PEOPLE_ART } from './assets/ages/people'
import warriorMini from './assets/ages/origins/units/warrior.png'
import spearMini from './assets/ages/origins/units/spear.png'
import slingerMini from './assets/ages/origins/units/slinger.png'
import archerMini from './assets/ages/origins/units/archer.png'
import cavalryMini from './assets/ages/bronzeIron/units/cavalry.png'
import warElephantMini from './assets/ages/classical/units/warElephant.png'
import firstWarsArt from './assets/ages/origins/campaigns/dawn/cover.png'
import bronzeEmpiresArt from './assets/ages/bronzeIron/campaigns/firstcities/cover.svg'

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
  people: PEOPLE_ART,
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
