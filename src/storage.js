import { START_META } from './data'

const KEY = 'march-of-epochs-react-v07'

export function loadMeta(){
  try{
    const raw = localStorage.getItem(KEY)
    if(!raw) return structuredClone(START_META)
    const parsed = JSON.parse(raw)
    return {
      ...structuredClone(START_META),
      ...parsed,
      loadout: { ...START_META.loadout, ...(parsed.loadout||{}) },
      characterCopies: { ...START_META.characterCopies, ...(parsed.characterCopies||{}) },
      characterLevels: { ...START_META.characterLevels, ...(parsed.characterLevels||{}) },
      campaignStats: { ...START_META.campaignStats, ...(parsed.campaignStats||{}) },
    }
  }catch{
    return structuredClone(START_META)
  }
}

export function saveMeta(meta){
  localStorage.setItem(KEY, JSON.stringify(meta))
}

export function resetMeta(){
  localStorage.removeItem(KEY)
  return structuredClone(START_META)
}
