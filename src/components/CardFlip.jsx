import {peopleUpgradeCost} from '../game/progression.js'
import { useState } from 'react'
import { ASSETS } from '../assets'
import { PEOPLE, UNITS, COPY_THRESHOLDS, GOLD_UPGRADE_COSTS, RARITIES } from '../data'

function stars(level,maxLevel){
  return '★'.repeat(level) + '☆'.repeat(Math.max(0,maxLevel-level))
}

export default function CardFlip({ id, meta, onUpgrade, compact=false, menu=false }){
  const [flipped,setFlipped] = useState(false)
  const p = PEOPLE[id]
  if(!p) return null
  const art = ASSETS.people[id]
  const level = meta.characterLevels[id] || 1
  const copies = meta.characterCopies[id] || 0
  const maxLevel = RARITIES[p.rarity].maxLevel
  const nextCopies = level < maxLevel ? COPY_THRESHOLDS[level] : null
  const nextGold = level < maxLevel ? peopleUpgradeCost(id,level) : null
  const canUpgrade = nextCopies && copies >= nextCopies && meta.gold >= nextGold

  if(menu)return <article className="person-profile" style={{'--rarity':RARITIES[p.rarity].color}}>
    <div className="person-profile-art">{art?<img src={art.mini||art.front} alt={p.name}/>:<span>{p.icon}</span>}<span className="profile-rarity">{p.rarity} · {p.type}</span></div>
    <div className="profile-progress"><b>Level {level} / {maxLevel}</b><span aria-label={`${level} of ${maxLevel} stars`}>{stars(level,maxLevel)}</span><small>{level<maxLevel?`${copies} / ${nextCopies} copies for next level`:'Maximum level reached'}</small></div>
    {level<maxLevel&&<button className="primary" disabled={!canUpgrade} onClick={()=>onUpgrade?.(id)}>Upgrade · {nextGold} Gold</button>}
    <p>{p.bio}</p><h3>Abilities</h3><ol className="profile-abilities">{p.levels.slice(0,maxLevel).map((ability,i)=><li key={i} className={i<level?'active':''}><b>Level {i+1}{i<level?' · Active':''}</b><span>{ability}</span></li>)}</ol>
    {p.signatureUnit&&!UNITS[p.signatureUnit]?.contentPending&&<div className="signature-callout"><b>Signature army</b><span>{UNITS[p.signatureUnit]?.name}</span></div>}
  </article>

  if(art?.front){
    return <div className={`premium-flip age1-card ${compact?'compact':''}`} style={{'--rarity':RARITIES[p.rarity].color}}>
      <div className={`premium-flip-inner ${flipped?'flipped':''}`} onClick={()=>setFlipped(v=>!v)}>
        <div className={`premium-face premium-front ${art.dynamic?'dynamic-person-front':'has-image'}`}>
          {art.dynamic?<><div className="dynamic-front-portrait"><img src={art.mini||art.front} alt={p.name}/></div><div className="dynamic-front-meta"><b>{p.name}</b><span>{p.type}</span><small>{p.rarity}</small></div></>:<img src={art.front} alt={`${p.name} card front`} />}
          <div className="premium-hud premium-hud-left"><span>{stars(level,maxLevel)}</span></div>
          <div className="premium-hud premium-hud-right"><b>{copies}/{nextCopies||copies}</b></div>
        </div>
        <div className={`premium-face premium-back ${art.back?'has-image':'dynamic-person-back'}`}>
          {art.back?<img src={art.back} alt={`${p.name} card back`} />:<>
            <div className="dynamic-back-portrait">{art.mini?<img src={art.mini} alt=""/>:<span>{p.icon}</span>}</div>
            <div className="dynamic-back-heading"><b>{p.name}</b><span>{p.rarity} · {p.type}</span></div>
            <p>{p.bio}</p>
            <div className="dynamic-level-list">{p.levels.slice(0,maxLevel).map((x,i)=><div key={i} className={i<level?'active':''}><b>Lv {i+1}</b><span>{x}</span></div>)}</div>
          </>}
          <div className="premium-hud premium-hud-left"><span>{stars(level,maxLevel)}</span></div>
          <div className="premium-hud premium-hud-right"><b>{copies}/{nextCopies||copies}</b></div>
        </div>
      </div>
      {!compact && <div className="premium-controls">
        <button onClick={()=>setFlipped(v=>!v)}>{flipped?'Show front':'Flip card'}</button>
        <div className="premium-progress"><b>Level {level}/{maxLevel}</b><span>{copies} cards{nextCopies?` · next ${nextCopies}`:' · maxed'}</span></div>
        {level < maxLevel && <button disabled={!canUpgrade} className={canUpgrade?'upgrade-ready':''} onClick={()=>onUpgrade?.(id)}>
          Upgrade · {nextGold} Gold
        </button>}
      </div>}
    </div>
  }

  return <div className={`generic-person-card ${compact?'compact':''}`} style={{'--rarity':RARITIES[p.rarity].color}}>
    <div className="generic-emblem">{p.icon}</div>
    <div className="generic-title">{p.name}</div>
    <div className="generic-sub">{p.rarity} · {p.type}</div>
    <div className="generic-stars">{stars(level,maxLevel)}</div>
    {!compact && <>
      <p>{p.bio}</p>
      <div className="level-list">{p.levels.slice(0,maxLevel).map((x,i)=><div key={i} className={i<level?'active':''}><b>{i+1}</b><span>{x}</span></div>)}</div>
      <div className="premium-controls"><div className="premium-progress"><b>{copies} cards</b><span>{nextCopies?`next ${nextCopies}`:'maxed'}</span></div>{level<maxLevel&&<button disabled={!canUpgrade} onClick={()=>onUpgrade?.(id)}>Upgrade · {nextGold} Gold</button>}</div>
    </>}
  </div>
}
