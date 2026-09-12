import { useEffect, useMemo, useRef, useState } from 'react'
import { ASSETS } from '../assets'
import { CAMPAIGNS, PEOPLE, REWARD_POOL, TECHS, UNITS } from '../data'
import Modal from './Modal'

const W=620,H=820
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const playerCells=[{x:120,y:660},{x:260,y:680},{x:400,y:665},{x:160,y:555},{x:305,y:575},{x:455,y:555}]
const enemyCells=[{x:500,y:150},{x:360,y:135},{x:220,y:150},{x:460,y:255},{x:320,y:240},{x:180,y:260}]
const roleHas=(u,s)=>u.role.includes(s)
const unitGlyph=u=>u.role.includes('MOUNTED')?'🐎':u.role.includes('RANGED')||u.role.includes('FIREARM')?'🏹':u.role.includes('SPEAR')?'⚑':'⚔'

function terrainFor(stage){
  const t=stage.terrain||{}
  return {
    river:!!t.river,
    riverY:[350,460],
    bridges:(t.bridges||[]).map(i=>({x:[75,235,385,520][i]||235,w:60})),
    mountains:t.mountains||[]
  }
}

function lineBlocked(a,b,mountains){
  for(const m of mountains){
    const minX=Math.min(a.x,b.x), maxX=Math.max(a.x,b.x), minY=Math.min(a.y,b.y), maxY=Math.max(a.y,b.y)
    if(maxX<m.x || minX>m.x+m.w || maxY<m.y || minY>m.y+m.h) continue
    const cx=clamp((a.x+b.x)/2,m.x,m.x+m.w), cy=clamp((a.y+b.y)/2,m.y,m.y+m.h)
    if(cx>=m.x&&cx<=m.x+m.w&&cy>=m.y&&cy<=m.y+m.h) return m
  }
  return null
}
function riverWaypoint(a,b,terrain){
  if(!terrain.river) return null
  const [y1,y2]=terrain.riverY
  const aNorth=a.y<y1, bNorth=b.y<y1
  if(aNorth===bNorth) return null
  if(!terrain.bridges.length) return {x:a.x,y:(y1+y2)/2}
  const bridge=terrain.bridges.sort((x,y)=>Math.abs(x.x-a.x)-Math.abs(y.x-a.x))[0]
  return {x:bridge.x+bridge.w/2,y:(y1+y2)/2}
}
function mountainWaypoint(a,b,m){
  const left={x:m.x-18,y:m.y+m.h/2}, right={x:m.x+m.w+18,y:m.y+m.h/2}
  return Math.hypot(left.x-a.x,left.y-a.y)+Math.hypot(left.x-b.x,left.y-b.y) < Math.hypot(right.x-a.x,right.y-a.y)+Math.hypot(right.x-b.x,right.y-b.y) ? left : right
}

function baseStats(type){ return { ...UNITS[type] } }
function makeEntity(side,type,pos,hpFrac,run,mult=1,index=0){
  const s=baseStats(type)
  let damage=s.damage*run.upgrades.damage, health=s.health*run.upgrades.health, speed=s.attackSpeed*run.upgrades.attackSpeed, range=s.range*(roleHas(s,'RANGED')||roleHas(s,'FIREARM')?run.upgrades.range:1), armor=s.armor+run.upgrades.armorBonus
  if(run.general==='veteran'){if(run.generalLevel>=1)damage*=1.06;if(run.generalLevel>=3)health*=1.08}
  if(run.general==='hunter'){if(roleHas(s,'RANGED')||roleHas(s,'FIREARM')){if(run.generalLevel>=1)damage*=1.08;if(run.generalLevel>=2)speed*=1.10;if(run.generalLevel>=3)range*=1.12}}
  if(run.general==='hannibal'&&(roleHas(s,'MOUNTED')||type==='warElephant')){if(run.generalLevel>=1)damage*=1.10;if(run.generalLevel>=2)damage*=1.09;if(run.generalLevel>=5&&type==='warElephant'){health*=1.35;damage*=1.25;armor+=8}}
  if(run.general==='napoleon'){if(run.generalLevel>=1)damage*=1.10;if(run.generalLevel>=2&&(roleHas(s,'FIREARM')))speed*=1.15;if(run.generalLevel>=5&&type==='imperialGuard'){health*=1.30;damage*=1.25}}
  if(run.leader==='cleopatra'){if(run.leaderLevel>=5&&type==='egyptianGuard'){health*=1.18;armor+=4}}
  if(side==='enemy'){damage*=mult;health*=mult;armor*=0.9+mult*.1}
  return { id:`${side}-${index}-${Math.random().toString(36).slice(2,7)}`, side, type, x:pos.x, y:pos.y, hp:health*hpFrac, maxHp:health, stats:{...s, damage, health, attackSpeed:speed, range, armor}, cool:0, dead:false, flash:0, moved:0 }
}

