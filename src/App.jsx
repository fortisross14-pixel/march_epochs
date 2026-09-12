import { useEffect, useMemo, useState } from 'react'
import { ASSETS } from './assets'
import {
  ACHIEVEMENTS, ARTIFACT_COPY_THRESHOLDS, ARTIFACT_WORKSHOP_GOLD,
  CAMPAIGNS, COPY_THRESHOLDS, GOLD_UPGRADE_COSTS, ITEMS, PEOPLE, RARITIES,
  TECHS, UNITS, UNIT_LEVEL_MAX, itemEffectAtLevel, unitLevelCost,
  unitNextLevelBonus, unitStatsAtLevel
} from './data'
import { loadMeta, resetMeta, saveMeta } from './storage'
import Modal from './components/Modal'
import CardFlip from './components/CardFlip'
import Battle from './components/Battle'

const clone=o=>structuredClone(o)
const unique=a=>[...new Set(a)]
const campaignOrder=['dawn','firstcities']
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
    const set=new Set(m.discoveredUnits||['warrior']);set.add('warrior')
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
  function openMuster(){setMuster(Array.from({length:startingCapacity},()=>null));setMusterOpen(true)}
  function pickUnit(slot,id){setMuster(a=>a.map((x,i)=>i===slot?id:x))}
  function launchBattle(){
    if(muster.some(x=>!x)){notify('Select an army for every starting slot.');return}
    patchMeta(m=>{m.stats.runsStarted=(m.stats.runsStarted||0)+1;return m})
    setMusterOpen(false)
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

      if(info.campaign==='dawn'&&(info.victory||(info.bestReached||0)>=6)&&!m.featureUnlocks.people){
        m.featureUnlocks.people=true;m.characterCopies.elder=1;m.characterCopies.veteran=1;m.characterLevels.elder=1;m.characterLevels.veteran=1;m.loadout.leader='elder';m.loadout.general='veteran';m.stats.peopleDiscovered=2;m.stats.peopleFeatureUnlocked=1;unlockMessage='People unlocked: Tribal Elder + Veteran Commander.'
      }
      if(info.victory){
        if(!m.completedCampaigns.includes(info.campaign))m.completedCampaigns.push(info.campaign)
        m.stats.campaignsCompleted=(m.stats.campaignsCompleted||0)+1
        if(info.campaign==='dawn'){
          if(!m.unlockedCampaigns.includes('firstcities'))m.unlockedCampaigns.push('firstcities')
          if(!m.featureUnlocks.technology){m.featureUnlocks.technology=true;m.ownedTech=['fire','archery','wheel'];m.loadout.tech=['fire','archery','wheel'];m.techSlots=3;unlockMessage=(unlockMessage?unlockMessage+' ':'')+'Technology unlocked for Campaign II.'}
        }
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
  function openPack(kind){
    if(!features.people)return
    const spec=kind==='great'?{cost:220,count:3,name:'Great Chronicle Pack'}:{cost:100,count:2,name:'Historical Pack'}
    if(meta.gold<spec.cost){notify('Not enough Gold.');return}
    patchMeta(m=>{m.gold-=spec.cost;m.stats.packsOpened=(m.stats.packsOpened||0)+1;return m});setPack({kind,...spec,stage:'sealed',results:[],bonus:0})
  }
  function revealPack(){
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
  function eligibleEquipTargets(item){
    if(item.slot==='hero')return ownedPeople.filter(id=>item.eligible==='ALL'||PEOPLE[id]?.type===item.eligible)
    return meta.discoveredUnits.filter(id=>{const u=UNITS[id];if(!u)return false;if(item.eligible==='ALL')return true;if(item.eligible==='RANGED')return u.role.includes('RANGED')||u.role.includes('FIREARM');if(item.eligible==='SLINGER')return id==='slinger';return true})
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

  function resetAll(){setMeta(resetMeta());setSelectedCampaign('dawn');setScreen('campaign');notify('Fresh progression started.')}

  if(screen==='battle'&&battle)return <Battle {...battle} meta={meta} onFinish={finishRun}/>

  const rightId=campaignOrder[currentCampaignIndex+1],rightLocked=rightId?!!(CAMPAIGNS[rightId].requires&&!meta.completedCampaigns.includes(CAMPAIGNS[rightId].requires)):true
  const header=<header className="mobile-game-header"><img src={ASSETS.logo} alt="March of Epochs"/><div className="header-currencies"><span className="xp">✦ <b>{meta.xp}</b><small>EXP</small></span><span className="gold">◉ <b>{meta.gold}</b><small>GOLD</small></span><span className={`tp ${features.technology?'':'locked'}`}>⚗ <b>{meta.tp}</b><small>TP</small></span></div></header>

  return <div className="app-shell mobile-first-shell">
    {header}
    <main>
      {screen==='campaign'&&<section className="screen-panel mobile-screen">
        <div className="campaign-mobile-heading"><div><span>CAMPAIGN {currentCampaignIndex+1}</span><h1>{campaign.name}</h1></div><button className={`achievement-pill ${claimableAchievements?'ready':''}`} onClick={()=>setAchievementsOpen(true)}>🏆 {claimableAchievements?`${claimableAchievements} ready`:'Achievements'}</button></div>
        <div className="content-pad">
          <div className="campaign-browser"><button className="campaign-nav-arrow" disabled={currentCampaignIndex===0} onClick={()=>moveCampaign(-1)}>‹</button><div className="campaign-showcase"><div className="campaign-art-img"><img src={ASSETS.campaigns[campaign.art]} alt={campaign.name}/><div><span>{campaign.era}</span><b>{campaign.boss}</b></div></div><div className="campaign-showcase-body"><div className="campaign-meta-grid"><div><span>Highest battle</span><b>{currentCampaignStats.best}/15</b></div><div><span>Stars</span><b>{currentCampaignStats.stars}/3</b></div><div><span>Starting squads</span><b>{startingCapacity}</b></div></div><div className="campaign-stars-row">{stars(currentCampaignStats.stars).map((on,i)=><span key={i} className={on?'on':''}>★</span>)}</div><p className="campaign-desc">{campaign.desc}</p><button className="primary big campaign-start" onClick={openMuster}>Muster Army & Begin</button></div></div><button className="campaign-nav-arrow" disabled={!rightId||rightLocked} onClick={()=>moveCampaign(1)}>›</button></div>

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

      {screen==='artifacts'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT EQUIPMENT</span><h1>Artifacts</h1><p>Buy copies with Gold, equip up to two on each army type, and evolve favorites in the Workshop.</p></div><div className="content-pad"><div className="subtabs">{[['army','Army Artifacts'],['workshop','Workshop'],['relics',features.relics?'Hero Relics':'🔒 Relics']].map(([id,n])=><button key={id} className={artifactTab===id?'active':''} onClick={()=>{if(id==='relics'&&!features.relics)notify('Hero Relics unlock after winning battle 2-5.');else setArtifactTab(id)}}>{n}</button>)}</div>
        {artifactTab==='army'&&<div className="artifact-grid">{Object.values(ITEMS).filter(i=>i.slot==='unit').map(item=>{const copies=meta.inventory[item.id]||0,level=meta.artifactLevels[item.id]||0;return <div className="artifact-card" key={item.id}><div className="artifact-art">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>🛡</span>}</div><div><h3>{item.name}</h3><span>{item.rarity} · {level?`Lv ${level}`:'Not owned'}</span><p>{effectSummary(item,level||1)}</p><small>Copies {copies}</small><div className="artifact-actions"><button disabled={meta.gold<item.price} onClick={()=>buyArtifact(item.id)}>{copies?'Buy copy':'Buy'} · ◉ {item.price}</button>{copies>0&&<button onClick={()=>setEquipPicker({itemId:item.id})}>Equip</button>}</div></div></div>})}</div>}
        {artifactTab==='workshop'&&<div className="artifact-grid">{Object.values(ITEMS).filter(i=>(meta.inventory[i.id]||0)>0&&(i.slot==='unit'||features.relics)).map(item=>{const level=meta.artifactLevels[item.id]||1,max=level>=item.maxLevel,need=max?null:ARTIFACT_COPY_THRESHOLDS[level],cost=max?0:ARTIFACT_WORKSHOP_GOLD[level];return <div className="artifact-card workshop-card" key={item.id}><div className="artifact-art">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>⚒</span>}</div><div><h3>{item.name}</h3><span>Level {level}/{item.maxLevel}</span><p>{effectSummary(item,level)}</p>{!max&&<small>Next: {effectSummary(item,level+1)} · requires {need} copies</small>}<button disabled={max||(meta.inventory[item.id]||0)<need||meta.gold<cost} onClick={()=>evolveArtifact(item.id)}>{max?'MAX':`Evolve · ◉ ${cost}`}</button></div></div>})}</div>}
        {artifactTab==='relics'&&features.relics&&<div className="artifact-grid">{Object.values(ITEMS).filter(i=>i.slot==='hero').map(item=>{const copies=meta.inventory[item.id]||0,level=meta.artifactLevels[item.id]||0;return <div className="artifact-card" key={item.id}><div className="artifact-art">{ASSETS.items?.[item.id]?<img src={ASSETS.items[item.id]} alt={item.name}/>:<span>♛</span>}</div><div><h3>{item.name}</h3><span>{item.rarity} · {level?`Lv ${level}`:'Not owned'}</span><p>{effectSummary(item,level||1)}</p><div className="artifact-actions"><button disabled={meta.gold<item.price} onClick={()=>buyArtifact(item.id)}>{copies?'Buy copy':'Buy'} · ◉ {item.price}</button>{copies>0&&<button onClick={()=>setEquipPicker({itemId:item.id})}>Equip</button>}</div></div></div>})}</div>}
      </div></section>}

      {screen==='people'&&features.people&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>LEADERS & GENERALS</span><h1>People</h1><p>People are discovered through packs. Duplicates level them and unlock stronger bonuses, slots, units and special actions.</p></div><div className="content-pad"><div className="mobile-pack-row"><button className="pack-box compact" onClick={()=>openPack('standard')}><b>Historical Pack</b><span>2 people + Gold</span><strong>◉ 100</strong></button><button className="pack-box compact great" onClick={()=>openPack('great')}><b>Great Chronicle</b><span>3 people · Rare+ chance</span><strong>◉ 220</strong></button></div><div className="section-head"><h3>Your People</h3><span>{ownedPeople.length} discovered</span></div><div className="people-grid">{ownedPeople.map(id=><button key={id} className="collection-person" onClick={()=>setDetailPerson(id)}><MiniCardArt id={id} meta={meta}/><div className="collection-person-meta"><b>{PEOPLE[id].name}</b><span>Lv {meta.characterLevels[id]||1} · {meta.characterCopies[id]||0} cards</span></div></button>)}</div></div></section>}

      {screen==='armies'&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>PERMANENT TRAINING</span><h1>Armies</h1><p>Spend EXP to train unlocked army types. Levels are modest improvements: a future elite army at Level 1 still has a much stronger base than primitive Warriors at Level 100.</p></div><div className="content-pad"><div className="army-training-grid">{meta.discoveredUnits.filter(id=>UNITS[id]).map(id=>{const level=meta.unitLevels[id]||1,cost=unitLevelCost(level),max=level>=UNIT_LEVEL_MAX,eq=meta.unitEquipment[id]||[];return <div className="army-training-card" key={id}><UnitCard id={id} meta={meta}/><div className="training-footer"><div><b>Next level</b><span>{max?'Maximum training':unitNextLevelBonus(level)}</span><small>{eq.length?`Artifacts: ${eq.map(a=>ITEMS[a]?.name).join(' · ')}`:'No artifacts equipped'}</small></div><button disabled={max||meta.xp<cost} onClick={()=>upgradeUnit(id)}>{max?'MAX':`Lv ${level+1} · ✦ ${cost}`}</button></div></div>})}</div></div></section>}

      {screen==='technology'&&features.technology&&<section className="screen-panel mobile-screen"><div className="simple-screen-title"><span>RESEARCH</span><h1>Technology</h1><p>Research permanently unlocks new army possibilities. A unit still requires its technologies to be equipped in the campaign loadout unless a Leader or General bypasses the requirement.</p></div><div className="content-pad"><div className="research-capacity"><div><b>Technology loadout</b><span>{meta.techSlots}/6 permanent slots</span></div><button disabled={meta.techSlots>=6} onClick={buyTechSlot}>{meta.techSlots>=6?'MAX':'Expand with Gold'}</button></div><div className="tech-tree">{Object.values(TECHS).sort((a,b)=>a.tier-b.tier).map(t=><TechNode key={t.id} id={t.id} meta={meta} onBuy={buyTech}/>)}</div></div></section>}
    </main>

    <nav className="bottom-nav progression-nav">{[
      ['campaign','⚔','Campaign',true],['artifacts','🛡','Artifacts',true],['people','♛','People',features.people],['armies','⚑','Armies',true],['technology','⚗','Technology',features.technology]
    ].map(([id,icon,label,open])=><button key={id} className={`${screen===id?'active':''} ${open?'':'locked'}`} onClick={()=>chooseScreen(id)}><span>{open?icon:'🔒'}</span><small>{label}</small></button>)}</nav>

    <Modal open={!!picker&&picker.type!=='muster'} onClose={()=>setPicker(null)} title={picker?.type==='tech'?'Choose Technology':picker?.type==='leader'?'Choose Leader':'Choose General'} wide>
      {picker?.type==='leader'&&<div className="picker-people">{ownedLeaders.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='general'&&<div className="picker-people">{ownedGenerals.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='tech'&&<div className="tech-picker">{meta.ownedTech.filter(id=>TECHS[id].tier<=campaign.maxTechTier).map(id=><button key={id} onClick={()=>choosePicker(id)}><span className="tech-picker-art">{ASSETS.tech?.[id]?<img src={ASSETS.tech[id]} alt={TECHS[id].name}/>:TECHS[id].icon}</span><b>{TECHS[id].name}</b><small>{TECHS[id].desc}</small></button>)}<button onClick={()=>choosePicker(null)}><span>∅</span><b>Empty slot</b><small>Run with fewer technologies.</small></button></div>}
    </Modal>

    <Modal open={musterOpen} onClose={()=>setMusterOpen(false)} title={`Muster · ${startingCapacity} starting squads`} wide><div className="muster-columns"><div><h3>Starting slots</h3><div className="muster-slot-grid">{muster.map((id,i)=><button key={i} className={`muster-slot-card ${id?'filled':''}`} onClick={()=>setPicker({type:'muster',index:i})}><span>Slot {i+1}</span>{id?<><UnitCard id={id} meta={meta} compact/><small>Tap to change</small></>:<div className="muster-empty"><b>＋</b><small>Select army</small></div>}</button>)}</div></div><div><h3>Eligible this run</h3><div className="muster-pool-list">{availableMusterUnits().map(id=><div key={id} className="muster-pool-item"><div className="mini-unit-glyph">{ASSETS.units?.[id]?<img src={ASSETS.units[id]} alt={UNITS[id].name}/>:unitIcon(UNITS[id])}</div><div><b>{UNITS[id].name} · Lv {meta.unitLevels[id]||1}</b><span>{UNITS[id].role}</span></div></div>)}</div><button className="primary big" onClick={launchBattle}>March to Campaign</button></div></div></Modal>
    <Modal open={picker?.type==='muster'} onClose={()=>setPicker(null)} title={`Choose army for slot ${(picker?.index??0)+1}`} wide><div className="units-grid picker">{availableMusterUnits().map(id=><button key={id} className="unit-pick" onClick={()=>{pickUnit(picker.index,id);setPicker(null)}}><UnitCard id={id} meta={meta}/></button>)}</div></Modal>

    <Modal open={!!detailPerson} onClose={()=>setDetailPerson(null)} title={detailPerson?PEOPLE[detailPerson].name:''} wide>{detailPerson&&<div className="person-detail-layout"><CardFlip id={detailPerson} meta={meta} onUpgrade={upgradePerson}/><div className="person-details"><h3>{PEOPLE[detailPerson].rarity} {PEOPLE[detailPerson].type}</h3><p>{PEOPLE[detailPerson].bio}</p><h4>Gameplay level path</h4><ol>{PEOPLE[detailPerson].levels.slice(0,RARITIES[PEOPLE[detailPerson].rarity].maxLevel).map((x,i)=><li key={i} className={i<(meta.characterLevels[detailPerson]||1)?'active':''}>{x}</li>)}</ol>{PEOPLE[detailPerson].signatureUnit&&<div className="signature-callout"><b>Signature army</b><span>{UNITS[PEOPLE[detailPerson].signatureUnit]?.name}</span></div>}</div></div>}</Modal>

    <Modal open={!!pack} onClose={()=>setPack(null)} title={pack?.name||'Historical Pack'} wide>{pack&&pack.stage==='sealed'?<div className="sealed-pack" onClick={revealPack}><img src={ASSETS.logo}/><div className="wax-seal">ME</div><h3>Tap to open</h3><p>People remain unknown until revealed.</p></div>:pack&&<div><div className="pack-results slim">{pack.results.map((result,i)=><div key={`${result.id}-${i}`} className="pack-result"><MiniCardArt id={result.id} meta={meta}/><b>{PEOPLE[result.id].name}</b><span>{result.isNew?'NEW DISCOVERY':'DUPLICATE'}</span></div>)}</div><div className="pack-bonus">＋ ◉ {pack.bonus} Gold</div><button className="primary big" onClick={()=>setPack(null)}>Add to Collection</button></div>}</Modal>

    <Modal open={!!equipPicker} onClose={()=>setEquipPicker(null)} title={equipPicker?`Equip ${ITEMS[equipPicker.itemId]?.name}`:'Equip'} wide>{equipPicker&&<div className="equip-target-grid">{eligibleEquipTargets(ITEMS[equipPicker.itemId]).map(id=>ITEMS[equipPicker.itemId].slot==='unit'?<button key={id} onClick={()=>equipItem(equipPicker.itemId,id)}><UnitCard id={id} meta={meta} compact/><span>{(meta.unitEquipment[id]||[]).length}/2 artifact slots</span></button>:<button key={id} className="hero-equip-target" onClick={()=>equipItem(equipPicker.itemId,id)}><MiniCardArt id={id} meta={meta}/><div><b>{PEOPLE[id].name}</b><span>Relic slot</span></div></button>)}</div>}</Modal>

    <Modal open={achievementsOpen} onClose={()=>setAchievementsOpen(false)} title="Achievements" wide><div className="achievement-grid">{Object.values(ACHIEVEMENTS).map(a=>{const value=meta.stats?.[a.stat]||0,claimed=meta.claimedAchievements.includes(a.id),ready=value>=a.target&&!claimed;return <div key={a.id} className={`achievement-card ${claimed?'claimed':ready?'ready':''}`}><div className="achievement-icon">🏆</div><div><h3>{a.name}</h3><p>{a.desc}</p><div className="achievement-progress"><i><em style={{width:`${Math.min(100,value/a.target*100)}%`}}/></i><span>{Math.min(value,a.target)}/{a.target}</span></div><small>Reward: ◉ {a.reward}{a.item?` + ${ITEMS[a.item].name}`:''}</small></div><button disabled={!ready} onClick={()=>claimAchievement(a.id)}>{claimed?'Claimed':ready?'Claim':'Locked'}</button></div>})}</div></Modal>

    {toast&&<div className="toast">{toast}</div>}
  </div>
}
