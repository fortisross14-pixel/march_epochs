import { useEffect, useMemo, useRef, useState } from 'react'
import { ASSETS } from '../assets'
import { CAMPAIGNS, ITEMS, PEOPLE, TECHS, UNITS } from '../data'
import Modal from './Modal'
import { BattlePresentation } from './battlePresentation'
import './battle.css'
import {createRun,reinforcementMultiplier,reinforcementHeal,battleIncome,objectiveResult,recoverRoster,rewardOptions,applyReward} from '../game/battleRules.js'
import {createEncounter,stepEncounter,setFocusTarget} from '../game/combat.js'
import {emitFeedback} from '../uiFeedback.js'

import {W,H,DEPLOY_TOP,clamp,formationPositions,defaultPositions,terrainFor,blockedGroundPoint} from '../game/combat.js'

export default function Battle({campaignId,loadout,startingRoster,startCapacity,eligibleUnits=[],meta,onFinish}){
  const campaign=CAMPAIGNS[campaignId],canvasRef=useRef(null),battleRef=useRef(null),rafRef=useRef(null),actionRef=useRef({mode:null,unitId:null}),killsRef=useRef(0)
  const presentationRef=useRef(null),pauseRef=useRef(false),finishTimerRef=useRef(null),detailsPauseRef=useRef(false),rewardClaimRef=useRef(false)
  const [victorySummary,setVictorySummary]=useState(null)
  if(!presentationRef.current)presentationRef.current=new BattlePresentation()
  const [paused,setPaused]=useState(false),[assetsReady,setAssetsReady]=useState(false),[assetError,setAssetError]=useState(false),[inspectId,setInspectId]=useState(null),[feedback,setFeedback]=useState(''),[outcome,setOutcome]=useState(null),[showDetails,setShowDetails]=useState(false)
  const [phase,setPhase]=useState('deploy'),[stageIndex,setStageIndex]=useState(0)
  const [run,setRun]=useState(()=>createRun(meta,campaignId,loadout,startingRoster,startCapacity,eligibleUnits))
  const [deployPos,setDeployPos]=useState(()=>formationPositions(startingRoster.length,'player')),[selectedRoster,setSelectedRoster]=useState(0)
  const [hud,setHud]=useState({player:100,enemy:100,powerP:0,powerE:0,meter:0,enemyMeter:0,rally:0,focus:0,special:0}),[actionMode,setActionMode]=useState(null),[actionUnitId,setActionUnitId]=useState(null)
  const [rewardChoices,setRewardChoices]=useState([]),[reinforceReward,setReinforceReward]=useState(false),[showReward,setShowReward]=useState(false),[showMilestone,setShowMilestone]=useState(false),[showEnd,setShowEnd]=useState(false),[endInfo,setEndInfo]=useState(null),[lostAny,setLostAny]=useState(false),[flawlessCount,setFlawlessCount]=useState(0),[showBrief,setShowBrief]=useState(true)
  const stage=campaign.stages[stageIndex],terrain=useMemo(()=>terrainFor(stage),[stage]),leader=PEOPLE[run.leader]||null,general=PEOPLE[run.general]||null,generalMini=run.general?ASSETS.people[run.general]?.mini:null
  const reinforceMult=useMemo(()=>reinforcementMultiplier(run),[run])
  const reinforceHeal=useMemo(()=>reinforcementHeal(run),[run])
  const specialReady=!!(general?.special&&run.generalLevel>=(general.specialLevel||99))

  function setAction(mode,unitId=null){
    if(mode)setFeedback('')
    actionRef.current={mode,unitId};setActionMode(mode);setActionUnitId(unitId)
  }
  function resetDeployPositions(roster=run.roster){setDeployPos(formationPositions(Math.max(1,Math.min(6,roster.length)),'player'));setSelectedRoster(0)}
  function autoDeploy(){resetDeployPositions()}

  function deploymentEntities(){const encounter=createEncounter(run,stage,deployPos);return [...encounter.player.map((e,i)=>({...e,id:'deploy-player-'+i})),...encounter.enemy.map((e,i)=>({...e,id:'deploy-enemy-'+i}))]}
  function drawDeploy(){if(canvasRef.current)presentationRef.current.draw(canvasRef.current,deploymentEntities(),terrain,{deploy:true,selected:'deploy-player-'+selectedRoster})}
  useEffect(()=>{let active=true;presentationRef.current.load().then(ok=>{if(active){setAssetsReady(true);setAssetError(!ok)}});return()=>{active=false}},[])
  useEffect(()=>{if(phase==='deploy')drawDeploy()},[phase,deployPos,selectedRoster,stageIndex,run,assetsReady])
  useEffect(()=>{
    const resize=new ResizeObserver(()=>{if(battleRef.current)drawBattle(battleRef.current);else drawDeploy()});resize.observe(canvasRef.current)
    return()=>resize.disconnect()
  },[phase,deployPos,selectedRoster,stageIndex,assetsReady])
  useEffect(()=>()=>{cancelAnimationFrame(rafRef.current);clearTimeout(finishTimerRef.current)},[])
  useEffect(()=>{const hide=()=>{if(document.hidden&&battleRef.current&&!battleRef.current.done){pauseRef.current=true;setPaused(true)}};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide)},[])
  useEffect(()=>{const key=e=>{if(e.key==='Escape'){if(actionRef.current.mode)setAction(null);else if(showDetails){setShowDetails(false);pauseRef.current=false}else if(!showBrief&&!showReward&&!showMilestone&&!showEnd)togglePause()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[showBrief,showReward,showMilestone,showEnd,showDetails])
  useEffect(()=>{if(!feedback)return;const timer=setTimeout(()=>setFeedback(''),2400);return()=>clearTimeout(timer)},[feedback])
  function togglePause(){pauseRef.current=!pauseRef.current;setPaused(pauseRef.current)}
  function openDetails(){detailsPauseRef.current=pauseRef.current;pauseRef.current=true;setPaused(false);setShowDetails(true)}
  function closeDetails(){setShowDetails(false);pauseRef.current=detailsPauseRef.current;setPaused(detailsPauseRef.current)}
  function leaveCampaign(){cancelAnimationFrame(rafRef.current);clearTimeout(finishTimerRef.current);onFinish({victory:false,cleared:run.wins,objectives:run.objectives,gold:run.gold,xp:run.xp,tp:run.tp,battle:stageIndex+1,bestReached:stageIndex+1,units:run.roster.map(r=>r.type),stars:0,flawlessBattles:flawlessCount,unitsKilled:killsRef.current,campaign:campaignId})}

  function beginBattle(){
    if(battleRef.current&&!battleRef.current.done)return
    const current=run.roster.slice(0,run.deployCap)
    if(current.length<1||!assetsReady)return
    presentationRef.current.reset();setOutcome(null);setFeedback('Engage the enemy');setInspectId(null);emitFeedback('battle-start')
    battleRef.current={...createEncounter(run,stage,deployPos),last:performance.now()}
    setPhase('battle');setAction(null);updateHud(battleRef.current);tick(performance.now())
  }
  function drawBattle(b){
    if(!canvasRef.current)return
    const mode=actionRef.current.mode,targets=mode==='focus'?b.enemy.filter(e=>!e.dead):mode==='reinforce'||mode==='rallyUnit'?b.player.filter(e=>!e.dead):[]
    presentationRef.current.draw(canvasRef.current,[...b.enemy,...b.player],b.terrain,{time:b.time,selected:actionRef.current.unitId||b.inspectId,targets:targets.map(e=>e.id),focused:b.focusTarget,destination:mode==='rallyDestination',projectiles:b.projectiles})
  }
  function updateHud(b){
    const sum=(arr,k)=>arr.reduce((a,e)=>a+(e.dead?0:e[k]),0),max=arr=>arr.reduce((a,e)=>a+e.maxHp,0),power=arr=>Math.round(arr.filter(e=>!e.dead).reduce((a,e)=>a+e.hp*(e.stats.damage*e.stats.attackSpeed+e.stats.armor*.4),0)/10)
    const ph=sum(b.player,'hp'),pm=max(b.player),eh=sum(b.enemy,'hp'),em=max(b.enemy)
    setHud({time:b.time,player:pm?Math.round(ph/pm*100):0,enemy:em?Math.round(eh/em*100):0,powerP:power(b.player),powerE:power(b.enemy),meter:Math.floor(b.meter),enemyMeter:Math.floor(b.enemyMeter),rally:Math.max(0,b.rallyCd-b.time),focusTarget:b.focusTarget,special:Math.max(0,b.specialCd-b.time)})
  }
  function tick(now){
    const b=battleRef.current;if(!b||b.done)return
    if(actionRef.current.mode||pauseRef.current){b.last=now;drawBattle(b);rafRef.current=requestAnimationFrame(tick);return}
    const dt=Math.min(.04,(now-b.last)/1000);b.last=now
    stepEncounter(b,run,stage,stageIndex,dt,()=>killsRef.current++);drawBattle(b)
    if(Math.floor(b.time*5)!==Math.floor((b.time-dt)*5))updateHud(b)
    if(b.done){updateHud(b);setOutcome(b.victory?'Victory':b.timedOut?'Time expired':'Defeat');finishTimerRef.current=setTimeout(()=>finishBattle(b.victory,b),700);return}rafRef.current=requestAnimationFrame(tick)
  }

  function finishBattle(victory,b){
    emitFeedback(victory?'victory':'defeat')
    const hadLoss=b.player.some(e=>e.dead),totalLost=lostAny||hadLoss
    if(hadLoss)setLostAny(true)
    if(!victory){setEndInfo({victory:false,cleared:run.wins,objectives:run.objectives,gold:run.gold+6,xp:run.xp+2,tp:run.tp,battle:stageIndex+1,bestReached:stageIndex+1,units:run.roster.map(r=>r.type),stars:0,flawlessBattles:flawlessCount,unitsKilled:killsRef.current});setShowEnd(true);setPhase('ended');return}
    const newFlawless=flawlessCount+(hadLoss?0:1);setFlawlessCount(newFlawless)
    const objective=objectiveResult(stage,b),income=battleIncome(run,stage,objective),newRoster=recoverRoster(run,b),nextRun={...run,roster:newRoster,wins:run.wins+1,objectives:run.objectives+(objective?1:0),gold:run.gold+income.gold,xp:run.xp+income.xp,tp:run.tp+((campaignId==='dawn'||meta.featureUnlocks.technology)?income.tp:0)}
    setRun(nextRun);setVictorySummary({...income,tp:(campaignId==='dawn'||meta.featureUnlocks.technology)?income.tp:0,objective,label:stage.objective?.label})
    if(stageIndex===campaign.stages.length-1){const condition=newRoster.reduce((a,r)=>a+r.hpFrac,0)/Math.max(1,nextRun.deployCap),earnedStars=1+(condition>=.65?1:0)+(!totalLost?1:0);setEndInfo({victory:true,cleared:nextRun.wins,objectives:nextRun.objectives,gold:nextRun.gold,xp:nextRun.xp,tp:nextRun.tp,battle:15,bestReached:15,units:nextRun.roster.map(r=>r.type),stars:earnedStars,flawlessBattles:newFlawless,unitsKilled:killsRef.current});setShowEnd(true);setPhase('ended');return}
    if((campaign.milestones||[4,9,Math.max(0,campaign.stages.length-2)]).includes(stageIndex)){setShowMilestone(true);setPhase('milestone');return}openRewards(nextRun)
  }
  function openRewards(r=run,unitOnly=false){rewardClaimRef.current=false;setReinforceReward(false);setRewardChoices(rewardOptions(r,Math.random,unitOnly).map(c=>c.kind==='unit'?{...c,name:'Recruit '+UNITS[c.id].name,desc:'Add one '+UNITS[c.id].name+' squad.'}:c));setShowReward(true);setPhase('reward')}
  function chooseReward(choice){if(rewardClaimRef.current)return;if(choice.kind==='reinforce'&&!choice.uid){setReinforceReward(true);return}rewardClaimRef.current=true;emitFeedback('reward');const next=applyReward(run,choice);setRun(next);setShowReward(false);advanceStage(next)}
  function advanceStage(nextRun=run){battleRef.current=null;presentationRef.current.reset();setOutcome(null);setInspectId(null);setHud({player:100,enemy:100,time:0,meter:0,rally:0,focus:0,special:0});setStageIndex(i=>i+1);setRun(nextRun);setPhase('deploy');resetDeployPositions(nextRun.roster);setAction(null);setShowBrief(true)}
  function milestone(type){if(type==='heal'){const next={...run,roster:run.roster.map(r=>({...r,hpFrac:1}))};setRun(next);setShowMilestone(false);advanceStage(next)}else{const cap=Math.min(6,run.deployCap+1),next={...run,deployCap:cap};setRun(next);setShowMilestone(false);openRewards(next,true)}}

  function activateRally(){const b=battleRef.current;if(!b||phase!=='battle'||pauseRef.current||b.done)return;if(actionRef.current.mode?.startsWith('rally')){setAction(null);return}if(b.time<b.rallyCd)return;setAction('rallyUnit')}
  function activateFocus(){const b=battleRef.current;if(!b||phase!=='battle'||pauseRef.current||b.done)return;if(actionRef.current.mode==='focus'){setAction(null);return}setAction('focus')}
  function activateReinforce(){const b=battleRef.current;if(!b||phase!=='battle'||pauseRef.current||b.done)return;if(actionRef.current.mode==='reinforce'){setAction(null);return}if(b.meter<100)return;setAction('reinforce')}
  function activateSpecial(){const b=battleRef.current;if(!b||phase!=='battle'||pauseRef.current||b.done||actionRef.current.mode||b.time<b.specialCd||!specialReady)return;if(run.general==='hannibal'){b.specialUntil=b.time+8;b.specialCd=b.time+34}else if(run.general==='thutmose'){b.specialUntil=b.time+7;b.specialCd=b.time+30}else if(run.general==='napoleon'){for(const e of b.enemy.filter(e=>!e.dead)){const wasAlive=!e.dead;e.hp=Math.max(0,e.hp-e.maxHp*.18);if(e.hp<=0){e.dead=true;e.deathAt=b.time;if(wasAlive)killsRef.current++}}b.specialCd=b.time+32}updateHud(b)}

  function chooseActionTarget(id){
    const b=battleRef.current;if(!b||b.done||pauseRef.current)return
    const action=actionRef.current
    if(action.mode==='rallyUnit'){const e=b.player.find(u=>u.id===id&&!u.dead);if(e)setAction('rallyDestination',e.id);return}
    if(action.mode==='focus'){const e=b.enemy.find(u=>u.id===id&&!u.dead);if(e){setFocusTarget(b,e.id);setFeedback('Focus locked: '+UNITS[e.type].name);emitFeedback('battle-ability');setAction(null);updateHud(b)}return}
    if(action.mode==='reinforce'){const e=b.player.find(u=>u.id===id&&!u.dead);if(e){e.hp=Math.min(e.maxHp,e.hp+e.maxHp*reinforceHeal);e.healAt=b.time;setFeedback(UNITS[e.type].name+' reinforced');emitFeedback('battle-ability');b.meter=0;setAction(null);updateHud(b)}return}
  }

  function handleCanvasClick(ev){
    if(paused||outcome)return
    const c=canvasRef.current,rect=c.getBoundingClientRect(),x=(ev.clientX-rect.left)*W/rect.width,y=(ev.clientY-rect.top)*H/rect.height
    if(phase==='deploy'){
      const fallbackSlots=formationPositions(Math.max(1,run.deployCap),'player')
      const points=run.roster.slice(0,run.deployCap).map((r,i)=>({i,p:presentationRef.current.positions.get('deploy-player-'+i)||deployPos[i]||fallbackSlots[i]||defaultPositions[i]})),hit=points.sort((a,b)=>Math.hypot(a.p.x-x,(a.p.y-y)*presentationRef.current.ratio)-Math.hypot(b.p.x-x,(b.p.y-y)*presentationRef.current.ratio))[0]
      if(hit&&Math.hypot(hit.p.x-x,(hit.p.y-y)*presentationRef.current.ratio)<48){setSelectedRoster(hit.i);return}
      if(y>=DEPLOY_TOP&&!blockedGroundPoint(x,y,terrain)){setDeployPos(pos=>{
        const base=run.roster.slice(0,run.deployCap).map((_,i)=>pos[i]||fallbackSlots[i]||defaultPositions[i])
        return base.map((p,i)=>i===selectedRoster?{x:clamp(x,28,W-28),y:clamp(y,DEPLOY_TOP+22,H-35)}:p)
      });return}
      return
    }
    const b=battleRef.current;if(!b)return;const action=actionRef.current
    const distance=e=>{const p=presentationRef.current.point(e);return Math.hypot(p.x-x,(p.y-y)*presentationRef.current.ratio)}
    const nearest=arr=>arr.filter(e=>!e.dead).sort((a,c)=>distance(a)-distance(c))[0]
    if(!action.mode){const e=nearest([...b.player,...b.enemy]);if(e&&distance(e)<50){b.inspectId=e.id;setInspectId(e.id)}return}
    if(action.mode==='rallyUnit'){const e=nearest(b.player);if(e&&distance(e)<50)chooseActionTarget(e.id);return}
    if(action.mode==='rallyDestination'){const e=b.player.find(u=>u.id===action.unitId&&!u.dead);if(e&&!blockedGroundPoint(x,y,b.terrain)){e.manualDestination={x:clamp(x,20,W-20),y:clamp(y,35,H-35)};e.navPath=null;b.rallyCd=b.time+4;setFeedback(UNITS[e.type].name+' moving');emitFeedback('battle-ability');setAction(null);updateHud(b)}else setFeedback('Choose open ground or a bridge');return}
    if(action.mode==='focus'){const e=nearest(b.enemy);if(e&&distance(e)<50)chooseActionTarget(e.id);return}
    if(action.mode==='reinforce'){const e=nearest(b.player);if(e&&distance(e)<50)chooseActionTarget(e.id);return}
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
  const targetList=actionMode==='focus'?(battleRef.current?.enemy||[]).filter(e=>!e.dead):(actionMode==='reinforce'||actionMode==='rallyUnit')?(battleRef.current?.player||[]).filter(e=>!e.dead):[]
  const army=phase==='deploy'?deploymentEntities().filter(e=>e.side==='player'):(battleRef.current?.player||[])
  const inspected=[...(battleRef.current?.player||[]),...(battleRef.current?.enemy||[])].find(e=>e.id===inspectId)
  const clockText=String(Math.floor((hud.time||0)/60)).padStart(2,'0')+':'+String(Math.floor((hud.time||0)%60)).padStart(2,'0')
  const commandHint=actionMode==='rallyUnit'?'Rally · Choose your squad':actionMode==='rallyDestination'?'Rally · Tap open ground':actionMode==='focus'?'Focus · Choose an enemy':actionMode==='reinforce'?'Reinforce · Choose your squad':null
  const playerLife=phase==='deploy'?Math.round(run.roster.reduce((sum,e)=>sum+e.hpFrac,0)/Math.max(1,run.roster.length)*100):hud.player
  function selectTray(e,i){if(actionMode==='rallyUnit'||actionMode==='reinforce')chooseActionTarget(e.id);else if(phase==='deploy')setSelectedRoster(i);else if(battleRef.current){battleRef.current.inspectId=e.id;setInspectId(e.id)}}
  const commands=[
    {name:'Rally',active:actionMode?.startsWith('rally'),disabled:hud.rally>0,status:hud.rally>0?Math.ceil(hud.rally)+'s':'Move squad',action:activateRally},
    {name:'Focus',active:actionMode==='focus',disabled:false,status:hud.focusTarget?'Target locked':'Mark enemy',action:activateFocus},
    {name:'Reinforce',active:actionMode==='reinforce',disabled:hud.meter<100,status:hud.meter>=100?'Ready':hud.meter+'%',action:activateReinforce}
  ]
  const dialogOpen=paused||showDetails||showBrief&&phase==='deploy'||showReward||showMilestone||showEnd
  const inertProps=dialogOpen?{inert:'','aria-hidden':true}:{}
  const victoryReceipt=victorySummary&&<div className="battle-victory-summary"><b>Battle won</b><div><span>+{victorySummary.gold} Gold</span><span>+{victorySummary.xp} EXP</span>{victorySummary.tp>0&&<span>+{victorySummary.tp} TP</span>}</div>{victorySummary.label&&<p>{victorySummary.objective?'Objective complete':'Objective missed'}: {victorySummary.label}</p>}</div>
  return <main className="epoch-battle" aria-label="Battle">
    <header className="epoch-stats" {...inertProps}>
      <div className="epoch-titlebar"><button className="epoch-icon-button" onClick={togglePause} aria-label="Battle menu"><img src={ASSETS.ui.arrowLeft} alt=""/></button><div><small>{campaign.name} · {stageIndex+1}/{campaign.stages.length}</small><h1>{stage.name}</h1></div><button className="epoch-icon-button" onClick={togglePause} aria-label="Pause battle"><span className="epoch-pause-symbol"/></button></div>
      <div className="epoch-army-health"><img className="epoch-portrait" src={generalMini||ASSETS.people[run.leader]?.mini||ASSETS.ui.armies} alt={general?.name||leader?.name||'Your army'}/><div className="epoch-health-side"><span>Your army <b>{playerLife}%</b></span><div role="meter" aria-label="Your army health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={playerLife}><i style={{width:playerLife+'%'}}/></div></div><div className="epoch-health-side enemy"><span><b>{phase==='deploy'?100:hud.enemy}%</b> Enemy</span><div role="meter" aria-label="Enemy army health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={phase==='deploy'?100:hud.enemy}><i style={{width:(phase==='deploy'?100:hud.enemy)+'%'}}/></div></div><img className="epoch-portrait enemy" src={ASSETS.people.sargon.mini} alt="Enemy army standard portrait"/></div>
      <div className="epoch-battle-state"><span>{phase==='deploy'?'Arrange your formation':actionMode?'Command · Paused':paused?'Paused':'Defeat the enemy army'}</span><time aria-label="Battle elapsed time">{clockText}</time><button onClick={openDetails}>Battle info</button></div>
    </header>
    <section className="epoch-field" aria-label="Battlefield" {...inertProps}>
      <canvas ref={canvasRef} width={W} height={H} onClick={handleCanvasClick} aria-label="Battlefield. Select squads with the cards below. Rally allows you to choose a destination on the field."/>
      {!assetsReady&&<div className="epoch-field-notice">Preparing the battlefield...</div>}
      {assetError&&<div className="epoch-asset-error" role="status">Some battlefield art could not load. Reload to retry.</div>}
      {feedback&&!actionMode&&<div className="epoch-feedback" role="status" aria-live="polite" key={feedback}>{feedback}</div>}
      {outcome&&<div className="epoch-outcome" role="status"><small>{outcome==='Victory'?'THE FIELD IS YOURS':'YOUR LINE HAS FALLEN'}</small><strong>{outcome}</strong></div>}
    </section>
    <section className="epoch-command" aria-label="Commander" {...inertProps}>
      <div className="epoch-commander-line"><img src={generalMini||ASSETS.ui.armies} alt=""/><div><b>{commandHint||general?.name||'Field Command'}</b><span>{commandHint?(feedback||'Battle paused until you choose or cancel'):phase==='deploy'?'Select a squad, then tap deployment ground':inspected?UNITS[inspected.type].name+' · '+(inspected.dead?'Defeated':Math.round(inspected.hp/inspected.maxHp*100)+'% health'):'Select a squad to inspect'}</span></div>{actionMode?<button className="epoch-cancel" onClick={()=>setAction(null)}>Cancel</button>:<button className="epoch-special" disabled={phase!=='battle'||!specialReady||hud.special>0||!!outcome} onClick={activateSpecial} aria-label={specialReady?'Commander special ability':'Commander special ability locked'}><img src={specialReady?ASSETS.ui.star:ASSETS.ui.lock} alt=""/><span>{!specialReady?'Locked':hud.special>0?Math.ceil(hud.special)+'s':'Special'}</span></button>}</div>
      {phase==='deploy'?<div className="epoch-deploy-actions"><button onClick={autoDeploy}>Auto Deploy</button><button className="epoch-primary" disabled={!assetsReady} onClick={beginBattle}>Finish Deployment</button></div>:<div className="epoch-actions">{commands.map(cmd=><button key={cmd.name} className={cmd.active?'active':''} aria-pressed={!!cmd.active} disabled={cmd.disabled||!!outcome||paused||showDetails} onClick={cmd.action}><span className="epoch-action-medallion"><svg className="epoch-command-glyph" viewBox="0 0 40 40" aria-hidden="true">{cmd.name==='Rally'?<><path d="M11 34V7M12 8C19 3 23 14 31 8V24C23 30 20 19 12 23"/><circle cx="11" cy="6" r="1.5"/></>:cmd.name==='Focus'?<><circle cx="20" cy="20" r="11"/><circle cx="20" cy="20" r="3"/><path d="M20 3V12M20 28V37M3 20H12M28 20H37"/></>:<path className="epoch-plus" d="M16 6H24V16H34V24H24V34H16V24H6V16H16Z"/>}</svg>{cmd.name==='Reinforce'&&<svg className="epoch-charge-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" pathLength="100" strokeDasharray={hud.meter+' 100'}/></svg>}</span><b>{cmd.name}</b><small>{cmd.active?'Choose target':cmd.status}</small></button>)}</div>}
      <div className="epoch-tray" aria-label={targetList.length?'Choose command target':'Your squads'}>{(targetList.length?targetList:army).map((e,i)=><button key={e.id} className={(phase==='deploy'&&i===selectedRoster||e.id===inspectId||e.id===actionUnitId?'selected ':'')+(e.side==='enemy'?'enemy ':'')+(e.dead?'fallen':'')} disabled={e.dead||actionMode==='rallyDestination'||!!outcome} onClick={()=>targetList.length?chooseActionTarget(e.id):selectTray(e,i)} aria-label={(targetList.length?'Target ':'Select ')+(i+1)+' '+UNITS[e.type].name+(e.dead?' defeated':' '+Math.round(e.hp/e.maxHp*100)+' percent health')} aria-pressed={phase==='deploy'?i===selectedRoster:e.id===inspectId}><span className="epoch-squad-number">{i+1}</span><img src={ASSETS.units[e.type]||ASSETS.ui.armies} alt=""/><span className="epoch-squad-name">{UNITS[e.type].name}</span><i><em style={{width:(e.dead?0:e.hp/e.maxHp*100)+'%'}}/></i></button>)}</div>
    </section>
    <Modal open={paused} onClose={togglePause} title="Battle paused"><div className="epoch-pause-menu"><p>Your formation and commands are held.</p><button className="epoch-primary" onClick={togglePause}>Resume battle</button><button onClick={openDetails}>Battle briefing & enhancements</button><button onClick={leaveCampaign}>Leave campaign · bank earned rewards</button></div></Modal>
    <Modal open={showDetails} onClose={closeDetails} title={stage.name}><div className="epoch-details"><p>{stage.tip}</p>{stage.objective&&<p>{stage.objective.label} for +{stage.objective.bonusGold} Gold. Battle limit: {stage.timeLimit/60} minutes.{stage.finale?' Coalition Guard: tougher front-line commander.':''}</p>}<p>{terrain.river?'Cross at the timber bridges. Water blocks ground movement; ranged fire can cross.':terrain.mountains.length?'Rocky high ground blocks movement and line of sight.':'Open ground. Protect your ranged squads behind the front line.'}</p>{campaignId==='dawn'&&<p>Campaign stars: conquer all 15 battles; finish with 65% army health; lose no squads. Each new star earns 15 Gold. First conquest earns 60 Gold and 30 EXP.</p>}<p>Focus stays on the marked enemy until it falls or you choose another target. Select a ranged squad to see its firing range; cliffs block its shots.</p><h3>Your enhancements</h3><ul>{enhancementSummary().map((x,i)=><li key={i}>{x}</li>)}</ul><button className="epoch-primary" onClick={closeDetails}>Return to battlefield</button></div></Modal>

    <Modal open={showBrief&&phase==='deploy'} onClose={()=>setShowBrief(false)} title={`${stage.name} · ${stage.date||''}`} wide><div className="battle-brief"><div><span className="brief-kicker">WHY IT MATTERS</span><p>{stage.history}</p></div><div className="brief-tactical"><span className="brief-kicker">TACTICAL CLUE</span><p>{stage.tip}</p><div className="brief-condition"><b>Terrain condition</b><span>{terrain.river?'Water blocks ground movement except at bridges. Ranged attacks can cross water.':terrain.mountains.length?'High ground / obstacles block movement and ranged line of sight.':'Open ground: formation, range and unit counters decide the fight.'}</span></div></div><button className="primary" onClick={()=>setShowBrief(false)}>Study Battlefield & Deploy</button></div></Modal>

    <Modal open={showReward} title="Evolution — choose one" wide>{victoryReceipt}{reinforceReward?<><p>Choose one squad to restore to full health.</p><div className="reward-grid">{run.roster.map((r,i)=><button key={r.uid} className="reward-card" disabled={r.hpFrac>=1} onClick={()=>chooseReward({kind:'reinforce',uid:r.uid})}><img className="reward-art" src={ASSETS.units[r.type]} alt=""/><h4>Squad {i+1}: {UNITS[r.type].name}</h4><p>{Math.round(r.hpFrac*100)}% health to 100%</p></button>)}</div><button className="epoch-primary" onClick={()=>setReinforceReward(false)}>Back to rewards</button></>:<div className="reward-grid">{rewardChoices.map(c=>{const icon=c.kind==='unit'?ASSETS.units[c.id]:{damage:ASSETS.statIcons?.damage,armor:ASSETS.statIcons?.armor,speed:ASSETS.statIcons?.speed,range:ASSETS.statIcons?.range,reinforceSpeed:ASSETS.commandCards?.reinforce,reinforceHeal:ASSETS.commandCards?.reinforce,health:ASSETS.statIcons?.health,reinforce:ASSETS.commandCards?.reinforce}[c.id];return <button key={c.id||c.name} className="reward-card" onClick={()=>chooseReward(c)}>{c.id?.startsWith('reinforce')?<svg className="reward-art" viewBox="0 0 40 40" aria-hidden="true"><path d="M15 6H25V15H34V25H25V34H15V25H6V15H15Z" fill="#b3c9aa" stroke="#e3e4b7" strokeWidth="1.5"/></svg>:icon?<img className="reward-art" src={icon} alt=""/>:<strong>{c.icon}</strong>}<h4>{c.name}</h4><p>{c.desc}</p></button>})}</div>}</Modal>
    <Modal open={showMilestone} title={`Campaign milestone after battle ${stageIndex+1}`} wide>{victoryReceipt}<div className="milestone-grid"><button disabled={run.deployCap>=6&&run.roster.length>=6} onClick={()=>milestone('size')}><img className="reward-art" src={ASSETS.ui.armies} alt=""/><h4>Expand Army</h4><p>Increase deployment capacity by one, then recruit a new squad.</p></button><button onClick={()=>milestone('heal')}><img className="reward-art" src={ASSETS.statIcons?.health} alt=""/><h4>Full Recovery</h4><p>Restore every surviving squad to 100%. Destroyed squads stay dead.</p></button></div></Modal>
    <Modal open={showEnd} title={endInfo?.victory?'Campaign conquered':'Your army has fallen'}><div className="end-summary"><h3>{endInfo?.victory?'Victory!':`Defeated at battle ${endInfo?.battle}`}</h3><p>You bank <b>◉ {endInfo?.gold||0}</b> Gold and <b>✦ {endInfo?.xp||0}</b> EXP{(campaignId==='dawn'||meta.featureUnlocks?.technology)?<> plus <b>⚗ {endInfo?.tp||0}</b> TP</>:''}.</p>{endInfo?.victory&&<p>Stars earned: <b>{endInfo.stars}/3</b></p>}<button className="primary" onClick={()=>onFinish({...endInfo,campaign:campaignId})}>Return to Campaign</button></div></Modal>
  </main>
}