function drawSquad(ctx,e,selected=false,targetable=false){
  const r = roleHas(e.stats,'MOUNTED') ? 18 : roleHas(e.stats,'RANGED')||roleHas(e.stats,'FIREARM') ? 14 : 16
  ctx.save()
  ctx.translate(e.x,e.y)
  ctx.fillStyle=e.side==='player'?'#2e74c9':'#ad4040'
  ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill()
  if(e.flash>0){ctx.strokeStyle='#fff3';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r+2,0,Math.PI*2);ctx.stroke()}
  if(selected){ctx.strokeStyle='#ffd671';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r+5,0,Math.PI*2);ctx.stroke()}
  if(targetable){ctx.strokeStyle=e.side==='player'?'#8ef0a6':'#ffd879';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r+7,0,Math.PI*2);ctx.stroke()}
  ctx.fillStyle='#fff';ctx.font='900 16px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(unitGlyph(e.stats),0,1)
  ctx.fillStyle='#091522cc';ctx.fillRect(-22,r+7,44,6);ctx.fillStyle=e.side==='player'?'#7ce39f':'#ef7474';ctx.fillRect(-22,r+7,44*(e.hp/e.maxHp),6)
  ctx.restore()
}

export default function Battle({ campaignId, loadout, startingRoster, startCapacity, meta, onFinish }){
  const campaign=CAMPAIGNS[campaignId]
  const canvasRef=useRef(null)
  const rafRef=useRef(0)
  const battleRef=useRef(null)
  const [phase,setPhase]=useState('deploy')
  const [stageIndex,setStageIndex]=useState(0)
  const [run,setRun]=useState(()=>({
    leader:loadout.leader, general:loadout.general, tech:loadout.tech.filter(Boolean), leaderLevel:meta.characterLevels[loadout.leader]||1, generalLevel:meta.characterLevels[loadout.general]||1,
    roster:startingRoster.map((type,i)=>({uid:`r${i}-${Date.now()}`,type,hpFrac:1})), deployCap:startCapacity,
    gold:0,tp:0, upgrades:{damage:1,health:1+(meta.hpRank||0)*.05,attackSpeed:1,range:1,armorBonus:0,reinforceSpeed:1,reinforceHeal:0}
  }))
  const [deploy,setDeploy]=useState(()=>Array.from({length:startCapacity},()=>null))
  const [selectedRoster,setSelectedRoster]=useState(0)
  const [hud,setHud]=useState({player:100,enemy:100,powerP:0,powerE:0,meter:0,enemyMeter:0,rally:0,focus:0,special:0,message:'Place your army'})
  const [rewardChoices,setRewardChoices]=useState([])
  const [showReward,setShowReward]=useState(false)
  const [showMilestone,setShowMilestone]=useState(false)
  const [showEnd,setShowEnd]=useState(false)
  const [endInfo,setEndInfo]=useState(null)
  const [reinforceTargeting,setReinforceTargeting]=useState(false)
  const [focusTargeting,setFocusTargeting]=useState(false)
  const [lostAny,setLostAny]=useState(false)
  const targetingRef=useRef({focus:false,reinforce:false})

  const stage=campaign.stages[stageIndex]
  const terrain=useMemo(()=>terrainFor(stage),[stage])
  const leader = PEOPLE[run.leader], general=PEOPLE[run.general]
  const generalArt = ASSETS.people[run.general]?.front || null
  const pausedForTargeting = focusTargeting || reinforceTargeting
  useEffect(()=>{targetingRef.current={focus:focusTargeting,reinforce:reinforceTargeting}},[focusTargeting,reinforceTargeting])

  const reinforceMult=useMemo(()=>{
    let m=run.upgrades.reinforceSpeed
    for(const t of run.tech)m*=TECHS[t]?.reinforceMult||1
    if(run.leader==='elder'&&run.leaderLevel>=2)m*=1.15
    if(run.leader==='cleopatra'&&run.leaderLevel>=6)m*=1.20
    if(run.general==='veteran'&&run.generalLevel>=2)m*=1.10
    return m
  },[run])
  const reinforceHeal=useMemo(()=>{
    let h=.15+run.upgrades.reinforceHeal
    if(run.leader==='cleopatra'&&run.leaderLevel>=3)h+=.08
    if(run.tech.includes('agriculture'))h+=.03
    if(run.tech.includes('irrigation'))h+=.04
    return clamp(h,.10,.60)
  },[run])

  function autoDeploy(){
    const filled=Array.from({length:run.deployCap},(_,i)=>i<run.roster.length?i:null)
    setDeploy(filled)
  }

  function drawTerrain(ctx,t,st){
    const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,campaignId==='dawn'?'#769db4':'#ddaf7b');grad.addColorStop(.48,campaignId==='dawn'?'#56745a':'#ad7345');grad.addColorStop(1,campaignId==='dawn'?'#344b34':'#744f31');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H)
    if(t.river){const [y1,y2]=t.riverY;ctx.fillStyle='#3b80a6dd';ctx.fillRect(0,y1,W,y2-y1);ctx.fillStyle='#97d8ee44';for(let y=y1+8;y<y2;y+=13)ctx.fillRect(0,y,W,2);for(const b of t.bridges){ctx.fillStyle='#8a6544';ctx.fillRect(b.x,y1-4,b.w,y2-y1+8)}}
    for(const r of t.mountains){ctx.fillStyle='#505761';ctx.beginPath();ctx.moveTo(r.x,r.y+r.h);ctx.lineTo(r.x+r.w*.5,r.y);ctx.lineTo(r.x+r.w,r.y+r.h);ctx.closePath();ctx.fill();ctx.strokeStyle='#78818b';ctx.stroke()}
    ctx.fillStyle='#07111db5';ctx.fillRect(8,8,168,28);ctx.fillStyle='#fff';ctx.font='900 12px system-ui';ctx.fillText(`${stageIndex+1}/15 · ${st.name}`,18,27)
  }

  function drawDeploy(){
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d')
    drawTerrain(ctx,terrain,stage)
    ctx.strokeStyle='#ffffff28';ctx.lineWidth=2
    playerCells.forEach((p,i)=>{ctx.strokeRect(p.x-34,p.y-28,68,56);if(deploy[i]!=null){const r=run.roster[deploy[i]];const fake=makeEntity('player',r.type,p,r.hpFrac,run,1,i);drawSquad(ctx,fake,deploy[i]===selectedRoster,false)}})
    stage.types.forEach((type,i)=>{const fake=makeEntity('enemy',type,enemyCells[i%enemyCells.length],1,run,stage.mult,i);drawSquad(ctx,fake,false,false)})
  }

  useEffect(()=>{if(phase==='deploy')drawDeploy()},[phase,deploy,selectedRoster,stageIndex,run])
  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[])

  function beginBattle(){
    const chosen=deploy.filter(i=>i!=null).slice(0,run.deployCap)
    if(chosen.length<Math.min(2,run.deployCap)) return
    const player=chosen.map((ri,i)=>makeEntity('player',run.roster[ri].type,playerCells[i],run.roster[ri].hpFrac,run,1,i))
    const enemy=stage.types.map((type,i)=>makeEntity('enemy',type,enemyCells[i],1,run,stage.mult,i))
    battleRef.current={player,enemy,projectiles:[],time:0,last:performance.now(),terrain,meter:0,enemyMeter:0,rallyUntil:0,rallyCd:0,focusUntil:0,focusCd:0,focusTarget:null,specialUntil:0,specialCd:0,done:false}
    setPhase('battle');setReinforceTargeting(false);setFocusTargeting(false)
    tick(performance.now())
  }

  function chooseTarget(e,enemies,b){
    let live=enemies.filter(x=>!x.dead)
    if(!live.length) return null
    if(e.side==='player'&&b.focusTarget&&b.focusUntil>b.time){const ft=live.find(x=>x.id===b.focusTarget); if(ft) return ft}
    if(roleHas(e.stats,'SPEAR')){const mounted=live.filter(x=>roleHas(x.stats,'MOUNTED')); if(mounted.length) live=mounted}
    return live.sort((a,c)=>dist(e,a)-dist(e,c))[0]
  }
  function moveEntity(e,target,dt,b){
    if(!target) return
    const melee=e.stats.range<=0, desiredRange=melee?25:e.stats.range*.82
    const d=dist(e,target)
    if(d<=desiredRange) return
    let goal={x:target.x,y:target.y}
    const river=riverWaypoint(e,goal,b.terrain); if(river) goal=river
    const block=lineBlocked(e,goal,b.terrain.mountains); if(block) goal=mountainWaypoint(e,goal,block)
    const dx=goal.x-e.x, dy=goal.y-e.y, dd=Math.hypot(dx,dy)||1
    let speed=e.stats.moveSpeed
    if(e.side==='player'&&b.specialUntil>b.time&&run.general==='hannibal') speed*=1.4
    const step=Math.min(dd,speed*dt);e.x+=dx/dd*step;e.y+=dy/dd*step;e.moved+=step
    e.x=clamp(e.x,20,W-20);e.y=clamp(e.y,35,H-35)
  }
  function canShoot(e,t,b){return dist(e,t)<=e.stats.range && !lineBlocked(e,t,b.terrain.mountains)}
  function attack(e,t,b){
    if(e.cool>0||!t||t.dead) return
    const melee=e.stats.range<=0
    if(melee&&dist(e,t)>30) return
    if(!melee&&!canShoot(e,t,b)) return
    let dmg=e.stats.damage
    if(e.side==='player'&&b.rallyUntil>b.time) dmg*=1.12
    if(e.side==='player'&&b.specialUntil>b.time&&run.general==='hannibal') dmg*=1.30
    if(e.stats.antiMounted&&roleHas(t.stats,'MOUNTED')) dmg*=e.stats.antiMounted
    if(e.stats.charge&&e.moved>70){dmg*=e.stats.charge;e.moved=0}
    const reduced=dmg*(100/(100+t.stats.armor*2.2))
    t.hp-=reduced;t.flash=.12;e.cool=1/e.stats.attackSpeed
    if(!melee)b.projectiles.push({x:e.x,y:e.y,tx:t.x,ty:t.y,life:.25,side:e.side})
    if(t.hp<=0){t.hp=0;t.dead=true}
  }
  function simSide(side,foes,dt,b){
    for(const e of side){if(e.dead)continue;e.cool-=dt;e.flash=Math.max(0,e.flash-dt);const t=chooseTarget(e,foes,b);if(!t)continue;const melee=e.stats.range<=0;if((melee&&dist(e,t)>30)||(!melee&&!canShoot(e,t,b)))moveEntity(e,t,dt,b);attack(e,t,b)}
  }
  function drawBattle(b){
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');drawTerrain(ctx,b.terrain,stage)
    for(const p of b.projectiles){ctx.strokeStyle=p.side==='player'?'#ffe08a':'#ffc0c0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.tx,p.ty);ctx.stroke()}
    const tr=targetingRef.current
    b.enemy.forEach(e=>!e.dead&&drawSquad(ctx,e,false,tr.focus))
    b.player.forEach(e=>!e.dead&&drawSquad(ctx,e,false,tr.reinforce))
    if(tr.focus||tr.reinforce){ctx.fillStyle='#07111d99';ctx.fillRect(140,380,340,58);ctx.strokeStyle='#6e93b2';ctx.strokeRect(140,380,340,58);ctx.fillStyle='#fff';ctx.font='900 20px system-ui';ctx.textAlign='center';ctx.fillText(tr.focus?'SELECT ENEMY TARGET':'SELECT FRIENDLY SQUAD',310,404);ctx.font='700 12px system-ui';ctx.fillText('Battle paused while you choose.',310,424)}
  }
  function updateHudFromBattle(b){
    const sum=(arr,k)=>arr.reduce((a,e)=>a+(e.dead?0:e[k]),0), max=(arr)=>arr.reduce((a,e)=>a+e.maxHp,0)
    const ph=sum(b.player,'hp'), pm=max(b.player), eh=sum(b.enemy,'hp'), em=max(b.enemy)
    const power=arr=>Math.round(arr.filter(e=>!e.dead).reduce((a,e)=>a+e.hp*(e.stats.damage*e.stats.attackSpeed+e.stats.armor*.4),0)/10)
    const tr=targetingRef.current
    setHud({player:pm?Math.round(ph/pm*100):0,enemy:em?Math.round(eh/em*100):0,powerP:power(b.player),powerE:power(b.enemy),meter:Math.floor(b.meter),enemyMeter:Math.floor(b.enemyMeter),rally:Math.max(0,b.rallyCd-b.time),focus:Math.max(0,b.focusCd-b.time),special:Math.max(0,b.specialCd-b.time),message:(tr.focus||tr.reinforce)?'Battle paused for command targeting':'Battle in progress'})
  }
  function tick(now){
    const b=battleRef.current;if(!b||b.done) return
    const tr=targetingRef.current
    if(tr.focus||tr.reinforce){b.last=now;drawBattle(b);updateHudFromBattle(b);rafRef.current=requestAnimationFrame(tick);return}
    const dt=Math.min(.04,(now-b.last)/1000);b.last=now;b.time+=dt
    b.meter=clamp(b.meter+dt*5.2*reinforceMult,0,100);b.enemyMeter=clamp(b.enemyMeter+dt*4.1*(1+stageIndex*.02),0,100)
    if(b.enemyMeter>=100){const damaged=b.enemy.filter(e=>!e.dead&&e.hp<e.maxHp*.95).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(damaged){damaged.hp=Math.min(damaged.maxHp,damaged.hp+damaged.maxHp*(.13+stageIndex*.004));b.enemyMeter=0}}
    simSide(b.player,b.enemy,dt,b); simSide(b.enemy,b.player,dt,b)
    b.projectiles.forEach(p=>p.life-=dt);b.projectiles=b.projectiles.filter(p=>p.life>0)
    drawBattle(b)
    if(Math.floor(b.time*5)!==Math.floor((b.time-dt)*5)) updateHudFromBattle(b)
    const pAlive=b.player.some(e=>!e.dead), eAlive=b.enemy.some(e=>!e.dead)
    if(!pAlive||!eAlive){b.done=true;setTimeout(()=>finishBattle(pAlive&&!eAlive,b),300);return}
    rafRef.current=requestAnimationFrame(tick)
  }

  function finishBattle(victory,b){
    const hadLoss = b.player.some(e=>e.dead)
    const totalLost = lostAny || hadLoss
    if(hadLoss) setLostAny(true)
    if(!victory){
      setEndInfo({victory:false,gold:run.gold,tp:run.tp,battle:stageIndex+1,bestReached:stageIndex+1,units:run.roster.map(r=>r.type),stars:0})
      setShowEnd(true);setPhase('ended');return
    }
    const survivors=b.player.filter(e=>!e.dead).map(e=>({type:e.type,hpFrac:e.hp/e.maxHp}))
    const recovery=clamp(.05+(meta.fieldMedicine||0)*.03+run.tech.reduce((a,t)=>a+(TECHS[t]?.recovery||0),0),.05,.25)
    const newRoster=survivors.map((s,i)=>({uid:`r${i}-${Date.now()}`,type:s.type,hpFrac:clamp(s.hpFrac+(1-s.hpFrac)*recovery,0,1)}))
    const goldGain=Math.round(stage.gold*leaderGoldMult())
    const nextRun={...run,roster:newRoster,gold:run.gold+goldGain,tp:run.tp+(stage.tp||0)}
    setRun(nextRun)
    if(stageIndex===14){
      const condition = newRoster.reduce((a,r)=>a+r.hpFrac,0) / Math.max(1,nextRun.deployCap)
      const earnedStars = 1 + (condition>=0.65 ? 1 : 0) + (!totalLost ? 1 : 0)
      setEndInfo({victory:true,gold:nextRun.gold,tp:nextRun.tp,battle:15,bestReached:15,units:nextRun.roster.map(r=>r.type),stars:earnedStars})
      setShowEnd(true);setPhase('ended');return
    }
    if([4,9,13].includes(stageIndex)){setShowMilestone(true);setPhase('milestone');return}
    openRewards(nextRun)
  }
  function leaderGoldMult(){
    if(run.leader==='cleopatra'){if(run.leaderLevel>=2)return 1.25;if(run.leaderLevel>=1)return 1.15}
    if(run.leader==='elder')return 1.08
    if(run.leader==='merchant')return run.leaderLevel>=3?1.20:1.12
    return 1
  }
  function availableUnitTypes(){
    const ids=['warrior','spear','slinger']
    for(const [id,u] of Object.entries(UNITS))if(u.requires&&u.requires.every(t=>run.tech.includes(t)))ids.push(id)
    if(run.general==='hannibal'&&run.generalLevel>=1)ids.push('warElephant')
    if(run.general==='napoleon'&&run.generalLevel>=1)ids.push('imperialGuard')
    if(run.leader==='cleopatra'&&run.leaderLevel>=5)ids.push('egyptianGuard')
    return [...new Set(ids)]
  }
  function openRewards(r=run,unitOnly=false){
    const options=[]
    if(r.roster.length<r.deployCap||unitOnly){
      const unitIds=availableUnitTypes().filter(id=>id!=='warrior'||Math.random()>.4)
      for(const id of unitIds.sort(()=>Math.random()-.5).slice(0,unitOnly?3:1)) options.push({kind:'unit',id,name:`Recruit ${UNITS[id].name}`,icon:unitGlyph(UNITS[id]),desc:`Add one ${UNITS[id].name} squad to the surviving army.`})
    }
    if(!unitOnly){for(const rwd of REWARD_POOL.slice().sort(()=>Math.random()-.5).slice(0,3-options.length)) options.push({kind:'upgrade',...rwd})}
    setRewardChoices(options.slice(0,3));setShowReward(true);setPhase('reward')
  }
  function chooseReward(choice){
    let next={...run}
    if(choice.kind==='unit') next={...next,roster:[...next.roster,{uid:`r${Date.now()}`,type:choice.id,hpFrac:1}]}
    else next={...next,upgrades:choice.apply(next.upgrades)}
    setRun(next);setShowReward(false);advanceStage(next)
  }
  function advanceStage(nextRun=run){
    setStageIndex(i=>i+1);setDeploy(Array.from({length:nextRun.deployCap},(_,i)=>i<nextRun.roster.length?i:null));setSelectedRoster(0);setPhase('deploy');setHud(h=>({...h,message:'Deploy for the next battle'}))
  }
  function milestone(type){
    if(type==='heal'){const next={...run,roster:run.roster.map(r=>({...r,hpFrac:1}))};setRun(next);setShowMilestone(false);advanceStage(next)}
    else{const cap=Math.min(6,run.deployCap+1),next={...run,deployCap:cap};setRun(next);setShowMilestone(false);openRewards(next,true)}
  }

  function activateRally(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.rallyCd)return;b.rallyUntil=b.time+5;b.rallyCd=b.time+22;updateHudFromBattle(b)}
  function activateFocus(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.focusCd)return;setFocusTargeting(true);setReinforceTargeting(false)}
  function activateReinforce(){const b=battleRef.current;if(!b||phase!=='battle'||b.meter<100)return;setReinforceTargeting(true);setFocusTargeting(false)}
  function activateSpecial(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.specialCd)return;const p=PEOPLE[run.general];if(!p?.special||run.generalLevel<(p.specialLevel||99))return
    if(run.general==='hannibal'){b.specialUntil=b.time+8;b.specialCd=b.time+34}
    else if(run.general==='napoleon'){for(const e of b.enemy.filter(e=>!e.dead)){e.hp=Math.max(0,e.hp-e.maxHp*.18);if(e.hp<=0)e.dead=true}b.specialCd=b.time+32}
    updateHudFromBattle(b)
  }
  function clickFriendly(id){const b=battleRef.current;if(!b||!reinforceTargeting||b.meter<100)return;const e=b.player.find(x=>x.id===id&&!x.dead);if(!e)return;e.hp=Math.min(e.maxHp,e.hp+e.maxHp*reinforceHeal);b.meter=0;setReinforceTargeting(false);updateHudFromBattle(b)}
  function clickEnemy(id){const b=battleRef.current;if(!b||!focusTargeting)return;const e=b.enemy.find(x=>x.id===id&&!x.dead);if(!e)return;b.focusTarget=e.id;b.focusUntil=b.time+6;b.focusCd=b.time+12;setFocusTargeting(false);updateHudFromBattle(b)}

  function handleCanvasClick(ev){
    const c=canvasRef.current, rect=c.getBoundingClientRect(), x=(ev.clientX-rect.left)*W/rect.width, y=(ev.clientY-rect.top)*H/rect.height
    if(phase==='deploy'){
      let nearest=-1, dd=999
      playerCells.slice(0,run.deployCap).forEach((p,i)=>{const d=Math.hypot(p.x-x,p.y-y);if(d<dd){dd=d;nearest=i}})
      if(dd<45){setDeploy(d=>{const next=[...d];const currentCell=next.findIndex(v=>v===selectedRoster);if(currentCell>=0)next[currentCell]=null;next[nearest]=selectedRoster;return next})}
      return
    }
    const b=battleRef.current;if(!b)return
    if(reinforceTargeting){const e=b.player.filter(e=>!e.dead).sort((a,c)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(c.x-x,c.y-y))[0];if(e&&Math.hypot(e.x-x,e.y-y)<38)return clickFriendly(e.id)}
    if(focusTargeting){const e=b.enemy.filter(e=>!e.dead).sort((a,c)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(c.x-x,c.y-y))[0];if(e&&Math.hypot(e.x-x,e.y-y)<38)return clickEnemy(e.id)}
  }

  const specialReady=general?.special&&run.generalLevel>=(general.specialLevel||99)
  const alivePlayer = battleRef.current?.player?.filter(e=>!e.dead) || []
  const aliveEnemy = battleRef.current?.enemy?.filter(e=>!e.dead) || []

  return <div className="battle-layout revamped">
    <div className="battle-main wide">
      <div className="battle-hud battle-topbar">
        <div><span>Encounter</span><b>{stageIndex+1}/15 · {stage.name}</b></div>
        <div className="life-pair"><span>YOU <b>{hud.player}%</b></span><i><em style={{width:`${hud.player}%`}}/></i><span>ENEMY <b>{hud.enemy}%</b></span><i className="enemy"><em style={{width:`${hud.enemy}%`}}/></i></div>
        <div><span>Run</span><b>◉ {run.gold} · ✦ {run.tp} · Slots {run.deployCap}</b></div>
      </div>
      <div className="canvas-shell large"><canvas ref={canvasRef} width={W} height={H} onClick={handleCanvasClick}/>{phase==='deploy'&&<div className="canvas-banner"><b>DEPLOY</b><span>Select a squad below, then click a highlighted tile</span></div>}</div>
      <div className="commander-dock">
        <div className="commander-bubble">{generalArt?<img src={generalArt} alt={general?.name}/>:<div className="bubble-fallback">{general?.icon||'⚔'}</div>}<div><b>{general?.name}</b><span>{leader?.name}</span></div></div>
        {phase==='deploy' ? <div className="command-grid commander-actions deploy-actions">
          <button onClick={autoDeploy}><b>Auto Deploy</b><span>Fill formation</span></button>
          <button className="selected"><b>Selected Squad</b><span>{run.roster[selectedRoster]?UNITS[run.roster[selectedRoster].type].name:'None'}</span></button>
          <button className="primaryish" onClick={beginBattle}><b>Finish Deployment</b><span>Begin battle</span></button>
        </div> : phase==='battle' ? <div className="command-grid commander-actions">
          <button disabled={hud.rally>0} onClick={activateRally}><b>Rally</b><span>{hud.rally>0?`${hud.rally.toFixed(0)}s`:'Ready'}</span></button>
          <button disabled={hud.focus>0} className={focusTargeting?'selected':''} onClick={activateFocus}><b>Focus Fire</b><span>{focusTargeting?'Pick enemy':hud.focus>0?`${hud.focus.toFixed(0)}s`:'Ready'}</span></button>
          <button disabled={hud.meter<100} className={reinforceTargeting?'selected':''} onClick={activateReinforce}><b>Reinforce</b><span>{hud.meter>=100?(reinforceTargeting?'Pick squad':`Heal ${Math.round(reinforceHeal*100)}%`):`${hud.meter}%`}</span></button>
          <button disabled={!specialReady||hud.special>0} onClick={activateSpecial}><b>{general?.special||'Special'}</b><span>{!specialReady?'Locked':hud.special>0?`${hud.special.toFixed(0)}s`:'Ready'}</span></button>
        </div> : <div className="battle-status-line">{hud.message}</div>}
      </div>
    </div>
    <aside className="battle-panel sidecards">
      {phase==='deploy'&&<><h3>Deployment</h3><div className="roster-list compact">{run.roster.map((r,i)=><button key={r.uid} className={selectedRoster===i?'active':''} onClick={()=>setSelectedRoster(i)}><b>{UNITS[r.type].name}</b><span>{Math.round(r.hpFrac*100)}% HP</span></button>)}</div><div className="battle-notes">Click a squad, then click a battlefield tile to place it. You need at least two placed squads to start.</div></>}
      {phase==='battle'&&<><h3>Your squads</h3><div className="roster-list compact">{alivePlayer.map(e=><button key={e.id} onClick={()=>clickFriendly(e.id)}><b>{UNITS[e.type].name}</b><span>{Math.round(e.hp/e.maxHp*100)}%</span></button>)}</div><h3>Enemy squads</h3><div className="roster-list compact enemy">{aliveEnemy.map(e=><button key={e.id} onClick={()=>clickEnemy(e.id)}><b>{UNITS[e.type].name}</b><span>{Math.round(e.hp/e.maxHp*100)}%</span></button>)}</div><div className="battle-notes"><b>Status</b><br/>{pausedForTargeting?'Battle paused for command selection.':`${alivePlayer.length} allied squads vs ${aliveEnemy.length} enemy squads.`}<br/><br/><b>Techs</b><br/>{run.tech.map(t=>TECHS[t]?.name).join(' · ')||'None'}</div></>}
      {phase!=='deploy'&&phase!=='battle'&&<div className="battle-notes">{hud.message}</div>}
    </aside>

    <Modal open={showReward} title="Evolution — choose one" wide><div className="reward-grid">{rewardChoices.map(c=><button key={c.id||c.name} className="reward-card" onClick={()=>chooseReward(c)}><strong>{c.icon}</strong><h4>{c.name}</h4><p>{c.desc}</p></button>)}</div></Modal>
    <Modal open={showMilestone} title={`Campaign milestone after battle ${stageIndex+1}`} wide><div className="milestone-grid"><button onClick={()=>milestone('size')}><strong>⚑＋</strong><h4>Expand Army</h4><p>Increase deployment capacity by one, then recruit a new squad.</p></button><button onClick={()=>milestone('heal')}><strong>✚</strong><h4>Full Recovery</h4><p>Restore every surviving squad to 100%. Destroyed squads stay dead.</p></button></div></Modal>
    <Modal open={showEnd} title={endInfo?.victory?'Campaign conquered':'Your army has fallen'}><div className="end-summary"><h3>{endInfo?.victory?'Victory!':`Defeated at battle ${endInfo?.battle}`}</h3><p>You bank <b>◉ {endInfo?.gold||0}</b> Gold and <b>✦ {endInfo?.tp||0}</b> Technology Points from this run.</p>{endInfo?.victory&&<p>Stars earned this clear: <b>{endInfo?.stars} / 3</b></p>}<button className="primary" onClick={()=>onFinish({...endInfo,campaign:campaignId})}>Return to Campaign</button></div></Modal>
  </div>
}
