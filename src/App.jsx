import { useEffect, useMemo, useState } from 'react'
import { ASSETS } from './assets'
import { CAMPAIGNS, COPY_THRESHOLDS, GOLD_UPGRADE_COSTS, PEOPLE, RARITIES, TECHS, UNITS } from './data'
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
  const art = ASSETS.people[id]
  const p = PEOPLE[id]
  const level = meta.characterLevels[id] || 1
  const copies = meta.characterCopies[id] || 0
  const maxLevel = RARITIES[p.rarity].maxLevel
  const nextCopies = level < maxLevel ? COPY_THRESHOLDS[level] : copies
  if(art){
    return <div className="mini-card-art premium">
      <img src={art.mini||art.front} alt={p.name} />
      <div className="mini-top-mask" />
      <div className="mini-badge left">{'★'.repeat(level)}{'☆'.repeat(Math.max(0,maxLevel-level))}</div>
      <div className="mini-badge right">{copies}/{nextCopies}</div>
    </div>
  }
  return <div className="mini-card-art emblem"><div className="slot-emblem">{p.icon}</div></div>
}

function PersonThumb({id,meta,onClick}){
  const p=PEOPLE[id],level=meta.characterLevels[id]||1,copies=meta.characterCopies[id]||0
  return <button className="person-thumb" onClick={onClick} style={{'--rarity':RARITIES[p.rarity].color}}>
    <MiniCardArt id={id} meta={meta} />
    <div><b>{p.name}</b><span>{p.rarity} · Lv {level}</span><small>{copies} cards</small></div>
  </button>
}

function TechNode({id,meta,onBuy,compact=false,disabled=false}){
  const t=TECHS[id],owned=meta.ownedTech.includes(id),available=t.prereq.every(p=>meta.ownedTech.includes(p)),canBuy=!owned&&available&&meta.tp>=t.cost&&!disabled
  return <button className={`tech-node ${owned?'owned':''} ${available?'available':'locked'}`} disabled={disabled||(!owned&&!available)} onClick={()=>canBuy&&onBuy(id)}>
    <div className="tech-icon">{t.icon}</div><div><b>{t.name}</b><span>Tier {t.tier}{owned?' · OWNED':!available?' · LOCKED':` · ✦ ${t.cost}`}</span>{!compact&&<small>{t.desc}</small>}</div>
  </button>
}

function UnitStat({label,value}){return <div className="unit-stat"><span>{label}</span><b>{value}</b></div>}
function UnitCard({id,compact=false}){
  const u=UNITS[id], art=ASSETS.units?.[id]
  return <div className={`unit-card ${compact?'compact':''}`}>
    <div className={`unit-icon ${art?'has-art':''}`}>{art?<img src={art} alt={u.name}/>:unitIcon(u)}</div>
    <div className="unit-card-main">
      <h4>{u.name}</h4><span className="unit-role">{u.role}</span>
      <div className="unit-stats"><UnitStat label="HP" value={u.health}/><UnitStat label="Armor" value={u.armor}/><UnitStat label="Dmg" value={u.damage}/><UnitStat label="Atk" value={u.attackSpeed}/><UnitStat label="Rng" value={u.range}/></div>
      {!compact && <p>{u.desc}</p>}
    </div>
  </div>
}

function weightedPick(pool){
  const weights=pool.map(id=>RARITIES[PEOPLE[id].rarity].weight),sum=weights.reduce((a,b)=>a+b,0);let r=Math.random()*sum
  for(let i=0;i<pool.length;i++){r-=weights[i];if(r<=0)return pool[i]}return pool[pool.length-1]
}

