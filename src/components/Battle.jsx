import { useEffect, useMemo, useRef, useState } from 'react'
import { ASSETS } from '../assets'
import { CAMPAIGNS, ITEMS, PEOPLE, TECHS, UNITS, REWARD_POOL, itemEffectAtLevel, unitStatsAtLevel } from '../data'
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
  const base=side==='player'?unitStatsAtLevel(type,run.unitLevels?.[type]||1):UNITS[type],s={...base}
  if(side==='player'){
    s.health*=run.upgrades.health;s.armor+=run.upgrades.armorBonus;s.damage*=run.upgrades.damage;s.attackSpeed*=run.upgrades.attackSpeed
    if(roleHas(s,'RANGED')||roleHas(s,'FIREARM'))s.range*=run.upgrades.range
    const gl=run.generalLevel
    if(run.general==='veteran'&&gl>=1)s.damage*=1.06
    if(run.general==='veteran'&&gl>=3)s.health*=1.08
    if(run.general==='hunter'&&(roleHas(s,'RANGED')||roleHas(s,'FIREARM'))){if(gl>=1)s.damage*=1.08;if(gl>=2)s.attackSpeed*=1.10;if(gl>=3)s.range*=1.12}
    if(run.general==='hannibal'&&(roleHas(s,'MOUNTED')||roleHas(s,'HEAVY'))){if(gl>=1)s.damage*=1.10;if(gl>=2)s.damage=(s.damage/1.10)*1.20;if(gl>=4)s.damage=(s.damage/1.20)*1.30;if(type==='warElephant'&&gl>=5){s.health*=1.35;s.damage*=1.25;s.armor+=8}}
    if(run.general==='napoleon'){if(gl>=1)s.damage*=1.10;if(gl>=2&&(roleHas(s,'FIREARM')||roleHas(s,'RANGED')))s.attackSpeed*=1.15;if(type==='imperialGuard'&&gl>=5){s.health*=1.30;s.damage*=1.25}}
    if(run.general==='sargon'&&roleHas(s,'MELEE'))s.damage*=gl>=2?1.15:1.08
    if(run.general==='thutmose'&&roleHas(s,'MOUNTED')){s.damage*=1.10;if(gl>=2)s.moveSpeed*=1.15}
    if(run.leader==='narmer'&&run.leaderLevel>=1)s.health*=1.08
    if(run.leader==='cyrus'&&run.leaderLevel>=1)s.health*=1.05
    if(run.leader==='ramesses'&&run.leaderLevel>=4)s.health*=1.10
    if(run.tech.includes('fire')&&run.tech.includes('archery')&&(roleHas(s,'RANGED')||roleHas(s,'FIREARM')))s.damage*=1.12
    for(const itemId of (run.unitEquipment?.[type]||[])){
      const effect=itemEffectAtLevel(itemId,run.artifactLevels?.[itemId]||1)
      if(effect.armor)s.armor+=effect.armor
      if(effect.damageMult)s.damage*=effect.damageMult
      if(effect.attackSpeedMult)s.attackSpeed*=effect.attackSpeedMult
      if(effect.healthMult)s.health*=effect.healthMult
    }
    const heroRelicId=run.heroEquipment?.[run.general]
    const heroRelicEffect=heroRelicId?itemEffectAtLevel(heroRelicId,run.artifactLevels?.[heroRelicId]||1):null
    if(heroRelicEffect?.damageMult)s.damage*=heroRelicEffect.damageMult
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
function segmentGroundBlocked(a,b,terrain){
  const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(2,Math.ceil(d/12))
  for(let i=1;i<=steps;i++){const t=i/steps,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(blockedGroundPoint(x,y,terrain))return true}
  return false
}
function findGroundPath(start,goal,terrain){
  // Coarse A* navigation. Smaller cells + segment validation makes it much harder for a unit
  // to get trapped against mountain rectangles or miss a bridge opening.
  const step=18,minX=16,maxX=W-16,minY=26,maxY=H-24
  const snap=p=>({x:clamp(Math.round((p.x-minX)/step)*step+minX,minX,maxX),y:clamp(Math.round((p.y-minY)/step)*step+minY,minY,maxY)})
  const nearestValid=p=>{
    const s=snap(p)
    if(!blockedGroundPoint(s.x,s.y,terrain))return s
    for(let r=1;r<12;r++){
      const candidates=[]
      for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(Math.abs(dx)===r||Math.abs(dy)===r)candidates.push({x:clamp(s.x+dx*step,minX,maxX),y:clamp(s.y+dy*step,minY,maxY)})
      candidates.sort((a,b)=>dist(a,p)-dist(b,p))
      const ok=candidates.find(q=>!blockedGroundPoint(q.x,q.y,terrain))
      if(ok)return ok
    }
    return s
  }
  const s=nearestValid(start),g=nearestValid(goal),key=p=>`${p.x},${p.y}`,heur=p=>Math.hypot(p.x-g.x,p.y-g.y)
  const open=[{...s,g:0,f:heur(s)}],came=new Map(),best=new Map([[key(s),0]]),closed=new Set()
  const dirs=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]
  let found=null,guard=0
  while(open.length&&guard++<5000){
    open.sort((a,b)=>a.f-b.f);const cur=open.shift(),ck=key(cur)
    if(closed.has(ck))continue;closed.add(ck)
    if(Math.hypot(cur.x-g.x,cur.y-g.y)<step*1.15){found=cur;break}
    for(const[dX,dY]of dirs){
      const n={x:cur.x+dX*step,y:cur.y+dY*step}
      if(n.x<minX||n.x>maxX||n.y<minY||n.y>maxY||blockedGroundPoint(n.x,n.y,terrain))continue
      if(dX&&dY&&(blockedGroundPoint(cur.x+dX*step,cur.y,terrain)||blockedGroundPoint(cur.x,cur.y+dY*step,terrain)))continue
      if(segmentGroundBlocked(cur,n,terrain))continue
      const nk=key(n),ng=cur.g+(dX&&dY?1.414:1)*step
      if(ng>=(best.get(nk)??Infinity))continue
      best.set(nk,ng);came.set(nk,ck);open.push({...n,g:ng,f:ng+heur(n)})
    }
  }
  if(!found)return[]
  const path=[];let ck=key(found),skey=key(s),safety=0
  while(ck!==skey&&safety++<800){const[x,y]=ck.split(',').map(Number);path.push({x,y});ck=came.get(ck);if(!ck)break}
  path.reverse();path.push({x:g.x,y:g.y})
  // Basic smoothing: skip intermediate nodes when the straight segment is now clear.
  const smooth=[];let anchor={x:start.x,y:start.y},i=0
  while(i<path.length){let far=i;for(let j=path.length-1;j>=i;j--){if(!segmentGroundBlocked(anchor,path[j],terrain)){far=j;break}}smooth.push(path[far]);anchor=path[far];i=far+1}
  return smooth
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

export default function Battle({campaignId,loadout,startingRoster,startCapacity,eligibleUnits=[],meta,onFinish}){
  const campaign=CAMPAIGNS[campaignId],canvasRef=useRef(null),battleRef=useRef(null),rafRef=useRef(null),actionRef=useRef({mode:null,unitId:null}),actionTimeoutRef=useRef(null),killsRef=useRef(0)
  const [phase,setPhase]=useState('deploy'),[stageIndex,setStageIndex]=useState(0)
  const [run,setRun]=useState(()=>({campaign:campaignId,leader:loadout.leader||null,general:loadout.general||null,tech:(loadout.tech||[]).filter(Boolean),leaderLevel:loadout.leader?(meta.characterLevels[loadout.leader]||1):0,generalLevel:loadout.general?(meta.characterLevels[loadout.general]||1):0,roster:startingRoster.map((type,i)=>({uid:`r${i}-${Date.now()}`,type,hpFrac:1})),deployCap:startCapacity,gold:0,xp:0,tp:0,eligibleUnits:[...eligibleUnits],unitLevels:meta.unitLevels||{},unitEquipment:meta.unitEquipment||{},heroEquipment:meta.heroEquipment||{},artifactLevels:meta.artifactLevels||{},upgrades:{damage:1,health:1,attackSpeed:1,range:1,armorBonus:0,reinforceSpeed:1,reinforceHeal:0}}))
  const [deployPos,setDeployPos]=useState(()=>startingRoster.map((_,i)=>({...defaultPositions[i]}))),[selectedRoster,setSelectedRoster]=useState(0)
  const [hud,setHud]=useState({player:100,enemy:100,powerP:0,powerE:0,meter:0,enemyMeter:0,rally:0,focus:0,special:0}),[actionMode,setActionMode]=useState(null),[actionUnitId,setActionUnitId]=useState(null)
  const [rewardChoices,setRewardChoices]=useState([]),[showReward,setShowReward]=useState(false),[showMilestone,setShowMilestone]=useState(false),[showEnd,setShowEnd]=useState(false),[endInfo,setEndInfo]=useState(null),[lostAny,setLostAny]=useState(false),[flawlessCount,setFlawlessCount]=useState(0),[showBrief,setShowBrief]=useState(true)
  const stage=campaign.stages[stageIndex],terrain=useMemo(()=>terrainFor(stage),[stage]),leader=PEOPLE[run.leader]||null,general=PEOPLE[run.general]||null,generalMini=run.general?ASSETS.people[run.general]?.mini:null
  const reinforceMult=useMemo(()=>{let m=run.upgrades.reinforceSpeed;for(const t of run.tech)m*=TECHS[t]?.reinforceMult||1;if(run.leader==='elder'&&run.leaderLevel>=2)m*=1.15;if(run.leader==='cleopatra'&&run.leaderLevel>=6)m*=1.20;if(run.general==='veteran'&&run.generalLevel>=2)m*=1.10;if(run.leader==='ramesses'&&run.leaderLevel>=1)m*=1.10;if(run.leader==='cyrus'&&run.leaderLevel>=2)m*=1.15;const relicId=run.heroEquipment?.[run.general];const effect=relicId?itemEffectAtLevel(relicId,run.artifactLevels?.[relicId]||1):null;if(effect?.reinforceMult)m*=effect.reinforceMult;return m},[run])
  const reinforceHeal=useMemo(()=>{let h=.15+run.upgrades.reinforceHeal;if(run.leader==='cleopatra'&&run.leaderLevel>=3)h+=.08;if(run.tech.includes('agriculture'))h+=.03;if(run.tech.includes('irrigation'))h+=.04;return clamp(h,.10,.60)},[run])
  const specialReady=!!(general?.special&&run.generalLevel>=(general.specialLevel||99))

  function setAction(mode,unitId=null){
    if(actionTimeoutRef.current)clearTimeout(actionTimeoutRef.current)
    actionRef.current={mode,unitId};setActionMode(mode);setActionUnitId(unitId)
    if(mode){actionTimeoutRef.current=setTimeout(()=>{actionRef.current={mode:null,unitId:null};setActionMode(null);setActionUnitId(null)},2000)}
  }
  useEffect(()=>()=>{if(actionTimeoutRef.current)clearTimeout(actionTimeoutRef.current)},[])
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
    battleRef.current={player,enemy,projectiles:[],time:0,last:performance.now(),terrain,meter:35,enemyMeter:0,rallyCd:0,focusUntil:0,focusCd:0,focusTarget:null,specialUntil:0,specialCd:0,done:false}
    setPhase('battle');setAction(null);tick(performance.now())
  }
  function chooseTarget(e,enemies,b){
    let live=enemies.filter(x=>!x.dead);if(!live.length)return null
    if(e.side==='player'&&b.focusTarget&&b.focusUntil>b.time){const ft=live.find(x=>x.id===b.focusTarget);if(ft)return ft}
    if(roleHas(e.stats,'SPEAR')){const mounted=live.filter(x=>roleHas(x.stats,'MOUNTED'));if(mounted.length)live=mounted}
    return live.sort((a,c)=>dist(e,a)-dist(e,c))[0]
  }
  function moveTowardPoint(e,point,dt,b){
    let goal=point
    const targetKey=`${Math.round(point.x/45)},${Math.round(point.y/45)}`
    const directBlocked=segmentGroundBlocked(e,point,b.terrain)
    if(directBlocked){
      if(!e.navPath||!e.navPath.length||e.navTargetKey!==targetKey||b.time>(e.navRecalc||0)){
        e.navPath=findGroundPath(e,point,b.terrain);e.navTargetKey=targetKey;e.navRecalc=b.time+.55
      }
      while(e.navPath?.length&&dist(e,e.navPath[0])<14)e.navPath.shift()
      if(e.navPath?.length)goal=e.navPath[0]
      else goal=movementWaypoint(e,point,b.terrain)
    }else{e.navPath=null;e.navTargetKey=null}
    const dx=goal.x-e.x,dy=goal.y-e.y,dd=Math.hypot(dx,dy)||1,step=Math.min(dd,e.stats.moveSpeed*dt)
    let nx=e.x+dx/dd*step,ny=e.y+dy/dd*step
    if(blockedGroundPoint(nx,ny,b.terrain)){
      e.navPath=findGroundPath(e,point,b.terrain);e.navRecalc=b.time+.25
      const next=e.navPath?.[0];if(next){const ndx=next.x-e.x,ndy=next.y-e.y,nd=Math.hypot(ndx,ndy)||1;nx=e.x+ndx/nd*Math.min(nd,e.stats.moveSpeed*dt);ny=e.y+ndy/nd*Math.min(nd,e.stats.moveSpeed*dt)}else{nx=e.x;ny=e.y}
    }
    e.x=clamp(nx,20,W-20);e.y=clamp(ny,35,H-35);e.moved+=Math.hypot(e.x-(e._lastX??e.x),e.y-(e._lastY??e.y));e._lastX=e.x;e._lastY=e.y
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
    let dmg=e.stats.damage;if(e.side==='player'&&b.specialUntil>b.time&&run.general==='hannibal')dmg*=1.30;if(e.side==='player'&&b.specialUntil>b.time&&run.general==='thutmose'&&roleHas(e.stats,'MOUNTED'))dmg*=1.35;if(e.stats.antiMounted&&roleHas(t.stats,'MOUNTED'))dmg*=e.stats.antiMounted;if(e.stats.charge&&e.moved>70){dmg*=e.stats.charge;e.moved=0}
    const reduced=dmg*(100/(100+t.stats.armor*2.2));t.hp-=reduced;t.flash=.12;e.cool=1/e.stats.attackSpeed;if(!melee)b.projectiles.push({x:e.x,y:e.y,tx:t.x,ty:t.y,life:.25,side:e.side});if(t.hp<=0){t.hp=0;t.dead=true;if(t.side==='enemy')killsRef.current++}
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
    const dt=Math.min(.04,(now-b.last)/1000);b.last=now;b.time+=dt;b.meter=clamp(b.meter+dt*7.5*reinforceMult,0,100);b.enemyMeter=clamp(b.enemyMeter+dt*4.4*(1+stageIndex*.018),0,100)
    if(b.enemyMeter>=100){const damaged=b.enemy.filter(e=>!e.dead&&e.hp<e.maxHp*.95).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(damaged){damaged.hp=Math.min(damaged.maxHp,damaged.hp+damaged.maxHp*(.13+stageIndex*.004));b.enemyMeter=0}}
    simSide(b.player,b.enemy,dt,b);simSide(b.enemy,b.player,dt,b);b.projectiles.forEach(p=>p.life-=dt);b.projectiles=b.projectiles.filter(p=>p.life>0);drawBattle(b);if(Math.floor(b.time*5)!==Math.floor((b.time-dt)*5))updateHud(b)
    const pAlive=b.player.some(e=>!e.dead),eAlive=b.enemy.some(e=>!e.dead);if(!pAlive||!eAlive){b.done=true;setTimeout(()=>finishBattle(pAlive&&!eAlive,b),320);return}rafRef.current=requestAnimationFrame(tick)
  }
  function finishBattle(victory,b){
    const hadLoss=b.player.some(e=>e.dead),totalLost=lostAny||hadLoss
    if(hadLoss)setLostAny(true)
    if(!victory){setEndInfo({victory:false,gold:run.gold+6,xp:run.xp+2,tp:run.tp,battle:stageIndex+1,bestReached:stageIndex+1,units:run.roster.map(r=>r.type),stars:0,flawlessBattles:flawlessCount,unitsKilled:killsRef.current});setShowEnd(true);setPhase('ended');return}
    const newFlawless=flawlessCount+(hadLoss?0:1);setFlawlessCount(newFlawless)
    const survivors=b.player.filter(e=>!e.dead).map(e=>({type:e.type,hpFrac:e.hp/e.maxHp})),recovery=clamp(.05+run.tech.reduce((a,t)=>a+(TECHS[t]?.recovery||0),0)+(run.leader==='cyrus'&&run.leaderLevel>=4?.08:0),.05,.28),newRoster=survivors.map((s,i)=>({uid:`r${i}-${Date.now()}`,type:s.type,hpFrac:clamp(s.hpFrac+(1-s.hpFrac)*recovery,0,1)})),goldGain=Math.round(stage.gold*leaderGoldMult()),xpGain=stage.xp||0,tpGain=meta.featureUnlocks?.technology?(stage.tp||0):0,nextRun={...run,roster:newRoster,gold:run.gold+goldGain,xp:run.xp+xpGain,tp:run.tp+tpGain}
    setRun(nextRun)
    if(stageIndex===campaign.stages.length-1){const condition=newRoster.reduce((a,r)=>a+r.hpFrac,0)/Math.max(1,nextRun.deployCap),earnedStars=1+(condition>=.65?1:0)+(!totalLost?1:0);setEndInfo({victory:true,gold:nextRun.gold,xp:nextRun.xp,tp:nextRun.tp,battle:15,bestReached:15,units:nextRun.roster.map(r=>r.type),stars:earnedStars,flawlessBattles:newFlawless,unitsKilled:killsRef.current});setShowEnd(true);setPhase('ended');return}
    if((campaign.milestones||[4,9,Math.max(0,campaign.stages.length-2)]).includes(stageIndex)){setShowMilestone(true);setPhase('milestone');return}openRewards(nextRun)
  }
  function leaderGoldMult(){let m=1;if(run.leader==='cleopatra'){if(run.leaderLevel>=2)m=1.25;else if(run.leaderLevel>=1)m=1.15}else if(run.leader==='elder')m=1.08;else if(run.leader==='merchant')m=run.leaderLevel>=3?1.20:1.12;else if(run.leader==='ramesses'&&run.leaderLevel>=2)m=1.12;else if(run.leader==='cyrus'&&run.leaderLevel>=1)m=1.10;const relicId=run.heroEquipment?.[run.leader];const effect=relicId?itemEffectAtLevel(relicId,run.artifactLevels?.[relicId]||1):null;if(effect?.goldMult)m*=effect.goldMult;return m}
  function availableUnitTypes(){return [...new Set((run.eligibleUnits?.length?run.eligibleUnits:['warrior']).filter(id=>UNITS[id]))]}
  function openRewards(r=run,unitOnly=false){const options=[];if(r.roster.length<r.deployCap||unitOnly){const ids=availableUnitTypes().sort(()=>Math.random()-.5);for(const id of ids.slice(0,unitOnly?3:1))options.push({kind:'unit',id,name:`Recruit ${UNITS[id].name}`,icon:'⚑',desc:`Add one ${UNITS[id].name} squad.`})}if(!unitOnly)for(const rwd of REWARD_POOL.slice().sort(()=>Math.random()-.5).slice(0,3-options.length))options.push({kind:'upgrade',...rwd});setRewardChoices(options.slice(0,3));setShowReward(true);setPhase('reward')}
  function chooseReward(choice){let next={...run};if(choice.kind==='unit')next={...next,roster:[...next.roster,{uid:`r${Date.now()}`,type:choice.id,hpFrac:1}]};else next={...next,upgrades:choice.apply(next.upgrades)};setRun(next);setShowReward(false);advanceStage(next)}
  function advanceStage(nextRun=run){setStageIndex(i=>i+1);setRun(nextRun);setPhase('deploy');resetDeployPositions(nextRun.roster);setAction(null);setShowBrief(true)}
  function milestone(type){if(type==='heal'){const next={...run,roster:run.roster.map(r=>({...r,hpFrac:1}))};setRun(next);setShowMilestone(false);advanceStage(next)}else{const cap=Math.min(6,run.deployCap+1),next={...run,deployCap:cap};setRun(next);setShowMilestone(false);openRewards(next,true)}}

  function activateRally(){const b=battleRef.current;if(!b||phase!=='battle')return;if(actionRef.current.mode?.startsWith('rally')){setAction(null);return}if(b.time<b.rallyCd)return;setAction('rallyUnit')}
  function activateFocus(){const b=battleRef.current;if(!b||phase!=='battle')return;if(actionRef.current.mode==='focus'){setAction(null);return}if(b.time<b.focusCd)return;setAction('focus')}
  function activateReinforce(){const b=battleRef.current;if(!b||phase!=='battle')return;if(actionRef.current.mode==='reinforce'){setAction(null);return}if(b.meter<100)return;setAction('reinforce')}
  function activateSpecial(){const b=battleRef.current;if(!b||phase!=='battle'||b.time<b.specialCd||!specialReady)return;if(run.general==='hannibal'){b.specialUntil=b.time+8;b.specialCd=b.time+34}else if(run.general==='thutmose'){b.specialUntil=b.time+7;b.specialCd=b.time+30}else if(run.general==='napoleon'){for(const e of b.enemy.filter(e=>!e.dead)){const wasAlive=!e.dead;e.hp=Math.max(0,e.hp-e.maxHp*.18);if(e.hp<=0){e.dead=true;if(wasAlive)killsRef.current++}}b.specialCd=b.time+32}updateHud(b)}

  function chooseActionTarget(id){
    const b=battleRef.current;if(!b)return
    const action=actionRef.current
    if(action.mode==='rallyUnit'){const e=b.player.find(u=>u.id===id&&!u.dead);if(e)setAction('rallyDestination',e.id);return}
    if(action.mode==='focus'){const e=b.enemy.find(u=>u.id===id&&!u.dead);if(e){b.focusTarget=e.id;b.focusUntil=b.time+4;b.focusCd=b.time+6;setAction(null);updateHud(b)}return}
    if(action.mode==='reinforce'){const e=b.player.find(u=>u.id===id&&!u.dead);if(e){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*reinforceHeal);b.meter=0;setAction(null);updateHud(b)}return}
  }

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
    if(action.mode==='rallyUnit'){const e=nearest(b.player);if(e&&Math.hypot(e.x-x,e.y-y)<38)chooseActionTarget(e.id);return}
    if(action.mode==='rallyDestination'){const e=b.player.find(u=>u.id===action.unitId&&!u.dead);if(e&&!blockedGroundPoint(x,y,b.terrain)){e.manualDestination={x:clamp(x,20,W-20),y:clamp(y,35,H-35)};e.navPath=null;b.rallyCd=b.time+6;setAction(null);updateHud(b)}return}
    if(action.mode==='focus'){const e=nearest(b.enemy);if(e&&Math.hypot(e.x-x,e.y-y)<40)chooseActionTarget(e.id);return}
    if(action.mode==='reinforce'){const e=nearest(b.player);if(e&&Math.hypot(e.x-x,e.y-y)<40)chooseActionTarget(e.id);return}
  }

  function enhancementSummary(){
    const chips=[]
    if(run.upgrades.damage>1.001)chips.push(`Damage +${Math.round((run.upgrades.damage-1)*100)}%`)
    if(run.upgrades.health>1.001)chips.push(`Health +${Math.round((run.upgrades.health-1)*100)}%`)
    if(run.upgrades.attackSpeed>1.001)chips.push(`Attack speed +${Math.round((run.upgrades.attackSpeed-1)*100)}%`)
    if(run.upgrades.range>1.001)chips.push(`Range +${Math.round((run.upgrades.range-1)*100)}%`)
    if(run.upgrades.armorBonus>0)chips.push(`Armor +${run.upgrades.armorBonus}`)
    if(reinforceMult>1.001)chips.push(`Reinforce speed +${Math.round((reinforceMult-1)*100)}%`)
    if(reinforceHeal>.151)chips.push(`Reinforce heal ${Math.round(reinforceHeal*100)}%`)
    if(run.general)chips.push(`${general?.name||'General'} Lv${run.generalLevel}`)
    if(run.leader)chips.push(`${leader?.name||'Leader'} Lv${run.leaderLevel}`)
    for(const t of run.tech)if(TECHS[t])chips.push(TECHS[t].name)
    const rosterTypes=[...new Set(run.roster.map(r=>r.type))]
    for(const type of rosterTypes){const lv=run.unitLevels?.[type]||1;if(lv>1)chips.push(`${UNITS[type].name} Lv${lv}`);for(const itemId of (run.unitEquipment?.[type]||[]))if(ITEMS[itemId])chips.push(ITEMS[itemId].name)}
    return chips.length?chips:['No temporary enhancements yet']
  }
  const statsBlock=<div className="battle-stats-card"><div className="battle-stat-title"><span>{campaign.name}</span><b>{stageIndex+1}/{campaign.stages.length} · {stage.name}</b></div><div className="battle-life"><div><span>YOUR ARMY · {hud.player}%</span><i><em style={{width:`${hud.player}%`}}/></i><small>{battleRef.current?.player?.filter(e=>!e.dead).length??run.roster.length} squads · Power {hud.powerP}</small></div><div className="enemy"><span>ENEMY · {hud.enemy}%</span><i><em style={{width:`${hud.enemy}%`}}/></i><small>{battleRef.current?.enemy?.filter(e=>!e.dead).length??stage.types.length} squads · Power {hud.powerE}</small></div></div><div className="replacement-line"><span>Replacements</span><b>{hud.meter}%</b></div><div className="enhancement-strip"><b>YOUR ENHANCEMENTS · PLAYER ONLY</b><div>{enhancementSummary().map((x,i)=><span key={`${x}-${i}`}>{x}</span>)}</div></div></div>
  const actionButtons=phase==='deploy'?<div className="battle-actions-grid deployment"><button onClick={autoDeploy}><b>Auto Deploy</b><span>Reset formation</span></button><button className="primary-action" onClick={beginBattle}><b>Finish Deployment</b><span>Start battle</span></button></div>:<div className="battle-actions-grid"><button disabled={hud.rally>0} className={actionMode?.startsWith('rally')?'selected':''} onClick={activateRally}><b>Rally</b><span>{actionMode==='rallyUnit'?'Select unit':actionMode==='rallyDestination'?'Choose destination':hud.rally>0?`${hud.rally.toFixed(0)}s`:'Move one unit'}</span></button><button disabled={hud.focus>0} className={actionMode==='focus'?'selected':''} onClick={activateFocus}><b>Focus</b><span>{actionMode==='focus'?'Select enemy':hud.focus>0?`${hud.focus.toFixed(0)}s`:'All target one unit'}</span></button><button disabled={hud.meter<100} className={actionMode==='reinforce'?'selected':''} onClick={activateReinforce}><b>Reinforce</b><span>{actionMode==='reinforce'?'Select unit':hud.meter>=100?`Heal ${Math.round(reinforceHeal*100)}%`:`${hud.meter}%`}</span></button><button disabled={!specialReady||hud.special>0} onClick={activateSpecial}><b>Special</b><span>{!specialReady?'Disabled':hud.special>0?`${hud.special.toFixed(0)}s`:general?.special||'Special'}</span></button></div>
  const targetList=actionMode==='focus'?(battleRef.current?.enemy||[]).filter(e=>!e.dead):(actionMode==='reinforce'||actionMode==='rallyUnit')?(battleRef.current?.player||[]).filter(e=>!e.dead):[]
  const targetStrip=phase==='battle'&&actionMode?<div className="command-target-strip">{actionMode==='rallyDestination'?<div className="destination-hint"><b>Rally destination</b><span>Tap a valid point on the battlefield. Selection resumes automatically after a short timeout.</span></div>:targetList.map((e,i)=><button key={e.id} onClick={()=>chooseActionTarget(e.id)}><span>{i+1}</span><div><b>{UNITS[e.type].name}</b><small>{Math.round(e.hp/e.maxHp*100)}% HP</small></div></button>)}</div>:null
  const commandBlock=<div className="battle-command-card"><div className="general-mini">{generalMini?<img src={generalMini} alt={general?.name||'Commander'}/>:<div>{general?.icon||'⚔'}</div>}<span><b>{general?.name||'Field Command'}</b><small>{phase==='deploy'?UNITS[run.roster[selectedRoster]?.type]?.name||'Select a squad':actionMode?'Battle paused briefly for selection':'Command ready'}</small></span></div>{actionButtons}{targetStrip}</div>

  return <div className="battle-shell-with-header"><header className="mobile-game-header battle-game-header"><img src={ASSETS.logo} alt="March of Epochs"/><div className="header-currencies"><span className="xp">✦ <b>{meta.xp}</b><small>EXP</small></span><span className="gold">◉ <b>{meta.gold}</b><small>GOLD</small></span><span className={`tp ${meta.featureUnlocks?.technology?'':'locked'}`}>⚗ <b>{meta.tp}</b><small>TP</small></span></div></header><div className="battle-page">
    <div className="battlefield-panel"><canvas ref={canvasRef} width={W} height={H} onClick={handleCanvasClick}/><div className="mobile-stats-overlay">{statsBlock}</div><div className="mobile-command-overlay">{commandBlock}</div></div>
    <aside className="desktop-battle-sidebar"><div>{statsBlock}</div><div>{commandBlock}</div></aside>

    <Modal open={showBrief&&phase==='deploy'} onClose={()=>setShowBrief(false)} title={`${stage.name} · ${stage.date||''}`} wide><div className="battle-brief"><div><span className="brief-kicker">WHY IT MATTERS</span><p>{stage.history}</p></div><div className="brief-tactical"><span className="brief-kicker">TACTICAL CLUE</span><p>{stage.tip}</p><div className="brief-condition"><b>Terrain condition</b><span>{terrain.river?'Water blocks ground movement except at bridges. Ranged attacks can cross water.':terrain.mountains.length?'High ground / obstacles block movement and ranged line of sight.':'Open ground: formation, range and unit counters decide the fight.'}</span></div></div><button className="primary" onClick={()=>setShowBrief(false)}>Study Battlefield & Deploy</button></div></Modal>

    <Modal open={showReward} title="Evolution — choose one" wide><div className="reward-grid">{rewardChoices.map(c=><button key={c.id||c.name} className="reward-card" onClick={()=>chooseReward(c)}><strong>{c.icon}</strong><h4>{c.name}</h4><p>{c.desc}</p></button>)}</div></Modal>
    <Modal open={showMilestone} title={`Campaign milestone after battle ${stageIndex+1}`} wide><div className="milestone-grid"><button onClick={()=>milestone('size')}><strong>⚑＋</strong><h4>Expand Army</h4><p>Increase deployment capacity by one, then recruit a new squad.</p></button><button onClick={()=>milestone('heal')}><strong>✚</strong><h4>Full Recovery</h4><p>Restore every surviving squad to 100%. Destroyed squads stay dead.</p></button></div></Modal>
    <Modal open={showEnd} title={endInfo?.victory?'Campaign conquered':'Your army has fallen'}><div className="end-summary"><h3>{endInfo?.victory?'Victory!':`Defeated at battle ${endInfo?.battle}`}</h3><p>You bank <b>◉ {endInfo?.gold||0}</b> Gold and <b>✦ {endInfo?.xp||0}</b> EXP{meta.featureUnlocks?.technology?<> plus <b>⚗ {endInfo?.tp||0}</b> TP</>:''}.</p>{endInfo?.victory&&<p>Stars earned: <b>{endInfo.stars}/3</b></p>}<button className="primary" onClick={()=>onFinish({...endInfo,campaign:campaignId})}>Return to Campaign</button></div></Modal>
  </div></div>
}
