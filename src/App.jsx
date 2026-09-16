import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ASSETS } from './assets'
import {
  ACHIEVEMENTS, ARTIFACT_COPY_THRESHOLDS, ARTIFACT_WORKSHOP_GOLD,
  AGES, ARTIFACT_CATALOG, CAMPAIGNS, CAMPAIGN_ORDER, COPY_THRESHOLDS, HERO_CATALOG, ITEMS, PEOPLE, RARITIES,
  TECHNOLOGY_CATALOG, TECHS, UNITS, UNIT_LEVEL_MAX, itemEffectAtLevel, unitLevelCost,
  unitNextLevelBonus, unitStatsAtLevel
} from './data'
import {AGE1_TECH_IDS} from './data'
import {claimAchievement as claimAchievementRule,purchasePack,buySupply,trainUnit,researchTech,canResearch,reconcileUnits,unitAvailable,unitReady,startingCapacity as capacityFor,packSpec,drawPack,upgradePerson as upgradePersonRule,evolveArtifact as evolveArtifactRule,itemEligibleForUnit,equipArtifact,artifactSupply,supplyPrice,settleRun} from './game/progression.js'
import { loadMeta, resetMeta, saveMeta } from './storage'
import Modal from './components/Modal'
import CardFlip from './components/CardFlip'
import Battle from './components/Battle'
import { ArtifactArtwork } from './components/MenuArtwork'
import CollectionControls from './components/CollectionControls'
import PackStore from './components/PackStore'
import TechnologyArtwork from './components/TechnologyArtwork'
import PeopleReveal from './components/PeopleReveal'
import {selectCollection, collectionAge, ageLabel} from './collections.js'
import {emitFeedback,createActionGate,formatCurrency,loadMenuState,saveMenuState} from './uiFeedback.js'


const clone=o=>structuredClone(o)
const unique=a=>[...new Set(a)]
const campaignOrder=CAMPAIGN_ORDER
const rarityOrder={Common:1,Uncommon:2,Rare:3,Epic:4,Legend:5}
const unitIcon=u=>u.role.includes('MOUNTED')?'🐎':u.role.includes('RANGED')||u.role.includes('FIREARM')?'🏹':u.role.includes('SPEAR')?'⚑':'⚔'

function Currency({value,label,icon,locked=false}){return <span className={`${label.toLowerCase()} ${locked?'locked':''}`} aria-label={`${value} ${label}${locked?', research locked':''}`} title={`${value} ${label}`}><img src={icon} alt=""/><b key={value}>{formatCurrency(value)}</b><small>{label}</small></span>}
function SaveNotice({onRetry}){return <div className="save-notice" role="alert">Progress could not be saved on this device. Keep this page open and retry.<button className="secondary-wide" onClick={onRetry}>Retry save</button></div>}

function MiniCardArt({ id, meta }){
  const p=PEOPLE[id]
  if(!p)return <div className="mini-card-art locked-art"><span>?</span></div>
  const art=ASSETS.people[id],level=meta.characterLevels[id]||1,copies=meta.characterCopies[id]||0,max=RARITIES[p.rarity].maxLevel,next=level<max?COPY_THRESHOLDS[level]:copies
  return <div className={`mini-card-art ${art?'premium':'emblem'}`}>
    {art?<img src={art.mini||art.front} alt={p.name}/>:<div className="slot-emblem">{p.icon}</div>}
    <div className="mini-top-mask"/><div className="mini-badge left">{'★'.repeat(level)}{'☆'.repeat(Math.max(0,max-level))}</div><div className="mini-badge right">{copies}/{next}</div>
  </div>
}

function PersonThumb({id,meta,onClick,selected=false}){
  const p=PEOPLE[id]
  return <button className={`person-thumb ${selected?'selected':''}`} aria-pressed={selected} onClick={onClick} style={{'--rarity':RARITIES[p.rarity].color}}><MiniCardArt id={id} meta={meta}/><div><b>{p.name}</b><span>{p.rarity} · Lv {meta.characterLevels[id]||1}</span><small>{selected?'Selected':`${meta.characterCopies[id]||0} cards`}</small></div></button>
}

function TechNode({id,meta,onBuy}){
  const t=TECHS[id],owned=meta.ownedTech.includes(id),available=t.prereq.every(p=>meta.ownedTech.includes(p)),canBuy=canResearch(meta,id)&&meta.tp>=t.cost
  return <button className={`tech-node illustrated-tech ${owned?'owned':''} ${available?'available':'locked'}`} disabled={!canBuy} onClick={()=>canBuy&&onBuy(id)}>
    <TechnologyArtwork id={id}/><div className="tech-copy"><b>{t.name}</b><span>Tier {t.tier}{owned?' · OWNED':!available?' · LOCKED':<> · <img className="inline-currency-icon" src={ASSETS.ui.tp} alt="TP"/> {t.cost}</>}</span><small>{t.desc}</small><em className="research-status">{owned?'Researched':!available?`Requires ${t.prereq.filter(p=>!meta.ownedTech.includes(p)).map(p=>TECHS[p].name).join(', ')}`:canBuy?'Research':`Need ${t.cost} TP`}</em></div>
  </button>
}

