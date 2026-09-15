import {UNITS, TECHS, itemEffectAtLevel, unitStatsAtLevel} from '../data.js'
import {peopleEffects} from './progression.js'
import {reinforcementMultiplier} from './battleRules.js'
const FIELD_SCALE=1.1,W=572,H=836
const DEPLOY_TOP=455*FIELD_SCALE
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const roleHas=(u,s)=>u.role.includes(s)
function formationPositions(count,side='player'){
  if(count<=0)return []
  const layout=count<=2?[count]:count===3?[2,1]:count===4?[2,2]:count===5?[3,2]:[3,3]
  const baseRows=side==='player'?[628,540]:[186,272]
  const spacings=side==='player'?[144,128]:[118,108]
  const out=[]
  layout.forEach((n,row)=>{
    const center=W/2
    const start=center-((n-1)*spacings[row])/2
    for(let i=0;i<n;i++)out.push({x:center+(start+i*spacings[row]-center)*FIELD_SCALE,y:(baseRows[row]+Math.abs(i-(n-1)/2)*4)*FIELD_SCALE})
  })
  return out.slice(0,count)
}
const defaultPositions=formationPositions(6,'player')
const enemyCells=Array.from({length:18},(_,i)=>({x:(64+(i%6)*78)*FIELD_SCALE,y:(124+Math.floor(i/6)*72)*FIELD_SCALE}))

