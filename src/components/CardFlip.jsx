import { useState } from 'react'
import { ASSETS } from '../assets'
import { PEOPLE, COPY_THRESHOLDS, GOLD_UPGRADE_COSTS, RARITIES } from '../data'

export default function CardFlip({ id, meta, onUpgrade, compact=false }){
  const [flipped,setFlipped] = useState(false)
  const p = PEOPLE[id]
  if(!p) return null
  const art = ASSETS.people[id]
  const level = meta.characterLevels[id] || 1
  const copies = meta.characterCopies[id] || 0
  const maxLevel = RARITIES[p.rarity].maxLevel
  const nextCopies = level < maxLevel ? COPY_THRESHOLDS[level] : null
  const nextGold = level < maxLevel ? GOLD_UPGRADE_COSTS[level] : null
  const canUpgrade = nextCopies && copies >= nextCopies && meta.gold >= nextGold

  if(art){
    return <div className={`premium-flip ${compact?'compact':''}`}>
      <div className={`premium-flip-inner ${flipped?'flipped':''}`} onClick={()=>setFlipped(v=>!v)}>
        <div className="premium-face premium-front"><img src={art.front} alt={`${p.name} card front`} /><div className="dynamic-card-hud"><span>{'★'.repeat(level)}{'☆'.repeat(Math.max(0,maxLevel-level))}</span><b>{copies}/{nextCopies||copies}</b></div></div>
        <div className="premium-face premium-back"><img src={art.back} alt={`${p.name} card back`} /><div className="dynamic-card-hud"><span>{'★'.repeat(level)}{'☆'.repeat(Math.max(0,maxLevel-level))}</span><b>{copies}/{nextCopies||copies}</b></div></div>
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
    <div className="generic-stars">{'★'.repeat(level)}{'☆'.repeat(Math.max(0,maxLevel-level))}</div>
    {!compact && <>
      <p>{p.bio}</p>
      <div className="level-list">{p.levels.slice(0,maxLevel).map((x,i)=><div key={i} className={i<level?'active':''}><b>{i+1}</b><span>{x}</span></div>)}</div>
      <div className="premium-controls"><div className="premium-progress"><b>{copies} cards</b><span>{nextCopies?`next ${nextCopies}`:'maxed'}</span></div>{level<maxLevel&&<button disabled={!canUpgrade} onClick={()=>onUpgrade?.(id)}>Upgrade · {nextGold} Gold</button>}</div>
    </>}
  </div>
}
