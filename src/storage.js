import { START_META } from './data'

const KEY = 'march-of-epochs-react-v017'

export function loadMeta(){
  try{
    const raw=localStorage.getItem(KEY)
    if(!raw)return structuredClone(START_META)
    const p=JSON.parse(raw)
    return {
      ...structuredClone(START_META),...p,
      loadout:{...START_META.loadout,...(p.loadout||{})},
      characterCopies:{...START_META.characterCopies,...(p.characterCopies||{})},
      characterLevels:{...START_META.characterLevels,...(p.characterLevels||{})},
      campaignStats:{...START_META.campaignStats,...(p.campaignStats||{})},
      featureUnlocks:{...START_META.featureUnlocks,...(p.featureUnlocks||{})},
      unitLevels:{...START_META.unitLevels,...(p.unitLevels||{})},
      inventory:{...START_META.inventory,...(p.inventory||{})},
      artifactLevels:{...START_META.artifactLevels,...(p.artifactLevels||{})},
      unitEquipment:{...START_META.unitEquipment,...(p.unitEquipment||{})},
      heroEquipment:{...START_META.heroEquipment,...(p.heroEquipment||{})},
      stats:{...START_META.stats,...(p.stats||{})},
      claimedAchievements:[...(p.claimedAchievements||[])],
    }
  }catch{return structuredClone(START_META)}
}
export function saveMeta(meta){localStorage.setItem(KEY,JSON.stringify(meta))}
export function resetMeta(){localStorage.removeItem(KEY);return structuredClone(START_META)}
