import { useEffect, useMemo, useRef, useState } from 'react'
import { ASSETS } from '../assets'
import { CAMPAIGNS, PEOPLE, TECHS, UNITS, REWARD_POOL } from '../data'
import Modal from './Modal'

const W=520,H=760
const DEPLOY_TOP=455
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const roleHas=(u,s)=>u.role.includes(s)
const defaultPositions=[
  {x:115,y:625},{x:260,y:640},{x:405,y:625},
  {x:150,y:535},{x:300,y:550},{x:430,y:535}
]
const enemyCells=Array.from({length:18},(_,i)=>({x:55+(i%6)*82,y:95+Math.floor(i/6)*76}))

function unitStats(type,run,side='player',enemyMult=1){
  const base=UNITS[type],s={...base}
  if(side==='player'){
    s.health*=run.upgrades.health;s.armor+=run.upgrades.armorBonus;s.damage*=run.upgrades.damage;s.attackSpeed*=run.upgrades.attackSpeed
    if(roleHas(s,'RANGED')||roleHas(s,'FIREARM'))s.range*=run.upgrades.range
    const gl=run.generalLevel
    if(run.general==='veteran'&&gl>=1)s.damage*=1.06
    if(run.general==='veteran'&&gl>=3)s.health*=1.08
    if(run.general==='hunter'&&(roleHas(s,'RANGED')||roleHas(s,'FIREARM'))){if(gl>=1)s.damage*=1.08;if(gl>=2)s.attackSpeed*=1.10;if(gl>=3)s.range*=1.12}
    if(run.general==='hannibal'&&(roleHas(s,'MOUNTED')||roleHas(s,'HEAVY'))){if(gl>=1)s.damage*=1.10;if(gl>=2)s.damage=(s.damage/1.10)*1.20;if(gl>=4)s.damage=(s.damage/1.20)*1.30;if(type==='warElephant'&&gl>=5){s.health*=1.35;s.damage*=1.25;s.armor+=8}}
    if(run.general==='napoleon'){if(gl>=1)s.damage*=1.10;if(gl>=2&&(roleHas(s,'FIREARM')||roleHas(s,'RANGED')))s.attackSpeed*=1.15;if(type==='imperialGuard'&&gl>=5){s.health*=1.30;s.damage*=1.25}}
    if(run.tech.includes('fire')&&run.tech.includes('archery')&&(roleHas(s,'RANGED')||roleHas(s,'FIREARM')))s.damage*=1.12
  }else{
    s.health*=enemyMult;s.damage*=.92+enemyMult*.13;s.armor*=.9+enemyMult*.08
  }
  return s
}

