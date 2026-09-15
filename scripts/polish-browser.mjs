// Optional local QA: npm install --no-save --package-lock=false playwright
// Run with the dev server at 127.0.0.1:5180. All generated output is ignored.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {START_META} from '../src/data.js'
import {equippedMeta} from './tactics-balance.mjs'

const output='.artifacts/phase-b',url='http://127.0.0.1:5180/',key='march-of-epochs-react-v017'
await fs.mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true,executablePath:process.env.POLISH_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const report=[],errors=[]
async function pageFor(viewport,meta=START_META){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,hasTouch:true})
  await context.addInitScript(({key,meta})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(meta))},{key,meta})
  const page=await context.newPage()
  page.on('pageerror',error=>errors.push(error.message))
  page.on('console',message=>{if(message.type()==='error')errors.push(`${message.text()} ${message.location().url}`)})
  await page.goto(url);await page.getByRole('navigation',{name:'Main navigation'}).waitFor()
  return {page,context}
}
async function layout(page,label){
  const issues=await page.evaluate(()=>{
    const issues=[]
    if(document.documentElement.scrollWidth>innerWidth+1)issues.push('page overflows horizontally')
    for(const el of document.querySelectorAll('[role="dialog"]')){
      const r=el.getBoundingClientRect();if(r.width&&(!el.closest('[inert]'))&&(r.left<0||r.right>innerWidth+1||r.top<0||r.bottom>innerHeight+1))issues.push('dialog extends outside viewport')
    }
    for(const el of document.querySelectorAll('.toast')){const r=el.getBoundingClientRect();if(r.left<0||r.right>innerWidth+1)issues.push('toast overflows viewport')}
    for(const button of document.querySelectorAll('button,summary')){
      const r=button.getBoundingClientRect();if(!r.width||!r.height||button.closest('[inert]')||button.disabled||r.bottom<0||r.top>innerHeight)continue
      if(r.height<43)issues.push(`small target: ${button.textContent.trim().slice(0,45)} (${Math.round(r.height)}px)`)
    }
    return issues
  })
  report.push({label,issues});assert.deepEqual(issues,[],label)
}
const close=page=>page.getByRole('dialog').last().getByRole('button',{name:'Close',exact:true}).click()
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key)
try{
  for(const [width,height] of [[320,700],[360,800],[393,852],[412,915],[480,960],[768,1024],[844,390]]){
    const {page,context}=await pageFor({width,height})
    await layout(page,`fresh campaign ${width}x${height}`)
    await page.getByRole('button',{name:'Armies',exact:true}).click()
    await layout(page,`armies ${width}x${height}`)
    await page.screenshot({path:`${output}/armies-${width}.png`,animations:'disabled'})
    await page.locator('.army-overview-card').first().click()
    await layout(page,`unit detail ${width}x${height}`)
    assert.equal(await page.getByRole('dialog').count(),1)
    await page.keyboard.press('Shift+Tab')
    assert.equal(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')),true,'focus stays in dialog')
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0)
    await page.getByRole('button',{name:'Artifacts',exact:true}).click()
    await page.getByRole('button',{name:'Pack Store',exact:true}).click()
    await layout(page,`store ${width}x${height}`)
    await context.close()
  }
  const meta=equippedMeta(5);meta.gold=900;meta.xp=150;meta.tp=25;meta.characterCopies.sargon=2;meta.stats.battlesWon=3;meta.inventory.leatherLamellar=6
  const {page,context}=await pageFor({width:393,height:852},meta)
  await page.getByRole('button',{name:'Armies',exact:true}).click()
  await page.screenshot({path:`${output}/armies-equipped.png`,animations:'disabled'})
  await page.locator('.army-overview-card').first().click()
  await page.reload();await page.getByRole('dialog',{name:'Warriors',exact:true}).waitFor()
  const before=await saved(page)
  await page.getByRole('button',{name:/Level Up/}).evaluate(button=>{button.click();button.click()})
  await page.getByRole('status').filter({hasText:'reached Level'}).waitFor()
  assert.equal((await saved(page)).unitLevels.warrior,before.unitLevels.warrior+1,'double tap trains once')
  await page.getByRole('button',{name:'Remove Stone Axe Grip',exact:true}).click()
  await page.getByRole('button',{name:'Equip Artifact',exact:false}).click()
  await layout(page,'nested artifact picker')
  await page.keyboard.press('Escape');await page.getByRole('dialog',{name:'Warriors',exact:true}).waitFor()
  await close(page)
  await page.locator('.menu-disclosure summary').click();await page.evaluate(()=>window.scrollTo(0,250))
  await page.getByRole('button',{name:'Artifacts',exact:true}).click()
  await page.getByRole('button',{name:'Armies',exact:true}).click()
  assert.ok(await page.evaluate(()=>window.scrollY)>=200,'tab retains scroll position')
  await page.getByRole('button',{name:'Artifacts',exact:true}).click()
  await page.getByRole('button',{name:/Reinforced Leather Lamellar, level/}).click()
  await page.getByRole('button',{name:/Evolve/}).click()
  await page.getByRole('status').filter({hasText:'evolved to Level 2'}).waitFor()
  assert.equal(await page.getByRole('dialog').count(),1,'evolution keeps detail open')
  await close(page)
  await page.getByRole('button',{name:'Pack Store',exact:true}).click()
  const goldBefore=(await saved(page)).gold
  await page.getByRole('button',{name:/Supply Artifact Pack/}).click()
  assert.ok((await saved(page)).gold<goldBefore)
  await page.getByRole('button',{name:/Tap to open/}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
  await page.getByRole('button',{name:'People',exact:true}).click()
  await page.locator('.collection-person').filter({hasText:'Sargon'}).click()
  await page.getByRole('button',{name:/Upgrade/}).click();await page.getByRole('status').filter({hasText:'promoted'}).waitFor();await close(page)
  await page.getByRole('button',{name:'Campaign',exact:true}).click()
  await page.getByRole('button',{name:/ready/}).click()
  await page.screenshot({path:`${output}/achievements.png`,animations:'disabled'})
  const claimGold=(await saved(page)).gold
  await page.getByRole('button',{name:'Claim reward',exact:true}).first().click()
  assert.ok((await saved(page)).gold>claimGold);await close(page)
  await page.getByRole('button',{name:'Start Campaign',exact:true}).click()
  await page.getByRole('button',{name:/Next.*Muster Army/}).click()
  for(let i=0;i<3;i++)await page.locator('.muster-pool-item').filter({hasText:i%2?'Archers':'Spearmen'}).click()
  await page.getByRole('button',{name:'Start Campaign',exact:true}).click()
  await page.getByRole('button',{name:'Study Battlefield & Deploy',exact:true}).click()
  await layout(page,'battle deployment')
  await page.getByRole('button',{name:'Battle info',exact:true}).click();await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog').count(),0,'briefing dismisses without opening pause')
  await page.getByRole('button',{name:'Pause battle',exact:true}).click()
  await page.getByRole('button',{name:'Battle briefing & enhancements',exact:true}).click();await page.keyboard.press('Escape')
  await page.getByRole('dialog',{name:'Battle paused',exact:true}).waitFor()
  await page.getByRole('button',{name:'Resume battle',exact:true}).click()
  await page.getByRole('button',{name:'Finish Deployment',exact:true}).click()
  await page.getByRole('button',{name:/Focus/}).click();await page.getByRole('button',{name:/Target 1/}).click()
  await page.getByText('Battle won',{exact:true}).waitFor({timeout:45000})
  await layout(page,'victory reward');await page.screenshot({path:`${output}/victory.png`,animations:'disabled'})
  if(await page.getByRole('button',{name:/^Reinforcement /}).count()){
    await page.getByRole('button',{name:/^Reinforcement /}).click();await layout(page,'reinforcement picker')
    await page.locator('.reward-card:not(:disabled)').first().click()
  }else await page.locator('.reward-card').first().click()
  await page.getByRole('button',{name:'Study Battlefield & Deploy',exact:true}).click()
  await page.getByRole('button',{name:'Battle menu',exact:true}).click()
  await page.getByRole('button',{name:/Leave campaign/}).click()
  await page.getByRole('navigation',{name:'Main navigation'}).waitFor()
  const settled=await saved(page);await page.reload();assert.equal((await saved(page)).gold,settled.gold)
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Armies',exact:true}).click()
  assert.equal(await page.locator('main').evaluate(el=>getComputedStyle(el).animationName),'none')
  await page.setViewportSize({width:320,height:700});await layout(page,'resize after campaign')
  await context.close()
  const researchMeta=structuredClone(START_META);researchMeta.featureUnlocks.technology=true;researchMeta.ownedTech=['fire'];researchMeta.tp=10
  const research=await pageFor({width:360,height:800},researchMeta)
  await research.page.getByRole('button',{name:'Technology',exact:true}).click()
  await layout(research.page,'technology at 360px')
  await research.page.locator('.tech-node').filter({has:research.page.locator('.tech-copy>b',{hasText:/^Archery$/})}).click()
  assert.ok((await saved(research.page)).ownedTech.includes('archery'))
  await research.page.screenshot({path:`${output}/technology.png`,animations:'disabled'})
  await research.context.close()
  const storage=await pageFor({width:360,height:800})
  await storage.page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('Storage unavailable')}})
  await storage.page.getByRole('button',{name:'Campaign',exact:true}).click()
  await storage.page.getByRole('button',{name:'Start Campaign',exact:true}).click()
  await storage.page.getByRole('button',{name:/Next.*Muster Army/}).click()
  for(let i=0;i<2;i++)await storage.page.locator('.muster-pool-item').filter({hasText:'Warriors'}).click()
  await storage.page.getByRole('button',{name:'Start Campaign',exact:true}).click()
  await storage.page.getByRole('alert').filter({hasText:'Progress could not be saved'}).waitFor()
  await storage.page.evaluate(()=>{Storage.prototype.setItem=window.originalSetItem})
  await storage.page.getByRole('button',{name:'Retry save',exact:true}).click()
  assert.equal(await storage.page.getByRole('alert').count(),0)
  assert.equal((await saved(storage.page)).stats.runsStarted,1)
  await storage.context.close()
  assert.deepEqual(errors,[],'console and runtime errors')
  await fs.writeFile(`${output}/report.json`,JSON.stringify({checks:report,errors},null,2))
  console.log(JSON.stringify({passed:report.length,errors,output}))
}catch(error){console.error(error);await fs.writeFile(`${output}/report.json`,JSON.stringify({checks:report,errors,error:String(error)},null,2));process.exitCode=1}
finally{await browser.close()}
