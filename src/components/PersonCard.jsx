import {useState} from 'react'
import frame from '../assets/ui-kit/cards/person-frame.png'
import {ASSETS} from '../assets'
import {PEOPLE,RARITIES,COPY_THRESHOLDS} from '../data'

const palettes={Common:['#f4f0df','#9ca9b3','#344651'],Uncommon:['#d0f6b2','#50aa75','#174a36'],Rare:['#cff2ff','#428fe5','#173d76'],Epic:['#f0d8ff','#a66ee5','#4c246f'],Legend:['#fff0a6','#e4ad42','#74501c']}

export default function PersonCard({id,meta,reveal=false}){
  const [imageReady,setImageReady]=useState(false),[frameReady,setFrameReady]=useState(false)
  const person=PEOPLE[id],[light,metal,dark]=palettes[person.rarity]
  const level=meta.characterLevels[id]||1,max=RARITIES[person.rarity].maxLevel,copies=meta.characterCopies[id]||0
  const art=ASSETS.people[id],ability=person.levels[Math.min(level-1,person.levels.length-1)]
  return <article className={`collectible-card rarity-${person.rarity.toLowerCase()} ${reveal?(imageReady&&frameReady?'card-unveiled':'card-awaiting-art'):''}`} style={{'--card-light':light,'--card-metal':metal,'--card-dark':dark}} aria-label={`${person.name}, ${person.rarity}, level ${level}`}>
    <div className="collectible-art"><img src={art.mini||art.front} alt={person.name} onLoad={()=>setImageReady(true)}/></div>
    <div className="collectible-frame" style={{'--frame-art':`url(${frame})`}} aria-hidden="true"><img src={frame} alt="" onLoad={()=>setFrameReady(true)}/></div>
    <svg className="collectible-crest" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {person.type==='general'?<g stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 31L29 6L29 16L15 33Z M10 6L30 31M8 24L18 34M23 34L33 24"/></g>:<g fill="currentColor"><path d="M5 12L13 20L20 5L27 20L35 12L31 31H9Z"/><path d="M9 34H31" stroke="currentColor" strokeWidth="2"/></g>}
    </svg>
    <div className="collectible-stars" aria-label={`${level} of ${max} stars`}>{'★'.repeat(level)}<span>{'☆'.repeat(max-level)}</span></div>
    <span className="collectible-copies">{copies}/{level<max?COPY_THRESHOLDS[level]:copies}</span>
    <div className="collectible-name"><h2>{person.name}</h2><span>{person.type}</span></div>
    <div className="collectible-power"><small>LEVEL {level} · {person.archetype}</small><p>{ability}</p></div>
    <span className="collectible-rarity">{person.rarity}</span>
    <div className="collectible-shine" aria-hidden="true"/>
  </article>
}
