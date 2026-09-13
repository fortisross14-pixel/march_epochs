import { useEffect, useMemo, useState } from 'react'
import { ASSETS } from './assets'
import {
  ACHIEVEMENTS, ARTIFACT_COPY_THRESHOLDS, ARTIFACT_WORKSHOP_GOLD,
  AGES, ARTIFACT_CATALOG, CAMPAIGNS, CAMPAIGN_ORDER, COPY_THRESHOLDS, GOLD_UPGRADE_COSTS, HERO_CATALOG, ITEMS, PEOPLE, RARITIES,
  TECHNOLOGY_CATALOG, TECHS, UNITS, UNIT_LEVEL_MAX, itemEffectAtLevel, unitLevelCost,
  unitNextLevelBonus, unitStatsAtLevel
} from './data'
import { loadMeta, resetMeta, saveMeta } from './storage'
import Modal from './components/Modal'
import CardFlip from './components/CardFlip'
import Battle from './components/Battle'

const clone=o=>structuredClone(o)
const unique=a=>[...new Set(a)]
const campaignOrder=CAMPAIGN_ORDER
const rarityOrder={Common:1,Uncommon:2,Rare:3,Epic:4,Legend:5}
const unitIcon=u=>u.role.includes('MOUNTED')?'🐎':u.role.includes('RANGED')||u.role.includes('FIREARM')?'🏹':u.role.includes('SPEAR')?'⚑':'⚔'
const stars=n=>Array.from({length:3},(_,i)=>i<n)

function MiniCardArt({ id, meta }){
  const p=PEOPLE[id]
  if(!p)return <div className="mini-card-art locked-art"><span>?</span></div>
  const art=ASSETS.people[id],level=meta.characterLevels[id]||1,copies=meta.characterCopies[id]||0,max=RARITIES[p.rarity].maxLevel,next=level<max?COPY_THRESHOLDS[level]:copies
  return <div className={`mini-card-art ${art?'premium':'emblem'}`}>
    {art?<img src={art.mini||art.front} alt={p.name}/>:<div className="slot-emblem">{p.icon}</div>}
    <div className="mini-top-mask"/><div className="mini-badge left">{'★'.repeat(level)}{'☆'.repeat(Math.max(0,max-level))}</div><div className="mini-badge right">{copies}/{next}</div>
  </div>
}

function PersonThumb({id,meta,onClick}){
  const p=PEOPLE[id]
  return <button className="person-thumb" onClick={onClick} style={{'--rarity':RARITIES[p.rarity].color}}><MiniCardArt id={id} meta={meta}/><div><b>{p.name}</b><span>{p.rarity} · Lv {meta.characterLevels[id]||1}</span><small>{meta.characterCopies[id]||0} cards</small></div></button>
}

function TechNode({id,meta,onBuy}){
  const t=TECHS[id],owned=meta.ownedTech.includes(id),available=t.prereq.every(p=>meta.ownedTech.includes(p)),canBuy=!owned&&available&&meta.tp>=t.cost
  return <button className={`tech-node ${owned?'owned':''} ${available?'available':'locked'}`} disabled={!owned&&!available} onClick={()=>canBuy&&onBuy(id)}>
    <div className="tech-icon art">{ASSETS.tech?.[id]?<img src={ASSETS.tech[id]} alt={t.name}/>:t.icon}</div><div><b>{t.name}</b><span>Tier {t.tier}{owned?' · OWNED':!available?' · LOCKED':` · ✦ ${t.cost}`}</span><small>{t.desc}</small></div>
  </button>
}

function UnitStat({label,value}){return <div className="unit-stat"><span>{label}</span><b>{value}</b></div>}
function UnitCard({id,meta,compact=false}){
  const level=meta?.unitLevels?.[id]||1,u=unitStatsAtLevel(id,level),art=ASSETS.units?.[id]
  return <div className={`unit-card ${compact?'compact':''}`}>
    <div className={`unit-icon ${art?'has-art':''}`}>{art?<img src={art} alt={u.name}/>:unitIcon(u)}</div>
    <div className="unit-card-main"><div className="unit-title-line"><h4>{u.name}</h4><b>Lv {level}</b></div><span className="unit-role">{u.role}</span><div className="unit-stats"><UnitStat label="HP" value={u.health}/><UnitStat label="Armor" value={u.armor}/><UnitStat label="Dmg" value={u.damage}/><UnitStat label="Atk" value={u.attackSpeed}/><UnitStat label="Rng" value={u.range}/></div>{!compact&&<p>{u.desc}</p>}</div>
  </div>
}

function weightedPick(pool){
  const weights=pool.map(id=>RARITIES[PEOPLE[id].rarity].weight),sum=weights.reduce((a,b)=>a+b,0);let r=Math.random()*sum
  for(let i=0;i<pool.length;i++){r-=weights[i];if(r<=0)return pool[i]}return pool[pool.length-1]
}

function effectSummary(item,level){
  const e=itemEffectAtLevel(item.id,level)
  const parts=[]
  if(e.healthMult)parts.push(`+${Math.round((e.healthMult-1)*100)}% HP`)
  if(e.damageMult)parts.push(`+${Math.round((e.damageMult-1)*100)}% Damage`)
  if(e.attackSpeedMult)parts.push(`+${Math.round((e.attackSpeedMult-1)*100)}% Attack Speed`)
  if(e.goldMult)parts.push(`+${Math.round((e.goldMult-1)*100)}% Gold`)
  if(e.reinforceMult)parts.push(`+${Math.round((e.reinforceMult-1)*100)}% Reinforce Speed`)
  if(e.armor)parts.push(`+${e.armor.toFixed(1)} Armor`)
  return parts.join(' · ')
}

function itemFrame(rarity){
  if(rarity==='Epic')return ASSETS.ui.itemSlotEpic
  if(rarity==='Rare' || rarity==='Uncommon')return ASSETS.ui.itemSlotRare
  if(rarity==='Legend')return ASSETS.ui.itemSlotLegend
  return ASSETS.ui.itemSlotCommon
}
function itemFamilyIcon(item){
  if(item.slot==='hero')return '♛'
  if(item.eligible==='RANGED' || item.eligible==='SLINGER' || item.eligible==='FIREARM')return '➶'
  if(item.eligible==='MELEE' || item.eligible==='SPEAR')return '⚔'
  if(item.eligible==='MOUNTED')return '🐎'
  return '✦'
}

