import {ASSETS} from '../assets'
import atlas from '../assets/ages/origins/technology/icons.png'
import manifest from '../assets/ages/origins/technology/manifest.json'
import {useId} from 'react'

// Fixed illustration cells, not cropped screenshots of framed cards.
export default function TechnologyArtwork({id}) {
  const cell=manifest.ids.indexOf(id)
  const clip=useId().replaceAll(':',''),x=cell%manifest.columns,y=Math.floor(cell/manifest.columns)
  return <div className="tech-icon art technology-thumbnail" aria-hidden="true">
    {cell>=0?<svg viewBox={`${cell%manifest.columns} ${Math.floor(cell/manifest.columns)} 1 1`} focusable="false">
      <defs><clipPath id={clip}><rect x={x} y={y} width="1" height="1"/></clipPath></defs>
      <image href={atlas} width={manifest.columns} height={manifest.rows} clipPath={`url(#${clip})`}/>
    </svg>:<img src={ASSETS.tech[id]} alt=""/>}
  </div>
}
