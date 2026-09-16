import {RARITIES} from '../data.js'
import {collectionAges, ageLabel} from '../collections.js'

export default function CollectionControls({kind, value, onChange}) {
  const label = kind === 'people' ? 'People' : 'Artifact'
  const update = (key, next) => onChange({...value, [key]:next})
  return <div className="collection-controls" aria-label={`${label} collection controls`}>
    <label>Age<select aria-label={`${label} age`} value={value.age} onChange={e=>update('age',e.target.value)}>
      <option value="all">All ages</option>{collectionAges.map(age=><option key={age.id} value={age.id}>{ageLabel(age.id)}</option>)}
    </select></label>
    {kind === 'people' && <label>Rarity<select aria-label="People rarity" value={value.rarity} onChange={e=>update('rarity',e.target.value)}>
      <option value="all">All rarities</option>{Object.keys(RARITIES).map(rarity=><option key={rarity}>{rarity}</option>)}
    </select></label>}
    <label>Sort<select aria-label={`${label} sort`} value={value.sort} onChange={e=>update('sort',e.target.value)}>
      <option value="rarity-desc">Rarity: highest first</option><option value="rarity-asc">Rarity: lowest first</option>
      <option value="age-asc">Age: earliest first</option><option value="age-desc">Age: latest first</option>
      <option value="level-desc">Level: highest first</option><option value="level-asc">Level: lowest first</option><option value="name">Name</option>
    </select></label>
  </div>
}