export default function App(){
  const [meta,setMeta]=useState(loadMeta)
  const [screen,setScreen]=useState('campaign')
  const [selectedCampaign,setSelectedCampaign]=useState('dawn')
  const [picker,setPicker]=useState(null)
  const [detailPerson,setDetailPerson]=useState(null)
  const [musterOpen,setMusterOpen]=useState(false)
  const [muster,setMuster]=useState([])
  const [battle,setBattle]=useState(null)
  const [pack,setPack]=useState(null)
  const [toast,setToast]=useState('')
  const [artifactTab,setArtifactTab]=useState('army')
  const [equipPicker,setEquipPicker]=useState(null)
  const [achievementsOpen,setAchievementsOpen]=useState(false)
  const [artifactStoreCategory,setArtifactStoreCategory]=useState('artifacts')
  const [detailUnit,setDetailUnit]=useState(null)
  const [unitEquipPicker,setUnitEquipPicker]=useState(null)
  const [detailArtifact,setDetailArtifact]=useState(null)
  const [campaignPrepOpen,setCampaignPrepOpen]=useState(false)
  const [campaignPrepStep,setCampaignPrepStep]=useState(1)

  useEffect(()=>saveMeta(meta),[meta])
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(t)},[toast])

  const features=meta.featureUnlocks||{}
  const ownedPeople=useMemo(()=>Object.keys(meta.characterCopies||{}).filter(id=>(meta.characterCopies[id]||0)>0&&PEOPLE[id]),[meta.characterCopies])
  const ownedLeaders=ownedPeople.filter(id=>PEOPLE[id].type==='leader').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const ownedGenerals=ownedPeople.filter(id=>PEOPLE[id].type==='general').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const campaign=CAMPAIGNS[selectedCampaign]
  const currentCampaignIndex=campaignOrder.indexOf(selectedCampaign)
  const currentCampaignStats=meta.campaignStats?.[selectedCampaign]||{best:0,stars:0}
  const leader=PEOPLE[meta.loadout.leader],general=PEOPLE[meta.loadout.general]
  const claimableAchievements=Object.values(ACHIEVEMENTS).filter(a=>(meta.stats?.[a.stat]||0)>=a.target&&!meta.claimedAchievements?.includes(a.id)).length
  const equippedUnitItems=(meta.unitEquipment?Object.values(meta.unitEquipment).flat():[]).filter(Boolean)
  const equippedHeroItems=(meta.heroEquipment?Object.values(meta.heroEquipment):[]).filter(Boolean)
  const equippedItemCount=id=>equippedUnitItems.filter(x=>x===id).length+equippedHeroItems.filter(x=>x===id).length
  const availableItemCopies=id=>Math.max(0,(meta.inventory?.[id]||0)-equippedItemCount(id))

  const effectiveTechSlots=features.technology?Math.min(6,meta.techSlots+(meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=4?1:0)+(meta.loadout.leader==='cyrus'&&(meta.characterLevels.cyrus||1)>=3?1:0)):0
  const startingCapacity=useMemo(()=>{
    let n=2
    if(features.people&&meta.loadout.general){const gl=meta.characterLevels[meta.loadout.general]||1;if(['hannibal','napoleon','sargon','thutmose'].includes(meta.loadout.general)&&gl>=3)n++}
    if(features.people&&meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=6)n++
    if(features.technology)for(const id of meta.loadout.tech.filter(Boolean))n+=TECHS[id]?.startSlots||0
    return Math.min(6,n)
  },[meta,features.people,features.technology])

  function patchMeta(fn){setMeta(m=>typeof fn==='function'?fn(clone(m)):{...m,...fn})}
  function notify(s){setToast(s)}
  function achievementReady(a){return (meta.stats?.[a.stat]||0)>=a.target&&!meta.claimedAchievements?.includes(a.id)}

  function reconcileUnits(m){
    const set=new Set(m.discoveredUnits||['warrior','slinger']);set.add('warrior');set.add('slinger')
    for(const [id,p] of Object.entries(PEOPLE))if((m.characterCopies?.[id]||0)>0&&p.signatureUnit)set.add(p.signatureUnit)
    for(const [id,u] of Object.entries(UNITS))if(u.requires?.length&&u.requires.every(t=>m.ownedTech.includes(t)))set.add(id)
    m.discoveredUnits=[...set]
    m.unitLevels=m.unitLevels||{}
    for(const id of m.discoveredUnits)if(!m.unitLevels[id])m.unitLevels[id]=1
  }

  function claimAchievement(id){
    const a=ACHIEVEMENTS[id];if(!a||!achievementReady(a))return
    patchMeta(m=>{m.gold+=a.reward;m.claimedAchievements=[...(m.claimedAchievements||[]),id];if(a.item){m.inventory[a.item]=(m.inventory[a.item]||0)+1;if(!m.artifactLevels[a.item])m.artifactLevels[a.item]=1}return m})
    notify(`${a.name}: +${a.reward} Gold${a.item?` + ${ITEMS[a.item].name}`:''}`)
  }

  function selectCampaign(id){const c=CAMPAIGNS[id];if(c.requires&&!meta.completedCampaigns.includes(c.requires))return;setSelectedCampaign(id)}
  function moveCampaign(dir){const idx=currentCampaignIndex+dir;if(idx<0||idx>=campaignOrder.length)return;selectCampaign(campaignOrder[idx])}

  function chooseScreen(id){
    if(id==='people'&&!features.people){notify('People unlock after you win battle 1-5 and reach 1-6.');return}
    if(id==='technology'&&!features.technology){notify('Technology unlocks after completing Campaign I.');return}
    setScreen(id)
  }

  function openPicker(type,index=null){setPicker({type,index})}
  function choosePicker(id){
    patchMeta(m=>{
      if(picker.type==='leader')m.loadout.leader=id
      if(picker.type==='general')m.loadout.general=id
      if(picker.type==='tech'){
        const arr=[...m.loadout.tech]
        if(id)for(let i=0;i<arr.length;i++)if(i!==picker.index&&arr[i]===id)arr[i]=null
        arr[picker.index]=id;m.loadout.tech=arr
      }
      return m
    });setPicker(null)
  }

  function unitAvailableInBuild(id){
    if(!meta.discoveredUnits.includes(id))return false
    if(id==='warrior')return true
    const u=UNITS[id]
    const selectedTech=features.technology?meta.loadout.tech.filter(Boolean):[]
    const generalData=features.people?PEOPLE[meta.loadout.general]:null,leaderData=features.people?PEOPLE[meta.loadout.leader]:null
    if(generalData?.signatureUnit===id&&(meta.characterLevels[meta.loadout.general]||1)>=(generalData.signatureLevel||1))return true
    if(leaderData?.signatureUnit===id&&(meta.characterLevels[meta.loadout.leader]||1)>=(leaderData.signatureLevel||5))return true
    if(u.requires?.length)return features.technology&&u.requires.every(t=>selectedTech.includes(t))
    return true
  }
  function availableMusterUnits(){return meta.discoveredUnits.filter(id=>UNITS[id]&&unitAvailableInBuild(id))}
  function openMuster(){
    setMuster(a=>a.length===startingCapacity?a:Array.from({length:startingCapacity},(_,i)=>a[i]||null))
    setCampaignPrepStep(1)
    setCampaignPrepOpen(true)
    setMusterOpen(false)
  }
  function nextCampaignPrepStep(){
    setMuster(a=>a.length===startingCapacity?a:Array.from({length:startingCapacity},(_,i)=>a[i]||null))
    setCampaignPrepStep(2)
    setMusterOpen(true)
  }
  function closeCampaignPrep(){setCampaignPrepOpen(false);setCampaignPrepStep(1);setMusterOpen(false)}
  function pickUnit(slot,id){setMuster(a=>a.map((x,i)=>i===slot?id:x))}
  function launchBattle(){
    if(muster.some(x=>!x)){notify('Select an army for every starting slot.');return}
    patchMeta(m=>{m.stats.runsStarted=(m.stats.runsStarted||0)+1;return m})
    closeCampaignPrep()
    setBattle({campaignId:selectedCampaign,loadout:clone(meta.loadout),startingRoster:[...muster],startCapacity:startingCapacity,eligibleUnits:availableMusterUnits()})
    setScreen('battle')
  }

  function finishRun(info){
    let unlockMessage=''
    patchMeta(m=>{
      m.gold+=info.gold||0;m.xp+=(info.xp||0);if(m.featureUnlocks.technology)m.tp+=info.tp||0
      const prev=m.campaignStats?.[info.campaign]||{best:0,stars:0}
      m.campaignStats={...(m.campaignStats||{}),[info.campaign]:{best:Math.max(prev.best,info.bestReached||0),stars:Math.max(prev.stars,info.stars||0)}}
      const wins=info.victory?15:Math.max(0,(info.bestReached||1)-1)
      m.stats.battlesWon=(m.stats.battlesWon||0)+wins
      m.stats.flawlessBattles=(m.stats.flawlessBattles||0)+(info.flawlessBattles||0)
      m.stats.unitsKilled=(m.stats.unitsKilled||0)+(info.unitsKilled||0)

      if(info.campaign==='dawn'&&(info.victory||(info.bestReached||0)>=6)&&!m.featureUnlocks.people){
        m.featureUnlocks.people=true;m.characterCopies.elder=1;m.characterCopies.veteran=1;m.characterLevels.elder=1;m.characterLevels.veteran=1;m.loadout.leader='elder';m.loadout.general='veteran';m.stats.peopleDiscovered=2;m.stats.peopleFeatureUnlocked=1;unlockMessage='People unlocked: Tribal Elder + Veteran Commander.'
      }
      if(info.victory){
        if(!m.completedCampaigns.includes(info.campaign))m.completedCampaigns.push(info.campaign)
        m.stats.campaignsCompleted=(m.stats.campaignsCompleted||0)+1
        const idx=CAMPAIGN_ORDER.indexOf(info.campaign),nextId=CAMPAIGN_ORDER[idx+1]
        if(nextId&&!m.unlockedCampaigns.includes(nextId))m.unlockedCampaigns.push(nextId)
        if(info.campaign==='dawn'&&!m.featureUnlocks.technology){m.featureUnlocks.technology=true;m.ownedTech=['fire','archery','wheel'];m.loadout.tech=['fire','archery','wheel'];m.techSlots=3;unlockMessage=(unlockMessage?unlockMessage+' ':'')+'Technology unlocked for Campaign II.'}
      }
      if(info.campaign==='firstcities'&&(info.victory||(info.bestReached||0)>=6)&&!m.featureUnlocks.relics){m.featureUnlocks.relics=true;unlockMessage=(unlockMessage?unlockMessage+' ':'')+'Hero Relics unlocked.'}
      reconcileUnits(m)
      return m
    })
    setBattle(null);setScreen('campaign')
    notify(unlockMessage|| (info.victory?`Campaign cleared · ${info.stars||1}★.`:`Run banked · reached battle ${info.bestReached||0}.`))
  }

  function buyTech(id){
    if(!features.technology)return
    const t=TECHS[id],available=t.prereq.every(x=>meta.ownedTech.includes(x))
    if(meta.ownedTech.includes(id)||!available||meta.tp<t.cost)return
    patchMeta(m=>{m.tp-=t.cost;m.ownedTech.push(id);m.stats.techUnlocked=(m.stats.techUnlocked||0)+1;reconcileUnits(m);return m});notify(`${t.name} researched.`)
  }
  function buyTechSlot(){
    if(!features.technology||meta.techSlots>=6)return
    const costs={3:180,4:360,5:650},cost=costs[meta.techSlots]||650
    if(meta.gold<cost){notify('Not enough Gold.');return}
    patchMeta(m=>{m.gold-=cost;m.techSlots++;while(m.loadout.tech.length<m.techSlots)m.loadout.tech.push(null);return m});notify('Technology loadout expanded.')
  }

  function packPool(){
    const base=['elder','merchant','veteran','hunter','narmer','sargon']
    if(meta.completedCampaigns.includes('dawn'))base.push('thutmose','ramesses','cyrus')
    if(meta.completedCampaigns.includes('firstcities'))base.push('cleopatra','hannibal')
    return base.filter(id=>PEOPLE[id])
  }
  function openPack(kind,packType='people'){
    if(packType==='people'){
      if(!features.people){notify('Hero packs unlock with People after battle 1-5.');return}
      const spec=kind==='great'?{cost:220,count:3,name:'Great Chronicle Pack'}:{cost:100,count:2,name:'Historical Pack'}
      if(meta.gold<spec.cost){notify('Not enough Gold.');return}
      patchMeta(m=>{m.gold-=spec.cost;m.stats.packsOpened=(m.stats.packsOpened||0)+1;return m})
      setPack({packType:'people',kind,...spec,stage:'sealed',results:[],bonus:0});return
    }
    const spec=kind==='advanced'
      ?{cost:95,count:2,name:'Advanced Artifact Pack',pool:['leatherLamellar','bronzeArmor','bronzeEdges','spearheads','edgedProjectiles','slingPouch']}
      :{cost:45,count:1,name:'Supply Artifact Pack',pool:['leatherLamellar','bronzeArmor','bronzeEdges','spearheads','slingPouch']}
    if(meta.gold<spec.cost){notify('Not enough Gold.');return}
    patchMeta(m=>{m.gold-=spec.cost;m.stats.packsOpened=(m.stats.packsOpened||0)+1;return m})
    setPack({packType:'artifact',kind,...spec,stage:'sealed',results:[],bonus:0})
  }
  function revealPack(){
    if(pack.packType==='artifact'){
      const results=[]
      for(let i=0;i<pack.count;i++)results.push(pack.pool[Math.floor(Math.random()*pack.pool.length)])
      if(pack.kind==='advanced'&&!results.includes('edgedProjectiles'))results[0]=Math.random()<.45?'edgedProjectiles':results[0]
      patchMeta(m=>{for(const id of results){m.inventory[id]=(m.inventory[id]||0)+1;if(!m.artifactLevels[id])m.artifactLevels[id]=1}return m})
      setPack(p=>({...p,stage:'revealed',results:results.map(id=>({id,isNew:!(meta.inventory[id]>0)})),bonus:0}));return
    }
    const pool=packPool(),results=[]
    for(let i=0;i<pack.count;i++)results.push(weightedPick(pool))
    if(pack.kind==='great'&&!results.some(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity))){const hi=pool.filter(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity));if(hi.length)results[0]=hi[Math.floor(Math.random()*hi.length)]}
    const bonus=15+Math.floor(Math.random()*16)
    patchMeta(m=>{m.gold+=bonus;for(const id of results){m.characterCopies[id]=(m.characterCopies[id]||0)+1;if(!m.characterLevels[id])m.characterLevels[id]=1}m.stats.peopleDiscovered=Object.keys(m.characterCopies).filter(id=>m.characterCopies[id]>0&&PEOPLE[id]).length;reconcileUnits(m);return m})
    setPack(p=>({...p,stage:'revealed',results:results.map(id=>({id,isNew:!(meta.characterCopies[id]>0)})),bonus}))
  }
  function upgradePerson(id){
    const p=PEOPLE[id],level=meta.characterLevels[id]||1,max=RARITIES[p.rarity].maxLevel;if(level>=max)return
    const need=COPY_THRESHOLDS[level],cost=GOLD_UPGRADE_COSTS[level];if((meta.characterCopies[id]||0)<need||meta.gold<cost)return
    patchMeta(m=>{m.gold-=cost;m.characterLevels[id]=level+1;m.stats.peopleUpgraded=(m.stats.peopleUpgraded||0)+1;reconcileUnits(m);return m});notify(`${p.name} reached Level ${level+1}.`)
  }

  function upgradeUnit(id){
    const level=meta.unitLevels[id]||1;if(level>=UNIT_LEVEL_MAX)return
    const cost=unitLevelCost(level);if(meta.xp<cost){notify(`Need ${cost} EXP.`);return}
    patchMeta(m=>{m.xp-=cost;m.unitLevels[id]=level+1;m.stats.unitLevelsBought=(m.stats.unitLevelsBought||0)+1;return m});notify(`${UNITS[id].name} reached Level ${level+1}.`)
  }

  function buyArtifact(id){
    const item=ITEMS[id]
    if(item.slot==='hero'&&!features.relics){notify('Hero Relics unlock after winning battle 2-5.');return}
    if(meta.gold<item.price){notify('Not enough Gold.');return}
    patchMeta(m=>{m.gold-=item.price;m.inventory[id]=(m.inventory[id]||0)+1;if(!m.artifactLevels[id])m.artifactLevels[id]=1;return m});notify(`${item.name} acquired.`)
  }
  function evolveArtifact(id){
    const item=ITEMS[id],level=meta.artifactLevels[id]||0;if(level<1||level>=item.maxLevel)return
    const need=ARTIFACT_COPY_THRESHOLDS[level],cost=ARTIFACT_WORKSHOP_GOLD[level]
    if((meta.inventory[id]||0)<need||meta.gold<cost){notify(`Need ${need} copies and ${cost} Gold.`);return}
    patchMeta(m=>{m.gold-=cost;m.artifactLevels[id]=level+1;m.stats.artifactsEvolved=(m.stats.artifactsEvolved||0)+1;return m});notify(`${item.name} evolved to Level ${level+1}.`)
  }
  function itemEligibleForUnit(item,unitId){
    const u=UNITS[unitId];if(!u)return false
    if(item.maxAge&&u.ageIndex&&u.ageIndex>item.maxAge)return false
    if(item.eligible==='ALL')return true
    if(item.eligible==='RANGED')return u.role.includes('RANGED')||u.role.includes('FIREARM')
    if(item.eligible==='MELEE')return u.range===0&&!u.role.includes('AIR')
    if(item.eligible==='SPEAR')return u.role.includes('SPEAR')
    if(item.eligible==='MOUNTED')return u.role.includes('MOUNTED')
    if(item.eligible==='FIREARM')return u.role.includes('FIREARM')
    if(item.eligible==='SLINGER')return unitId==='slinger'
    return false
  }
  function eligibleEquipTargets(item){
    if(item.slot==='hero')return ownedPeople.filter(id=>item.eligible==='ALL'||PEOPLE[id]?.type===item.eligible)
    return meta.discoveredUnits.filter(id=>itemEligibleForUnit(item,id))
  }
  function equipItem(itemId,targetId){
    const item=ITEMS[itemId];if((meta.inventory[itemId]||0)<1)return
    patchMeta(m=>{
      for(const unit of Object.keys(m.unitEquipment||{}))m.unitEquipment[unit]=(m.unitEquipment[unit]||[]).filter(id=>id!==itemId)
      for(const hero of Object.keys(m.heroEquipment||{}))if(m.heroEquipment[hero]===itemId)m.heroEquipment[hero]=null
      if(item.slot==='unit'){const current=[...(m.unitEquipment[targetId]||[])];if(current.length>=2)current.shift();current.push(itemId);m.unitEquipment[targetId]=current}else m.heroEquipment[targetId]=itemId
      m.stats.itemsEquipped=(m.stats.itemsEquipped||0)+1;return m
    });setEquipPicker(null);notify(`${item.name} equipped.`)
  }

  function unequipUnitItem(unitId,itemId){
    patchMeta(m=>{m.unitEquipment[unitId]=(m.unitEquipment[unitId]||[]).filter(id=>id!==itemId);return m})
    notify(`${ITEMS[itemId]?.name||'Artifact'} unequipped.`)
  }
  function eligibleArtifactsForUnit(unitId){
    return Object.values(ITEMS).filter(item=>item.slot==='unit'&&availableItemCopies(item.id)>0&&itemEligibleForUnit(item,unitId))
  }

  function resetAll(){setMeta(resetMeta());setSelectedCampaign('dawn');setScreen('campaign');notify('Fresh progression started.')}

  if(screen==='battle'&&battle)return <Battle {...battle} meta={meta} onFinish={finishRun}/>

  const rightId=campaignOrder[currentCampaignIndex+1],rightLocked=rightId?!!(CAMPAIGNS[rightId].requires&&!meta.completedCampaigns.includes(CAMPAIGNS[rightId].requires)):true
  const header=<header className="mobile-game-header"><img src={ASSETS.logo} alt="March of Epochs"/><div className="header-currencies"><span className="xp"><img src={ASSETS.ui.xp} alt=""/><b>{meta.xp}</b><small>EXP</small></span><span className="gold"><img src={ASSETS.ui.coin} alt=""/><b>{meta.gold}</b><small>GOLD</small></span><span className={`tp ${features.technology?'':'locked'}`}><img src={ASSETS.ui.tp} alt=""/><b>{meta.tp}</b><small>TP</small></span></div></header>

  return <div className="app-shell mobile-first-shell">
    {header}
    <main>
      {screen==='campaign'&&<section className="screen-panel mobile-screen">
        <div className="campaign-mobile-heading"><div><span>CAMPAIGN {campaign.number||currentCampaignIndex+1} OF {campaignOrder.length}</span><h1>{campaign.name}</h1></div><button className={`achievement-pill ${claimableAchievements?'ready':''}`} onClick={()=>setAchievementsOpen(true)}><img src={ASSETS.ui.trophy} alt=""/>{claimableAchievements?`${claimableAchievements} ready`:'Achievements'}</button></div>
        <div className="content-pad">
          <div className="campaign-browser"><button className="campaign-nav-arrow" disabled={currentCampaignIndex===0} onClick={()=>moveCampaign(-1)}><img src={ASSETS.ui.arrowLeft} alt="Previous campaign"/></button><div className="campaign-showcase"><div className="campaign-art-img"><img src={ASSETS.campaigns[campaign.art]||ASSETS.campaigns.firstWars} alt={campaign.name}/><div><span>{campaign.era}</span><b>{campaign.boss}</b></div></div><div className="campaign-showcase-body"><div className="campaign-meta-grid"><div><span>Highest battle</span><b>{currentCampaignStats.best}/{campaign.stages.length}</b></div><div><span>Stars</span><b>{currentCampaignStats.stars}/3</b></div><div><span>Starting squads</span><b>{startingCapacity}</b></div></div><div className="campaign-stars-row">{stars(currentCampaignStats.stars).map((on,i)=><span key={i} className={on?'on':''}>★</span>)}</div><p className="campaign-desc">{campaign.desc}</p><button className="primary big campaign-start" onClick={openMuster}>Prepare Campaign</button></div></div><button className="campaign-nav-arrow" disabled={!rightId||rightLocked} onClick={()=>moveCampaign(1)}><img src={ASSETS.ui.arrowRight} alt="Next campaign"/></button></div>

          <div className="campaign-shell-summary">
            <div className="section-head"><h3>Battle Chronicle</h3><span>{AGES[campaign.ageId]?.name||'Historical Age'} · {campaign.stages.length} battles</span></div>
            <div className="battle-shell-list">{campaign.stages.map((s,i)=><div key={s.name} className={`${i<(currentCampaignStats.best||0)?'cleared':''} ${i===currentCampaignStats.best?'next':''}`}><b>{i+1}</b><span>{s.name}</span></div>)}</div>
            <div className="section-head"><h3>15-Campaign World</h3><span>The complete progression shell is now defined</span></div>
            <div className="campaign-roadmap-strip">{campaignOrder.map((id,i)=>{const c=CAMPAIGNS[id],open=i===0||meta.unlockedCampaigns.includes(id);return <div key={id} className={`${id===selectedCampaign?'active':''} ${open?'':'locked'}`}><b>{i+1}</b><span>{c.name}</span><small>{AGES[c.ageId]?.name||c.era}</small></div>})}</div>
          </div>

          <div className="section-head"><h3>Command</h3><span>{features.people?'Choose your Leader and General':'Unlocks after battle 1-5'}</span></div>
          <div className="loadout-grid command-loadout">
            {features.people?<><button className="loadout-slot person" onClick={()=>openPicker('leader')}><span>LEADER</span><MiniCardArt id={meta.loadout.leader} meta={meta}/><b>{leader?.name||'Select Leader'}</b><small>Level {meta.characterLevels[meta.loadout.leader]||1}</small></button><button className="loadout-slot person" onClick={()=>openPicker('general')}><span>GENERAL</span><MiniCardArt id={meta.loadout.general} meta={meta}/><b>{general?.name||'Select General'}</b><small>Level {meta.characterLevels[meta.loadout.general]||1}</small></button></>:<><div className="loadout-slot feature-locked"><span>LEADER</span><strong>🔒</strong><b>People locked</b><small>Win battle 1-5</small></div><div className="loadout-slot feature-locked"><span>GENERAL</span><strong>🔒</strong><b>People locked</b><small>Win battle 1-5</small></div></>}
          </div>

          <div className="section-head"><h3>Foundational Technologies</h3><span>{features.technology?`${effectiveTechSlots} slots`:'Unlocks after Campaign I'}</span></div>
          {features.technology?<div className="loadout-grid technology-loadout">{Array.from({length:effectiveTechSlots},(_,i)=>{const id=meta.loadout.tech[i];return <button key={i} className="loadout-slot tech" onClick={()=>openPicker('tech',i)}><span>TECH {i+1}</span><div className="tech-big art">{id&&ASSETS.tech?.[id]?<img src={ASSETS.tech[id]} alt={TECHS[id].name}/>:id?TECHS[id].icon:'＋'}</div><b>{id?TECHS[id].name:'Empty'}</b><small>{id?TECHS[id].desc:'Choose technology'}</small></button>})}</div>:<div className="feature-lock-banner"><b>🔒 Technology</b><span>Complete Campaign I to open research, earn Technology Points and equip technologies.</span></div>}

          <div className="progression-hint"><b>Current progression</b><span>{!features.people?'Artifacts + Warrior training are your only permanent power. Reach 1-6 to unlock People.':!features.technology?'People are online. Push through Campaign I to unlock Technology.':!features.relics?'Technology is online. Hero Relics unlock after battle 2-5.':'All current progression systems unlocked.'}</span></div>
          <button className="text-reset" onClick={resetAll}>Reset prototype progression</button>
        </div>
      </section>}

      {screen==='artifacts'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT EQUIPMENT</span><h1>Artifacts</h1><p>Artifacts now come from packs. Equip up to two Army Artifacts on each unit type; Hero Relics unlock later.</p></div><div className="content-pad"><div className="subtabs">{[['army','Army Artifacts'],['relics',features.relics?'Hero Relics':'🔒 Relics'],['store','Pack Store']].map(([id,n])=><button key={id} className={artifactTab===id?'active':''} onClick={()=>{if(id==='relics'&&!features.relics)notify('Hero Relics unlock after winning battle 2-5.');else setArtifactTab(id)}}>{n}</button>)}</div>
        {artifactTab==='army'&&<><div className="section-head"><h3>Your Army Artifacts</h3><span>{Object.values(ITEMS).filter(i=>i.slot==='unit'&&availableItemCopies(i.id)>0).length} available in inventory</span></div>{Object.values(ITEMS).filter(i=>i.slot==='unit'&&availableItemCopies(i.id)>0).length?<div className="artifact-tile-grid">{Object.values(ITEMS).filter(i=>i.slot==='unit'&&availableItemCopies(i.id)>0).map(item=>{const copies=meta.inventory[item.id]||0,available=availableItemCopies(item.id),equipped=equippedItemCount(item.id),level=meta.artifactLevels[item.id]||1,max=level>=item.maxLevel,need=max?0:ARTIFACT_COPY_THRESHOLDS[level],canUpgrade=!max&&copies>=need&&meta.gold>=ARTIFACT_WORKSHOP_GOLD[level];return <button className={`artifact-tile rarity-${item.rarity.toLowerCase()}`} key={item.id} onClick={()=>setDetailArtifact(item.id)}><img className="artifact-frame" src={itemFrame(item.rarity)} alt=""/><div className="artifact-corner family">{itemFamilyIcon(item)}</div><div className="artifact-corner level">Lv.{level}</div><div className="artifact-art-wrap">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>🛡</span>}</div><div className="artifact-count">{available}</div>{canUpgrade&&<img className="artifact-upgrade-ready" src={ASSETS.ui.upgradeReady} alt="Ready to upgrade"/>}<div className="artifact-caption"><b>{item.name}</b><small>{item.rarity}{equipped?` · ${equipped} eq.`:''}</small></div></button>})}</div>:<div className="empty-state"><b>No Army Artifacts available</b><span>Open a Supply Artifact Pack in the Pack Store. Equipped Artifacts are hidden from this inventory list until you remove them from a unit.</span><button className="primary" onClick={()=>setArtifactTab('store')}>Open Pack Store</button></div>}</>}
        {artifactTab==='relics'&&features.relics&&<><div className="section-head"><h3>Your Hero Relics</h3><span>{Object.values(ITEMS).filter(i=>i.slot==='hero'&&availableItemCopies(i.id)>0).length} available in inventory</span></div>{Object.values(ITEMS).filter(i=>i.slot==='hero'&&availableItemCopies(i.id)>0).length?<div className="artifact-tile-grid">{Object.values(ITEMS).filter(i=>i.slot==='hero'&&availableItemCopies(i.id)>0).map(item=>{const copies=meta.inventory[item.id]||0,available=availableItemCopies(item.id),equipped=equippedItemCount(item.id),level=meta.artifactLevels[item.id]||1,max=level>=item.maxLevel,need=max?0:ARTIFACT_COPY_THRESHOLDS[level],canUpgrade=!max&&copies>=need&&meta.gold>=ARTIFACT_WORKSHOP_GOLD[level];return <button className={`artifact-tile rarity-${item.rarity.toLowerCase()}`} key={item.id} onClick={()=>setDetailArtifact(item.id)}><img className="artifact-frame" src={itemFrame(item.rarity)} alt=""/><div className="artifact-corner family">{itemFamilyIcon(item)}</div><div className="artifact-corner level">Lv.{level}</div><div className="artifact-art-wrap">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>♛</span>}</div><div className="artifact-count">{available}</div>{canUpgrade&&<img className="artifact-upgrade-ready" src={ASSETS.ui.upgradeReady} alt="Ready to upgrade"/>}<div className="artifact-caption"><b>{item.name}</b><small>{item.rarity}{equipped?` · ${equipped} eq.`:''}</small></div></button>})}</div>:<div className="empty-state"><b>No Hero Relics available</b><span>Relic packs appear in the store once this feature is unlocked. Equipped Relics are hidden from this inventory list.</span></div>}</>}
        {artifactTab==='store'&&<div className="pack-store"><div className="subtabs inner-store-tabs"><button className={artifactStoreCategory==='artifacts'?'active':''} onClick={()=>setArtifactStoreCategory('artifacts')}>Artifact Packs</button><button className={artifactStoreCategory==='heroes'?'active':''} onClick={()=>features.people?setArtifactStoreCategory('heroes'):notify('Hero packs unlock with People after battle 1-5.')}>{features.people?'Hero Packs':'🔒 Hero Packs'}</button></div>{artifactStoreCategory==='artifacts'?<div className="pack-grid mobile-packs"><button className="pack-box artifact-pack" onClick={()=>openPack('basic','artifact')}><div className="pack-seal">🛡</div><h3>Supply Artifact Pack</h3><p>1 random early Army Artifact. Best first purchase for a new account.</p><b>◉ 45 Gold</b></button><button className="pack-box artifact-pack great" onClick={()=>openPack('advanced','artifact')}><div className="pack-seal">⚒</div><h3>Advanced Artifact Pack</h3><p>2 Army Artifacts with a broader chance of melee, spear and ranged gear.</p><b>◉ 95 Gold</b></button>{features.relics&&<div className="store-note"><b>Relic packs coming next</b><p>Hero Relics are unlocked; this build keeps their first pool achievement-driven while we expand the relic library.</p></div>}</div>:<div className="pack-grid mobile-packs"><button className="pack-box" onClick={()=>openPack('standard','people')}><div className="pack-seal">♛</div><h3>Historical Pack</h3><p>2 random Leader/General cards + a small Gold return.</p><b>◉ 100 Gold</b></button><button className="pack-box great" onClick={()=>openPack('great','people')}><div className="pack-seal">★</div><h3>Great Chronicle</h3><p>3 people with improved odds of Rare+ discoveries.</p><b>◉ 220 Gold</b></button></div>}</div>}
        <div className="section-head"><h3>Artifact Families by Age</h3><span>Full equipment shell</span></div><div className="artifact-age-shell">{Object.entries(ARTIFACT_CATALOG).map(([ageId,list])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);return <div key={ageId}><b>{age?.name||ageId}</b><div>{list.map(name=><span key={name}>{name}</span>)}</div></div>})}</div>
      </div></section>}

      {screen==='people'&&features.people&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>LEADERS & GENERALS</span><h1>People</h1><p>People are discovered through packs. The full roster is organized by historical age, but undiscovered names remain hidden in normal play.</p></div><div className="content-pad"><div className="section-head"><h3>Your People</h3><span>{ownedPeople.length} discovered</span></div><div className="people-grid">{ownedPeople.map(id=><button key={id} className="collection-person" onClick={()=>setDetailPerson(id)}><MiniCardArt id={id} meta={meta}/><div className="collection-person-meta"><b>{PEOPLE[id].name}</b><span>Lv {meta.characterLevels[id]||1} · {meta.characterCopies[id]||0} cards</span></div></button>)}</div><button className="store-jump" onClick={()=>{setScreen('artifacts');setArtifactTab('store');setArtifactStoreCategory('heroes')}}>Open Hero Pack Store</button><div className="section-head"><h3>Roster by Age</h3><span>Common → Legend collection shell</span></div><div className="age-roster-grid">{Object.entries(HERO_CATALOG).map(([ageId,pool])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);const count=Object.values(pool).flat().length;return <div key={ageId} className="age-roster-card"><b>{age?.name||ageId}</b><span>{count} people planned</span><small>Common {pool.common.length} · Uncommon {pool.uncommon.length} · Rare {pool.rare.length} · Epic {pool.epic.length} · Legend {pool.legend.length}</small></div>})}</div></div></section>}

      {screen==='armies'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT TRAINING</span><h1>Armies</h1><p>Tap an unlocked army to level it with EXP and manage its two Artifact slots. The lower catalogue shows the entire unit progression by age.</p></div><div className="content-pad"><div className="army-overview-grid">{meta.discoveredUnits.filter(id=>UNITS[id]).map(id=>{const u=unitStatsAtLevel(id,meta.unitLevels[id]||1),art=ASSETS.units?.[id],eq=meta.unitEquipment[id]||[];return <button className="army-overview-card" key={id} onClick={()=>setDetailUnit(id)}><div className="army-overview-art">{art?<img src={art} alt={u.name}/>:<span>{unitIcon(u)}</span>}</div><div className="army-overview-copy"><div><h3>{u.name}</h3><b>Lv {meta.unitLevels[id]||1}</b></div><div className="army-overview-stats"><span>♥ {u.health}</span><span>⚔ {u.damage}</span><span>🛡 {u.armor}</span><span>⏱ {u.attackSpeed}</span></div><small>{eq.length?`${eq.length}/2 Artifacts equipped`:'No Artifacts equipped'}</small></div><i>›</i></button>})}</div><div className="section-head"><h3>Arsenal by Age</h3><span>{Object.keys(UNITS).length} unit types in the shell</span></div><div className="army-age-catalog">{Object.entries(AGES).map(([ageKey,age])=>{const units=Object.values(UNITS).filter(u=>u.ageId===age.id||u.ageId===ageKey);if(!units.length)return null;return <div key={ageKey} className="army-age-group"><div><b>{age.name}</b><span>{units.length} formations</span></div><div className="army-shell-chips">{units.map(u=><span key={u.id} className={meta.discoveredUnits.includes(u.id)?'owned':''}>{meta.discoveredUnits.includes(u.id)?'✓':'🔒'} {u.name}</span>)}</div></div>})}</div></div></section>}

      {screen==='technology'&&features.technology&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>RESEARCH</span><h1>Technology</h1><p>Research permanently unlocks new army possibilities. The live tree contains the implemented nodes; the age roadmap below defines the complete research shell.</p></div><div className="content-pad"><div className="research-capacity"><div><b>Technology loadout</b><span>{meta.techSlots}/6 permanent slots</span></div><button disabled={meta.techSlots>=6} onClick={buyTechSlot}>{meta.techSlots>=6?'MAX':'Expand with Gold'}</button></div><div className="tech-tree">{Object.values(TECHS).sort((a,b)=>a.tier-b.tier).map(t=><TechNode key={t.id} id={t.id} meta={meta} onBuy={buyTech}/>)}</div><div className="section-head"><h3>Research by Age</h3><span>Full technology roadmap</span></div><div className="technology-age-shell">{Object.entries(TECHNOLOGY_CATALOG).map(([ageId,list])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);return <div key={ageId}><b>{age?.name||ageId}</b><div>{list.map(name=><span key={name}>{name}</span>)}</div></div>})}</div></div></section>}
    </main>

    <nav className="bottom-nav progression-nav">{[
      ['campaign','Campaign',true],['artifacts','Artifacts',true],['people','People',features.people],['armies','Armies',true],['technology','Technology',features.technology]
    ].map(([id,label,open])=>{const active=screen===id;const icon=open?(ASSETS.ui[active?`${id}Active`:id]||ASSETS.ui[id]):ASSETS.ui.lock;return <button key={id} className={`${active?'active':''} ${open?'':'locked'}`} onClick={()=>chooseScreen(id)}><span><img src={icon} alt=""/></span><small>{label}</small></button>})}</nav>

    <Modal open={!!picker&&picker.type!=='muster'} onClose={()=>setPicker(null)} title={picker?.type==='tech'?'Choose Technology':picker?.type==='leader'?'Choose Leader':'Choose General'} wide>
      {picker?.type==='leader'&&<div className="picker-people">{ownedLeaders.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='general'&&<div className="picker-people">{ownedGenerals.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='tech'&&<div className="tech-picker">{meta.ownedTech.filter(id=>TECHS[id].tier<=campaign.maxTechTier).map(id=><button key={id} onClick={()=>choosePicker(id)}><span className="tech-picker-art">{ASSETS.tech?.[id]?<img src={ASSETS.tech[id]} alt={TECHS[id].name}/>:TECHS[id].icon}</span><b>{TECHS[id].name}</b><small>{TECHS[id].desc}</small></button>)}<button onClick={()=>choosePicker(null)}><span>∅</span><b>Empty slot</b><small>Run with fewer technologies.</small></button></div>}
    </Modal>

    <Modal open={campaignPrepOpen} onClose={closeCampaignPrep} title={`Prepare Campaign · Step 1 of 2`} wide>
      <div className="campaign-prep-layout">
        <div className="campaign-prep-hero">
          <div className="campaign-prep-art"><img src={ASSETS.campaigns[campaign.art]||ASSETS.campaigns.firstWars} alt={campaign.name}/></div>
          <div className="campaign-prep-copy"><span>{campaign.era}</span><h3>{campaign.name}</h3><p>{campaign.desc}</p><small>{campaign.stages.length} battles · best reached {currentCampaignStats.best}/{campaign.stages.length} · {startingCapacity} starting squads</small></div>
        </div>
        <div className="section-head"><h3>People Loadout</h3><span>{features.people?'Pick your Leader and General':'People are still locked'}</span></div>
        <div className="loadout-grid command-loadout prep-grid">
          {features.people?<><button className="loadout-slot person prep-card" onClick={()=>openPicker('leader')}><span>LEADER</span><MiniCardArt id={meta.loadout.leader} meta={meta}/><b>{leader?.name||'Select Leader'}</b><small>Level {meta.characterLevels[meta.loadout.leader]||1}</small></button><button className="loadout-slot person prep-card" onClick={()=>openPicker('general')}><span>GENERAL</span><MiniCardArt id={meta.loadout.general} meta={meta}/><b>{general?.name||'Select General'}</b><small>Level {meta.characterLevels[meta.loadout.general]||1}</small></button></>:<><div className="loadout-slot feature-locked prep-card"><span>LEADER</span><strong>🔒</strong><b>People locked</b><small>Win battle 1-5 to unlock.</small></div><div className="loadout-slot feature-locked prep-card"><span>GENERAL</span><strong>🔒</strong><b>People locked</b><small>Win battle 1-5 to unlock.</small></div></>}
        </div>
        <div className="section-head"><h3>Technology Loadout</h3><span>{features.technology?`${effectiveTechSlots} slots available`:'Technology is still locked'}</span></div>
        {features.technology?<div className="loadout-grid technology-loadout prep-grid">{Array.from({length:effectiveTechSlots},(_,i)=>{const id=meta.loadout.tech[i];return <button key={i} className="loadout-slot tech prep-card" onClick={()=>openPicker('tech',i)}><span>TECH {i+1}</span><div className="tech-big art">{id&&ASSETS.tech?.[id]?<img src={ASSETS.tech[id]} alt={TECHS[id].name}/>:id?TECHS[id].icon:'＋'}</div><b>{id?TECHS[id].name:'Empty'}</b><small>{id?TECHS[id].desc:'Choose technology'}</small></button>})}</div>:<div className="feature-lock-banner inline"><b>🔒 Technology</b><span>Complete Campaign I to unlock research and technology slots.</span></div>}
        <div className="modal-footer-actions"><button className="secondary-wide" onClick={closeCampaignPrep}>Cancel</button><button className="primary big" onClick={nextCampaignPrepStep}>Next · Choose Armies</button></div>
      </div>
    </Modal>

    <Modal open={musterOpen} onClose={closeCampaignPrep} title={`Choose Armies · Step 2 of 2`} wide>
      <div className="muster-compact-layout">
        <div className="muster-compact-slots">{muster.map((id,i)=>{const u=id?unitStatsAtLevel(id,meta.unitLevels[id]||1):null,art=id?ASSETS.units?.[id]:null;return <button key={i} className={`muster-compact-slot ${id?'filled':''}`} onClick={()=>setPicker({type:'muster',index:i})}><span className="slot-number">SLOT {i+1}</span>{id?<><div className="muster-compact-art">{art?<img src={art} alt={u.name}/>:<span>{unitIcon(u)}</span>}</div><div className="muster-compact-copy"><b>{u.name}</b><small>{u.role} · Lv {meta.unitLevels[id]||1}</small><div className="muster-inline-stats"><span>♥ {u.health}</span><span>🛡 {u.armor}</span><span>⚔ {u.damage}</span><span>⏱ {u.attackSpeed}</span></div></div><i>Change</i></>:<><div className="muster-add">＋</div><b>Select Army</b></>}</button>})}</div>
        <div className="muster-eligible-panel"><div className="section-head"><h3>Eligible this run</h3><span>From unlocks + current loadout</span></div><div className="muster-pool-list compact">{availableMusterUnits().map(id=>{const u=unitStatsAtLevel(id,meta.unitLevels[id]||1),art=ASSETS.units?.[id];return <div key={id} className="muster-pool-item"><div className="mini-unit-glyph">{art?<img src={art} alt={u.name}/>:unitIcon(u)}</div><div><b>{u.name} · Lv {meta.unitLevels[id]||1}</b><span>{u.role} · ♥ {u.health} · ⚔ {u.damage} · 🛡 {u.armor}</span></div></div>})}</div><div className="modal-footer-actions"><button className="secondary-wide" onClick={()=>{setMusterOpen(false);setCampaignPrepOpen(true);setCampaignPrepStep(1)}}>Back · People & Tech</button><button className="primary big" onClick={launchBattle}>March to Campaign</button></div></div>
      </div>
    </Modal>
    <Modal open={picker?.type==='muster'} onClose={()=>setPicker(null)} title={`Choose army for slot ${(picker?.index??0)+1}`} wide><div className="units-grid picker">{availableMusterUnits().map(id=><button key={id} className="unit-pick" onClick={()=>{pickUnit(picker.index,id);setPicker(null)}}><UnitCard id={id} meta={meta}/></button>)}</div></Modal>

    <Modal open={!!detailUnit} onClose={()=>setDetailUnit(null)} title={detailUnit?UNITS[detailUnit]?.name:''} wide>{detailUnit&&(()=>{const level=meta.unitLevels[detailUnit]||1,u=unitStatsAtLevel(detailUnit,level),cost=unitLevelCost(level),max=level>=UNIT_LEVEL_MAX,art=ASSETS.units?.[detailUnit],eq=meta.unitEquipment[detailUnit]||[];return <div className="unit-detail-layout"><div className="unit-detail-hero"><div className="unit-detail-art">{art?<img src={art} alt={u.name}/>:<span>{unitIcon(u)}</span>}</div><div className="unit-level-ribbon"><b>Level {level}</b><span>{max?'MAX':`${meta.xp} EXP available`}</span></div></div><div className="unit-detail-copy"><p>{u.desc}</p><div className="unit-detail-stats"><UnitStat label="Health" value={u.health}/><UnitStat label="Armor" value={u.armor}/><UnitStat label="Damage" value={u.damage}/><UnitStat label="Attack Speed" value={u.attackSpeed}/><UnitStat label="Range" value={u.range}/></div><div className="level-up-panel"><div><b>Next Level</b><span>{max?'Maximum training reached':unitNextLevelBonus(level)}</span></div><button className="primary" disabled={max||meta.xp<cost} onClick={()=>upgradeUnit(detailUnit)}>{max?'MAX':`Level Up · ✦ ${cost}`}</button></div><div className="equipment-section"><div className="section-head"><h3>Equipped Artifacts</h3><span>{eq.length}/2 slots</span></div><div className="equipment-slot-grid">{[0,1].map(i=>{const itemId=eq[i],item=itemId?ITEMS[itemId]:null;return <div key={i} className={`equipment-slot ${item?'filled':''}`}>{item?<><div className="equipment-slot-art">{ASSETS.items?.[itemId]?<img src={ASSETS.items[itemId]} alt={item.name}/>:<span>🛡</span>}</div><div><b>{item.name}</b><span>{effectSummary(item,meta.artifactLevels[itemId]||1)}</span></div><button onClick={()=>unequipUnitItem(detailUnit,itemId)}>✕</button></>:<button className="empty-equip" onClick={()=>setUnitEquipPicker(detailUnit)}>＋<span>Equip Artifact</span></button>}</div>})}</div>{eq.length<2&&<button className="secondary-wide" onClick={()=>setUnitEquipPicker(detailUnit)}>Choose Artifact</button>}</div><div className="unlock-note"><b>Unlock path</b><span>{UNITS[detailUnit].unlock||'Permanent army unlock'}</span></div></div></div>})()}</Modal>

    <Modal open={!!unitEquipPicker} onClose={()=>setUnitEquipPicker(null)} title={unitEquipPicker?`Equip Artifact · ${UNITS[unitEquipPicker]?.name}`:'Equip Artifact'} wide>{unitEquipPicker&&<div className="artifact-grid equip-artifact-grid">{eligibleArtifactsForUnit(unitEquipPicker).length?eligibleArtifactsForUnit(unitEquipPicker).map(item=><button key={item.id} className="artifact-card equip-choice" onClick={()=>{equipItem(item.id,unitEquipPicker);setUnitEquipPicker(null)}}><div className="artifact-art">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>🛡</span>}</div><div><h3>{item.name}</h3><span>Lv {meta.artifactLevels[item.id]||1}</span><p>{effectSummary(item,meta.artifactLevels[item.id]||1)}</p></div></button>):<div className="empty-state"><b>No eligible Artifacts owned</b><span>Open Artifact Packs first.</span><button className="primary" onClick={()=>{setUnitEquipPicker(null);setScreen('artifacts');setArtifactTab('store');setArtifactStoreCategory('artifacts')}}>Go to Pack Store</button></div>}</div>}</Modal>

    <Modal open={!!detailArtifact} onClose={()=>setDetailArtifact(null)} title={detailArtifact?ITEMS[detailArtifact]?.name:''} wide>{detailArtifact&&(()=>{const item=ITEMS[detailArtifact],level=meta.artifactLevels[detailArtifact]||1,copies=meta.inventory[detailArtifact]||0,available=availableItemCopies(detailArtifact),equipped=equippedItemCount(detailArtifact),max=level>=item.maxLevel,need=max?0:ARTIFACT_COPY_THRESHOLDS[level],cost=max?0:ARTIFACT_WORKSHOP_GOLD[level],canUpgrade=!max&&copies>=need&&meta.gold>=cost;return <div className="artifact-detail-layout"><div className={`artifact-detail-hero rarity-${item.rarity.toLowerCase()}`}><img className="artifact-detail-frame" src={itemFrame(item.rarity)} alt=""/><div className="artifact-detail-art">{ASSETS.items?.[detailArtifact]?<img src={ASSETS.items[detailArtifact]} alt={item.name}/>:<span>✦</span>}</div><div className="artifact-detail-level">Lv {level}</div><div className="artifact-detail-count">x{available}</div></div><div className="artifact-detail-copy"><div className="artifact-title-row"><h3>{item.name}</h3><span className={`rarity-chip ${item.rarity.toLowerCase()}`}>{item.rarity}</span></div><p>{item.desc}</p><div className="artifact-detail-stats"><div><span>Current effect</span><b>{effectSummary(item,level)}</b></div><div><span>Inventory</span><b>{available} available · {copies} total{equipped?` · ${equipped} equipped`:''}</b></div><div><span>Eligible</span><b>{item.slot==='hero'?'Hero relic slot':item.eligible}</b></div></div><div className="level-up-panel"><div><b>Workshop</b><span>{max?'Maximum rarity reached':`Need ${need} copies and ${cost} Gold`}</span></div><button className="primary" disabled={!canUpgrade} onClick={()=>{evolveArtifact(detailArtifact);setDetailArtifact(null)}}>{max?'MAX':`Evolve · ◉ ${cost}`}</button></div><div className="modal-footer-actions left"><button className="secondary-wide" onClick={()=>{setDetailArtifact(null);setArtifactTab(item.slot==='hero'?'relics':'army')}}>Back to Inventory</button><button className="primary big" onClick={()=>{setDetailArtifact(null);setEquipPicker({itemId:detailArtifact})}}>Equip Artifact</button></div></div></div>})()}</Modal>

    <Modal open={!!detailPerson} onClose={()=>setDetailPerson(null)} title={detailPerson?PEOPLE[detailPerson].name:''} wide>{detailPerson&&<div className="person-detail-layout"><CardFlip id={detailPerson} meta={meta} onUpgrade={upgradePerson}/><div className="person-details"><h3>{PEOPLE[detailPerson].rarity} {PEOPLE[detailPerson].type}</h3><p>{PEOPLE[detailPerson].bio}</p><h4>Gameplay level path</h4><ol>{PEOPLE[detailPerson].levels.slice(0,RARITIES[PEOPLE[detailPerson].rarity].maxLevel).map((x,i)=><li key={i} className={i<(meta.characterLevels[detailPerson]||1)?'active':''}>{x}</li>)}</ol>{PEOPLE[detailPerson].signatureUnit&&<div className="signature-callout"><b>Signature army</b><span>{UNITS[PEOPLE[detailPerson].signatureUnit]?.name}</span></div>}</div></div>}</Modal>

    <Modal open={!!pack} onClose={()=>setPack(null)} title={pack?.name||'Pack'} wide>{pack&&pack.stage==='sealed'?<div className="sealed-pack" onClick={revealPack}><img src={ASSETS.logo}/><div className="wax-seal">ME</div><h3>Tap to open</h3><p>{pack.packType==='artifact'?'Artifacts are revealed when the chest opens.':'People remain unknown until revealed.'}</p></div>:pack&&pack.packType==='artifact'?<div><div className="pack-results artifact-results">{pack.results.map((result,i)=>{const item=ITEMS[result.id];return <div key={`${result.id}-${i}`} className="pack-result artifact-pack-result"><div className="artifact-art">{ASSETS.items?.[result.id]?<img src={ASSETS.items[result.id]} alt={item.name}/>:<span>🛡</span>}</div><b>{item.name}</b><span>{result.isNew?'NEW ARTIFACT':'DUPLICATE COPY'}</span><small>{item.rarity} · {effectSummary(item,meta.artifactLevels[result.id]||1)}</small></div>})}</div><button className="primary big" onClick={()=>setPack(null)}>Add to Inventory</button></div>:pack&&<div><div className="pack-results slim">{pack.results.map((result,i)=><div key={`${result.id}-${i}`} className="pack-result"><MiniCardArt id={result.id} meta={meta}/><b>{PEOPLE[result.id].name}</b><span>{result.isNew?'NEW DISCOVERY':'DUPLICATE'}</span></div>)}</div><div className="pack-bonus">＋ ◉ {pack.bonus} Gold</div><button className="primary big" onClick={()=>setPack(null)}>Add to Collection</button></div>}</Modal>

    <Modal open={!!equipPicker} onClose={()=>setEquipPicker(null)} title={equipPicker?`Equip ${ITEMS[equipPicker.itemId]?.name}`:'Equip'} wide>{equipPicker&&<div className="equip-target-grid">{eligibleEquipTargets(ITEMS[equipPicker.itemId]).map(id=>ITEMS[equipPicker.itemId].slot==='unit'?<button key={id} onClick={()=>equipItem(equipPicker.itemId,id)}><UnitCard id={id} meta={meta} compact/><span>{(meta.unitEquipment[id]||[]).length}/2 artifact slots</span></button>:<button key={id} className="hero-equip-target" onClick={()=>equipItem(equipPicker.itemId,id)}><MiniCardArt id={id} meta={meta}/><div><b>{PEOPLE[id].name}</b><span>Relic slot</span></div></button>)}</div>}</Modal>

    <Modal open={achievementsOpen} onClose={()=>setAchievementsOpen(false)} title="Achievements" wide>{(()=>{const all=Object.values(ACHIEVEMENTS),status=a=>{const value=meta.stats?.[a.stat]||0,claimed=meta.claimedAchievements.includes(a.id);return{value,claimed,ready:value>=a.target&&!claimed}},card=a=>{const s=status(a);return <div key={a.id} className={`achievement-card ${s.ready?'ready':''}`}><div className="achievement-icon">🏆</div><div><h3>{a.name}</h3><p>{a.desc}</p><div className="achievement-progress"><i><em style={{width:`${Math.min(100,s.value/a.target*100)}%`}}/></i><span>{Math.min(s.value,a.target)}/{a.target}</span></div><small>Reward: ◉ {a.reward}{a.item?` + ${ITEMS[a.item].name}`:''}</small></div><button disabled={!s.ready} onClick={()=>claimAchievement(a.id)}>{s.ready?'Claim':'Go'}</button></div>},ready=all.filter(a=>status(a).ready).sort((a,b)=>((a.order||0)-(b.order||0))||a.name.localeCompare(b.name)),families=[...new Set(all.map(a=>a.family||'Other'))];return <div className="achievement-modal-content">{ready.length>0&&<><div className="achievement-family-title"><b>Ready to Claim</b><span>Completed achievements disappear from the list after claiming.</span></div><div className="achievement-grid">{ready.map(card)}</div></>}{families.map(f=>{const items=all.filter(a=>(a.family||'Other')===f&&!status(a).claimed&&!status(a).ready).sort((a,b)=>(a.order||0)-(b.order||0));if(!items.length)return null;return <div key={f} className="achievement-family"><div className="achievement-family-title"><b>{f}</b><span>Progression chain</span></div><div className="achievement-grid">{items.map(card)}</div></div>})}</div>})()}</Modal>

    {toast&&<div className="toast">{toast}</div>}
  </div>
}
