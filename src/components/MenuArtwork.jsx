import { ASSETS } from '../assets'
import leatherLamellar from '../assets/artifacts_age1/leatherLamellar.png'
import boneCharm from '../assets/artifacts_age1/boneCharm.png'
import bronzeArmor from '../assets/artifacts_age1/bronzeArmor.png'
import bronzeEdges from '../assets/artifacts_age1/bronzeEdges.png'
import spearheads from '../assets/artifacts_age1/spearheads.png'
import slingPouch from '../assets/artifacts_age1/slingPouch.png'

const artifactArt={leatherLamellar,boneCharm,bronzeArmor,bronzeEdges,spearheads,slingPouch,spearShaft:spearheads}

// These cutouts keep baked-in card labels and neighbouring atlas cards out of menus.
export function ArtifactArtwork({id,name=''}){
  const atlas=['stoneAxeGrip','edgedProjectiles'].includes(id),src=atlas?ASSETS.artifactCards[id]:artifactArt[id]||ASSETS.items?.[id]
  return <div className={`menu-artifact-art ${atlas?'atlas':artifactArt[id]?'cutout':''}`} data-artifact={id}>{src?<img src={src} alt={name}/>:<span aria-hidden="true">✦</span>}</div>
}