export default function App(){
  const [meta,setMeta]=useState(loadMeta)
  const [screen,setScreen]=useState('campaign')
  const [storeTab,setStoreTab]=useState('packs')
  const [collectionTab,setCollectionTab]=useState('people')
  const [selectedCampaign,setSelectedCampaign]=useState(campaignOrder[0])
  const [picker,setPicker]=useState(null)
  const [detailPerson,setDetailPerson]=useState(null)
  const [musterOpen,setMusterOpen]=useState(false)
  const [muster,setMuster]=useState([])
  const [battle,setBattle]=useState(null)
  const [pack,setPack]=useState(null)
  const [toast,setToast]=useState('')

  useEffect(()=>saveMeta(meta),[meta])
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(t)},[toast])

  const ownedPeople=useMemo(()=>Object.keys(meta.characterCopies).filter(id=>meta.characterCopies[id]>0&&PEOPLE[id]),[meta.characterCopies])
  const ownedLeaders=ownedPeople.filter(id=>PEOPLE[id].type==='leader').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const ownedGenerals=ownedPeople.filter(id=>PEOPLE[id].type==='general').sort((a,b)=>rarityOrder[PEOPLE[b].rarity]-rarityOrder[PEOPLE[a].rarity])
  const campaign=CAMPAIGNS[selectedCampaign]
  const leader=PEOPLE[meta.loadout.leader],general=PEOPLE[meta.loadout.general]
  const currentCampaignIndex=campaignOrder.indexOf(selectedCampaign)
  const currentCampaignStats=meta.campaignStats?.[selectedCampaign]||{best:0,stars:0}

  const effectiveTechSlots=Math.min(6,meta.techSlots+(meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=4?1:0))
  const startingCapacity=useMemo(()=>{
    let n=2
    if(meta.loadout.general==='hannibal'&&(meta.characterLevels.hannibal||1)>=3)n+=1
    if(meta.loadout.general==='napoleon'&&(meta.characterLevels.napoleon||1)>=3)n+=1
    if(meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=6)n+=1
    for(const id of meta.loadout.tech.filter(Boolean))n+=TECHS[id]?.startSlots||0
    return Math.min(6,n)
  },[meta])

  function patchMeta(fn){setMeta(m=>typeof fn==='function'?fn(clone(m)):{...m,...fn})}
  function notify(s){setToast(s)}

  function syncLoadoutForCampaign(m,id){
    const limit=Math.min(6,m.techSlots+(m.loadout.leader==='cleopatra'&&(m.characterLevels.cleopatra||1)>=4?1:0))
    m.loadout.tech=m.loadout.tech.filter(t=>!t||TECHS[t].tier<=CAMPAIGNS[id].maxTechTier).slice(0,limit)
    while(m.loadout.tech.length<limit)m.loadout.tech.push(null)
  }

  function selectCampaign(id){
    const c=CAMPAIGNS[id]
    if(c.requires && !meta.completedCampaigns.includes(c.requires)) return
    setSelectedCampaign(id)
    patchMeta(m=>{syncLoadoutForCampaign(m,id);return m})
  }
  function moveCampaign(dir){
    const nextIndex = currentCampaignIndex + dir
    if(nextIndex<0 || nextIndex>=campaignOrder.length) return
    const target=campaignOrder[nextIndex]
    const c=CAMPAIGNS[target]
    if(c.requires && !meta.completedCampaigns.includes(c.requires)) return
    selectCampaign(target)
  }

  function openPicker(type,index=null){setPicker({type,index})}
  function choosePicker(id){
    patchMeta(m=>{
      if(picker.type==='leader')m.loadout.leader=id
      if(picker.type==='general')m.loadout.general=id
      if(picker.type==='tech'){
        const arr=[...m.loadout.tech]
        if(id){for(let i=0;i<arr.length;i++)if(i!==picker.index&&arr[i]===id)arr[i]=null}
        arr[picker.index]=id;m.loadout.tech=arr
      }
      return m
    })
    setPicker(null)
  }

  function availableMusterUnits(){
    const tech=meta.loadout.tech.filter(Boolean), ids=['warrior','spear','slinger']
    for(const [id,u] of Object.entries(UNITS)) if(u.requires&&u.requires.every(t=>tech.includes(t))) ids.push(id)
    if(meta.loadout.general==='hannibal'&&(meta.characterLevels.hannibal||1)>=1) ids.push('warElephant')
    if(meta.loadout.general==='napoleon'&&(meta.characterLevels.napoleon||1)>=1) ids.push('imperialGuard')
    if(meta.loadout.leader==='cleopatra'&&(meta.characterLevels.cleopatra||1)>=5) ids.push('egyptianGuard')
    return unique(ids)
  }
  function openMuster(){setMuster(Array.from({length:startingCapacity},()=>null));setMusterOpen(true)}
  function pickDefaultForSlot(slot,id){setMuster(a=>a.map((x,i)=>i===slot?id:x))}
  function launchBattle(){
    if(muster.some(x=>!x)){notify('Select a unit for every starting army slot.');return}
    setMusterOpen(false)
    setBattle({campaignId:selectedCampaign,loadout:clone(meta.loadout),startingRoster:[...muster],startCapacity:startingCapacity})
    setScreen('battle')
  }

  function finishRun(info){
    patchMeta(m=>{
      m.gold+=info.gold||0;m.tp+=info.tp||0
      for(const id of (info.units||[])) if(UNITS[id]&&!m.discoveredUnits.includes(id)) m.discoveredUnits.push(id)
      const prev = m.campaignStats?.[info.campaign] || { best:0, stars:0 }
      m.campaignStats = { ...(m.campaignStats||{}), [info.campaign]: { best: Math.max(prev.best, info.bestReached||0), stars: Math.max(prev.stars, info.stars||0) } }
      if(info.victory){
        if(!m.completedCampaigns.includes(info.campaign))m.completedCampaigns.push(info.campaign)
        if(info.campaign==='dawn'&&!m.unlockedCampaigns.includes('firstcities'))m.unlockedCampaigns.push('firstcities')
      }
      return m
    })
    setBattle(null)
    setScreen('campaign')
    notify(info.victory?`Campaign cleared · ${info.stars||1}★ achieved.`:`Run banked · reached battle ${info.bestReached||0}.`)
  }

  function canBuyTech(id){const t=TECHS[id];return !meta.ownedTech.includes(id)&&t.prereq.every(x=>meta.ownedTech.includes(x))&&meta.tp>=t.cost}
  function buyTech(id){if(!canBuyTech(id))return;patchMeta(m=>{m.tp-=TECHS[id].cost;m.ownedTech.push(id);return m});notify(`${TECHS[id].name} unlocked.`)}
  function buyDevelopment(kind){
    patchMeta(m=>{
      if(kind==='techSlot'&&m.techSlots<6){const cost=[0,0,0,260,520,900][m.techSlots]||900;if(m.gold<cost)return m;m.gold-=cost;m.techSlots++;while(m.loadout.tech.length<m.techSlots)m.loadout.tech.push(null);notify('Technology slot expanded.')}
      if(kind==='hp'){const cost=180+m.hpRank*150;if(m.gold<cost)return m;m.gold-=cost;m.hpRank++;notify('Army conditioning improved.')}
      if(kind==='medicine'){const cost=220+m.fieldMedicine*180;if(m.gold<cost)return m;m.gold-=cost;m.fieldMedicine++;notify('Field medicine improved.')}
      return m
    })
  }

  function packPool(){
    const base=['elder','merchant','veteran','hunter','cleopatra','hannibal']
    if(meta.completedCampaigns.includes('firstcities'))base.push('napoleon')
    return base.filter(id=>PEOPLE[id])
  }
  function openPack(kind){
    const spec=kind==='great'?{cost:220,count:3,name:'Great Chronicle Pack'}:{cost:100,count:2,name:'Historical Pack'}
    const free=kind==='standard'&&meta.freePack>0
    if(!free&&meta.gold<spec.cost){notify('Not enough Gold.');return}
    patchMeta(m=>{if(free)m.freePack--;else m.gold-=spec.cost;return m})
    setPack({kind,...spec,stage:'sealed',results:[],bonus:0})
  }
  function revealPack(){
    const pool=packPool(), count=pack.count, results=[]
    for(let i=0;i<count;i++) results.push(weightedPick(pool))
    if(pack.kind==='great'&&!results.some(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity))){
      const hi=pool.filter(id=>['Rare','Epic','Legend'].includes(PEOPLE[id].rarity))
      if(hi.length)results[0]=hi[Math.floor(Math.random()*hi.length)]
    }
    const bonus=15+Math.floor(Math.random()*16)
    patchMeta(m=>{
      m.gold+=bonus
      for(const id of results){m.characterCopies[id]=(m.characterCopies[id]||0)+1;if(!m.characterLevels[id])m.characterLevels[id]=1;const sig=PEOPLE[id].signatureUnit;if(sig&&!m.discoveredUnits.includes(sig))m.discoveredUnits.push(sig)}
      return m
    })
    setPack(p=>({...p,stage:'revealed',results:results.map(id=>({id,isNew:!(meta.characterCopies[id]>0)})),bonus}))
  }

  function upgradePerson(id){
    const p=PEOPLE[id],level=meta.characterLevels[id]||1,max=RARITIES[p.rarity].maxLevel
    if(level>=max)return
    const need=COPY_THRESHOLDS[level],cost=GOLD_UPGRADE_COSTS[level]
    if((meta.characterCopies[id]||0)<need||meta.gold<cost)return
    patchMeta(m=>{m.gold-=cost;m.characterLevels[id]=level+1;const sig=p.signatureUnit;if(sig&&!m.discoveredUnits.includes(sig))m.discoveredUnits.push(sig);return m})
    notify(`${p.name} reached Level ${level+1}.`)
  }

  function resetAll(){setMeta(resetMeta());setSelectedCampaign('dawn');notify('Prototype save reset.')}

  if(screen==='battle'&&battle) return <Battle {...battle} meta={meta} onFinish={finishRun} />

  const campaignLocked = !!(campaign.requires && !meta.completedCampaigns.includes(campaign.requires))
  const canGoLeft = currentCampaignIndex>0
  const rightId = campaignOrder[currentCampaignIndex+1]
  const rightLocked = rightId ? !!(CAMPAIGNS[rightId].requires && !meta.completedCampaigns.includes(CAMPAIGNS[rightId].requires)) : true

  return <div className="app-shell">
    <header className="topbar"><img src={ASSETS.logo} className="main-logo" alt="March of Epochs"/><div className="resources"><span>◉ {meta.gold}</span><span>✦ {meta.tp}</span><span>People {ownedPeople.length}</span></div></header>

    <main>
      {screen==='campaign'&&<section className="screen-panel">
        <div className="hero-banner"><span>CAMPAIGN MAP</span><h1>{campaign.name}</h1><p>Move across campaigns with the arrows, strengthen your loadout, then begin the selected campaign from its own panel. Stars are permanent and can be improved on later replays.</p></div>
        <div className="content-pad">
          <div className="campaign-browser">
            <button className="campaign-nav-arrow" disabled={!canGoLeft} onClick={()=>moveCampaign(-1)}>‹</button>
            <div className={`campaign-showcase ${selectedCampaign}`}>
              <div className={`campaign-art ${selectedCampaign}`}><div className="campaign-art-title"><span>{campaign.era}</span><b>{campaign.boss}</b></div></div>
              <div className="campaign-showcase-body">
                <div className="campaign-meta-grid">
                  <div><span>Highest level reached</span><b>{currentCampaignStats.best}/15</b></div>
                  <div><span>Campaign stars</span><b>{currentCampaignStats.stars}/3</b></div>
                  <div><span>Technology cap</span><b>Tier {campaign.maxTechTier}</b></div>
                </div>
                <div className="campaign-stars-row">{stars(currentCampaignStats.stars).map((on,i)=><span key={i} className={on?'on':''}>★</span>)}</div>
                <div className="campaign-achievements">
                  <div className={currentCampaignStats.stars>=1?'done':''}><b>1★</b><span>Complete the campaign.</span></div>
                  <div className={currentCampaignStats.stars>=2?'done':''}><b>2★</b><span>Finish with at least 65% total army condition.</span></div>
                  <div className={currentCampaignStats.stars>=3?'done':''}><b>3★</b><span>Finish without losing a single squad.</span></div>
                </div>
                <p className="campaign-desc">{campaign.desc}</p>
                <div className="button-row compact-row">
                  <button className="primary big" disabled={campaignLocked} onClick={openMuster}>{campaignLocked?'Locked':'Muster Army & Begin'}</button>
                  <button onClick={resetAll}>Reset Prototype</button>
                </div>
              </div>
            </div>
            <button className="campaign-nav-arrow" disabled={!rightId||rightLocked} onClick={()=>moveCampaign(1)}>›</button>
          </div>

          <div className="section-head"><h3>Loadout</h3><span>{effectiveTechSlots} tech slots · starting army {startingCapacity}</span></div>
          <div className="loadout-grid">
            <button className="loadout-slot person" onClick={()=>openPicker('leader')}><span>LEADER</span><MiniCardArt id={meta.loadout.leader} meta={meta}/><b>{leader?.name}</b><small>Level {meta.characterLevels[meta.loadout.leader]||1}</small></button>
            <button className="loadout-slot person" onClick={()=>openPicker('general')}><span>GENERAL</span><MiniCardArt id={meta.loadout.general} meta={meta}/><b>{general?.name}</b><small>Level {meta.characterLevels[meta.loadout.general]||1}</small></button>
            {Array.from({length:effectiveTechSlots},(_,i)=>{const id=meta.loadout.tech[i];return <button key={i} className="loadout-slot tech" onClick={()=>openPicker('tech',i)}><span>TECH {i+1}</span><div className="tech-big">{id?TECHS[id].icon:'＋'}</div><b>{id?TECHS[id].name:'Empty'}</b><small>{id?TECHS[id].desc:'Choose technology'}</small></button>})}
          </div>
          <div className="run-summary"><div><b>Starting Army</b><span>{startingCapacity} squads</span></div><div><b>Campaign</b><span>{campaign.name}</span></div><div><b>Boss</b><span>{campaign.boss}</span></div></div>
        </div>
      </section>}

      {screen==='store'&&<section className="screen-panel"><div className="hero-banner"><span>PACKS ARE DISCOVERY. TECHNOLOGY IS INVESTMENT.</span><h1>Store</h1><p>Characters are discovered through packs. Technologies and development are the systems you intentionally build.</p></div><div className="content-pad"><div className="subtabs">{[['packs','Packs'],['technology','Technology'],['development','Development']].map(([id,n])=><button key={id} className={storeTab===id?'active':''} onClick={()=>setStoreTab(id)}>{n}</button>)}</div>
        {storeTab==='packs'&&<div className="pack-grid"><button className="pack-box" onClick={()=>openPack('standard')}><div className="pack-seal">ME</div><h3>Historical Pack</h3><p>2 random Leader/General cards + 15–30 Gold. Pool expands with campaign progress.</p><b>{meta.freePack>0?'FREE PACK AVAILABLE':'◉ 100 Gold'}</b></button><button className="pack-box great" onClick={()=>openPack('great')}><div className="pack-seal">★</div><h3>Great Chronicle Pack</h3><p>3 character cards + Gold. Guaranteed Rare+ when your unlocked pool contains one.</p><b>◉ 220 Gold</b></button><div className="store-note"><b>Hidden discovery</b><p>The Store never lists future historical people by name. Completing campaigns silently expands the eligible pool.</p></div></div>}
        {storeTab==='technology'&&<div className="tech-tree">{Object.values(TECHS).sort((a,b)=>a.tier-b.tier).map(t=><TechNode key={t.id} id={t.id} meta={meta} onBuy={buyTech}/>)}</div>}
        {storeTab==='development'&&<div className="development-grid"><button onClick={()=>buyDevelopment('techSlot')} disabled={meta.techSlots>=6}><strong>＋ TECH SLOT</strong><h3>{meta.techSlots}/6</h3><p>Add another foundational technology to future runs.</p><b>{meta.techSlots>=6?'MAX':`◉ ${[0,0,0,260,520,900][meta.techSlots]||900}`}</b></button><button onClick={()=>buyDevelopment('hp')}><strong>♥ ARMY CONDITIONING</strong><h3>Rank {meta.hpRank}</h3><p>Permanent +5% starting HP per rank.</p><b>◉ {180+meta.hpRank*150}</b></button><button onClick={()=>buyDevelopment('medicine')}><strong>✚ FIELD MEDICINE</strong><h3>Rank {meta.fieldMedicine}</h3><p>Recover more surviving HP between encounters.</p><b>◉ {220+meta.fieldMedicine*180}</b></button></div>}
      </div></section>}

      {screen==='collection'&&<section className="screen-panel"><div className="hero-banner"><span>THE CHRONICLE</span><h1>Collection</h1><p>Only discovered people appear here. Premium cards use integrated front/back art; other people remain simpler until we replace the whole roster.</p></div><div className="content-pad"><div className="subtabs">{[['people','People'],['technology','Technologies'],['units','Units']].map(([id,n])=><button key={id} className={collectionTab===id?'active':''} onClick={()=>setCollectionTab(id)}>{n}</button>)}</div>
        {collectionTab==='people'&&<><div className="collection-meta"><span>{ownedPeople.length} people discovered</span><span>Tap a card to inspect and flip it</span></div><div className="people-grid">{ownedPeople.map(id=><div key={id} className="collection-person" onClick={()=>setDetailPerson(id)}><MiniCardArt id={id} meta={meta}/><div className="collection-person-meta"><b>{PEOPLE[id].name}</b><span>Lv {meta.characterLevels[id]||1} · {meta.characterCopies[id]||0} cards</span></div></div>)}</div></>}
        {collectionTab==='technology'&&<div className="tech-tree collection">{Object.values(TECHS).map(t=><TechNode key={t.id} id={t.id} meta={meta} onBuy={buyTech}/>)}</div>}
        {collectionTab==='units'&&<div className="units-grid">{unique(meta.discoveredUnits.concat(ownedPeople.map(id=>PEOPLE[id].signatureUnit).filter(Boolean))).filter(id=>UNITS[id]).map(id=><UnitCard key={id} id={id}/>)}</div>}
      </div></section>}
    </main>

    <nav className="bottom-nav">{[['campaign','⚔ Campaign'],['store','◉ Store'],['collection','▦ Collection']].map(([id,n])=><button key={id} className={screen===id?'active':''} onClick={()=>setScreen(id)}>{n}</button>)}</nav>

    <Modal open={!!picker&&picker.type!=='muster'} onClose={()=>setPicker(null)} title={picker?.type==='tech'?'Choose Technology':picker?.type==='leader'?'Choose Leader':'Choose General'} wide>
      {picker?.type==='leader'&&<div className="picker-people">{ownedLeaders.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='general'&&<div className="picker-people">{ownedGenerals.map(id=><PersonThumb key={id} id={id} meta={meta} onClick={()=>choosePicker(id)}/>)}</div>}
      {picker?.type==='tech'&&<div className="tech-picker">{meta.ownedTech.filter(id=>TECHS[id].tier<=campaign.maxTechTier).map(id=><button key={id} onClick={()=>choosePicker(id)}><span>{TECHS[id].icon}</span><b>{TECHS[id].name}</b><small>{TECHS[id].desc}</small></button>)}<button onClick={()=>choosePicker(null)}><span>∅</span><b>Empty slot</b><small>Run with fewer foundational technologies.</small></button></div>}
    </Modal>

    <Modal open={musterOpen} onClose={()=>setMusterOpen(false)} title={`Muster starting army · ${startingCapacity} squads`} wide>
      <div className="muster-columns">
        <div>
          <h3>Starting slots</h3>
          <div className="muster-slot-grid">{muster.map((id,i)=><button key={i} className={`muster-slot-card ${id?'filled':''}`} onClick={()=>setPicker({type:'muster',index:i})}><span>Slot {i+1}</span>{id?<><UnitCard id={id} compact/><small>Tap to change army</small></>:<div className="muster-empty"><b>＋</b><small>Select army</small></div>}</button>)}</div>
        </div>
        <div>
          <h3>Available armies</h3>
          <div className="muster-pool-list">{availableMusterUnits().map(id=><div key={id} className="muster-pool-item"><div className="mini-unit-glyph">{ASSETS.units?.[id]?<img src={ASSETS.units[id]} alt={UNITS[id].name}/>:unitIcon(UNITS[id])}</div><div><b>{UNITS[id].name}</b><span>{UNITS[id].role}</span></div></div>)}</div>
          <p className="micro-copy">Your starting armies come from your selected technologies, your general's signature unit, and special leader unlocks. Click an empty slot to pick one.</p>
          <button className="primary big" onClick={launchBattle}>March to Campaign</button>
        </div>
      </div>
    </Modal>

    <Modal open={picker?.type==='muster'} onClose={()=>setPicker(null)} title={`Choose unit for slot ${(picker?.index??0)+1}`} wide><div className="units-grid picker">{availableMusterUnits().map(id=><button key={id} className="unit-pick" onClick={()=>{pickDefaultForSlot(picker.index,id);setPicker(null)}}><UnitCard id={id}/></button>)}</div></Modal>

    <Modal open={!!detailPerson} onClose={()=>setDetailPerson(null)} title={detailPerson?PEOPLE[detailPerson].name:''} wide>{detailPerson&&<div className="person-detail-layout"><CardFlip id={detailPerson} meta={meta} onUpgrade={upgradePerson}/><div className="person-details"><h3>{PEOPLE[detailPerson].rarity} {PEOPLE[detailPerson].type}</h3><p>{PEOPLE[detailPerson].bio}</p><h4>Gameplay level path</h4><ol>{PEOPLE[detailPerson].levels.slice(0,RARITIES[PEOPLE[detailPerson].rarity].maxLevel).map((x,i)=><li key={i} className={i<(meta.characterLevels[detailPerson]||1)?'active':''}>{x}</li>)}</ol>{PEOPLE[detailPerson].signatureUnit&&<div className="signature-callout"><b>Signature unit</b><span>{UNITS[PEOPLE[detailPerson].signatureUnit]?.name}</span></div>}<small className="micro-copy">Front/back card art is presentation. The text on this page is the authoritative gameplay version.</small></div></div>}</Modal>

    <Modal open={!!pack} onClose={()=>setPack(null)} title={pack?.name||'Historical Pack'} wide>{pack&&pack.stage==='sealed'?<div className="sealed-pack" onClick={revealPack}><img src={ASSETS.logo}/><div className="wax-seal">ME</div><h3>Tap to open</h3><p>Characters remain hidden until the cards turn over.</p></div>:pack&&<div><div className="pack-results slim">{pack.results.map((result,i)=>{const id=result.id;return <div key={`${id}-${i}`} className="pack-result" style={{animationDelay:`${i*.14}s`}}><MiniCardArt id={id} meta={meta}/><b>{PEOPLE[id].name}</b><span>{result.isNew?'NEW DISCOVERY':'DUPLICATE'}</span></div>})}</div><div className="pack-bonus">＋ ◉ {pack.bonus} Gold</div><button className="primary big" onClick={()=>setPack(null)}>Add to Collection</button></div>}</Modal>

    {toast&&<div className="toast">{toast}</div>}
  </div>
}
