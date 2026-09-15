import {AGE1_TECH_IDS,AGE1_PEOPLE_IDS,AGE1_ARTIFACT_IDS,AGE1_PEOPLE_GOLD,PEOPLE,UNITS,TECHS,ITEMS,CAMPAIGN_ORDER,COPY_THRESHOLDS,GOLD_UPGRADE_COSTS,RARITIES,ARTIFACT_COPY_THRESHOLDS,ARTIFACT_WORKSHOP_GOLD,UNIT_LEVEL_MAX,unitLevelCost,ACHIEVEMENTS} from '../data.js'

export function peopleEffects(run){
  const out={}
  for(const [id,level] of [[run.leader,run.leaderLevel],[run.general,run.generalLevel]])for(const effect of PEOPLE[id]?.effects?.slice(0,level)||[])for(const [key,value] of Object.entries(effect))out[key]=key.endsWith('Mult')?(out[key]||1)*value:(out[key]||0)+value
  return out
}
export function metaPeople(meta){return{leader:meta.featureUnlocks.people?meta.loadout.leader:null,general:meta.featureUnlocks.people?meta.loadout.general:null,leaderLevel:meta.characterLevels[meta.loadout.leader]||0,generalLevel:meta.characterLevels[meta.loadout.general]||0}}
export function supplyPrice(meta,base){return Math.max(1,Math.round(base*(1-(peopleEffects(metaPeople(meta)).shopDiscount||0))))}
export function buySupply(meta,id){const item=ITEMS[id];if(!item||!artifactSupply(meta).includes(id))return false;const cost=supplyPrice(meta,item.price);if(meta.gold<cost)return false;meta.gold-=cost;meta.inventory[id]=(meta.inventory[id]||0)+1;meta.artifactLevels[id]||=1;return true}
export function trainUnit(meta,id){if(!meta.discoveredUnits.includes(id))return false;const level=meta.unitLevels[id]||1,cost=unitLevelCost(level);if(level>=UNIT_LEVEL_MAX||meta.xp<cost)return false;meta.xp-=cost;meta.unitLevels[id]=level+1;meta.stats.unitLevelsBought++;return true}
export function researchTech(meta,id){if(!canResearch(meta,id)||meta.tp<TECHS[id].cost)return false;meta.tp-=TECHS[id].cost;meta.ownedTech.push(id);meta.stats.techUnlocked++;reconcileUnits(meta);return true}
export function claimAchievement(meta,id){const a=ACHIEVEMENTS[id];if(!a||meta.claimedAchievements.includes(id)||(meta.stats[a.stat]||0)<a.target)return false;meta.gold+=a.reward;meta.claimedAchievements.push(id);if(a.item){meta.inventory[a.item]=(meta.inventory[a.item]||0)+1;meta.artifactLevels[a.item]||=1}return true}
export function peopleUpgradeCost(id,level){return (AGE1_PEOPLE_IDS.includes(id)?AGE1_PEOPLE_GOLD:GOLD_UPGRADE_COSTS)[level]}
export function canResearch(meta,id){const t=TECHS[id];return !!t&&meta.featureUnlocks.technology&&!meta.ownedTech.includes(id)&&t.prereq.every(p=>meta.ownedTech.includes(p))&&(meta.completedCampaigns.includes('dawn')||AGE1_TECH_IDS.includes(id))}
export function unitReady(id,campaign='dawn'){return !!UNITS[id]&&(!UNITS[id].contentPending||(campaign!=='dawn'&&id==='bronzeGuard'))}
export function reconcileUnits(meta){
  const units=new Set(meta.discoveredUnits||[]);units.add('warrior');units.add('slinger')
  for(const [id,p] of Object.entries(PEOPLE))if((meta.characterCopies[id]||0)>0&&p.signatureUnit&&(meta.characterLevels[id]||1)>=(p.signatureLevel||(id==='cleopatra'?5:1)))units.add(p.signatureUnit)
  for(const [id,u] of Object.entries(UNITS))if(u.requires?.length&&u.requires.every(t=>meta.ownedTech.includes(t))&&(u.ageId==='origins'||meta.completedCampaigns.includes('dawn')))units.add(id)
  if((meta.campaignStats.dawn?.cleared||0)>=3)units.add('hunterBand')
  meta.discoveredUnits=[...units];meta.unitLevels||={};for(const id of units)meta.unitLevels[id]||=1
  return meta
}
export function unitAvailable(meta,id,campaign='dawn'){
  const u=UNITS[id];if(!u||!unitReady(id,campaign)||!meta.discoveredUnits.includes(id))return false
  if(campaign==='dawn'&&u.ageId!=='origins')return false
  for(const role of ['leader','general']){const p=PEOPLE[meta.loadout[role]];if(meta.featureUnlocks.people&&p?.signatureUnit===id&&(meta.characterLevels[p.id]||1)>=(p.signatureLevel||(p.id==='cleopatra'?5:1)))return true}
  if(!u.requires?.length)return true
  const tech=meta.featureUnlocks.technology?meta.loadout.tech.filter(t=>t&&(campaign!=='dawn'||AGE1_TECH_IDS.includes(t))):[]
  return u.requires.every(t=>tech.includes(t))
}
export function startingCapacity(meta,campaign='dawn'){
  let count=2;const p=metaPeople(meta),effects=peopleEffects(p)
  count+=effects.startSlots||0
  if(meta.featureUnlocks.people&&['hannibal','napoleon','thutmose'].includes(p.general)&&p.generalLevel>=3)count++
  if(p.leader==='cleopatra'&&p.leaderLevel>=6)count++
  if(meta.featureUnlocks.technology)for(const id of meta.loadout.tech.filter(Boolean))if(campaign!=='dawn'||AGE1_TECH_IDS.includes(id))count+=TECHS[id]?.startSlots||0
  return Math.min(6,count)
}
export function itemEligibleForUnit(item,id){
  const u=UNITS[id];if(!u||!item||item.slot!=='unit'||(item.maxAge&&u.ageIndex>item.maxAge))return false
  return item.eligible==='ALL'||(item.eligible==='RANGED'&&(u.role.includes('RANGED')||u.role.includes('FIREARM')))||(item.eligible==='MELEE'&&u.range===0&&!u.role.includes('AIR'))||(item.eligible==='SPEAR'&&u.role.includes('SPEAR'))||(item.eligible==='MOUNTED'&&u.role.includes('MOUNTED'))||(item.eligible==='FIREARM'&&u.role.includes('FIREARM'))||(item.eligible==='SLINGER'&&id==='slinger')
}
export function equippedCount(meta,id){return Object.values(meta.unitEquipment||{}).flat().filter(x=>x===id).length+Object.values(meta.heroEquipment||{}).filter(x=>x===id).length}
export function availableCopies(meta,id){return Math.max(0,(meta.inventory[id]||0)-equippedCount(meta,id))}
export function equipArtifact(meta,id,target){
  const item=ITEMS[id];if(!item||availableCopies(meta,id)<1)return false
  if(item.slot==='unit'){
    if(!meta.discoveredUnits.includes(target)||!itemEligibleForUnit(item,target))return false
    const list=[...(meta.unitEquipment[target]||[])];if(list.includes(id))return false
    if(list.length>=2)list.shift();list.push(id);meta.unitEquipment[target]=list
  }else{
    if(!meta.featureUnlocks.relics||!(meta.characterCopies[target]>0)||(item.eligible!=='ALL'&&PEOPLE[target]?.type!==item.eligible))return false
    meta.heroEquipment[target]=id
  }
  meta.stats.itemsEquipped=(meta.stats.itemsEquipped||0)+1;return true
}
export function artifactSupply(meta){return AGE1_ARTIFACT_IDS.filter(id=>meta.discoveredUnits.some(unit=>unitReady(unit)&&itemEligibleForUnit(ITEMS[id],unit)))}
export function packSpec(meta,kind,type='people'){
  if(type==='artifact')return{kind,packType:type,name:kind==='advanced'?'Advanced Artifact Pack':'Supply Artifact Pack',count:kind==='advanced'?2:1,cost:supplyPrice(meta,kind==='advanced'?65:35),pool:artifactSupply(meta)}
  const pool=[...AGE1_PEOPLE_IDS];if(meta.completedCampaigns.includes('dawn'))pool.push('thutmose','ramesses','cyrus');if(meta.completedCampaigns.includes('firstcities'))pool.push('cleopatra','hannibal')
  return{kind,packType:type,name:kind==='great'?'Great Chronicle Pack':'Historical Pack',count:kind==='great'?3:2,cost:supplyPrice(meta,kind==='great'?140:65),pool}
}
export function drawPack(spec,random=Math.random){
  const draw=()=>{const weights=spec.pool.map(id=>spec.packType==='people'?RARITIES[PEOPLE[id].rarity].weight:1),total=weights.reduce((a,b)=>a+b,0);let r=random()*total;for(let i=0;i<spec.pool.length;i++){r-=weights[i];if(r<=0)return spec.pool[i]}return spec.pool.at(-1)}
  const ids=Array.from({length:spec.count},draw)
  if(spec.packType==='people'&&spec.kind==='great'&&!ids.some(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity))){const rare=spec.pool.filter(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity));if(rare.length)ids[0]=rare[Math.floor(random()*rare.length)]}
  return{ids,bonus:spec.packType==='people'?8+Math.floor(random()*9):0}
}
export function addPackRewards(meta,{ids,bonus},type){
  const seen=new Set(Object.keys(type==='people'?meta.characterCopies:meta.inventory).filter(id=>(type==='people'?meta.characterCopies:meta.inventory)[id]>0))
  const results=ids.map(id=>{const isNew=!seen.has(id);seen.add(id);if(type==='people'){meta.characterCopies[id]=(meta.characterCopies[id]||0)+1;meta.characterLevels[id]||=1}else{meta.inventory[id]=(meta.inventory[id]||0)+1;meta.artifactLevels[id]||=1}return{id,isNew}})
  meta.gold+=bonus;meta.stats.peopleDiscovered=Object.values(PEOPLE).filter(p=>meta.characterCopies[p.id]>0).length;reconcileUnits(meta);return results
}
export function purchasePack(meta,spec,rewards){
  if(meta.gold<spec.cost||!spec.pool.length||(spec.packType==='people'&&!meta.featureUnlocks.people))return null
  if(rewards.ids.length!==spec.count||rewards.ids.some(id=>!spec.pool.includes(id)))return null
  meta.gold-=spec.cost;meta.stats.packsOpened++
  return addPackRewards(meta,rewards,spec.packType)
}
export function evolveArtifact(meta,id){const item=ITEMS[id],level=meta.artifactLevels[id]||1;if(!item||level>=item.maxLevel)return false;const copies=ARTIFACT_COPY_THRESHOLDS[level],cost=ARTIFACT_WORKSHOP_GOLD[level];if((meta.inventory[id]||0)<copies||meta.gold<cost)return false;meta.gold-=cost;meta.artifactLevels[id]=level+1;meta.stats.artifactsEvolved++;return true}
export function upgradePerson(meta,id){const p=PEOPLE[id],level=meta.characterLevels[id]||1,cost=peopleUpgradeCost(id,level);if(!p||level>=RARITIES[p.rarity].maxLevel||(meta.characterCopies[id]||0)<COPY_THRESHOLDS[level]||meta.gold<cost)return false;meta.gold-=cost;meta.characterLevels[id]=level+1;meta.stats.peopleUpgraded++;reconcileUnits(meta);return true}
export function settleRun(meta,info){
  const messages=[],cleared=info.cleared??(info.victory?15:Math.max(0,(info.bestReached||1)-1)),old=meta.campaignStats[info.campaign]||{best:0,stars:0}
  meta.gold+=info.gold||0;meta.xp+=info.xp||0;if(info.campaign==='dawn'||meta.featureUnlocks.technology)meta.tp+=info.tp||0
  if(info.campaign==='dawn')meta.gold+=Math.max(0,(info.stars||0)-(old.stars||0))*15
  meta.campaignStats[info.campaign]={...old,best:Math.max(old.best,info.bestReached||0),cleared:Math.max(old.cleared||0,cleared),stars:Math.max(old.stars,info.stars||0),objectives:Math.max(old.objectives||0,info.objectives||0)}
  meta.stats.battlesWon+=cleared;meta.stats.flawlessBattles+=info.flawlessBattles||0;meta.stats.unitsKilled+=info.unitsKilled||0
  if(info.campaign==='dawn'&&cleared>=2&&!meta.featureUnlocks.technology){meta.featureUnlocks.technology=true;meta.ownedTech=[...new Set([...meta.ownedTech,'fire'])];if(!meta.loadout.tech.some(Boolean))meta.loadout.tech=['fire'];meta.tp+=2;messages.push('Research unlocked. Choose your first Age I technology.')}
  if(info.campaign==='dawn'&&cleared>=5&&!meta.featureUnlocks.people){meta.featureUnlocks.people=true;for(const id of ['elder','veteran']){meta.characterCopies[id]=(meta.characterCopies[id]||0)+1;meta.characterLevels[id]||=1}meta.loadout.leader||='elder';meta.loadout.general||='veteran';meta.stats.peopleFeatureUnlocked=1;messages.push('People unlocked: Tribal Elder and Veteran Commander.')}
  if(info.victory){const first=!meta.completedCampaigns.includes(info.campaign);if(first){meta.completedCampaigns.push(info.campaign);meta.stats.campaignsCompleted++;if(info.campaign==='dawn'){meta.gold+=60;meta.xp+=30;messages.push('First Wars conquered: +60 Gold and +30 EXP.')}}const next=CAMPAIGN_ORDER[CAMPAIGN_ORDER.indexOf(info.campaign)+1];if(next&&!meta.unlockedCampaigns.includes(next))meta.unlockedCampaigns.push(next)}
  if(info.campaign==='firstcities'&&cleared>=5&&!meta.featureUnlocks.relics){meta.featureUnlocks.relics=true;messages.push('Hero Relics unlocked.')}
  meta.stats.peopleDiscovered=Object.keys(meta.characterCopies).filter(id=>meta.characterCopies[id]>0&&PEOPLE[id]).length
  reconcileUnits(meta);return messages
}

// Legacy saves retain their currencies, equipment and completed content.
// Previously 'best' counted the reached battle, including a defeat there.
export function migrateProgression(meta){
  for(const [id,record] of Object.entries(meta.campaignStats))record.cleared??=meta.completedCampaigns.includes(id)?15:Math.max(0,(record.best||0)-1)
  if(meta.campaignStats.dawn.cleared>=2&&!meta.featureUnlocks.technology){meta.featureUnlocks.technology=true;meta.ownedTech=[...new Set([...meta.ownedTech,'fire'])];meta.tp+=2;if(!meta.loadout.tech.some(Boolean))meta.loadout.tech=['fire']}
  if(meta.campaignStats.dawn.cleared>=5&&!meta.featureUnlocks.people){meta.featureUnlocks.people=true;for(const id of ['elder','veteran']){meta.characterCopies[id]||=1;meta.characterLevels[id]||=1}meta.loadout.leader||='elder';meta.loadout.general||='veteran';meta.stats.peopleFeatureUnlocked=1;meta.stats.peopleDiscovered=Object.keys(meta.characterCopies).filter(id=>meta.characterCopies[id]>0&&PEOPLE[id]).length}
  return reconcileUnits(meta)
}