function terrainFor(stage){
  const t=stage.terrain||{}
  return {river:!!t.river,riverY:[334,390],bridges:(t.bridges||[2]).map(i=>({x:35+i*100,w:64})),mountains:t.mountains||[]}
}
function pointInRect(x,y,r,pad=0){return x>=r.x-pad&&x<=r.x+r.w+pad&&y>=r.y-pad&&y<=r.y+r.h+pad}
function pointInBridge(x,t){return t.bridges.some(b=>x>=b.x&&x<=b.x+b.w)}
function blockedGroundPoint(x,y,t){
  if(t.mountains.some(r=>pointInRect(x,y,r,8)))return true
  if(t.river){const[y1,y2]=t.riverY;if(y>=y1&&y<=y2&&!pointInBridge(x,t))return true}
  return false
}
function lineBlocked(a,b,mountains){
  for(const r of mountains){for(let i=1;i<24;i++){const t=i/24,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(pointInRect(x,y,r,5))return r}}
  return null
}
function mountainWaypoint(a,b,r){
  const pad=24,corners=[{x:r.x-pad,y:r.y-pad},{x:r.x+r.w+pad,y:r.y-pad},{x:r.x-pad,y:r.y+r.h+pad},{x:r.x+r.w+pad,y:r.y+r.h+pad}]
  return corners.sort((c,d)=>dist(a,c)+dist(c,b)-dist(a,d)-dist(d,b))[0]
}
function nearestBridge(a,terrain){return terrain.bridges.slice().sort((p,q)=>Math.abs((p.x+p.w/2)-a.x)-Math.abs((q.x+q.w/2)-a.x))[0]}
function riverWaypoint(a,b,terrain){
  if(!terrain.river)return null
  const[y1,y2]=terrain.riverY
  const aNorth=a.y<y1,aSouth=a.y>y2,bNorth=b.y<y1,bSouth=b.y>y2,inRiver=!aNorth&&!aSouth
  if(!(inRiver||(aNorth&&bSouth)||(aSouth&&bNorth)))return null
  const bridge=nearestBridge(a,terrain),cx=bridge.x+bridge.w/2
  if(inRiver){if(bNorth)return{x:cx,y:y1-14};if(bSouth)return{x:cx,y:y2+14};return null}
  if(aNorth&&bSouth){if(Math.abs(a.x-cx)>bridge.w*.34)return{x:cx,y:y1-14};return{x:cx,y:y2+14}}
  if(aSouth&&bNorth){if(Math.abs(a.x-cx)>bridge.w*.34)return{x:cx,y:y2+14};return{x:cx,y:y1-14}}
  return null
}
function movementWaypoint(a,b,terrain){
  let goal={x:b.x,y:b.y}
  const river=riverWaypoint(a,goal,terrain);if(river)goal=river
  const mountain=lineBlocked(a,goal,terrain.mountains);if(mountain)goal=mountainWaypoint(a,goal,mountain)
  return goal
}
function makeEntity(side,type,pos,hpFrac,run,mult,idx){
  const stats=unitStats(type,run,side,mult),maxHp=stats.health
  return{id:`${side}-${idx}-${Math.random().toString(36).slice(2,7)}`,side,type,x:pos.x,y:pos.y,stats,maxHp,hp:maxHp*(hpFrac??1),cool:Math.random()*.3,dead:false,moved:0,flash:0,manualDestination:null}
}
function drawSquad(ctx,e,selected=false,targetable=false){
  const u=e.stats,hp=e.hp/e.maxHp
  ctx.save();ctx.translate(e.x,e.y)
  if(selected||targetable){ctx.strokeStyle=selected?'#86ff9d':e.side==='player'?'#86ff9d':'#ffe379';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.stroke()}
  if(e.flash>0){ctx.globalAlpha=.55;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
  const color=e.side==='player'?'#75c9ff':'#ef7474',count=Math.max(1,Math.ceil(hp*6))
  for(let i=0;i<count;i++){
    const cx=(i%3-1)*10,cy=(Math.floor(i/3)-.5)*11;ctx.fillStyle=color;ctx.beginPath();ctx.arc(cx,cy,5.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#07111d';ctx.lineWidth=1.4;ctx.stroke()
    if(roleHas(u,'SPEAR')){ctx.strokeStyle='#e9d09b';ctx.beginPath();ctx.moveTo(cx+2,cy);ctx.lineTo(cx+13,cy-9);ctx.stroke()}
    if(roleHas(u,'RANGED')||roleHas(u,'FIREARM')){ctx.strokeStyle='#f3dd9d';ctx.beginPath();ctx.moveTo(cx-3,cy-4);ctx.lineTo(cx+8,cy+4);ctx.stroke()}
  }
  if(roleHas(u,'MOUNTED')){ctx.strokeStyle='#d4a66e';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,10,20,9,0,0,Math.PI*2);ctx.stroke()}
  if(e.type==='warElephant'){ctx.fillStyle='#8a9497';ctx.beginPath();ctx.ellipse(0,4,26,18,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#5c6467';ctx.stroke()}
  ctx.fillStyle='#07111dcc';ctx.fillRect(-25,-33,50,6);ctx.fillStyle=hp>.5?'#75d3a1':hp>.25?'#f2c66c':'#ef7474';ctx.fillRect(-25,-33,50*hp,6)
  ctx.fillStyle='#d9e7f1';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText(UNITS[e.type].name,0,36);ctx.restore()
}

export default function Battle({campaignId,loadout,startingRoster,startCapacity,meta,onFinish}){
  const campaign=CAMPAIGNS[campaignId],canvasRef=useRef(null),battleRef=useRef(null),rafRef=useRef(null),actionRef=useRef({mode:null,unitId:null})
  const [phase,setPhase]=useState('deploy'),[stageIndex,setStageIndex]=useState(0)
  const [run,setRun]=useState(()=>({campaign:campaignId,leader:loadout.leader,general:loadout.general,tech:loadout.tech.filter(Boolean),leaderLevel:meta.characterLevels[loadout.leader]||1,generalLevel:meta.characterLevels[loadout.general]||1,roster:startingRoster.map((type,i)=>({uid:`r${i}-${Date.now()}`,type,hpFrac:1})),deployCap:startCapacity,gold:0,tp:0,upgrades:{damage:1,health:1+(meta.hpRank||0)*.05,attackSpeed:1,range:1,armorBonus:0,reinforceSpeed:1,reinforceHeal:0}}))
  const [deployPos,setDeployPos]=useState(()=>startingRoster.map((_,i)=>({...defaultPositions[i]}))),[selectedRoster,setSelectedRoster]=useState(0)
  const [hud,setHud]=useState({player:100,enemy:100,powerP:0,powerE:0,meter:0,enemyMeter:0,rally:0,focus:0,special:0}),[actionMode,setActionMode]=useState(null),[actionUnitId,setActionUnitId]=useState(null)
  const [rewardChoices,setRewardChoices]=useState([]),[showReward,setShowReward]=useState(false),[showMilestone,setShowMilestone]=useState(false),[showEnd,setShowEnd]=useState(false),[endInfo,setEndInfo]=useState(null),[lostAny,setLostAny]=useState(false)
  const stage=campaign.stages[stageIndex],terrain=useMemo(()=>terrainFor(stage),[stage]),leader=PEOPLE[run.leader],general=PEOPLE[run.general],generalMini=ASSETS.people[run.general]?.mini
  const reinforceMult=useMemo(()=>{let m=run.upgrades.reinforceSpeed;for(const t of run.tech)m*=TECHS[t]?.reinforceMult||1;if(run.leader==='elder'&&run.leaderLevel>=2)m*=1.15;if(run.leader==='cleopatra'&&run.leaderLevel>=6)m*=1.20;if(run.general==='veteran'&&run.generalLevel>=2)m*=1.10;return m},[run])
  const reinforceHeal=useMemo(()=>{let h=.15+run.upgrades.reinforceHeal;if(run.leader==='cleopatra'&&run.leaderLevel>=3)h+=.08;if(run.tech.includes('agriculture'))h+=.03;if(run.tech.includes('irrigation'))h+=.04;return clamp(h,.10,.60)},[run])
  const specialReady=general?.special&&run.generalLevel>=(general.specialLevel||99)

  function setAction(mode,unitId=null){actionRef.current={mode,unitId};setActionMode(mode);setActionUnitId(unitId)}
  function resetDeployPositions(roster=run.roster){setDeployPos(roster.map((_,i)=>({...defaultPositions[i%defaultPositions.length]})));setSelectedRoster(0)}
  function autoDeploy(){resetDeployPositions()}

  function drawTerrain(ctx,t,st,showDeploy=false){
    const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,campaignId==='dawn'?'#7396a4':'#d7a16a');grad.addColorStop(.48,campaignId==='dawn'?'#56745a':'#a76d44');grad.addColorStop(1,campaignId==='dawn'?'#334633':'#725035');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H)
    ctx.fillStyle='#ffffff10';for(let i=0;i<25;i++)ctx.fillRect((i*73)%W,(i*117)%H,2,2)
    if(t.river){const[y1,y2]=t.riverY;ctx.fillStyle='#3d84a9cc';ctx.fillRect(0,y1,W,y2-y1);ctx.fillStyle='#8fd1e855';for(let y=y1+8;y<y2;y+=12)ctx.fillRect(0,y,W,2);for(const b of t.bridges){ctx.fillStyle='#8a6544';ctx.fillRect(b.x,y1-4,b.w,y2-y1+8);ctx.fillStyle='#b88d5c';for(let x=b.x+5;x<b.x+b.w;x+=12)ctx.fillRect(x,y1-2,6,y2-y1+4)}}
    for(const r of t.mountains){ctx.fillStyle='#505761';ctx.beginPath();ctx.moveTo(r.x,r.y+r.h);ctx.lineTo(r.x+r.w*.5,r.y);ctx.lineTo(r.x+r.w,r.y+r.h);ctx.closePath();ctx.fill();ctx.strokeStyle='#78818b';ctx.stroke()}
    if(showDeploy){ctx.fillStyle='#75d3a10d';ctx.fillRect(0,DEPLOY_TOP,W,H-DEPLOY_TOP);ctx.strokeStyle='#75d3a166';ctx.setLineDash([8,8]);ctx.strokeRect(6,DEPLOY_TOP+6,W-12,H-DEPLOY_TOP-12);ctx.setLineDash([])}
  }
  function drawDeploy(){
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');drawTerrain(ctx,terrain,stage,true)
    run.roster.slice(0,run.deployCap).forEach((r,i)=>{const p=deployPos[i]||defaultPositions[i];if(!p)return;drawSquad(ctx,makeEntity('player',r.type,p,r.hpFrac,run,1,i),i===selectedRoster,false)})
    stage.types.forEach((type,i)=>drawSquad(ctx,makeEntity('enemy',type,enemyCells[i%enemyCells.length],1,run,stage.mult,i),false,false))
  }
  useEffect(()=>{if(phase==='deploy')drawDeploy()},[phase,deployPos,selectedRoster,stageIndex,run])
  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[])

  function beginBattle(){
    const current=run.roster.slice(0,run.deployCap)
    if(current.length<1)return
    const player=current.map((r,i)=>makeEntity('player',r.type,deployPos[i]||defaultPositions[i],r.hpFrac,run,1,i)),enemy=stage.types.map((type,i)=>makeEntity('enemy',type,enemyCells[i],1,run,stage.mult,i))
    battleRef.current={player,enemy,projectiles:[],time:0,last:performance.now(),terrain,meter:0,enemyMeter:0,rallyCd:0,focusUntil:0,focusCd:0,focusTarget:null,specialUntil:0,specialCd:0,done:false}
    setPhase('battle');setAction(null);tick(performance.now())
  }
  function chooseTarget(e,enemies,b){
    let live=enemies.filter(x=>!x.dead);if(!live.length)return null
    if(e.side==='player'&&b.focusTarget&&b.focusUntil>b.time){const ft=live.find(x=>x.id===b.focusTarget);if(ft)return ft}
    if(roleHas(e.stats,'SPEAR')){const mounted=live.filter(x=>roleHas(x.stats,'MOUNTED'));if(mounted.length)live=mounted}
    return live.sort((a,c)=>dist(e,a)-dist(e,c))[0]
  }
  function moveTowardPoint(e,point,dt,b){
    const goal=movementWaypoint(e,point,b.terrain),dx=goal.x-e.x,dy=goal.y-e.y,dd=Math.hypot(dx,dy)||1,step=Math.min(dd,e.stats.moveSpeed*dt)
    let nx=e.x+dx/dd*step,ny=e.y+dy/dd*step
    if(blockedGroundPoint(nx,ny,b.terrain)){nx=e.x;ny=e.y}
    e.x=clamp(nx,20,W-20);e.y=clamp(ny,35,H-35);e.moved+=step
  }
  function moveEntity(e,target,dt,b){
    if(!target)return
    if(e.manualDestination){if(dist(e,e.manualDestination)<12){e.manualDestination=null}else{moveTowardPoint(e,e.manualDestination,dt,b);return}}
    const melee=e.stats.range<=0,desiredRange=melee?25:e.stats.range*.82
    if(dist(e,target)<=desiredRange&&!lineBlocked(e,target,b.terrain.mountains))return
    moveTowardPoint(e,target,dt,b)
  }
  function canShoot(e,t,b){return dist(e,t)<=e.stats.range&&!lineBlocked(e,t,b.terrain.mountains)}
  function attack(e,t,b){
    if(e.cool>0||!t||t.dead||e.manualDestination)return
    const melee=e.stats.range<=0;if(melee&&dist(e,t)>30)return;if(!melee&&!canShoot(e,t,b))return
    let dmg=e.stats.damage;if(e.side==='player'&&b.specialUntil>b.time&&run.general==='hannibal')dmg*=1.30;if(e.stats.antiMounted&&roleHas(t.stats,'MOUNTED'))dmg*=e.stats.antiMounted;if(e.stats.charge&&e.moved>70){dmg*=e.stats.charge;e.moved=0}
    const reduced=dmg*(100/(100+t.stats.armor*2.2));t.hp-=reduced;t.flash=.12;e.cool=1/e.stats.attackSpeed;if(!melee)b.projectiles.push({x:e.x,y:e.y,tx:t.x,ty:t.y,life:.25,side:e.side});if(t.hp<=0){t.hp=0;t.dead=true}
  }
  function simSide(side,foes,dt,b){for(const e of side){if(e.dead)continue;e.cool-=dt;e.flash=Math.max(0,e.flash-dt);const t=chooseTarget(e,foes,b);if(!t)continue;const melee=e.stats.range<=0;if(e.manualDestination||(melee&&dist(e,t)>30)||(!melee&&!canShoot(e,t,b)))moveEntity(e,t,dt,b);attack(e,t,b)}}
  function drawBattle(b){
    const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d');drawTerrain(ctx,b.terrain,stage,false)
    for(const p of b.projectiles){ctx.strokeStyle=p.side==='player'?'#ffe08a':'#ffc0c0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.tx,p.ty);ctx.stroke()}
    const mode=actionRef.current.mode,selectedId=actionRef.current.unitId
    b.enemy.forEach(e=>!e.dead&&drawSquad(ctx,e,e.id===selectedId,mode==='focus'))
    b.player.forEach(e=>!e.dead&&drawSquad(ctx,e,e.id===selectedId,mode==='reinforce'||mode==='rallyUnit'))
    if(mode){ctx.fillStyle='#07111daa';ctx.fillRect(95,350,330,62);ctx.strokeStyle='#77a6c8';ctx.strokeRect(95,350,330,62);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 17px system-ui';const title=mode==='focus'?'SELECT ENEMY':mode==='reinforce'?'SELECT UNIT TO REINFORCE':mode==='rallyUnit'?'SELECT UNIT TO MOVE':'SELECT DESTINATION';ctx.fillText(title,260,375);ctx.font='700 10px system-ui';ctx.fillText('Battle paused',260,395)}
  }
  function updateHud(b){
    const sum=(arr,k)=>arr.reduce((a,e)=>a+(e.dead?0:e[k]),0),max=arr=>arr.reduce((a,e)=>a+e.maxHp,0),power=arr=>Math.round(arr.filter(e=>!e.dead).reduce((a,e)=>a+e.hp*(e.stats.damage*e.stats.attackSpeed+e.stats.armor*.4),0)/10)
    const ph=sum(b.player,'hp'),pm=max(b.player),eh=sum(b.enemy,'hp'),em=max(b.enemy)
    setHud({player:pm?Math.round(ph/pm*100):0,enemy:em?Math.round(eh/em*100):0,powerP:power(b.player),powerE:power(b.enemy),meter:Math.floor(b.meter),enemyMeter:Math.floor(b.enemyMeter),rally:Math.max(0,b.rallyCd-b.time),focus:Math.max(0,b.focusCd-b.time),special:Math.max(0,b.specialCd-b.time)})
  }
  function tick(now){
    const b=battleRef.current;if(!b||b.done)return
    if(actionRef.current.mode){b.last=now;drawBattle(b);updateHud(b);rafRef.current=requestAnimationFrame(tick);return}
    const dt=Math.min(.04,(now-b.last)/1000);b.last=now;b.time+=dt;b.meter=clamp(b.meter+dt*5.2*reinforceMult,0,100);b.enemyMeter=clamp(b.enemyMeter+dt*4.1*(1+stageIndex*.02),0,100)
    if(b.enemyMeter>=100){const damaged=b.enemy.filter(e=>!e.dead&&e.hp<e.maxHp*.95).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(damaged){damaged.hp=Math.min(damaged.maxHp,damaged.hp+damaged.maxHp*(.13+stageIndex*.004));b.enemyMeter=0}}
    simSide(b.player,b.enemy,dt,b);simSide(b.enemy,b.player,dt,b);b.projectiles.forEach(p=>p.life-=dt);b.projectiles=b.projectiles.filter(p=>p.life>0);drawBattle(b);if(Math.floor(b.time*5)!==Math.floor((b.time-dt)*5))updateHud(b)
    const pAlive=b.player.some(e=>!e.dead),eAlive=b.enemy.some(e=>!e.dead);if(!pAlive||!eAlive){b.done=true;setTimeout(()=>finishBattle(pAlive&&!eAlive,b),320);return}rafRef.current=requestAnimationFrame(tick)
  }
  function finishBattle(victory,b){
    const hadLoss=b.player.some(e=>e.dead),totalLost=lostAny||hadLoss;if(hadLoss)setLostAny(true)
    if(!victory){setEndInfo({victory:false,gold:run.gold,tp:run.tp,battle:stageIndex+1,bestReached:stageIndex+1,units:run.roster.map(r=>r.type),stars:0});setShowEnd(true);setPhase('ended');return}
    const survivors=b.player.filter(e=>!e.dead).map(e=>({type:e.type,hpFrac:e.hp/e.maxHp})),recovery=clamp(.05+(meta.fieldMedicine||0)*.03+run.tech.reduce((a,t)=>a+(TECHS[t]?.recovery||0),0),.05,.25),newRoster=survivors.map((s,i)=>({uid:`r${i}-${Date.now()}`,type:s.type,hpFrac:clamp(s.hpFrac+(1-s.hpFrac)*recovery,0,1)})),goldGain=Math.round(stage.gold*leaderGoldMult()),nextRun={...run,roster:newRoster,gold:run.gold+goldGain,tp:run.tp+(stage.tp||0)}
    setRun(nextRun)
    if(stageIndex===14){const condition=newRoster.reduce((a,r)=>a+r.hpFrac,0)/Math.max(1,nextRun.deployCap),earnedStars=1+(condition>=.65?1:0)+(!totalLost?1:0);setEndInfo({victory:true,gold:nextRun.gold,tp:nextRun.tp,battle:15,bestReached:15,units:nextRun.roster.map(r=>r.type),stars:earnedStars});setShowEnd(true);setPhase('ended');return}
    if([4,9,13].includes(stageIndex)){setShowMilestone(true);setPhase('milestone');return}openRewards(nextRun)
  }
  function leaderGoldMult(){if(run.leader==='cleopatra'){if(run.leaderLevel>=2)return 1.25;if(run.leaderLevel>=1)return 1.15}if(run.leader==='elder')return 1.08;if(run.leader==='merchant')return run.leaderLevel>=3?1.20:1.12;return 1}
  function availableUnitTypes(){const ids=['warrior','spear','slinger'];for(const[id,u]of Object.entries(UNITS))if(u.requires&&u.requires.every(t=>run.tech.includes(t)))ids.push(id);if(run.general==='hannibal'&&run.generalLevel>=1)ids.push('warElephant');if(run.general==='napoleon'&&run.generalLevel>=1)ids.push('imperialGuard');if(run.leader==='cleopatra'&&run.leaderLevel>=5)ids.push('egyptianGuard');return[...new Set(ids)]}
  function openRewards(r=run,unitOnly=false){const options=[];if(r.roster.length<r.deployCap||unitOnly){const ids=availableUnitTypes().sort(()=>Math.random()-.5);for(const id of ids.slice(0,unitOnly?3:1))options.push({kind:'unit',id,name:`Recruit ${UNITS[id].name}`,icon:'⚑',desc:`Add one ${UNITS[id].name} squad.`})}if(!unitOnly)for(const rwd of REWARD_POOL.slice().sort(()=>Math.random()-.5).slice(0,3-options.length))options.push({kind:'upgrade',...rwd});setRewardChoices(options.slice(0,3));setShowReward(true);setPhase('reward')}
  function chooseReward(choice){let next={...run};if(choice.kind==='unit')next={...next,roster:[...next.roster,{uid:`r${Date.now()}`,type:choice.id,hpFrac:1}]};else next={...next,upgrades:choice.apply(next.upgrades)};setRun(next);setShowReward(false);advanceStage(next)}
  function advanceStage(nextRun=run){setStageIndex(i=>i+1);setRun(nextRun);setPhase('deploy');resetDeployPositions(nextRun.roster);setAction(null)}
  function milestone(type){if(type==='heal'){const next={...run,roster:run.roster.map(r=>({...r,hpFrac:1}))};setRun(next);setShowMilestone(false);advanceStage(next)}else{const cap=Math.min(6,run.deployCap+1),next={...run,deployCap:cap};setRun(next);setShowMilestone(false);openRewards(next,true)}}

  function activateRally(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.rallyCd)return;setAction('rallyUnit')}
  function activateFocus(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.focusCd)return;setAction('focus')}
  function activateReinforce(){const b=battleRef.current;if(!b||phase!=='battle'||b.meter<100)return;setAction('reinforce')}
  function activateSpecial(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.specialCd||!specialReady)return;if(run.general==='hannibal'){b.specialUntil=b.time+8;b.specialCd=b.time+34}else if(run.general==='napoleon'){for(const e of b.enemy.filter(e=>!e.dead)){e.hp=Math.max(0,e.hp-e.maxHp*.18);if(e.hp<=0)e.dead=true}b.specialCd=b.time+32}updateHud(b)}

  function handleCanvasClick(ev){
    const c=canvasRef.current,rect=c.getBoundingClientRect(),x=(ev.clientX-rect.left)*W/rect.width,y=(ev.clientY-rect.top)*H/rect.height
    if(phase==='deploy'){
      const points=run.roster.slice(0,run.deployCap).map((r,i)=>({i,p:deployPos[i]||defaultPositions[i]})),hit=points.sort((a,b)=>Math.hypot(a.p.x-x,a.p.y-y)-Math.hypot(b.p.x-x,b.p.y-y))[0]
      if(hit&&Math.hypot(hit.p.x-x,hit.p.y-y)<31){setSelectedRoster(hit.i);return}
      if(y>=DEPLOY_TOP&&!blockedGroundPoint(x,y,terrain)){setDeployPos(pos=>pos.map((p,i)=>i===selectedRoster?{x:clamp(x,28,W-28),y:clamp(y,DEPLOY_TOP+22,H-35)}:p));return}
      return
    }
    const b=battleRef.current;if(!b)return;const action=actionRef.current
    const nearest=(arr)=>arr.filter(e=>!e.dead).sort((a,c)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(c.x-x,c.y-y))[0]
    if(action.mode==='rallyUnit'){const e=nearest(b.player);if(e&&Math.hypot(e.x-x,e.y-y)<38){setAction('rallyDestination',e.id)}return}
    if(action.mode==='rallyDestination'){const e=b.player.find(u=>u.id===action.unitId&&!u.dead);if(e&&!blockedGroundPoint(x,y,b.terrain)){e.manualDestination={x:clamp(x,20,W-20),y:clamp(y,35,H-35)};b.rallyCd=b.time+16;setAction(null);updateHud(b)}return}
    if(action.mode==='focus'){const e=nearest(b.enemy);if(e&&Math.hypot(e.x-x,e.y-y)<40){b.focusTarget=e.id;b.focusUntil=b.time+8;b.focusCd=b.time+14;setAction(null);updateHud(b)}return}
    if(action.mode==='reinforce'){const e=nearest(b.player);if(e&&Math.hypot(e.x-x,e.y-y)<40){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*reinforceHeal);b.meter=0;setAction(null);updateHud(b)}return}
  }

  const statsBlock=<div className="battle-stats-card"><div className="battle-stat-title"><span>{campaign.name}</span><b>{stageIndex+1}/15 · {stage.name}</b></div><div className="battle-life"><div><span>YOUR ARMY · {hud.player}%</span><i><em style={{width:`${hud.player}%`}}/></i><small>{battleRef.current?.player?.filter(e=>!e.dead).length??run.roster.length} squads · Power {hud.powerP}</small></div><div className="enemy"><span>ENEMY · {hud.enemy}%</span><i><em style={{width:`${hud.enemy}%`}}/></i><small>{battleRef.current?.enemy?.filter(e=>!e.dead).length??stage.types.length} squads · Power {hud.powerE}</small></div></div><div className="replacement-line"><span>Replacements</span><b>{hud.meter}%</b></div></div>
  const actionButtons=phase==='deploy'?<div className="battle-actions-grid deployment"><button onClick={autoDeploy}><b>Auto Deploy</b><span>Reset formation</span></button><button className="primary-action" onClick={beginBattle}><b>Finish Deployment</b><span>Start battle</span></button></div>:<div className="battle-actions-grid"><button disabled={hud.rally>0} className={actionMode?.startsWith('rally')?'selected':''} onClick={activateRally}><b>Rally</b><span>{actionMode==='rallyUnit'?'Select unit':actionMode==='rallyDestination'?'Choose destination':hud.rally>0?`${hud.rally.toFixed(0)}s`:'Move one unit'}</span></button><button disabled={hud.focus>0} className={actionMode==='focus'?'selected':''} onClick={activateFocus}><b>Focus</b><span>{actionMode==='focus'?'Select enemy':hud.focus>0?`${hud.focus.toFixed(0)}s`:'All target one unit'}</span></button><button disabled={hud.meter<100} className={actionMode==='reinforce'?'selected':''} onClick={activateReinforce}><b>Reinforce</b><span>{actionMode==='reinforce'?'Select unit':hud.meter>=100?`Heal ${Math.round(reinforceHeal*100)}%`:`${hud.meter}%`}</span></button><button disabled={!specialReady||hud.special>0} onClick={activateSpecial}><b>Special</b><span>{!specialReady?'Disabled':hud.special>0?`${hud.special.toFixed(0)}s`:general.special}</span></button></div>
  const commandBlock=<div className="battle-command-card"><div className="general-mini">{generalMini?<img src={generalMini} alt={general.name}/>:<div>{general.icon}</div>}<span><b>{general.name}</b><small>{phase==='deploy'?UNITS[run.roster[selectedRoster]?.type]?.name||'Select a squad':actionMode?'Battle paused for selection':'Command ready'}</small></span></div>{actionButtons}</div>

  return <div className="battle-page">
    <div className="battlefield-panel"><canvas ref={canvasRef} width={W} height={H} onClick={handleCanvasClick}/><div className="mobile-stats-overlay">{statsBlock}</div><div className="mobile-command-overlay">{commandBlock}</div></div>
    <aside className="desktop-battle-sidebar"><div>{statsBlock}</div><div>{commandBlock}</div></aside>

    <Modal open={showReward} title="Evolution — choose one" wide><div className="reward-grid">{rewardChoices.map(c=><button key={c.id||c.name} className="reward-card" onClick={()=>chooseReward(c)}><strong>{c.icon}</strong><h4>{c.name}</h4><p>{c.desc}</p></button>)}</div></Modal>
    <Modal open={showMilestone} title={`Campaign milestone after battle ${stageIndex+1}`} wide><div className="milestone-grid"><button onClick={()=>milestone('size')}><strong>⚑＋</strong><h4>Expand Army</h4><p>Increase deployment capacity by one, then recruit a new squad.</p></button><button onClick={()=>milestone('heal')}><strong>✚</strong><h4>Full Recovery</h4><p>Restore every surviving squad to 100%. Destroyed squads stay dead.</p></button></div></Modal>
    <Modal open={showEnd} title={endInfo?.victory?'Campaign conquered':'Your army has fallen'}><div className="end-summary"><h3>{endInfo?.victory?'Victory!':`Defeated at battle ${endInfo?.battle}`}</h3><p>You bank <b>◉ {endInfo?.gold||0}</b> Gold and <b>✦ {endInfo?.tp||0}</b> Technology Points.</p>{endInfo?.victory&&<p>Stars earned: <b>{endInfo.stars}/3</b></p>}<button className="primary" onClick={()=>onFinish({...endInfo,campaign:campaignId})}>Return to Campaign</button></div></Modal>
  </div>
}
