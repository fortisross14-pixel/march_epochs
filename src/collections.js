import {AGES, RARITIES} from './data.js'

export const collectionAges = Object.values(AGES)
export const ageLabel = id => {
  const index = collectionAges.findIndex(age => age.id === id)
  return index < 0 ? 'Unassigned age' : `Age ${index + 1} · ${collectionAges[index].name}`
}

// Presentation metadata: historical collection age, independent of pack availability.
const peopleAges = {
  elder:'origins', merchant:'origins', veteran:'origins', hunter:'origins', narmer:'origins', sargon:'origins',
  thutmose:'bronzeIron', ramesses:'bronzeIron', cyrus:'bronzeIron',
  cleopatra:'classical', hannibal:'classical', napoleon:'revolution',
}
const artifactAges = {
  leatherLamellar:'origins', stoneAxeGrip:'origins', boneCharm:'origins', slingPouch:'origins', spearShaft:'origins', edgedProjectiles:'origins',
  bronzeArmor:'bronzeIron', bronzeEdges:'bronzeIron', spearheads:'bronzeIron',
  warStandard:'classical', ptolemaicCoin:'classical', bicorne:'revolution',
}
export const collectionAge = (item, kind) => item.ageId || (kind === 'people' ? peopleAges : artifactAges)[item.id]

export function selectCollection(items, {kind, age='all', rarity='all', sort='rarity-desc', levels={}}) {
  const rarityRank = value => Object.keys(RARITIES).indexOf(value)
  const ageRank = item => {
    const index = collectionAges.findIndex(age => age.id === collectionAge(item, kind))
    return index < 0 ? collectionAges.length : index
  }
  return items.filter(item => (age === 'all' || collectionAge(item, kind) === age) && (rarity === 'all' || item.rarity === rarity))
    .sort((a, b) => {
      const byName = a.name.localeCompare(b.name)
      switch (sort) {
        case 'age-asc': return ageRank(a) - ageRank(b) || byName
        case 'age-desc': return ageRank(b) - ageRank(a) || byName
        case 'level-desc': return (levels[b.id] || 1) - (levels[a.id] || 1) || byName
        case 'level-asc': return (levels[a.id] || 1) - (levels[b.id] || 1) || byName
        case 'rarity-asc': return rarityRank(a.rarity) - rarityRank(b.rarity) || byName
        case 'name': return byName
        default: return rarityRank(b.rarity) - rarityRank(a.rarity) || byName
      }
    })
}
