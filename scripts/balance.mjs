// Headless pilots use the production combat, rewards, equipment and settlement rules.
// A pilot is a reproducible heuristic, not a claim about measured human skill.
import fs from 'node:fs'
import {pathToFileURL} from 'node:url'
import {START_META,CAMPAIGNS,UNITS,TECHS,ITEMS,ACHIEVEMENTS,unitLevelCost,UNIT_LEVEL_MAX} from '../src/data.js'
import {createEncounter,stepEncounter,formationPositions,FIELD_SCALE,setFocusTarget} from '../src/game/combat.js'
import {createRun,reinforcementHeal,battleIncome,objectiveResult,recoverRoster,rewardOptions,applyReward} from '../src/game/battleRules.js'
import {claimAchievement,trainUnit,researchTech,unitAvailable,startingCapacity,reconcileUnits,canResearch,settleRun,artifactSupply,supplyPrice,equipArtifact,packSpec,drawPack,addPackRewards,evolveArtifact,upgradePerson} from '../src/game/progression.js'
export const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
export function claimAll(meta){for(const id of Object.keys(ACHIEVEMENTS))claimAchievement(meta,id)}
export function fight(run,stage,index,policy,random){
  const positions=formationPositions(run.roster.length)
  if(policy==='skilled')positions.forEach((p,j)=>{p.y=(UNITS[run.roster[j].type].range?625:525)*FIELD_SCALE;p.x=(210+(j%3)*46)*FIELD_SCALE})
  const b=createEncounter(run,stage,positions,random);let kills=0
  while(!b.done&&b.time<240){
    if(b.meter>=100){const e=b.player.filter(e=>!e.dead&&e.hp/e.maxHp<(policy==='inefficient'?.4:.8)).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(e){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*reinforcementHeal(run));b.meter=0}}
    if(policy==='skilled'&&!b.focusTarget){const foes=b.enemy.filter(e=>!e.dead),front=b.player.filter(e=>!e.dead);foes.sort((a,c)=>Math.min(...front.map(p=>Math.hypot(p.x-a.x,p.y-a.y)))-Math.min(...front.map(p=>Math.hypot(p.x-c.x,p.y-c.y))));setFocusTarget(b,foes[0]?.id)}
    stepEncounter(b,run,stage,index,.04,()=>kills++)
  }
  return{b,kills}
}
function rosterFor(meta,policy){const eligible=meta.discoveredUnits.filter(id=>unitAvailable(meta,id)),cap=startingCapacity(meta),front=eligible.includes('cavalry')?'cavalry':eligible.includes('spear')?'spear':'warrior',back=eligible.includes('archer')?'archer':eligible.includes('hunterBand')?'hunterBand':'slinger';return{eligible,cap,roster:Array.from({length:cap},(_,i)=>i%2?back:front)}}
export function simulateRun(meta,policy='average',random=rng(1),startingRoster=null){
  const {eligible,cap,roster:defaultRoster}=rosterFor(meta,policy),roster=startingRoster||defaultRoster;let run=createRun(meta,'dawn',meta.loadout,roster,cap,eligible),killed=0,flawless=0,lost=false;const battles=[]
  meta.stats.runsStarted++
  for(let i=0;i<15;i++){
    const stage=CAMPAIGNS.dawn.stages[i],{b,kills}=fight(run,stage,i,policy==='inefficient'?'average':policy,random);killed+=kills
    const objective=b.victory&&objectiveResult(stage,b)
    battles.push({battle:i+1,victory:b.victory,losses:b.player.filter(e=>e.dead).length,time:+b.time.toFixed(2),objective,timedOut:b.timedOut,remaining:b.player.filter(e=>!e.dead).map(e=>({type:e.type,hp:Math.round(e.hp/e.maxHp*100)}))})
    if(!b.victory){run.gold+=6;run.xp+=2;break}
    const loss=b.player.some(e=>e.dead);lost||=loss;if(!loss)flawless++
    const income=battleIncome(run,stage,objective);run={...run,roster:recoverRoster(run,b),wins:run.wins+1,objectives:run.objectives+(objective?1:0),gold:run.gold+income.gold,xp:run.xp+income.xp,tp:run.tp+income.tp}
    if(i===14)break
    let unitOnly=false
    if([4,9,13].includes(i)){
      if(run.roster.some(r=>r.hpFrac<.4)&&run.roster.length===run.deployCap){run.roster=run.roster.map(r=>({...r,hpFrac:1}));continue}
      run.deployCap=Math.min(6,run.deployCap+1);unitOnly=true
    }
    const choices=rewardOptions(run,random,unitOnly),score={armor:5,damage:4,speed:3,health:2,reinforceHeal:1.5,reinforceSpeed:1,range:0}
    const wounded=run.roster.slice().sort((a,b)=>a.hpFrac-b.hpFrac)[0],value=c=>c.kind==='unit'?8:c.kind==='reinforce'?(wounded.hpFrac<.6?7:0):score[c.id]
    choices.sort((a,b)=>value(b)-value(a))
    if(choices[0])run=applyReward(run,choices[0].kind==='reinforce'?{...choices[0],uid:wounded.uid}:choices[0])
  }
  const victory=run.wins===15,condition=run.roster.reduce((a,r)=>a+r.hpFrac,0)/run.deployCap
  const info={campaign:'dawn',victory,cleared:run.wins,bestReached:battles.length,gold:run.gold,xp:run.xp,tp:run.tp,objectives:run.objectives,stars:victory?1+(condition>=.65?1:0)+(!lost?1:0):0,unitsKilled:killed,flawlessBattles:flawless}
  settleRun(meta,info);claimAll(meta)
  return{...info,battles,bank:{gold:meta.gold,xp:meta.xp,tp:meta.tp},starting:roster,levels:{...meta.unitLevels},equipment:structuredClone(meta.unitEquipment),people:[meta.loadout.leader,meta.loadout.general]}
}
export function shop(meta,policy,random){
  const log=[],research=policy==='skilled'?['agriculture','archery','irrigation','domestication','copper']:policy==='inefficient'?['copper','agriculture','wheel','archery','writing']:['archery','agriculture','copper','irrigation','domestication']
  for(const id of research)if(canResearch(meta,id)&&meta.tp>=TECHS[id].cost){researchTech(meta,id);log.push('Research '+id)}
  meta.loadout.tech=research.filter(id=>meta.ownedTech.includes(id)).slice(0,meta.techSlots);reconcileUnits(meta)
  const {roster}=rosterFor(meta,policy),types=[...new Set(roster)]
  // Spend EXP across the actual formation; inefficient buyers also train unused reserves.
  const train=policy==='inefficient'?[...new Set([...types,'slinger','warrior'])]:types
  for(let n=0;n<60;n++){const id=train.slice().sort((a,b)=>(meta.unitLevels[a]||1)-(meta.unitLevels[b]||1))[0],lv=meta.unitLevels[id]||1,cost=unitLevelCost(lv);if(meta.xp<cost||lv>=UNIT_LEVEL_MAX)break;trainUnit(meta,id);log.push('Train '+id)}
  if(meta.featureUnlocks.people&&meta.gold>=packSpec(meta,'standard').cost){const spec=packSpec(meta,'standard');meta.gold-=spec.cost;meta.stats.packsOpened++;addPackRewards(meta,drawPack(spec,random),'people');log.push('People pack')}
  if(meta.featureUnlocks.people){meta.loadout.leader=meta.characterCopies.narmer?'narmer':'elder';meta.loadout.general=meta.characterCopies.hunter&&types.some(id=>UNITS[id].range>0)?'hunter':meta.characterCopies.sargon?'sargon':'veteran';for(const id of [meta.loadout.leader,meta.loadout.general])if(upgradePerson(meta,id))log.push('Promote '+id)}
  if(policy==='inefficient')for(let n=0;n<2;n++){const spec=packSpec(meta,'basic','artifact');if(meta.gold<spec.cost)break;meta.gold-=spec.cost;meta.stats.packsOpened++;addPackRewards(meta,drawPack(spec,random),'artifact');log.push('Artifact pack')}
  for(const type of types)for(const id of Object.keys(meta.inventory))if((meta.unitEquipment[type]||[]).length<2)equipArtifact(meta,id,type)
  for(const type of types){const priorities=UNITS[type].range>0?[type==='slinger'?'slingPouch':'edgedProjectiles','leatherLamellar']:['leatherLamellar','stoneAxeGrip'];for(const id of priorities){if((meta.unitEquipment[type]||[]).includes(id))continue;const cost=supplyPrice(meta,ITEMS[id].price);if(!(meta.inventory[id]>0)&&meta.gold>=cost&&artifactSupply(meta).includes(id)){meta.gold-=cost;meta.inventory[id]=(meta.inventory[id]||0)+1;meta.artifactLevels[id]||=1;log.push('Buy '+id)}equipArtifact(meta,id,type)}}
  // Evolve equipped supplies with affordable duplicates, retaining their collection copies.
  for(const id of [...new Set(Object.values(meta.unitEquipment).flat())]){const cost=supplyPrice(meta,ITEMS[id].price);if(meta.gold>=cost+20&&(meta.inventory[id]||0)<2){meta.gold-=cost;meta.inventory[id]=(meta.inventory[id]||0)+1;log.push('Duplicate '+id)}if(evolveArtifact(meta,id))log.push('Evolve '+id)}
  claimAll(meta);return log
}
export function path(policy,seed=1){const meta=structuredClone(START_META),random=rng(seed),runs=[];for(let i=0;i<4;i++){const result=simulateRun(meta,policy,random);result.purchases=shop(meta,policy,random);runs.push(result)}return{policy,seed,runs,final:meta}}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const count=Number(process.argv[2]||4),results=[];for(const policy of ['average','skilled','inefficient'])for(let seed=1;seed<=count;seed++)results.push(path(policy,seed));fs.writeFileSync('docs/pass4/after.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(p=>({policy:p.policy,seed:p.seed,runs:p.runs.map(r=>r.victory?'15 clear':r.bestReached)})),null,2))}