function unitStats(type,run,side='player',enemyMult=1){
  const base=side==='player'?unitStatsAtLevel(type,run.unitLevels?.[type]||1):UNITS[type],s={...base}
  if(side==='player'){
    s.health*=run.upgrades.health;s.armor+=run.upgrades.armorBonus;s.damage*=run.upgrades.damage;s.attackSpeed*=run.upgrades.attackSpeed
    if(roleHas(s,'RANGED')||roleHas(s,'FIREARM'))s.range*=run.upgrades.range
    const gl=run.generalLevel
    const effects=peopleEffects(run),ranged=s.range>0
    s.damage*=(effects.damageMult||1)*(ranged?effects.rangedDamageMult||1:effects.meleeDamageMult||1)
    s.health*=effects.healthMult||1;s.armor+=effects.armor||0
    if(ranged){s.attackSpeed*=effects.rangedSpeedMult||1;s.range*=effects.rangedRangeMult||1}
    s.attackSpeed*=1+Math.min(.10,(effects.momentum||0)*(run.wins||0))
    if(run.campaign==='dawn')for(const id of run.tech)s.moveSpeed*=TECHS[id]?.age1MoveMult||1
    if(type==='bronzeGuard')s.health*=effects.signatureHealthMult||1
    if(run.general==='hannibal'&&(roleHas(s,'MOUNTED')||roleHas(s,'HEAVY'))){if(gl>=1)s.damage*=1.10;if(gl>=2)s.damage=(s.damage/1.10)*1.20;if(gl>=4)s.damage=(s.damage/1.20)*1.30;if(type==='warElephant'&&gl>=5){s.health*=1.35;s.damage*=1.25;s.armor+=8}}
    if(run.general==='napoleon'){if(gl>=1)s.damage*=1.10;if(gl>=2&&(roleHas(s,'FIREARM')||roleHas(s,'RANGED')))s.attackSpeed*=1.15;if(type==='imperialGuard'&&gl>=5){s.health*=1.30;s.damage*=1.25}}
    if(run.general==='thutmose'&&roleHas(s,'MOUNTED')){s.damage*=1.10;if(gl>=2)s.moveSpeed*=1.15}
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
  return {river:!!t.river,riverY:[334,390].map(n=>n*FIELD_SCALE),bridges:(t.bridges||[2]).map(i=>({x:(35+i*100)*FIELD_SCALE,w:64*FIELD_SCALE})),mountains:(t.mountains||[]).map(r=>({x:r.x*FIELD_SCALE,y:r.y*FIELD_SCALE,w:r.w*FIELD_SCALE,h:r.h*FIELD_SCALE}))}
}
function pointInRect(x,y,r,pad=0){return x>=r.x-pad&&x<=r.x+r.w+pad&&y>=r.y-pad&&y<=r.y+r.h+pad}
function segmentHitsRect(a,b,r,pad=0){
  let enter=0,leave=1
  for(const [origin,delta,min,max] of [[a.x,b.x-a.x,r.x-pad,r.x+r.w+pad],[a.y,b.y-a.y,r.y-pad,r.y+r.h+pad]]){
    if(Math.abs(delta)<1e-9){if(origin<min||origin>max)return false;continue}
    const t1=(min-origin)/delta,t2=(max-origin)/delta
    enter=Math.max(enter,Math.min(t1,t2));leave=Math.min(leave,Math.max(t1,t2))
    if(enter>leave)return false
  }
  return true
}
function pointInBridge(x,t){return t.bridges.some(b=>x>=b.x&&x<=b.x+b.w)}
function blockedGroundPoint(x,y,t){
  if(t.mountains.some(r=>pointInRect(x,y,r,8)))return true
  if(t.river){const[y1,y2]=t.riverY;if(y>=y1&&y<=y2&&!pointInBridge(x,t))return true}
  return false
}
function lineBlocked(a,b,mountains){
  return mountains.find(r=>segmentHitsRect(a,b,r,5))||null
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
  if(terrain.mountains.some(r=>segmentHitsRect(a,b,r,8)))return true
  if(terrain.river){
    const [top,bottom]=terrain.riverY,bridges=terrain.bridges.slice().sort((p,q)=>p.x-q.x)
    let left=0
    for(const bridge of [...bridges,{x:W,w:0}]){
      if(bridge.x>left&&segmentHitsRect(a,b,{x:left+.0001,y:top,w:bridge.x-left-.0002,h:bottom-top}))return true
      left=Math.max(left,bridge.x+bridge.w)
    }
  }
  return false
}
function findGroundPath(start,goal,terrain){
  // Coarse A* navigation. Smaller cells + segment validation makes it much harder for a unit
  // to get trapped against mountain rectangles or miss a bridge opening.
  const step=18,minX=16,maxX=W-16,minY=26,maxY=H-24
  const snap=p=>({x:clamp(Math.round((p.x-minX)/step)*step+minX,minX,maxX),y:clamp(Math.round((p.y-minY)/step)*step+minY,minY,maxY)})
  const nearestValid=(p,reachable=false)=>{
    const s=snap(p)
    if(!blockedGroundPoint(s.x,s.y,terrain)&&(!reachable||!segmentGroundBlocked(p,s,terrain)))return s
    for(let r=1;r<12;r++){
      const candidates=[]
      for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(Math.abs(dx)===r||Math.abs(dy)===r)candidates.push({x:clamp(s.x+dx*step,minX,maxX),y:clamp(s.y+dy*step,minY,maxY)})
      candidates.sort((a,b)=>dist(a,p)-dist(b,p))
      const ok=candidates.find(q=>!blockedGroundPoint(q.x,q.y,terrain)&&(!reachable||!segmentGroundBlocked(p,q,terrain)))
      if(ok)return ok
    }
    return s
  }
  const s=nearestValid(start,true),g=nearestValid(goal),key=p=>`${p.x},${p.y}`,heur=p=>Math.hypot(p.x-g.x,p.y-g.y)
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
  path.reverse();path.unshift(s);path.push({x:g.x,y:g.y})
  // Basic smoothing: skip intermediate nodes when the straight segment is now clear.
  const smooth=[];let anchor={x:start.x,y:start.y},i=0
  while(i<path.length){let far=i;for(let j=path.length-1;j>=i;j--){if(!segmentGroundBlocked(anchor,path[j],terrain)){far=j;break}}smooth.push(path[far]);anchor=path[far];i=far+1}
  return smooth
}
function makeEntity(side,type,pos,hpFrac,run,mult,idx,random=Math.random){
  const stats=unitStats(type,run,side,mult),maxHp=stats.health
  return{id:`${side}-${idx}-${random().toString(36).slice(2,7)}`,side,type,squadNumber:idx+1,x:pos.x,y:pos.y,stats,maxHp,hp:maxHp*(hpFrac??1),cool:random()*.3,dead:false,moved:0,flash:0,manualDestination:null}
}
  function chooseTarget(e,enemies,b){
    let live=enemies.filter(x=>!x.dead);if(!live.length)return null
    if(e.side==='player'&&b.focusTarget){const ft=live.find(x=>x.id===b.focusTarget);if(ft)return ft}
    // Take a clear shot from here before chasing a closer enemy behind a cliff.
    if(e.stats.range>0){const inRange=live.filter(t=>canShoot(e,t,b));if(inRange.length)live=inRange}
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
      while(e.navPath?.length&&dist(e,e.navPath[0])<14&&(e.navPath.length===1||!segmentGroundBlocked(e,e.navPath[1],b.terrain)))e.navPath.shift()
      if(e.navPath?.length)goal=e.navPath[0]
      else goal=movementWaypoint(e,point,b.terrain)
    }else{e.navPath=null;e.navTargetKey=null}
    const dx=goal.x-e.x,dy=goal.y-e.y,dd=Math.hypot(dx,dy)||1,step=Math.min(dd,e.stats.moveSpeed*dt)
    let nx=e.x+dx/dd*step,ny=e.y+dy/dd*step
    if(segmentGroundBlocked(e,{x:nx,y:ny},b.terrain)){
      e.navPath=findGroundPath(e,point,b.terrain);e.navRecalc=b.time+.25
      const next=e.navPath?.[0];if(next){const ndx=next.x-e.x,ndy=next.y-e.y,nd=Math.hypot(ndx,ndy)||1;nx=e.x+ndx/nd*Math.min(nd,e.stats.moveSpeed*dt);ny=e.y+ndy/nd*Math.min(nd,e.stats.moveSpeed*dt)}else{nx=e.x;ny=e.y}
    }
    // Recomputed routes must obey the same collision rule as the first attempt.
    if(segmentGroundBlocked(e,{x:nx,y:ny},b.terrain)){nx=e.x;ny=e.y}
    e.x=clamp(nx,20,W-20);e.y=clamp(ny,35,H-35);e.moved+=Math.hypot(e.x-(e._lastX??e.x),e.y-(e._lastY??e.y));e._lastX=e.x;e._lastY=e.y
  }
  function moveEntity(e,target,dt,b){
    if(!target)return
    if(e.manualDestination){if(dist(e,e.manualDestination)<12){e.manualDestination=null}else{moveTowardPoint(e,e.manualDestination,dt,b);return}}
    const melee=e.stats.range<=0,desiredRange=melee?25:e.stats.range
    if(dist(e,target)<=desiredRange&&!lineBlocked(e,target,b.terrain.mountains))return
    moveTowardPoint(e,target,dt,b)
  }
  function canShoot(e,t,b){return dist(e,t)<=e.stats.range&&!lineBlocked(e,t,b.terrain.mountains)}
  function attack(e,t,b,run,onKill){
    if(e.cool>0||!t||t.dead||e.manualDestination)return
    const melee=e.stats.range<=0;if(melee&&dist(e,t)>30)return;if(!melee&&!canShoot(e,t,b))return
    let dmg=e.stats.damage;if(e.side==='player'&&b.specialUntil>b.time&&run.general==='hannibal')dmg*=1.30;if(e.side==='player'&&b.specialUntil>b.time&&run.general==='thutmose'&&roleHas(e.stats,'MOUNTED'))dmg*=1.35;if(e.stats.antiMounted&&roleHas(t.stats,'MOUNTED'))dmg*=e.stats.antiMounted;if(e.stats.charge&&e.moved>70){dmg*=e.stats.charge;e.moved=0}
    const reduced=dmg*(100/(100+t.stats.armor*2.2));t.hp-=reduced;t.flash=.12;e.attackAt=b.time;e.cool=1/e.stats.attackSpeed;if(!melee)b.projectiles.push({x:e.x,y:e.y,tx:t.x,ty:t.y,life:.25,side:e.side,from:e.id,to:t.id});if(t.hp<=0){t.hp=0;t.dead=true;t.deathAt=b.time;if(t.side==='enemy')onKill()}
  }
  function simSide(side,foes,dt,b,run,onKill=()=>{}){for(const e of side){if(e.dead)continue;e.cool-=dt;e.flash=Math.max(0,e.flash-dt);const t=chooseTarget(e,foes,b);if(!t)continue;const melee=e.stats.range<=0;if(e.manualDestination||(melee&&dist(e,t)>30)||(!melee&&!canShoot(e,t,b)))moveEntity(e,t,dt,b);attack(e,t,b,run,onKill)}}

