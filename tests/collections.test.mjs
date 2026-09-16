import test from 'node:test'
import assert from 'node:assert/strict'
import {ITEMS,PEOPLE} from '../src/data.js'
import {collectionAge,collectionAges,selectCollection} from '../src/collections.js'

test('all current People and artifacts have a canonical collection age',()=>{
  for(const [kind,catalog] of [['people',PEOPLE],['artifacts',ITEMS]])for(const item of Object.values(catalog)){
    assert.ok(collectionAges.some(age=>age.id===collectionAge(item,kind)),`${kind}: ${item.id}`)
  }
})
test('People filters combine age and rarity without changing source order',()=>{
  const people=Object.values(PEOPLE),original=[...people]
  assert.deepEqual(selectCollection(people,{kind:'people',age:'bronzeIron',rarity:'Epic',sort:'name'}).map(p=>p.id),['cyrus','thutmose'])
  assert.deepEqual(people,original)
  assert.equal(selectCollection(people,{kind:'people',age:'modernAge'}).length,0)
})
test('level ordering handles untrained entries, and historical age is independent of availability',()=>{
  const items=Object.values(ITEMS)
  assert.equal(selectCollection(items,{kind:'artifacts',sort:'level-desc',levels:{boneCharm:5}})[0].id,'boneCharm')
  assert.equal(selectCollection(items,{kind:'artifacts',sort:'age-desc'})[0].id,'bicorne')
  assert.equal(collectionAge(ITEMS.bronzeArmor,'artifacts'),'bronzeIron')
  assert.equal(selectCollection(Object.values(PEOPLE),{kind:'people',sort:'rarity-desc'})[0].rarity,'Legend')
})
test('future content can declare age directly without editing the legacy mapping',()=>{
  const future={id:'new-general',name:'New General',ageId:'modernAge',rarity:'Rare'}
  assert.deepEqual(selectCollection([future],{kind:'people',age:'modernAge'}),[future])
})