function UnitStat({label,value}){const key={HP:'health',Health:'health',Armor:'armor',Dmg:'damage',Damage:'damage',Atk:'speed','Attack Speed':'speed',Rng:'range',Range:'range'}[label],icon=ASSETS.statIcons?.[key];return <div className="unit-stat">{icon&&<img className="unit-stat-icon" src={icon} alt=""/>}<span>{label}</span><b>{value}</b></div>}
function UnitCard({id,meta,compact=false}){
  const level=meta?.unitLevels?.[id]||1,u=unitStatsAtLevel(id,level),art=ASSETS.units?.[id]
  return <div className={`unit-card ${compact?'compact':''}`}>
    <div className={`unit-icon ${art?'has-art':''}`}>{art?<img src={art} alt={u.name}/>:unitIcon(u)}</div>
    <div className="unit-card-main"><div className="unit-title-line"><h4>{u.name}</h4><b>Lv {level}</b></div><span className="unit-role">{u.role}</span><div className="unit-stats"><UnitStat label="HP" value={u.health}/><UnitStat label="Armor" value={u.armor}/><UnitStat label="Dmg" value={u.damage}/><UnitStat label="Atk" value={u.attackSpeed}/><UnitStat label="Rng" value={u.range}/></div>{!compact&&<p>{u.desc}</p>}</div>
  </div>
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

function ArtifactTileVisual({item,level,available,equipped,canUpgrade,onClick}){
  return <button className={`artifact-tile menu-artifact-card inventory-tile ${equipped&&available===0?'is-equipped':''} rarity-${item.rarity.toLowerCase()}`} aria-label={`${item.name}, level ${level}, ${available} available, ${equipped} equipped`} title={`${item.name} | ${ageLabel(collectionAge(item,'artifacts'))}`} style={{'--rarity':RARITIES[item.rarity].color}} onClick={onClick}>
    <div className="artifact-card-top"><span>Lv {level}</span><small>{item.rarity}</small></div><ArtifactArtwork id={item.id}/><div className="artifact-card-caption"><b>{item.name}</b><small>{equipped&&available===0?'Equipped':`${available} available`}{equipped>0&&available>0?` / ${equipped} equipped`:''}</small>{canUpgrade&&<span className="inventory-upgrade" title="Upgrade ready">↑<span className="sr-only"> Upgrade ready</span></span>}</div>
  </button>
}

export default function App(){
  const [meta,setMeta]=useState(loadMeta)
  const [initialUi]=useState(loadMenuState)
  const [screen,setScreenState]=useState(()=>['campaign','armies','artifacts','people','technology'].includes(initialUi.screen)&&(!['people','technology'].includes(initialUi.screen)||meta.featureUnlocks[initialUi.screen])?initialUi.screen:'campaign')
  const [selectedCampaign,setSelectedCampaign]=useState(()=>meta.unlockedCampaigns.includes(initialUi.campaign)?initialUi.campaign:'dawn')
  const [picker,setPicker]=useState(null)
  const [detailPerson,setDetailPerson]=useState(()=>meta.characterCopies[initialUi.person]>0?initialUi.person:null)
  const [musterOpen,setMusterOpen]=useState(false)
  const [muster,setMuster]=useState([])
  const [battle,setBattle]=useState(null)
  const [pack,setPack]=useState(null)
  const [toast,setToast]=useState(null)
  const [saveFailed,setSaveFailed]=useState(false)
  const [artifactTab,setArtifactTab]=useState(()=>['army','store'].includes(initialUi.artifactTab)||initialUi.artifactTab==='relics'&&meta.featureUnlocks.relics?initialUi.artifactTab:'army')
  const [equipPicker,setEquipPicker]=useState(null)
  const [achievementsOpen,setAchievementsOpen]=useState(false)
  const [peopleTab,setPeopleTab]=useState('collection')
  const [peopleFilter,setPeopleFilter]=useState({age:'all',rarity:'all',sort:'rarity-desc'})
  const [artifactFilter,setArtifactFilter]=useState({age:'all',sort:'level-desc'})
  const [detailUnit,setDetailUnit]=useState(()=>meta.discoveredUnits.includes(initialUi.unit)?initialUi.unit:null)
  const [unitEquipPicker,setUnitEquipPicker]=useState(null)
  const [detailArtifact,setDetailArtifact]=useState(()=>meta.inventory[initialUi.artifact]>0?initialUi.artifact:null)
  const [campaignPrepOpen,setCampaignPrepOpen]=useState(false)
  const [activeMusterSlot,setActiveMusterSlot]=useState(0)
  const [unlockNotice,setUnlockNotice]=useState([])
  const previousCurrency=useRef({gold:meta.gold,xp:meta.xp,tp:meta.tp})
  const previousFeatures=useRef(meta.featureUnlocks)
  const scrollPositions=useRef(initialUi.scroll||{}),actionGate=useRef(createActionGate()),noticeId=useRef(0)
  function setScreen(id){scrollPositions.current[screen]=window.scrollY;setScreenState(id)}
  function retrySave(){const ok=saveMeta(meta);setSaveFailed(!ok);if(ok)notify('Progress saved.','success')}
  useEffect(()=>{
    const newlyUnlocked=['people','technology','relics'].filter(key=>meta.featureUnlocks[key]&&!previousFeatures.current[key])
    previousFeatures.current=meta.featureUnlocks
    if(newlyUnlocked.length){setUnlockNotice(newlyUnlocked);emitFeedback('unlock')}
  },[meta.featureUnlocks])

  useEffect(()=>{setSaveFailed(!saveMeta(meta))},[meta])
  useEffect(()=>{const gains=Object.fromEntries(['gold','xp','tp'].map(key=>[key,Math.max(0,meta[key]-previousCurrency.current[key])]));previousCurrency.current={gold:meta.gold,xp:meta.xp,tp:meta.tp};if(Object.values(gains).some(Boolean))emitFeedback('currency',gains)},[meta.gold,meta.xp,meta.tp])
  useLayoutEffect(()=>{if(screen!=='battle')window.scrollTo(0,scrollPositions.current[screen]||0)},[screen])
  useEffect(()=>{
    if(screen==='battle')return
    const persist=()=>{scrollPositions.current[screen]=window.scrollY;saveMenuState({screen,campaign:selectedCampaign,artifactTab,unit:detailUnit,artifact:detailArtifact,person:detailPerson,scroll:scrollPositions.current})}
    persist();window.addEventListener('pagehide',persist)
    return()=>window.removeEventListener('pagehide',persist)
  },[screen,selectedCampaign,artifactTab,detailUnit,detailArtifact,detailPerson])
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),3600);return()=>clearTimeout(t)},[toast])

  const features=meta.featureUnlocks||{}
  const ownedPeople=useMemo(()=>Object.keys(meta.characterCopies||{}).filter(id=>(meta.characterCopies[id]||0)>0&&PEOPLE[id]),[meta.characterCopies])
  const visiblePeople=selectCollection(ownedPeople.map(id=>PEOPLE[id]),{kind:'people',...peopleFilter,levels:meta.characterLevels})
  const ownedArtifacts=Object.values(ITEMS).filter(item=>item.slot===(artifactTab==='relics'?'hero':'unit')&&(meta.inventory[item.id]||0)>0)
  const visibleArtifacts=selectCollection(ownedArtifacts,{kind:'artifacts',...artifactFilter,levels:meta.artifactLevels})
  const ownedLeaders=ownedPeople.filter(id=>PEOPLE[id].type==='leader').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const ownedGenerals=ownedPeople.filter(id=>PEOPLE[id].type==='general').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const campaign=CAMPAIGNS[selectedCampaign]
  const currentCampaignIndex=campaignOrder.indexOf(selectedCampaign)
  const currentCampaignStats=meta.campaignStats?.[selectedCampaign]||{best:0,stars:0}
  const claimableAchievements=Object.values(ACHIEVEMENTS).filter(a=>(meta.stats?.[a.stat]||0)>=a.target&&!meta.claimedAchievements?.includes(a.id)).length
  const equippedUnitItems=(meta.unitEquipment?Object.values(meta.unitEquipment).flat():[]).filter(Boolean)
  const equippedHeroItems=(meta.heroEquipment?Object.values(meta.heroEquipment):[]).filter(Boolean)
  const equippedItemCount=id=>equippedUnitItems.filter(x=>x===id).length+equippedHeroItems.filter(x=>x===id).length
  const availableItemCopies=id=>Math.max(0,(meta.inventory?.[id]||0)-equippedItemCount(id))

  const effectiveTechSlots=features.technology?Math.min(6,meta.techSlots+(meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=4?1:0)+(meta.loadout.leader==='cyrus'&&(meta.characterLevels.cyrus||1)>=3?1:0)):0
  const startingCapacity=useMemo(()=>capacityFor(meta,selectedCampaign),[meta,selectedCampaign])

  function patchMeta(fn){setMeta(m=>typeof fn==='function'?fn(clone(m)):{...m,...fn})}
  function notify(message,kind='success'){setToast({message,kind,id:++noticeId.current});emitFeedback(kind,{message})}
  function achievementReady(a){return (meta.stats?.[a.stat]||0)>=a.target&&!meta.claimedAchievements?.includes(a.id)}



  function claimAchievement(id){
    const a=ACHIEVEMENTS[id];if(!a||!achievementReady(a)||!actionGate.current('claim:'+id))return
    patchMeta(m=>{claimAchievementRule(m,id);return m})
    notify(`${a.name}: +${a.reward} Gold${a.item?` + ${ITEMS[a.item].name}`:''}`,'achievement')
  }

  function selectCampaign(id){const c=CAMPAIGNS[id];if(c.requires&&!meta.completedCampaigns.includes(c.requires))return;setSelectedCampaign(id)}
  function moveCampaign(dir){const idx=currentCampaignIndex+dir;if(idx<0||idx>=campaignOrder.length)return;selectCampaign(campaignOrder[idx])}

  function chooseScreen(id){
    if(id==='people'&&!features.people){notify('People unlock after winning battle 1-5.','invalid');return}
    if(id==='technology'&&!features.technology){notify('Technology unlocks after winning battle 1-2.','invalid');return}
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
    });notify(id?`${PEOPLE[id]?.name||TECHS[id]?.name} selected.`:'Technology slot cleared.');setPicker(null)
  }

  function unitAvailableInBuild(id){return unitAvailable(meta,id,selectedCampaign)}

  function availableMusterUnits(){return meta.discoveredUnits.filter(id=>UNITS[id]&&unitAvailableInBuild(id))}
  function openMuster(){
    setMuster(a=>a.length===startingCapacity?a:Array.from({length:startingCapacity},(_,i)=>a[i]||null))
    setActiveMusterSlot(0)
    setCampaignPrepOpen(true)
    setMusterOpen(false)
  }
  function nextCampaignPrepStep(){
    const available=new Set(availableMusterUnits())
    setMuster(a=>Array.from({length:startingCapacity},(_,i)=>available.has(a[i])?a[i]:null))
    setActiveMusterSlot(i=>Math.min(i,startingCapacity-1))
    setCampaignPrepOpen(false)
    setMusterOpen(true)
  }
  function closeCampaignPrep(){setCampaignPrepOpen(false);setActiveMusterSlot(0);setMusterOpen(false);setPicker(null)}
  function backToLoadout(){setMusterOpen(false);setCampaignPrepOpen(true)}
  function pickUnit(slot,id){setMuster(a=>a.map((x,i)=>i===slot?id:x));notify(`${UNITS[id].name} assigned to squad ${slot+1}.`)}
  function launchBattle(){
    if(muster.some(x=>!x)){notify('Select an army for every starting slot.','invalid');return}
    if(!actionGate.current('launch'))return
    patchMeta(m=>{m.stats.runsStarted=(m.stats.runsStarted||0)+1;return m})
    closeCampaignPrep()
    setBattle({campaignId:selectedCampaign,loadout:{...clone(meta.loadout),tech:features.technology?meta.loadout.tech.filter(id=>id&&(selectedCampaign!=='dawn'||AGE1_TECH_IDS.includes(id))):[]},startingRoster:[...muster],startCapacity:startingCapacity,eligibleUnits:availableMusterUnits()})
    setScreen('battle')
  }

  function finishRun(info){patchMeta(m=>{settleRun(m,info);return m});setBattle(null);setScreen('campaign');notify(info.victory?'Campaign conquered. Rewards banked.':'Run rewards banked. Train and equip your army for the next attempt.')}

  function buyTech(id){const t=TECHS[id];if(!canResearch(meta,id)||meta.tp<t.cost||!actionGate.current('research:'+id))return;patchMeta(m=>{researchTech(m,id);return m});notify(t.name+' researched. Choose it in your campaign loadout.','unlock')}

  function buyTechSlot(){
    if(!features.technology||meta.techSlots>=6||!actionGate.current('techSlot'))return
    const costs={3:180,4:360,5:650},cost=costs[meta.techSlots]||650
    if(meta.gold<cost){notify('Not enough Gold.','invalid');return}
    patchMeta(m=>{if(m.gold<cost||m.techSlots>=6)return m;m.gold-=cost;m.techSlots++;while(m.loadout.tech.length<m.techSlots)m.loadout.tech.push(null);return m});notify('Technology loadout expanded.')
  }

  function openPack(kind,packType='people'){
    if(pack||packType==='people'&&!features.people||!actionGate.current('pack'))return
    const spec=packSpec(meta,kind,packType);if(meta.gold<spec.cost||!spec.pool.length){notify('Not enough Gold.','invalid');return}
    const rewards=drawPack(spec),results=purchasePack(clone(meta),spec,rewards);if(!results)return;patchMeta(m=>{purchasePack(m,spec,rewards);return m});setPack({...spec,stage:'sealed',results,bonus:rewards.bonus})
  }
  function revealPack(){setPack(p=>p?{...p,stage:'revealed'}:p);emitFeedback('reward')}
  function upgradePerson(id){if(!actionGate.current('person:'+id)||!upgradePersonRule(clone(meta),id))return;patchMeta(m=>{upgradePersonRule(m,id);return m});notify(`${PEOPLE[id].name} promoted to Level ${(meta.characterLevels[id]||1)+1}.`,'level-up')}

  function upgradeUnit(id){
    const level=meta.unitLevels[id]||1;if(level>=UNIT_LEVEL_MAX||!actionGate.current('unit:'+id))return
    const cost=unitLevelCost(level);if(meta.xp<cost){notify(`Need ${cost} EXP.`,'invalid');return}
    patchMeta(m=>{trainUnit(m,id);return m});notify(`${UNITS[id].name} reached Level ${level+1}.`,'level-up')
  }

  function buyArtifact(id){const item=ITEMS[id],cost=supplyPrice(meta,item.price);if(!artifactSupply(meta).includes(id)||meta.gold<cost||!actionGate.current('buy:'+id))return;patchMeta(m=>{buySupply(m,id);return m});notify(item.name+' acquired.','reward')}
  function evolveArtifact(id){if(!actionGate.current('evolve:'+id)||!evolveArtifactRule(clone(meta),id))return;patchMeta(m=>{evolveArtifactRule(m,id);return m});notify(`${ITEMS[id].name} evolved to Level ${(meta.artifactLevels[id]||1)+1}.`,'level-up')}

  function eligibleEquipTargets(item){
    if(item.slot==='hero')return ownedPeople.filter(id=>item.eligible==='ALL'||PEOPLE[id]?.type===item.eligible)
    return meta.discoveredUnits.filter(id=>unitReady(id)&&itemEligibleForUnit(item,id))
  }
  function equipItem(itemId,targetId){
    if(!actionGate.current('equip:'+itemId)||!equipArtifact(clone(meta),itemId,targetId))return
    const old=ITEMS[itemId].slot==='hero'?meta.heroEquipment[targetId]:(meta.unitEquipment[targetId]||[]).length>=2?meta.unitEquipment[targetId][0]:null
    patchMeta(m=>{equipArtifact(m,itemId,targetId);return m});setEquipPicker(null)
    notify(`${ITEMS[itemId].name} equipped to ${UNITS[targetId]?.name||PEOPLE[targetId]?.name}.${old?` ${ITEMS[old].name} returned to inventory.`:''}`,'equip')
  }

  function unequipUnitItem(unitId,itemId){
    patchMeta(m=>{m.unitEquipment[unitId]=(m.unitEquipment[unitId]||[]).filter(id=>id!==itemId);return m})
    notify(`${ITEMS[itemId]?.name||'Artifact'} unequipped.`)
  }
  function eligibleArtifactsForUnit(unitId){
    return Object.values(ITEMS).filter(item=>item.slot==='unit'&&availableItemCopies(item.id)>0&&itemEligibleForUnit(item,unitId)&&!(meta.unitEquipment[unitId]||[]).includes(item.id))
  }

  function dismissUnlockNotice(){
    const peopleDiscovered=unlockNotice.includes('people')
    setUnlockNotice([])
    if(peopleDiscovered){const results=['elder','veteran'].filter(id=>meta.characterCopies[id]>0).map(id=>({id,isNew:true}));if(results.length)setPack({name:'Your first People',packType:'people',kind:'discovery',stage:'revealed',results,bonus:0})}
  }

  function resetAll(){setMeta(resetMeta());setSelectedCampaign('dawn');setScreen('campaign');notify('Fresh progression started.')}

  if(screen==='battle'&&battle)return <>{saveFailed&&<SaveNotice onRetry={retrySave}/>}<Battle {...battle} meta={meta} onFinish={finishRun}/></>

  const rightId=campaignOrder[currentCampaignIndex+1],rightLocked=rightId?!!(CAMPAIGNS[rightId].requires&&!meta.completedCampaigns.includes(CAMPAIGNS[rightId].requires)):true
  const overlayOpen=!!(picker||campaignPrepOpen||musterOpen||detailUnit||unitEquipPicker||detailArtifact||detailPerson||pack||equipPicker||achievementsOpen||unlockNotice.length)
  const header=<header className="mobile-game-header"><img src={ASSETS.logo} alt="March of Epochs"/><div className="header-currencies"><Currency value={meta.xp} label="EXP" icon={ASSETS.ui.xp}/><Currency value={meta.gold} label="GOLD" icon={ASSETS.ui.coin}/><Currency value={meta.tp} label="TP" icon={ASSETS.ui.tp} locked={!features.technology}/></div></header>

  return <div className="app-shell mobile-first-shell menu-shell" onClickCapture={event=>{const button=event.target.closest('button');if(button&&!button.disabled)emitFeedback(button.classList.contains('primary')?'primary':'tap')}}>
    {saveFailed&&<SaveNotice onRetry={retrySave}/>}
    <div className="menu-base" {...(overlayOpen?{inert:'','aria-hidden':true}:{})}>
    {header}
    <main key={screen}>
      {screen==='campaign'&&<section className="screen-panel mobile-screen">
        <div className="campaign-mobile-heading"><div><span>CAMPAIGN {campaign.number||currentCampaignIndex+1} OF {campaignOrder.length}</span><h1>{campaign.name}</h1></div><button className={`achievement-pill ${claimableAchievements?'ready':''}`} onClick={()=>setAchievementsOpen(true)}><img src={ASSETS.ui.trophy} alt=""/>{claimableAchievements?`${claimableAchievements} ready`:'Achievements'}</button></div>
        <div className="content-pad">
          <div className="campaign-selector"><span>Choose campaign</span><div className="campaign-selector-actions"><button aria-label="Previous campaign" disabled={currentCampaignIndex===0} onClick={()=>moveCampaign(-1)}>‹</button><button aria-label={rightLocked?'Next campaign locked':'Next campaign'} disabled={!rightId||rightLocked} onClick={()=>moveCampaign(1)}>›</button></div></div><div className="campaign-browser"><div className="campaign-showcase"><div className="campaign-art-img"><img src={ASSETS.campaigns[campaign.art]||ASSETS.campaigns.firstWars} alt={campaign.name}/><div><span>{campaign.era}</span><b>{campaign.boss}</b></div></div><div className="campaign-showcase-body"><div className="campaign-meta-grid"><div><span>Highest battle</span><b>{currentCampaignStats.best}/{campaign.stages.length}</b></div><div><span>Stars</span><b>{currentCampaignStats.stars}/3</b></div><div><span>Starting squads</span><b>{startingCapacity}</b></div></div><p className="campaign-desc">{campaign.desc}</p><button className="primary big campaign-start" onClick={openMuster}>Start Campaign</button></div></div></div>

          <div className="campaign-shell-summary">
            <div className="section-head"><h3>Battle Chronicle</h3><span>{AGES[campaign.ageId]?.name||'Historical Age'} · {campaign.stages.length} battles</span></div>
            <div className="battle-shell-list compact-nodes">{campaign.stages.map((s,i)=>{const status=i<(currentCampaignStats.cleared??Math.max(0,(currentCampaignStats.best||0)-1))?'cleared':i===(currentCampaignStats.cleared??Math.max(0,(currentCampaignStats.best||0)-1))?'next':'locked';return <div key={s.name} aria-label={`Battle ${i+1}: ${s.name}, ${status}`} title={s.name} className={status}><b>{i+1}</b></div>})}</div>
            <details className="menu-disclosure"><summary>World campaigns <span>{campaignOrder.length} chapters</span></summary>
            <div className="campaign-roadmap-strip">{campaignOrder.map((id,i)=>{const c=CAMPAIGNS[id],open=i===0||meta.unlockedCampaigns.includes(id);return <div key={id} className={`${id===selectedCampaign?'active':''} ${open?'':'locked'}`}><b>{i+1}</b><span>{c.name}</span><small>{AGES[c.ageId]?.name||c.era}</small></div>})}</div></details>
          </div>

          <div className="progression-hint"><b>Next unlock</b><span>{!features.technology?'Win battle 1-2 to unlock Technology.':!features.people?'Win battle 1-5 to unlock Leaders and Generals.':!features.relics?'Win battle 2-5 to unlock Hero Relics.':'People, Technology and Hero Relics unlocked.'}</span></div>
          {import.meta.env.DEV&&<details className="menu-disclosure development-tools"><summary>Development tools</summary><button className="danger" onClick={()=>{if(window.confirm('Reset all progression on this device? This cannot be undone.'))resetAll()}}>Reset progression</button></details>}
        </div>
      </section>}

      {screen==='artifacts'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT EQUIPMENT</span><h1>Artifacts</h1><p>Equip your armies. Evolve your collection.</p></div><div className="content-pad"><div className="subtabs">{[['army','Army Artifacts'],['relics',features.relics?'Hero Relics':'Relics Locked'],['store','Pack Store']].map(([id,n])=><button key={id} aria-pressed={artifactTab===id} className={artifactTab===id?'active':''} onClick={()=>{if(id==='relics'&&!features.relics)notify('Hero Relics unlock after winning battle 2-5.','invalid');else setArtifactTab(id)}}>{n}</button>)}</div>
        {(artifactTab==='army'||artifactTab==='relics'&&features.relics)&&<>
          <CollectionControls kind="artifacts" value={artifactFilter} onChange={setArtifactFilter}/>
          <div className="section-head"><h3>{artifactTab==='relics'?'Your Hero Relics':'Your Army Artifacts'}</h3><span aria-live="polite">{visibleArtifacts.length} / {ownedArtifacts.length} collected</span></div>
          {visibleArtifacts.length?<div className="artifact-tile-grid inventory-grid">{visibleArtifacts.map(item=>{
            const copies=meta.inventory[item.id]||0,available=availableItemCopies(item.id),equipped=equippedItemCount(item.id),level=meta.artifactLevels[item.id]||1,max=level>=item.maxLevel,canUpgrade=!max&&copies>=ARTIFACT_COPY_THRESHOLDS[level]&&meta.gold>=ARTIFACT_WORKSHOP_GOLD[level];
            return <ArtifactTileVisual key={item.id} item={item} level={level} available={available} equipped={equipped} canUpgrade={canUpgrade} onClick={()=>setDetailArtifact(item.id)}/>
          })}</div>:<div className="empty-state"><b>{ownedArtifacts.length?'No artifacts match this age':artifactTab==='relics'?'No Hero Relics collected':'No Army Artifacts collected'}</b><span>{ownedArtifacts.length?'Choose another age to see your collection.':artifactTab==='relics'?'Earn Hero Relics through achievements.':'Choose supplies or open a pack in the Artifact Store.'}</span>{ownedArtifacts.length?<button className="secondary-wide" onClick={()=>setArtifactFilter({...artifactFilter,age:'all'})}>Clear artifact filters</button>:artifactTab==='army'&&<button className="primary" onClick={()=>setArtifactTab('store')}>Open Artifact Store</button>}</div>}
        </>}
        {artifactTab==='store'&&<><PackStore type="artifact" meta={meta} onOpen={openPack}/><div className="section-head"><h3>Choose your supplies</h3><span>Guaranteed equipment</span></div><div className="artifact-tile-grid">{artifactSupply(meta).map(id=><button className="artifact-tile menu-artifact-card supply-card" key={id} disabled={meta.gold<supplyPrice(meta,ITEMS[id].price)} onClick={()=>buyArtifact(id)}><ArtifactArtwork id={id}/><b>{ITEMS[id].name}</b><small>{effectSummary(ITEMS[id],meta.artifactLevels[id]||1)}</small><span>{supplyPrice(meta,ITEMS[id].price)} Gold{meta.gold<supplyPrice(meta,ITEMS[id].price)&&<small className="feedback-note">Need {supplyPrice(meta,ITEMS[id].price)-meta.gold} more Gold</small>}</span></button>)}</div>{features.relics&&<p className="feedback-note">Earn Hero Relics through achievements and equip them to your People.</p>}</>}
        <details className="menu-disclosure"><summary>Artifact families <span>By age</span></summary><div className="artifact-age-shell">{Object.entries(ARTIFACT_CATALOG).map(([ageId,list])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);return <div key={ageId}><b>{age?.name||ageId}</b><div>{list.map(name=><span key={name}>{name}</span>)}</div></div>})}</div></details>
      </div></section>}

      {screen==='people'&&features.people&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>LEADERS & GENERALS</span><h1>People</h1><p>Discover Leaders and Generals to command your armies.</p></div><div className="content-pad">
        <div className="subtabs">{[['collection','Collection'],['store','People Store']].map(([id,name])=><button key={id} aria-pressed={peopleTab===id} className={peopleTab===id?'active':''} onClick={()=>setPeopleTab(id)}>{name}</button>)}</div>
        {peopleTab==='store'?<PackStore type="people" meta={meta} onOpen={openPack}/>:<>
          <CollectionControls kind="people" value={peopleFilter} onChange={setPeopleFilter}/>
          <div className="section-head"><h3>Your People</h3><span aria-live="polite">{visiblePeople.length} / {ownedPeople.length} discovered</span></div>
          <div className="people-grid">{visiblePeople.map(person=><button key={person.id} className="collection-person" style={{'--rarity':RARITIES[person.rarity].color}} onClick={()=>setDetailPerson(person.id)}><MiniCardArt id={person.id} meta={meta}/><div className="collection-person-meta"><b>{person.name}</b><span>{person.rarity} · Lv {meta.characterLevels[person.id]||1}</span><small>{ageLabel(collectionAge(person,'people'))}</small></div></button>)}</div>
          {!visiblePeople.length&&<div className="empty-state"><b>{ownedPeople.length?'No People match these filters':'Your collection starts here'}</b><span>{ownedPeople.length?'Try another rarity or age.':'Open a People pack to discover your first Leader or General.'}</span>{ownedPeople.length>0&&<button className="secondary-wide" onClick={()=>setPeopleFilter({...peopleFilter,age:'all',rarity:'all'})}>Clear People filters</button>}</div>}
          <button className="store-jump" onClick={()=>setPeopleTab('store')}>Open People Store</button>
          <details className="menu-disclosure"><summary>People by age <span>Collection guide</span></summary><div className="age-roster-grid">{Object.entries(HERO_CATALOG).map(([ageId,pool])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);const count=Object.values(pool).flat().length;return <div key={ageId} className="age-roster-card"><b>{age?.name||ageId}</b><span>{count} people</span><small>Common {pool.common.length} · Uncommon {pool.uncommon.length} · Rare {pool.rare.length} · Epic {pool.epic.length} · Legend {pool.legend.length}</small></div>})}</div></details>
        </>}
      </div></section>}

      {screen==='armies'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT TRAINING</span><h1>Armies</h1><p>Train your units and equip them for the next campaign.</p></div><div className="content-pad"><div className="army-overview-grid">{meta.discoveredUnits.filter(id=>unitReady(id,meta.completedCampaigns.includes('dawn')?'firstcities':'dawn')).map(id=>{const u=unitStatsAtLevel(id,meta.unitLevels[id]||1),art=ASSETS.units?.[id],eq=meta.unitEquipment[id]||[];return <button className="army-overview-card" key={id} onClick={()=>setDetailUnit(id)}><div className="army-overview-art">{art?<img src={art} alt={u.name}/>:<span>{unitIcon(u)}</span>}</div><div className="army-overview-copy"><div><h3>{u.name}</h3><b>Lv {meta.unitLevels[id]||1}</b></div><div className="army-overview-stats"><span><img src={ASSETS.statIcons.health} alt=""/><em>Health</em><strong>{u.health}</strong></span><span><img src={ASSETS.statIcons.damage} alt=""/><em>Damage</em><strong>{u.damage}</strong></span><span><img src={ASSETS.statIcons.armor} alt=""/><em>Armor</em><strong>{u.armor}</strong></span><span><img src={ASSETS.statIcons.speed} alt=""/><em>Atk / sec</em><strong>{u.attackSpeed}</strong></span></div><small>{eq.length?`${eq.length}/2 Artifacts equipped`:'No Artifacts equipped'}</small></div><i>›</i></button>})}</div><details className="menu-disclosure"><summary>Arsenal by age <span>{Object.keys(UNITS).length} units</span></summary><div className="army-age-catalog">{Object.entries(AGES).map(([ageKey,age])=>{const units=Object.values(UNITS).filter(u=>u.ageId===age.id||u.ageId===ageKey);if(!units.length)return null;return <div key={ageKey} className="army-age-group"><div><b>{age.name}</b><span>{units.length} formations</span></div><div className="army-shell-chips">{units.map(u=><span key={u.id} className={meta.discoveredUnits.includes(u.id)?'owned':''}>{meta.discoveredUnits.includes(u.id)?'✓':'🔒'} {u.name}<small>{u.contentPending?'Unavailable':u.unlock}</small></span>)}</div></div>})}</div></details></div></section>}

      {screen==='technology'&&features.technology&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>RESEARCH</span><h1>Technology</h1><p>Discover new formations and strengthen your campaign loadout.</p></div><div className="content-pad"><div className="research-capacity"><div><b>Technology loadout</b><span>{meta.techSlots}/6 permanent slots</span></div><button disabled={meta.techSlots>=6||meta.gold<({3:180,4:360,5:650}[meta.techSlots]||650)} onClick={buyTechSlot}>{meta.techSlots>=6?'Maximum slots':`Expand · ${{3:180,4:360,5:650}[meta.techSlots]||650} Gold`}</button></div><div className="tech-tree">{Object.values(TECHS).filter(t=>meta.completedCampaigns.includes('dawn')||AGE1_TECH_IDS.includes(t.id)).sort((a,b)=>a.tier-b.tier).map(t=><TechNode key={t.id} id={t.id} meta={meta} onBuy={buyTech}/>)}</div><details className="menu-disclosure"><summary>Research by age <span>Discovery guide</span></summary><div className="technology-age-shell">{Object.entries(TECHNOLOGY_CATALOG).map(([ageId,list])=>{const age=AGES[ageId]||Object.values(AGES).find(a=>a.id===ageId);return <div key={ageId}><b>{age?.name||ageId}</b><div>{list.map(name=><span key={name}>{name}</span>)}</div></div>})}</div></details></div></section>}
    </main>

    <nav aria-label="Main navigation" hidden={overlayOpen} className="bottom-nav progression-nav">{[
      ['campaign','Campaign',true],['artifacts','Artifacts',true],['people','People',features.people],['armies','Armies',true],['technology','Technology',features.technology]
    ].map(([id,label,open])=>{const active=screen===id;const icon=open?(ASSETS.ui[active?`${id}Active`:id]||ASSETS.ui[id]):ASSETS.ui.lock;return <button key={id} aria-current={active?'page':undefined} aria-label={open?label:`${label}, locked`} className={`${active?'active':''} ${open?'':'locked'}`} onClick={()=>chooseScreen(id)}><span><img src={icon} alt=""/></span><small>{label}</small></button>})}</nav>
    </div>

    <Modal menu open={!!picker&&picker.type!=='muster'} back onClose={()=>setPicker(null)} title={picker?.type==='tech'?'Choose Technology':picker?.type==='leader'?'Choose Leader':'Choose General'} wide>
      {picker?.type==='leader'&&<div className="picker-people">{ownedLeaders.map(id=><PersonThumb key={id} id={id} meta={meta} selected={meta.loadout.leader===id} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='general'&&<div className="picker-people">{ownedGenerals.map(id=><PersonThumb key={id} id={id} meta={meta} selected={meta.loadout.general===id} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='tech'&&<div className="tech-picker">{meta.ownedTech.filter(id=>selectedCampaign==='dawn'?AGE1_TECH_IDS.includes(id):TECHS[id].tier<=campaign.maxTechTier).map(id=><button key={id} aria-pressed={meta.loadout.tech[picker.index]===id} className={meta.loadout.tech[picker.index]===id?'selected':''} onClick={()=>choosePicker(id)}><span className="tech-picker-art"><TechnologyArtwork id={id}/></span><b>{TECHS[id].name}</b><small>{TECHS[id].desc}</small></button>)}<button onClick={()=>choosePicker(null)}><span>∅</span><b>Empty slot</b><small>Run with fewer technologies.</small></button></div>}
    </Modal>

    <Modal menu flow back open={campaignPrepOpen&&!picker} onClose={closeCampaignPrep} title="Campaign Loadout" wide>
      <div className="campaign-prep-layout">
        <div className="flow-context"><span>STEP 1 OF 2</span><b>{campaign.name}</b><small>{startingCapacity} starting squads · {campaign.stages.length} battles</small></div>
        <div className="campaign-prep-art"><img src={ASSETS.campaigns[campaign.art]||ASSETS.campaigns.firstWars} alt=""/></div>
        <div className="section-head"><h3>Commanders</h3><span>{features.people?'Tap a card to change':'Unlock after battle 1-5'}</span></div>
        {features.people?<div className="loadout-grid command-loadout prep-grid">{['leader','general'].map(role=>{const id=meta.loadout[role],person=PEOPLE[id];return <button key={role} className="loadout-slot person prep-card" onClick={()=>openPicker(role)}><span>{role.toUpperCase()}</span><MiniCardArt id={id} meta={meta}/><b>{person?.name||'Choose '+role}</b><small>{person?'Level '+(meta.characterLevels[id]||1):'Select a commander'}</small></button>})}</div>:<div className="feature-lock-banner inline"><img src={ASSETS.ui.lock} alt="Locked"/><div><b>Leaders & Generals</b><span>Win battle 1-5 to unlock your first commanders.</span></div></div>}
        <div className="section-head"><h3>Technology</h3><span>{features.technology?effectiveTechSlots+' slots':'Unlock after battle 1-2'}</span></div>
        {features.technology?<div className="loadout-grid technology-loadout prep-grid">{Array.from({length:effectiveTechSlots},(_,i)=>{const id=meta.loadout.tech[i];return <button key={i} className="loadout-slot tech prep-card" onClick={()=>openPicker('tech',i)}><span>SLOT {i+1}</span><div className="tech-big art">{id?<TechnologyArtwork id={id}/>:'＋'}</div><b>{id?TECHS[id].name:'Choose technology'}</b><small>{id?'Tap to change':'Optional'}</small></button>})}</div>:<div className="feature-lock-banner inline"><img src={ASSETS.ui.lock} alt="Locked"/><div><b>Research & Technology</b><span>Win battle 1-2 to unlock.</span></div></div>}
        <div className="modal-footer-actions"><button className="primary big" onClick={nextCampaignPrepStep}>Next · Muster Army</button></div>
      </div>
    </Modal>

    <Modal menu flow back open={musterOpen&&!picker} onClose={backToLoadout} title="Muster Army">
      <div className="muster-compact-layout">
        <div className="flow-context"><span>STEP 2 OF 2</span><b>{campaign.name}</b><small>{muster.filter(Boolean).length} of {muster.length} squads selected · Tap a slot to change</small></div>
        <div className="muster-compact-slots">{muster.map((id,i)=>{const u=id?unitStatsAtLevel(id,meta.unitLevels[id]||1):null,art=id?ASSETS.units?.[id]:null;return <button key={i} className={`muster-compact-slot ${id?'filled':''} ${i===activeMusterSlot?'selected':''}`} aria-pressed={i===activeMusterSlot} aria-label={`Slot ${i+1}: ${u?.name||'empty'}, choose army`} onClick={()=>{setActiveMusterSlot(i);setPicker({type:'muster',index:i})}}><span className="slot-number">SLOT {i+1}{id?' · READY':''}</span>{id?<><div className="muster-compact-art">{art?<img src={art} alt=""/>:<span>{unitIcon(u)}</span>}</div><div className="muster-compact-copy"><b>{u.name}</b><small>Lv {meta.unitLevels[id]||1} · {u.role}</small><div className="muster-inline-stats"><span><img src={ASSETS.statIcons.health} alt="Health"/>{u.health}</span><span><img src={ASSETS.statIcons.damage} alt="Damage"/>{u.damage}</span></div></div></>:<><div className="muster-add">＋</div><b>Choose army</b><small>Tap to select</small></>}</button>})}</div>
        <div className="muster-eligible-panel"><div className="section-head"><h3>Available Units</h3><span>Tap to fill slot {activeMusterSlot+1}</span></div><div className="muster-pool-list compact">{availableMusterUnits().map(id=>{const u=UNITS[id],art=ASSETS.units?.[id],count=muster.filter(x=>x===id).length;return <button key={id} className="muster-pool-item" onClick={()=>{pickUnit(activeMusterSlot,id);const next=muster.findIndex((x,i)=>!x&&i!==activeMusterSlot);if(next>=0)setActiveMusterSlot(next)}}><div className="mini-unit-glyph">{art?<img src={art} alt=""/>:unitIcon(u)}</div><div><b>{u.name}</b><small>Lv {meta.unitLevels[id]||1}{count?' · '+count+' selected':''}</small></div><span aria-hidden="true">＋</span></button>})}</div><p className="micro-copy">Available units follow your unlocks and selected commanders and technologies.</p></div>
        <div className="modal-footer-actions"><button className="primary big" disabled={muster.some(x=>!x)} onClick={launchBattle}>Start Campaign</button></div>
      </div>
    </Modal>
    <Modal menu open={picker?.type==='muster'} back onClose={()=>setPicker(null)} title={`Choose army for slot ${(picker?.index??0)+1}`} wide><div className="units-grid picker">{availableMusterUnits().map(id=><button key={id} className="unit-pick" onClick={()=>{pickUnit(picker.index,id);setPicker(null)}}><UnitCard id={id} meta={meta}/></button>)}</div></Modal>

    <Modal menu open={!!detailUnit&&!unitEquipPicker} onClose={()=>setDetailUnit(null)} title={detailUnit?UNITS[detailUnit]?.name:''} wide>{detailUnit&&(()=>{const level=meta.unitLevels[detailUnit]||1,u=unitStatsAtLevel(detailUnit,level),cost=unitLevelCost(level),max=level>=UNIT_LEVEL_MAX,art=ASSETS.units?.[detailUnit],eq=meta.unitEquipment[detailUnit]||[];return <div className="unit-detail-layout"><div className="unit-detail-hero"><div className="unit-detail-art">{art?<img src={art} alt={u.name}/>:<span>{unitIcon(u)}</span>}</div><div className="unit-level-ribbon"><b key={level}>Level {level}</b><span>{max?'MAX':`${meta.xp} EXP available`}</span></div></div><div className="unit-detail-copy"><p>{u.desc}</p><div className="unit-detail-stats"><UnitStat label="Health" value={u.health}/><UnitStat label="Armor" value={u.armor}/><UnitStat label="Damage" value={u.damage}/><UnitStat label="Attack Speed" value={u.attackSpeed}/><UnitStat label="Range" value={u.range}/></div><div className="level-up-panel"><div><b>Next Level</b><span>{max?'Maximum training reached':unitNextLevelBonus(level,detailUnit)}</span></div><button className="primary" aria-describedby="training-cost" disabled={max||meta.xp<cost} onClick={()=>upgradeUnit(detailUnit)}>{max?'MAX':<>Level Up · <img className="inline-currency-icon" src={ASSETS.ui.xp} alt="EXP"/> {cost}</>}</button>{!max&&meta.xp<cost&&<p id="training-cost" className="feedback-note">{cost-meta.xp} more EXP needed. Earn EXP in campaign battles.</p>}</div><div className="equipment-section"><div className="section-head"><h3>Equipped Artifacts</h3><span>{eq.length}/2 slots</span></div><div className="equipment-slot-grid">{[0,1].map(i=>{const itemId=eq[i],item=itemId?ITEMS[itemId]:null;return <div key={i} className={`equipment-slot ${item?'filled':''}`}>{item?<><div className="equipment-slot-art"><ArtifactArtwork id={itemId}/></div><div><b>{item.name}</b><span>{effectSummary(item,meta.artifactLevels[itemId]||1)}</span></div><button className="icon-only-close" aria-label={`Remove ${item.name}`} onClick={()=>unequipUnitItem(detailUnit,itemId)}><img src={ASSETS.ui.close} alt="Remove"/></button></>:<button className="empty-equip" onClick={()=>setUnitEquipPicker(detailUnit)}>＋<span>Equip Artifact</span></button>}</div>})}</div></div><div className="unlock-note"><b>Unlock path</b><span>{UNITS[detailUnit].unlock||'Permanent army unlock'}</span></div></div></div>})()}</Modal>

    <Modal menu open={!!unitEquipPicker} back onClose={()=>setUnitEquipPicker(null)} title={unitEquipPicker?`Equip Artifact · ${UNITS[unitEquipPicker]?.name}`:'Equip Artifact'} wide>{unitEquipPicker&&<div className="artifact-grid equip-artifact-grid">{eligibleArtifactsForUnit(unitEquipPicker).length?eligibleArtifactsForUnit(unitEquipPicker).map(item=><button key={item.id} className="artifact-card equip-choice" onClick={()=>{equipItem(item.id,unitEquipPicker);setUnitEquipPicker(null)}}><div className="artifact-art"><ArtifactArtwork id={item.id}/></div><div><h3>{item.name}</h3><span>Lv {meta.artifactLevels[item.id]||1}</span><p>{effectSummary(item,meta.artifactLevels[item.id]||1)}</p></div></button>):<div className="empty-state"><b>No eligible Artifacts owned</b><span>Open Artifact Packs first.</span><button className="primary" onClick={()=>{setUnitEquipPicker(null);setDetailUnit(null);setScreen('artifacts');setArtifactTab('store')}}>Go to Pack Store</button></div>}</div>}</Modal>

    <Modal menu open={!!detailArtifact} onClose={()=>setDetailArtifact(null)} title={detailArtifact?ITEMS[detailArtifact]?.name:''} wide>{detailArtifact&&(()=>{const item=ITEMS[detailArtifact],level=meta.artifactLevels[detailArtifact]||1,copies=meta.inventory[detailArtifact]||0,available=availableItemCopies(detailArtifact),equipped=equippedItemCount(detailArtifact),max=level>=item.maxLevel,need=max?0:ARTIFACT_COPY_THRESHOLDS[level],cost=max?0:ARTIFACT_WORKSHOP_GOLD[level],canUpgrade=!max&&copies>=need&&meta.gold>=cost;return <div className="artifact-detail-layout"><div className="artifact-detail-hero menu-artifact-hero" style={{'--rarity':RARITIES[item.rarity].color}}><ArtifactArtwork id={detailArtifact}/><div className="artifact-hero-caption"><b key={level}>Level {level}</b><span>{item.rarity}</span></div></div><div className="artifact-detail-copy"><div className="artifact-title-row"><h3>{item.name}</h3><span className={`rarity-chip ${item.rarity.toLowerCase()}`}>{item.rarity}</span></div><p>{item.desc}</p><div className="artifact-detail-stats"><div><span>Current effect</span><b>{effectSummary(item,level)}</b></div><div><span>Inventory</span><b>{available} available · {copies} total{equipped?` · ${equipped} equipped`:''}</b></div><div><span>Eligible</span><b>{item.slot==='hero'?'Hero relic slot':item.eligible}</b></div></div><div className="level-up-panel"><div><b>Workshop</b><span>{max?'Maximum level reached':`Need ${need} copies and ${cost} Gold`}</span></div><button className="secondary-wide" disabled={!canUpgrade} onClick={()=>evolveArtifact(detailArtifact)}>{max?'MAX':`Evolve · ◉ ${cost}`}</button></div><div className="modal-footer-actions left"><button className="primary big" disabled={available<1} onClick={()=>{setDetailArtifact(null);setEquipPicker({itemId:detailArtifact})}}>{available>0?'Equip Artifact':'All copies equipped'}</button></div></div></div>})()}</Modal>

    <Modal menu open={!!detailPerson} onClose={()=>setDetailPerson(null)} title={detailPerson?PEOPLE[detailPerson].name:''} wide>{detailPerson&&<div className="person-detail-layout"><CardFlip menu id={detailPerson} meta={meta} onUpgrade={upgradePerson}/></div>}</Modal>

    <Modal menu open={!!pack} onClose={pack?.stage==='sealed'?undefined:()=>setPack(null)} title={pack?.name||'Pack'} wide>{pack&&pack.stage==='sealed'?<button className="sealed-pack illustrated" onClick={revealPack}><img className="sealed-chest" src={pack.packType==='artifact'?(pack.kind==='advanced'?ASSETS.ui.chestPurple:ASSETS.ui.chestBronze):(pack.kind==='great'?ASSETS.ui.chestGold:ASSETS.ui.chestBlue)} alt="Pack"/><h3>Tap to open</h3><p>{pack.packType==='artifact'?'Artifacts are revealed when the chest opens.':'People remain unknown until revealed.'}</p></button>:pack&&pack.packType==='artifact'?<div><div className="pack-results artifact-results">{pack.results.map((result,i)=>{const item=ITEMS[result.id];return <div key={`${result.id}-${i}`} className="pack-result artifact-pack-result"><div className="artifact-art pack-card-art"><ArtifactArtwork id={result.id}/></div><b>{item.name}</b><span>{result.isNew?'NEW ARTIFACT':'DUPLICATE COPY'}</span><small>{item.rarity} · {effectSummary(item,meta.artifactLevels[result.id]||1)}</small></div>})}</div><button className="primary big" onClick={()=>setPack(null)}>Continue</button></div>:pack&&<PeopleReveal pack={pack} meta={meta} onClose={()=>setPack(null)}/>}</Modal>

    <Modal menu open={!!equipPicker} onClose={()=>setEquipPicker(null)} title={equipPicker?`Equip ${ITEMS[equipPicker.itemId]?.name}`:'Equip'} wide>{equipPicker&&<div className="equip-target-grid">{!eligibleEquipTargets(ITEMS[equipPicker.itemId]).length&&<div className="empty-state"><b>No eligible army yet</b><span>Unlock a compatible army to equip this Artifact.</span></div>}{eligibleEquipTargets(ITEMS[equipPicker.itemId]).map(id=>ITEMS[equipPicker.itemId].slot==='unit'?<button key={id} disabled={(meta.unitEquipment[id]||[]).includes(equipPicker.itemId)} onClick={()=>equipItem(equipPicker.itemId,id)}><UnitCard id={id} meta={meta} compact/><span>{(meta.unitEquipment[id]||[]).length}/2 artifact slots{(meta.unitEquipment[id]||[]).length>=2?' / Replaces '+ITEMS[meta.unitEquipment[id][0]].name:''}</span></button>:<button key={id} className="hero-equip-target" onClick={()=>equipItem(equipPicker.itemId,id)}><MiniCardArt id={id} meta={meta}/><div><b>{PEOPLE[id].name}</b><span>Relic slot</span></div></button>)}</div>}</Modal>

    <Modal menu open={achievementsOpen} onClose={()=>setAchievementsOpen(false)} title="Achievements" wide>{(()=>{const all=Object.values(ACHIEVEMENTS),status=a=>{const value=meta.stats?.[a.stat]||0,claimed=meta.claimedAchievements.includes(a.id);return{value,claimed,ready:value>=a.target&&!claimed}},card=a=>{const s=status(a);return <div key={a.id} className={`achievement-card ${s.ready?'ready':''}`}><div className="achievement-icon"><img src={ASSETS.ui.trophy} alt=""/></div><div><h3>{a.name}</h3><p>{a.desc}</p><div className="achievement-progress" role="progressbar" aria-label={a.name} aria-valuemin={0} aria-valuemax={a.target} aria-valuenow={Math.min(s.value,a.target)}><i><em style={{width:`${Math.min(100,s.value/a.target*100)}%`}}/></i><span>{Math.min(s.value,a.target)}/{a.target}</span></div><small>Reward: ◉ {a.reward}{a.item?` + ${ITEMS[a.item].name}`:''}</small></div><button disabled={!s.ready} onClick={()=>claimAchievement(a.id)}>{s.ready?'Claim reward':'In progress'}</button></div>},ready=all.filter(a=>status(a).ready).sort((a,b)=>((a.order||0)-(b.order||0))||a.name.localeCompare(b.name)),families=[...new Set(all.map(a=>a.family||'Other'))];return <div className="achievement-modal-content">{ready.length>0&&<><div className="achievement-family-title"><b>Ready to Claim</b><span>Your rewards are ready.</span></div><div className="achievement-grid">{ready.map(card)}</div></>}{families.map(f=>{const items=all.filter(a=>(a.family||'Other')===f&&!status(a).claimed&&!status(a).ready).sort((a,b)=>(a.order||0)-(b.order||0));if(!items.length)return null;return <div key={f} className="achievement-family"><div className="achievement-family-title"><b>{f}</b><span>Progression chain</span></div><div className="achievement-grid">{items.map(card)}</div></div>})}</div>})()}</Modal>

    <Modal menu open={unlockNotice.length>0} title="New horizons" onClose={dismissUnlockNotice}><div className="unlock-rewards">{unlockNotice.map(key=><div key={key}><img src={ASSETS.ui[key==='relics'?'artifacts':key]} alt=""/><h3>{key==='people'?'People unlocked':key==='technology'?'Technology unlocked':'Hero Relics unlocked'}</h3><p>{key==='people'?'Tribal Elder and Veteran Commander are ready to lead your armies.':key==='technology'?'Research new formations and choose technologies for your next campaign.':'Equip Hero Relics to strengthen your Leaders and Generals.'}</p></div>)}<button className="primary" onClick={dismissUnlockNotice}>Continue</button></div></Modal>
    {toast&&<div key={toast.id} role="status" aria-live="polite" aria-atomic="true" className="toast"><span className="toast-symbol" aria-hidden="true">{toast.kind==='invalid'?'!':'✓'}</span><span>{toast.message}</span></div>}
  </div>
}