export {W,H,FIELD_SCALE,DEPLOY_TOP,clamp,dist,roleHas,formationPositions,defaultPositions,enemyCells,unitStats,terrainFor,blockedGroundPoint,findGroundPath,makeEntity,simSide}

export function setFocusTarget(b,id){
  if(b.done||!b.enemy.some(e=>e.id===id&&!e.dead))return false
  b.focusTarget=id
  return true
}

export function createEncounter(run,stage,positions=formationPositions(run.roster.length),random=Math.random){
  const terrain=terrainFor(stage),open=point=>{
    if(run.campaign!=='dawn'||!blockedGroundPoint(point.x,point.y,terrain))return point
    for(let radius=18;radius<=180;radius+=18)for(const [dx,dy] of [[0,-radius],[radius,0],[-radius,0],[0,radius]]){const p={x:clamp(point.x+dx,20,W-20),y:clamp(point.y+dy,35,H-35)};if(!blockedGroundPoint(p.x,p.y,terrain))return p}
    throw new Error('Encounter has no open deployment ground')
  }
  const player=run.roster.slice(0,run.deployCap).map((r,i)=>makeEntity('player',r.type,open(positions[i]),r.hpFrac,run,1,i,random)),slots=formationPositions(stage.types.length,'enemy').map(open)
  const enemy=stage.types.map((type,i)=>{const e=makeEntity('enemy',type,slots[i]||enemyCells[i],1,run,stage.mult,i,random);if(i===0&&stage.finale){e.stats.health*=stage.finale.health;e.hp=e.maxHp=e.stats.health;e.stats.damage*=stage.finale.damage;e.stats.armor+=stage.finale.armor;e.finale=true}return e})
  return{player,enemy,projectiles:[],time:0,terrain:terrainFor(stage),meter:35,enemyMeter:0,rallyCd:0,focusTarget:null,specialUntil:0,specialCd:0,done:false}
}
export function stepEncounter(b,run,stage,index,dt,onKill=()=>{}){
  if(b.done)return
  b.time+=dt;b.meter=clamp(b.meter+dt*7.5*reinforcementMultiplier(run),0,100);b.enemyMeter=clamp(b.enemyMeter+dt*4.4*(1+index*.018),0,100)
  if(b.enemyMeter>=100){const e=b.enemy.filter(e=>!e.dead&&e.hp<e.maxHp*.95).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];if(e){e.healAt=b.time;e.hp=Math.min(e.maxHp,e.hp+e.maxHp*(.13+index*.004));b.enemyMeter=0}}
  simSide(b.player,b.enemy,dt,b,run,onKill);simSide(b.enemy,b.player,dt,b,run,onKill)
  if(b.focusTarget&&!b.enemy.some(e=>e.id===b.focusTarget&&!e.dead))b.focusTarget=null
  b.projectiles.forEach(p=>p.life-=dt);b.projectiles=b.projectiles.filter(p=>p.life>0)
  const alive=b.player.some(e=>!e.dead),foes=b.enemy.some(e=>!e.dead)
  b.timedOut=!!stage.timeLimit&&b.time>=stage.timeLimit&&foes
  b.done=!alive||!foes||b.timedOut;b.victory=alive&&!foes
}
