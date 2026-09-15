import {TECHS,PEOPLE,itemEffectAtLevel,AGE1_REWARDS,REWARD_POOL} from '../data.js'
import {peopleEffects,metaPeople} from './progression.js'
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
export function createRun(meta,campaign,loadout,roster,capacity,eligible){return{campaign,...metaPeople({...meta,loadout}),tech:(loadout.tech||[]).filter(Boolean),roster:roster.map((type,i)=>({uid:'r'+i,type,hpFrac:1})),deployCap:capacity,gold:0,xp:0,tp:0,wins:0,objectives:0,eligibleUnits:eligible,unitLevels:meta.unitLevels,unitEquipment:meta.unitEquipment,heroEquipment:meta.heroEquipment,artifactLevels:meta.artifactLevels,upgrades:{damage:1,health:1,attackSpeed:1,range:1,armorBonus:0,reinforceSpeed:1,reinforceHeal:0}}}
export function reinforcementMultiplier(run){let m=run.upgrades.reinforceSpeed*(peopleEffects(run).reinforceMult||1);for(const t of run.tech)m*=TECHS[t]?.reinforceMult||1;if(run.leader==='cleopatra'&&run.leaderLevel>=6)m*=1.20;if(run.leader==='ramesses'&&run.leaderLevel>=1)m*=1.10;if(run.leader==='cyrus'&&run.leaderLevel>=2)m*=1.15;const id=run.heroEquipment?.[run.general];if(id)m*=itemEffectAtLevel(id,run.artifactLevels[id]||1).reinforceMult||1;return m}
export function reinforcementHeal(run){return clamp(.15+run.upgrades.reinforceHeal+(peopleEffects(run).reinforceHeal||0)+(run.leader==='cleopatra'&&run.leaderLevel>=3?.08:0)+(run.tech.includes('agriculture')?.03:0)+(run.tech.includes('irrigation')?.04:0),.1,.6)}
export function recoveryRate(run){return clamp((run.campaign==='dawn'?.20:.05)+run.tech.reduce((n,id)=>n+(TECHS[id]?.recovery||0),0)+(peopleEffects(run).recovery||0)+(run.leader==='cyrus'&&run.leaderLevel>=4?.08:0),.05,.35)}
export function victoryGoldMultiplier(run){let m=peopleEffects(run).goldMult||1;if(run.leader==='cleopatra')m=run.leaderLevel>=2?1.25:1.15;if(run.leader==='ramesses'&&run.leaderLevel>=2)m=1.12;if(run.leader==='cyrus'&&run.leaderLevel>=1)m=1.10;const id=run.heroEquipment?.[run.leader];if(id)m*=itemEffectAtLevel(id,run.artifactLevels[id]||1).goldMult||1;return m}
export function objectiveResult(stage,b){if(!stage.objective)return false;const alive=b.player.filter(e=>!e.dead),condition=alive.reduce((n,e)=>n+e.hp/e.maxHp,0)/Math.max(1,b.player.length);return stage.objective.kind==='preserve'?alive.length===b.player.length:stage.objective.kind==='condition'?condition>=.5:b.time<=stage.objective.parSeconds}
export function battleIncome(run,stage,objective){return{gold:Math.round(stage.gold*victoryGoldMultiplier(run))+(objective?(stage.objective?.bonusGold||0):0),xp:Math.round((stage.xp||0)*(run.campaign==='dawn'?run.tech.reduce((n,id)=>n*(TECHS[id]?.age1XpMult||1),1):1)),tp:stage.tp||0}}
export function recoverRoster(run,b){const recovery=recoveryRate(run);return b.player.filter(e=>!e.dead).map((e,i)=>({uid:'r'+i,type:e.type,hpFrac:clamp(e.hp/e.maxHp+(1-e.hp/e.maxHp)*recovery,0,1)}))}
export function rewardPool(run){return run.campaign==='dawn'?AGE1_REWARDS:REWARD_POOL}
export function rewardOptions(run,random=Math.random,unitOnly=false){
  const shuffled=list=>list.map(value=>({value,key:random()})).sort((a,b)=>a.key-b.key).map(x=>x.value),options=[]
  if(run.roster.length<run.deployCap){for(const id of shuffled(run.eligibleUnits).slice(0,unitOnly?3:1))options.push({kind:'unit',id})}
  if(!unitOnly||!options.length)for(const reward of shuffled(rewardPool(run).filter(r=>JSON.stringify(r.apply(run.upgrades))!==JSON.stringify(run.upgrades))).slice(0,3-options.length))options.push({kind:'upgrade',...reward})
  if(!unitOnly&&run.roster.some(r=>r.hpFrac<1))options.push({kind:'reinforce',id:'reinforce',name:'Reinforcement',desc:'Fully restore one surviving squad. Choose which squad to reinforce.'})
  return options
}
export function applyReward(run,choice){
  if(choice.kind==='reinforce')return {...run,roster:run.roster.map(r=>r.uid===choice.uid?{...r,hpFrac:1}:r)}
  return choice.kind==='unit'?{...run,roster:[...run.roster,{uid:'r'+run.roster.length,type:choice.id,hpFrac:1}].slice(0,run.deployCap)}:{...run,upgrades:choice.apply(run.upgrades)}
}
