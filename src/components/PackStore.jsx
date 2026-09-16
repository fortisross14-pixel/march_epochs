import {ASSETS} from '../assets'
import {packSpec} from '../game/progression.js'

const packs = {
  artifact:[
    {kind:'basic', name:'Supply Artifact Pack', description:'1 random early Army Artifact.', chest:'chestBronze'},
    {kind:'advanced', name:'Advanced Artifact Pack', description:'2 useful Army Artifacts at a bundle price.', chest:'chestPurple'},
  ],
  people:[
    {kind:'standard', name:'Historical Pack', description:'2 random Leader/General cards + a small Gold return.', chest:'chestBlue'},
    {kind:'great', name:'Great Chronicle', description:'3 People cards, including at least one Rare or better.', chest:'chestGold'},
  ],
}
export default function PackStore({type, meta, onOpen}) {
  return <div className="pack-store" aria-label={type==='people'?'People store':'Artifact store'}>
    <div className="section-head"><h3>{type==='people'?'People Store':'Artifact Store'}</h3><span>Spend earned Gold</span></div>
    <div className="pack-grid mobile-packs">{packs[type].map((pack,index)=>{
      const spec=packSpec(meta,pack.kind,type), shortfall=Math.max(0,spec.cost-meta.gold)
      return <button key={pack.kind} className={`pack-box ${type==='artifact'?'artifact-pack':''} ${index?'great':''}`} disabled={shortfall>0||!spec.pool.length} onClick={()=>onOpen(pack.kind,type)}>
        <img className="pack-chest-art" src={ASSETS.ui[pack.chest]} alt=""/><h3>{pack.name}</h3><p>{pack.description}</p><b>{spec.cost} Gold</b>
        {shortfall>0&&<small className="feedback-note">Need {shortfall} more Gold</small>}
      </button>
    })}</div>
  </div>
}
