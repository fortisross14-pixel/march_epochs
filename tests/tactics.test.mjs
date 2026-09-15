import test from 'node:test'
import assert from 'node:assert/strict'
import {START_META,AGE1_REWARDS,UNITS,itemEffectAtLevel,unitStatsAtLevel} from '../src/data.js'
import {createRun,rewardOptions,applyReward} from '../src/game/battleRules.js'
import {createEncounter,stepEncounter,simSide,setFocusTarget,terrainFor,blockedGroundPoint,unitStats,W,H,DEPLOY_TOP} from '../src/game/combat.js'
import {rng,simulateRun} from '../scripts/balance.mjs'
import {equippedMeta} from '../scripts/tactics-balance.mjs'

const runFor=(types=['archer'])=>createRun(structuredClone(START_META),'dawn',START_META.loadout,types,types.length,types)
const encounter=(run,types=['warrior'],terrain={})=>createEncounter(run,{types,mult:1,terrain},undefined,rng(1))

test('all Age I ranged types fire across water without approaching or crossing',()=>{
  for(const type of ['slinger','archer','hunterBand']){
    const run=runFor([type]),b=encounter(run,['warrior'],{river:true,bridges:[2]}),archer=b.player[0],enemy=b.enemy[0]
    Object.assign(archer,{x:120,y:DEPLOY_TOP+25,cool:0});Object.assign(enemy,{x:120,y:330})
    const origin={x:archer.x,y:archer.y}
    for(let i=0;i<125;i++){b.time+=.04;simSide(b.player,b.enemy,.04,b,run);simSide(b.enemy,b.player,.04,b,run);assert.equal(blockedGroundPoint(enemy.x,enemy.y,b.terrain),false)}
    assert.ok(enemy.hp<enemy.maxHp,type);assert.deepEqual({x:archer.x,y:archer.y},origin,type)
    assert.equal(archer.hp,archer.maxHp,'melee must take the bridge before it can hurt the shooter')
    // Stop shooting and let the melee unit complete its route; it must not get stuck.
    while(b.time<30&&archer.hp===archer.maxHp){b.time+=.04;simSide(b.enemy,b.player,.04,b,run);assert.equal(blockedGroundPoint(enemy.x,enemy.y,b.terrain),false)}
    assert.ok(archer.hp<archer.maxHp,'melee eventually crosses the bridge and reaches the shooter')
  }
})

test('ranged AI shoots a clear target instead of chasing a closer enemy behind a cliff',()=>{
  const run=runFor(),b=encounter(run,['warrior','warrior']),archer=b.player[0],[hidden,clear]=b.enemy
  Object.assign(archer,{x:100,y:600,cool:0});Object.assign(hidden,{x:100,y:450});Object.assign(clear,{x:320,y:600})
  b.terrain.mountains=[{x:75,y:500,w:50,h:45}]
  simSide(b.player,b.enemy,.04,b,run)
  assert.equal(hidden.hp,hidden.maxHp);assert.ok(clear.hp<clear.maxHp);assert.equal(archer.y,600)
  clear.dead=true;archer.cool=0;simSide(b.player,b.enemy,.04,b,run)
  assert.equal(hidden.hp,hidden.maxHp,'cliffs still block fire')
})

test('Focus lasts beyond four seconds, can be replaced immediately, and clears on death',()=>{
  const run=runFor(),b=encounter(run,['warrior','warrior']),archer=b.player[0],[near,marked]=b.enemy
  Object.assign(archer,{x:100,y:600,cool:0});Object.assign(near,{x:100,y:560});Object.assign(marked,{x:100,y:400})
  assert.equal(setFocusTarget(b,marked.id),true);b.time=30
  simSide(b.player,b.enemy,.04,b,run)
  assert.ok(marked.hp<marked.maxHp);assert.equal(near.hp,near.maxHp)
  assert.equal(setFocusTarget(b,near.id),true);archer.cool=0;simSide(b.player,b.enemy,.04,b,run);assert.ok(near.hp<near.maxHp)
  assert.equal(setFocusTarget(b,'missing'),false);assert.equal(b.focusTarget,near.id)
  near.dead=true;stepEncounter(b,run,{},0,.04);assert.equal(b.focusTarget,null)
  assert.equal(createEncounter(run,{types:['warrior'],mult:1}).focusTarget,null)
})

test('reinforcement is always offered to wounded survivors and restores exactly the selected squad',()=>{
  const run=runFor(['warrior','warrior','archer']);run.roster[0].hpFrac=.3;run.roster[1].hpFrac=.6
  for(let seed=1;seed<=20;seed++)assert.ok(rewardOptions(run,rng(seed)).some(c=>c.kind==='reinforce'))
  const restored=applyReward(run,{kind:'reinforce',uid:run.roster[1].uid})
  assert.deepEqual(restored.roster.map(r=>r.hpFrac),[.3,1,1]);assert.equal(run.roster[1].hpFrac,.6)
  assert.deepEqual(restored.upgrades,run.upgrades);assert.equal(restored.roster.length,3)
  assert.deepEqual(applyReward(run,{kind:'reinforce',uid:'fallen'}).roster,run.roster)
  assert.ok(!rewardOptions(run,rng(1),true).some(c=>c.kind==='reinforce'),'expansion recruitment remains a unit choice')
  assert.ok(!rewardOptions(runFor(),rng(1)).some(c=>c.kind==='reinforce'),'full-health armies do not get a wasted reward')
})

test('training, Sargon, artifacts, and victory bonuses multiply together',()=>{
  const meta=equippedMeta(4),run=createRun(meta,'dawn',meta.loadout,['spear'],1,['spear'])
  const stats=unitStatsAtLevel('spear',4),gear=itemEffectAtLevel('spearheads',1)
  const boosted=applyReward(run,{kind:'upgrade',...AGE1_REWARDS.find(r=>r.id==='damage')})
  assert.ok(Math.abs(unitStats('spear',boosted).damage-stats.damage*1.12*gear.damageMult*1.12)<.00001)
  assert.ok(unitStats('spear',boosted).damage>UNITS.spear.damage*1.7)
  assert.ok(unitStats('spear',boosted).health>UNITS.spear.health*1.5)
})

test('battlefield and terrain expand together and deployment remains south of the river',()=>{
  const terrain=terrainFor({terrain:{river:true,bridges:[2],mountains:[{x:100,y:200,w:50,h:80}]}})
  assert.equal(W,572);assert.equal(H,836);assert.ok(DEPLOY_TOP>terrain.riverY[1])
  assert.ok(Math.abs(terrain.mountains[0].w-55)<.00001)
  for(const e of encounter(runFor(['warrior','archer'])).player)assert.ok(e.x>0&&e.x<W&&e.y>DEPLOY_TOP&&e.y<H)
})

test('equipped level 4–5 armies with Sargon reach late Age I with few losses',()=>{
  for(const level of [4,5])for(const seed of [1,2,3]){
    const result=simulateRun(equippedMeta(level),'skilled',rng(seed))
    assert.ok(result.cleared>=13,`level ${level}, seed ${seed}: ${result.cleared}`)
    assert.ok(result.battles.filter(b=>b.battle<=13).reduce((n,b)=>n+b.losses,0)<=1)
  }
})
