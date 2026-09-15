import groundUrl from '../assets/battle_age1/ground.webp'
import soldiersUrl from '../assets/battle_age1/soldiers.webp'
import cliffUrl from '../assets/battle_age1/cliff.webp'
import riverUrl from '../assets/battle_age1/river.webp'
import soldierFrames from '../assets/battle_age1/soldier-frames.json'
import { ASSETS } from '../assets'
import {W,H,DEPLOY_TOP} from '../game/combat.js'

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
const colors={player:{cloth:'#285e98',light:'#90b8d1'},enemy:{cloth:'#913e32',light:'#e1a184'}}
const columns={warrior:0,slinger:1,spear:2,archer:3,hunterBand:3,cavalry:4}
const ellipse=(c,x,y,rx,ry)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2)}

async function loadArt(url){
  const img=new Image();img.src=url;await img.decode()
  return img
}

export class BattlePresentation {
  constructor(){this.art={};this.positions=new Map();this.time=0;this.ratio=1;this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches}
  async load(){
    const entries=[['ground',groundUrl],['soldiers',soldiersUrl],['cliff',cliffUrl],['river',riverUrl],...Object.entries(ASSETS.units)]
    const results=await Promise.allSettled(entries.map(async([key,url])=>{this.art[key]=await loadArt(url)}))
    this.cache=null
    return results.every(r=>r.status==='fulfilled')
  }
  reset(){this.positions.clear();this.cache=null;this.lastTime=null}
  context(canvas){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2)
    const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr)
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;this.viewportChanged=true}
    const c=canvas.getContext('2d');c.setTransform(w/W,0,0,h/H,0,0)
    this.ratio=(h/H)/(w/W);return c
  }
  terrain(t){
    if(this.cache?.terrain===t)return this.cache.canvas
    const canvas=document.createElement('canvas');canvas.width=W*2;canvas.height=H*2
    const c=canvas.getContext('2d');c.scale(2,2)
    c.fillStyle='#af965e';c.fillRect(0,0,W,H)
    if(this.art.ground)c.drawImage(this.art.ground,0,0,W,H)
    if(t.river){
      const [a,b]=t.riverY
      // The visible water and crossings use exactly the simulation's bounds.
      c.fillStyle='#776a43';c.fillRect(0,a-7,W,b-a+14)
      const water=c.createLinearGradient(0,a,0,b);water.addColorStop(0,'#385957');water.addColorStop(.25,'#528385');water.addColorStop(.7,'#679e9e');water.addColorStop(1,'#335b60')
      c.fillStyle=water;c.fillRect(0,a,W,b-a)
      for(let i=0;i<155;i++){
        const x=(i*73.37)%W,y=a+3+(i*13.19)%(b-a-6)
        c.strokeStyle=i%3?'#c8dbc329':'#244d4f40';c.lineWidth=.6+i%2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+5,y+1.5,x+10+i%13,y);c.stroke()
      }
      for(let i=0;i<95;i++){
        const x=(i*53.71)%W,y=i%2?a-3:b+3
        c.fillStyle=['#b8a876','#8e8457','#d0bc87'][i%3];ellipse(c,x,y,2+i%4,1+i%2);c.fill()
        if(i%6===0&&!t.bridges.some(p=>x>p.x-10&&x<p.x+p.w+10)){c.strokeStyle='#65704a';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x-2,y-9);c.moveTo(x,y);c.lineTo(x+4,y-6);c.stroke()}
      }
      if(this.art.river){
        const strip=document.createElement('canvas');strip.width=1040;strip.height=180
        const sc=strip.getContext('2d');sc.drawImage(this.art.river,0,0,strip.width,strip.height)
        sc.globalCompositeOperation='destination-in';const fade=sc.createLinearGradient(0,0,0,180);fade.addColorStop(0,'#0000');fade.addColorStop(.12,'#000');fade.addColorStop(.88,'#000');fade.addColorStop(1,'#0000');sc.fillStyle=fade;sc.fillRect(0,0,1040,180)
        c.drawImage(strip,0,a-12,W,b-a+24)
      }
      for(const bridge of t.bridges){
        const {x,w}=bridge
        c.fillStyle='#342b2080';c.fillRect(x+4,a-5,w,b-a+16)
        c.fillStyle='#4c3826';c.fillRect(x,a-7,w,b-a+14)
        for(let y=a-6;y<b+7;y+=7){
          const plank=c.createLinearGradient(x,y,x,y+6);plank.addColorStop(0,'#c6a371');plank.addColorStop(1,'#82613d');c.fillStyle=plank;c.fillRect(x+2,y,w-4,6)
          c.strokeStyle='#71543180';c.lineWidth=.6;c.beginPath();c.moveTo(x+8,y+3);c.lineTo(x+w-11,y+2);c.stroke()
        }
        for(const edge of [x+1,x+w-3]){c.fillStyle='#584128';c.fillRect(edge,a-14,3,b-a+28);c.fillStyle='#e1c190';c.fillRect(edge,a-14,1,b-a+28);for(const y of [a-10,b+7]){c.fillStyle='#4b3625';c.fillRect(edge-2,y-6,6,12);c.fillStyle='#c4a57b';c.fillRect(edge-2,y-6,6,3)}}
      }
    }
    for(const r of t.mountains){
      // A soft contact shadow grounds the outcrop without a geometric base.
      c.fillStyle='#423c2744';ellipse(c,r.x+r.w/2+3,r.y+r.h/2+8,r.w*.64,r.h*.6);c.fill()
    }
    const shade=c.createRadialGradient(260,360,170,260,360,490);shade.addColorStop(0,'#16271c00');shade.addColorStop(1,'#17261966');c.fillStyle=shade;c.fillRect(0,0,W,H)
    this.cache={terrain:t,canvas};return canvas
  }
  layout(entities,terrain,time){
    const live=entities.filter(e=>!e.dead),pts=live.map(e=>({id:e.id,x:e.x,y:e.y,e}))
    const blocked=(x,y)=>terrain.mountains.some(r=>x>=r.x-12&&x<=r.x+r.w+12&&y>=r.y-12&&y<=r.y+r.h+12)||(terrain.river&&y>=terrain.riverY[0]&&y<=terrain.riverY[1]&&!terrain.bridges.some(b=>x>=b.x+5&&x<=b.x+b.w-5))
    const place=(p,x,y)=>{const dx=x-p.e.x,dy=y-p.e.y,d=Math.hypot(dx,dy*this.ratio),limit=32;if(d>limit){x=p.e.x+dx*limit/d;y=p.e.y+dy*limit/d}x=clamp(x,42,W-42);y=clamp(y,76,H-35);if(!blocked(x,y)){p.x=x;p.y=y}}
    // Relax only display anchors. Combat coordinates, collision, range, damage,
    // target choices, and pathfinding never read these positions.
    for(let pass=0;pass<32;pass++)for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],dx=a.x-b.x,dy=(a.y-b.y)*this.ratio,d=Math.hypot(dx,dy*1.32)
      if(d>=79)continue
      const angle=(i*2.4+j)*1.8,ux=d>.01?dx/d:Math.cos(angle),uy=d>.01?dy/d:Math.sin(angle),push=(79-d)*.52
      place(a,a.x+ux*push,a.y+uy*push/this.ratio);place(b,b.x-ux*push,b.y-uy*push/this.ratio)
    }
    const dt=this.lastTime==null?1:Math.max(0,time-this.lastTime),mix=this.reduced||time===0||this.viewportChanged?1:1-Math.exp(-dt*12)
    for(const p of pts){const old=this.positions.get(p.id);this.positions.set(p.id,{x:old?old.x+(p.x-old.x)*mix:p.x,y:old?old.y+(p.y-old.y)*mix:p.y,moving:old?Math.hypot(p.e.x-(old.worldX??p.e.x),p.e.y-(old.worldY??p.e.y))>.03:false,worldX:p.e.x,worldY:p.e.y})}
    this.lastTime=time;this.viewportChanged=false
  }
  point(e){return this.positions.get(e.id)||e}
  squad(c,e,opts={}){
    const p=this.point(e),hp=clamp(e.hp/e.maxHp,0,1),pal=colors[e.side],selected=opts.selected,target=opts.target,death=e.dead?clamp((opts.time-(e.deathAt??opts.time))/.65,0,1):0
    if(death>=1)return
    c.save();c.translate(p.x,p.y);c.scale(.96,.96/this.ratio);c.globalAlpha=1-death
    if(e.dead){c.translate(0,death*9);c.rotate(death*.6)}
    c.fillStyle='#28281738';ellipse(c,1,6,37,12);c.fill()
    if(selected||target||opts.focused){c.fillStyle=selected?'#d8df9a22':'#dfad7a15';c.strokeStyle=selected?'#d9de9b':opts.focused?'#f2bc78':pal.light;c.lineWidth=selected?2.4:1.6;ellipse(c,0,4,44,18);c.fill();c.stroke()}
    const col=columns[e.type],mounted=col===4,count=mounted?3:Math.max(1,Math.ceil(hp*5)),offsets=mounted?[[-17,-10],[17,-7],[0,10]]:[[-18,-12],[6,-15],[24,0],[-25,7],[0,12]]
    for(let i=0;i<count;i++){
      const [x,y]=offsets[i],bob=!this.reduced&&p.moving?Math.sin(opts.time*13+i*1.9)*1.6:0,attack=!this.reduced?Math.max(0,1-(opts.time-(e.attackAt??-10))/.22)*3:0
      const frame=col==null?null:soldierFrames[col+(e.side==='player'?0:5)],h=mounted?57:52,w=frame?h*frame.w/frame.h:40
      c.save();c.translate(x+attack*(e.side==='player'?1:-1),y+bob);if(e.side==='enemy')c.scale(-1,1)
      if(frame&&this.art.soldiers)c.drawImage(this.art.soldiers,frame.x,frame.y,frame.w,frame.h,-w/2,-h,w,h)
      else if(this.art[e.type]||this.art.warrior)c.drawImage(this.art[e.type]||this.art.warrior,-w/2,-h,w,h)
      c.restore()
    }
    if(e.dead){c.restore();return}
    // A small standard carries both team and squad identity; health sits below it.
    c.strokeStyle='#443722';c.lineWidth=2;c.beginPath();c.moveTo(-5,-24);c.lineTo(-5,-73);c.stroke()
    c.fillStyle=pal.cloth;c.strokeStyle='#d2b778';c.lineWidth=1;c.beginPath();c.moveTo(-4,-72);c.lineTo(16,-70);c.lineTo(16,-49);c.lineTo(6,-54);c.lineTo(-4,-51);c.closePath();c.fill();c.stroke()
    c.fillStyle='#fff0c5';c.font='bold 12px Georgia';c.textAlign='center';c.fillText(String(opts.badge||e.squadNumber||1),6,-58)
    c.fillStyle='#15212be6';c.beginPath();c.roundRect(-24,21,48,6,3);c.fill();c.fillStyle=hp>.3?pal.light:'#e7b75e';c.beginPath();c.roundRect(-22,23,44*hp,2,1);c.fill()
    if(e.flash>0){c.strokeStyle='#ffdf9a';c.lineWidth=2;c.beginPath();c.moveTo(21,-24);c.lineTo(31,-32);c.moveTo(26,-20);c.lineTo(36,-18);c.stroke()}
    const heal=opts.time-(e.healAt??-10)
    if(heal>=0&&heal<.9){c.globalAlpha=1-heal/.9;c.strokeStyle='#dfedb1';c.lineWidth=2;ellipse(c,0,5,36+heal*12,13+heal*4);c.stroke();c.fillStyle='#e2f0c6';c.font='bold 19px Georgia';c.fillText('+',0,-64-heal*14)}
    c.restore()
  }
  draw(canvas,entities,terrain,options={}){
    const c=this.context(canvas),time=options.time||0
    c.drawImage(this.terrain(terrain),0,0,W,H);this.layout(entities,terrain,time)
    if(options.deploy){c.fillStyle='#c8d29b13';c.fillRect(12,DEPLOY_TOP,W-24,H-DEPLOY_TOP-15);c.strokeStyle='#ebdfac88';c.lineWidth=1.5;c.setLineDash([8,9]);c.beginPath();c.moveTo(20,DEPLOY_TOP);c.lineTo(W-20,DEPLOY_TOP);c.stroke();c.setLineDash([]);c.fillStyle='#283323ca';c.beginPath();c.roundRect(W/2-78,DEPLOY_TOP+10,156,25,8);c.fill();c.fillStyle='#f0e5c0';c.font='bold 12px Georgia';c.textAlign='center';c.fillText('DEPLOYMENT GROUND',W/2,DEPLOY_TOP+27)}
    const selected=entities.find(e=>!e.dead&&e.id===options.selected&&e.stats.range>0)
    if(selected){c.save();c.strokeStyle='#f3e3a7aa';c.fillStyle='#f5e8b010';c.lineWidth=1.5;c.setLineDash([7,7]);ellipse(c,selected.x,selected.y,selected.stats.range,selected.stats.range);c.fill();c.stroke();c.restore()}
    if(terrain.river&&!this.reduced){c.strokeStyle='#d9e5c338';c.lineWidth=1;for(let i=0;i<8;i++){const x=(i*73+time*11)%W,y=terrain.riverY[0]+12+(i*7)%33;if(terrain.bridges.some(b=>x>b.x-16&&x<b.x+b.w))continue;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+9,y+2,x+18,y);c.stroke()}}
    const layers=[...entities.filter(e=>!e.dead||time-(e.deathAt??-10)<.65).map(e=>({y:this.point(e).y,draw:()=>this.squad(c,e,{time,selected:e.id===options.selected,target:options.targets?.includes(e.id),badge:options.targets?.includes(e.id)?options.targets.indexOf(e.id)+1:null,focused:e.id===options.focused})})),...terrain.mountains.map(r=>({y:r.y+r.h,draw:()=>{if(this.art.cliff)c.drawImage(this.art.cliff,r.x-12,r.y-20,r.w+24,r.h+32)}}))]
    layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw())
    for(const e of entities){if(e.dead||!e.manualDestination)continue;const p=this.point(e),d=e.manualDestination;c.strokeStyle='#f0df9d99';c.lineWidth=1.4;c.setLineDash([4,6]);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(d.x,d.y);c.stroke();c.setLineDash([]);ellipse(c,d.x,d.y,11,7);c.stroke()}
    for(const p of options.projectiles||[]){const from=this.positions.get(p.from)||{x:p.x,y:p.y},to=this.positions.get(p.to)||{x:p.tx,y:p.ty},v=clamp(1-p.life/.25,0,1),arc=Math.sin(v*Math.PI)*22/this.ratio,x=from.x+(to.x-from.x)*v,y=from.y+(to.y-from.y)*v-arc-24/this.ratio;c.strokeStyle='#2c281e';c.lineWidth=3;c.beginPath();c.moveTo(x-(to.x-from.x)*.045,y-(to.y-from.y)*.045);c.lineTo(x,y);c.stroke();c.strokeStyle=p.side==='player'?'#fff1b9':'#f7c6a5';c.lineWidth=1.6;c.stroke();c.fillStyle='#fff1cc';ellipse(c,x,y,2,2/this.ratio);c.fill()}
    if(options.destination){c.fillStyle='#f0df9d';c.font='bold 13px Georgia';c.textAlign='center';c.fillText('Choose open ground',W/2,40)}
  }
}
