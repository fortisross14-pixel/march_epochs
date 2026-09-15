import {pathToFileURL} from 'node:url'
import {START_META,AGE1_TECH_IDS} from '../src/data.js'
import {reconcileUnits} from '../src/game/progression.js'
import {simulateRun,rng} from './balance.mjs'

// Entry-level Sargon and Merchant, level-one artifacts, trained combat units.
// Test both two-squad starts and Agriculture's additional starting squad.
export function equippedMeta(level,agriculture=true){
  const meta=structuredClone(START_META)
  meta.featureUnlocks.people=true;meta.featureUnlocks.technology=true
  meta.loadout={general:'sargon',leader:'merchant',tech:agriculture?['agriculture','archery','copper']:['archery','copper','fire']}
  meta.characterCopies={sargon:1,merchant:1};meta.characterLevels={sargon:1,merchant:1}
  meta.ownedTech=[...AGE1_TECH_IDS];reconcileUnits(meta)
  for(const id of meta.discoveredUnits)meta.unitLevels[id]=level
  meta.unitEquipment={warrior:['leatherLamellar','stoneAxeGrip'],spear:['leatherLamellar','spearheads'],archer:['leatherLamellar','edgedProjectiles'],slinger:['leatherLamellar','slingPouch'],hunterBand:['leatherLamellar','edgedProjectiles']}
  for(const id of Object.values(meta.unitEquipment).flat()){meta.inventory[id]=(meta.inventory[id]||0)+1;meta.artifactLevels[id]=1}
  return meta
}
export function tacticsBalance(seeds=8){
  const results=[]
  for(const level of [4,5])for(const agriculture of [true,false])for(const policy of ['average','skilled']){
    const runs=[]
    for(let seed=1;seed<=seeds;seed++){
      const result=simulateRun(equippedMeta(level,agriculture),policy,rng(seed))
      runs.push({seed,cleared:result.cleared,flawless:result.flawlessBattles,lossesThrough13:result.battles.filter(b=>b.battle<=13).reduce((n,b)=>n+b.losses,0)})
    }
    results.push({level,startingSquads:agriculture?3:2,policy,runs})
  }
  return results
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(tacticsBalance(Number(process.argv[2]||8)),null,2))
