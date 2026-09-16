import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {PEOPLE} from '../src/data.js'
import {equippedMeta} from './tactics-balance.mjs'
const output='.artifacts/cards',key='march-of-epochs-react-v017'
await fs.mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true,executablePath:process.env.POLISH_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const meta=equippedMeta(5);meta.gold=1000;meta.characterCopies=Object.fromEntries(Object.keys(PEOPLE).map(id=>[id,1]));meta.loadout.tech=['fire','archery','wheel']
const context=await browser.newContext({viewport:{width:393,height:852}})
await context.addInitScript(({meta,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(meta))},{meta,key})
const page=await context.newPage(),errors=[],checks=[]
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const nav=name=>page.getByRole('navigation').getByRole('button',{name,exact:true}).click()
async function layout(label){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,label);checks.push(label)}
try{
 await page.goto('http://127.0.0.1:5180/');await nav('People')
 for(const [width,height] of [[320,700],[393,852],[600,900]]){
  await page.setViewportSize({width,height})
  for(const name of ['Tribal Elder','Merchant Prince','Narmer','Sargon of Akkad','Cleopatra']){
   await page.locator('.collection-person').filter({hasText:name}).click()
   const card=page.locator('.collectible-card');await card.waitFor()
   await card.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())))
   assert.equal(await card.locator('.collectible-name h2').innerText(),name)
   assert.equal(await card.locator('.collectible-frame').count(),1)
   assert.equal(await card.locator('.collectible-frame img').evaluate(img=>{const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(Math.floor(canvas.width*.5),Math.floor(canvas.height*.4),1,1).data[3]}),0,'frame has a real transparent window')
   const overflow=await card.locator('.collectible-name,.collectible-power').evaluateAll(els=>els.some(el=>el.scrollHeight>el.clientHeight+2))
   assert.equal(overflow,false,`${name} card text fits at ${width}`)
   await layout(`${name} at ${width}`)
   await card.screenshot({path:`${output}/${name.replaceAll(' ','-')}-${width}.png`,animations:'disabled'})
   await page.keyboard.press('Escape')
  }
 }
 await page.setViewportSize({width:393,height:852});await nav('Campaign')
 await page.getByRole('button',{name:'Start Campaign',exact:true}).click()
 assert.equal(await page.locator('.technology-loadout .technology-thumbnail svg').count(),3)
 assert.equal(await page.locator('.technology-loadout .technology-thumbnail clipPath rect[width="1"][height="1"]').count(),3,'wide loadout slots clip each atlas cell')
 assert.equal(await page.locator('.technology-loadout .tech-big>img').count(),0)
 await page.locator('.technology-loadout').screenshot({path:`${output}/loadout-technology.png`})
 await page.locator('.technology-loadout button').first().click()
 assert.ok(await page.locator('.tech-picker .technology-thumbnail svg').count()>=3)
 await page.keyboard.press('Escape');await page.keyboard.press('Escape')
 checks.push('new technology atlas in loadout and picker')
 await nav('People');await page.getByRole('button',{name:'People Store',exact:true}).click()
 await page.getByRole('button',{name:/Historical Pack/}).click();await page.getByRole('button',{name:/Tap to open/}).click()
 const first=await page.locator('.collectible-card').getAttribute('aria-label')
 assert.equal(await page.locator('.card-unveiled').evaluate(el=>getComputedStyle(el).animationName),'card-unveil')
 await page.locator('.people-unveiling').screenshot({path:`${output}/reveal.png`,animations:'disabled'})
 await page.getByRole('button',{name:'Reveal next',exact:true}).click()
 assert.match(await page.locator('.discovery-heading').innerText(),/2 of 2/)
 await page.emulateMedia({reducedMotion:'reduce'})
 assert.equal(await page.locator('.card-unveiled').evaluate(el=>getComputedStyle(el).animationName),'none')
 assert.equal(await page.locator('.discovery-rays').evaluate(el=>getComputedStyle(el).animationName),'none')
 const before=await page.evaluate(key=>localStorage.getItem(key),key)
 await page.getByRole('button',{name:'Continue',exact:true}).click()
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before,'revealing never grants rewards twice')
 checks.push('sequential reveal, motion preference, already banked rewards')
 const discoveryMeta=structuredClone(meta);discoveryMeta.characterCopies={sargon:1,merchant:1}
 const discoveryContext=await browser.newContext({viewport:{width:393,height:852}})
 await discoveryContext.addInitScript(({meta,key})=>{localStorage.setItem(key,JSON.stringify(meta));Math.random=()=>0},{meta:discoveryMeta,key})
 const discovery=await discoveryContext.newPage()
 discovery.on('pageerror',e=>errors.push(e.message))
 await discovery.goto('http://127.0.0.1:5180/')
 await discovery.getByRole('navigation').getByRole('button',{name:'People',exact:true}).click()
 await discovery.getByRole('button',{name:'People Store',exact:true}).click()
 await discovery.getByRole('button',{name:/Historical Pack/}).click();await discovery.getByRole('button',{name:/Tap to open/}).click()
 await discovery.getByRole('heading',{name:'New discovery',exact:true}).waitFor()
 await discovery.locator('.card-unveiled').waitFor()
 await discovery.locator('.people-unveiling').screenshot({path:`${output}/new-discovery.png`,animations:'disabled'})
 const banked=await discovery.evaluate(key=>JSON.parse(localStorage.getItem(key)).characterCopies,key)
 await discovery.getByRole('button',{name:'Reveal next',exact:true}).click()
 await discovery.getByRole('heading',{name:'Another step to greatness',exact:true}).waitFor()
 await discovery.getByRole('button',{name:'Continue',exact:true}).click()
 assert.deepEqual(await discovery.evaluate(key=>JSON.parse(localStorage.getItem(key)).characterCopies,key),banked)
 await discoveryContext.close();checks.push('new discovery followed by duplicate of the same person')
 assert.deepEqual(errors,[])
 await fs.writeFile(`${output}/report.json`,JSON.stringify({checks,errors,first},null,2));console.log(JSON.stringify({passed:checks.length,errors}))
}catch(error){await page.screenshot({path:`${output}/failure.png`,fullPage:true});throw error}finally{await browser.close()}
