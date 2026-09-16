// Optional local browser QA; uses the same Playwright setup as polish-browser.mjs.
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {chromium} from 'playwright'
import {START_META,PEOPLE,ITEMS} from '../src/data.js'

const output='.artifacts/collections',key='march-of-epochs-react-v017'
await fs.mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true,executablePath:process.env.POLISH_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const errors=[],checks=[]
const meta=structuredClone(START_META)
meta.gold=3000;meta.featureUnlocks={people:true,technology:true,relics:true}
meta.completedCampaigns=['dawn'];meta.unlockedCampaigns=['dawn','firstcities']
meta.characterCopies=Object.fromEntries(Object.keys(PEOPLE).map(id=>[id,2]))
meta.characterLevels={elder:3,napoleon:6,sargon:2}
meta.inventory=Object.fromEntries(Object.keys(ITEMS).map(id=>[id,2]))
meta.inventory.stoneAxeGrip=1;meta.inventory.warStandard=1
meta.artifactLevels={boneCharm:5,bronzeArmor:3}
meta.unitEquipment={warrior:['stoneAxeGrip']};meta.heroEquipment={sargon:'warStandard'}
const context=await browser.newContext({viewport:{width:393,height:852},hasTouch:true})
await context.addInitScript(({key,meta})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(meta))},{key,meta})
const page=await context.newPage()
page.on('pageerror',e=>errors.push(e.message))
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const nav=name=>page.getByRole('navigation').getByRole('button',{name,exact:true}).click()
const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key)
async function layout(label){
  const issues=await page.evaluate(()=>{
    const result=[]
    if(document.documentElement.scrollWidth>innerWidth+1)result.push('horizontal overflow')
    for(const image of document.querySelectorAll('img'))if(image.getBoundingClientRect().height&&(!image.complete||!image.naturalWidth))result.push(`broken image: ${image.src}`)
    for(const select of document.querySelectorAll('select'))if(select.getBoundingClientRect().height<44)result.push('small select target')
    return result
  })
  assert.deepEqual(issues,[],label);checks.push(label)
}
try{
  await page.goto('http://127.0.0.1:5180/')
  await nav('People');await page.locator('.collection-person').first().waitFor()
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))))
  assert.equal(await page.locator('.collection-person').count(),12)
  const sources=await page.locator('.collection-person img').evaluateAll(images=>images.map(i=>i.src))
  assert.ok(sources.every(src=>src.includes('/assets/ages/')),'all portraits use age-based paths')
  await page.getByLabel('People age',{exact:true}).selectOption('bronzeIron')
  assert.equal(await page.locator('.collection-person').count(),3)
  await page.getByLabel('People rarity',{exact:true}).selectOption('Epic')
  assert.equal(await page.locator('.collection-person').count(),2)
  await page.getByLabel('People sort',{exact:true}).selectOption('name')
  assert.match(await page.locator('.collection-person').first().innerText(),/Cyrus/)
  await layout('People combined age and rarity filters')
  await page.getByLabel('People age',{exact:true}).selectOption('modernAge')
  assert.equal(await page.locator('.collection-person').count(),0)
  await page.getByRole('button',{name:'Clear People filters'}).click()
  await page.getByLabel('People sort',{exact:true}).selectOption('level-desc')
  assert.match(await page.locator('.collection-person').first().innerText(),/Napoleon/)
  await page.getByLabel('People sort',{exact:true}).selectOption('age-desc')
  assert.match(await page.locator('.collection-person').first().innerText(),/Napoleon/)
  await page.getByLabel('People sort',{exact:true}).selectOption('rarity-asc')
  assert.match(await page.locator('.collection-person').first().innerText(),/Common/)
  await page.getByLabel('People age',{exact:true}).selectOption('origins')
  await page.screenshot({path:`${output}/people-age1.png`,fullPage:true,animations:'disabled'})
  await page.locator('.collection-person').filter({hasText:'Sargon'}).click()
  await page.getByRole('dialog').waitFor();await layout('Sargon detail uses replacement portrait')
  await page.screenshot({path:`${output}/sargon-detail.png`,animations:'disabled'})
  await page.keyboard.press('Escape')
  await page.getByRole('button',{name:'People Store',exact:true}).click()
  assert.equal(await page.getByRole('button',{name:/Supply Artifact Pack/}).count(),0)
  const before=await saved()
  await page.getByRole('button',{name:/Historical Pack/}).click()
  await page.getByRole('button',{name:/Tap to open/}).click()
  await page.getByRole('button',{name:'Reveal next',exact:true}).click()
  await page.getByRole('button',{name:'Continue',exact:true}).click()
  assert.ok((await saved()).gold<before.gold)
  assert.deepEqual((await saved()).inventory,before.inventory,'People store does not award artifact packs')
  checks.push('People pack purchase and reveal in separate store')
  await nav('Artifacts')
  assert.equal(await page.locator('.inventory-tile').count(),9)
  assert.match(await page.locator('.inventory-tile').first().getAttribute('aria-label'),/Bone Charm, level 5/)
  const equipped=page.getByRole('button',{name:/Stone Axe Grip, level/})
  assert.equal(await equipped.isEnabled(),true)
  assert.match(await equipped.getAttribute('class'),/is-equipped/)
  await equipped.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape')
  await page.getByLabel('Artifact age',{exact:true}).selectOption('bronzeIron')
  assert.equal(await page.locator('.inventory-tile').count(),3)
  await page.getByLabel('Artifact age',{exact:true}).selectOption('all')
  await page.getByLabel('Artifact sort',{exact:true}).selectOption('age-desc')
  assert.match(await page.locator('.inventory-tile').first().getAttribute('aria-label'),/Bronze/)
  for(const [width,height] of [[320,700],[393,852],[480,960],[768,1024],[844,390]]){
    await page.setViewportSize({width,height});await layout(`artifact matrix ${width}x${height}`)
    const columns=await page.locator('.inventory-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)
    assert.equal(columns,width<440?3:4)
    await page.screenshot({path:`${output}/artifacts-${width}.png`,fullPage:true,animations:'disabled'})
  }
  await page.setViewportSize({width:393,height:852})
  await page.getByRole('button',{name:'Hero Relics',exact:true}).click()
  assert.equal(await page.locator('.inventory-tile').count(),3,'equipped relics stay visible')
  assert.match(await page.getByRole('button',{name:/Carthaginian War Standard, level/}).getAttribute('class'),/is-equipped/)
  await page.getByRole('button',{name:'Pack Store',exact:true}).click()
  assert.equal(await page.getByRole('button',{name:/Historical Pack|Great Chronicle/}).count(),0)
  const artifactBefore=await saved()
  await page.getByRole('button',{name:/Supply Artifact Pack/}).click()
  await page.getByRole('button',{name:/Tap to open/}).click();await page.getByRole('button',{name:'Continue',exact:true}).click()
  assert.deepEqual((await saved()).characterCopies,artifactBefore.characterCopies,'Artifact store does not award People')
  checks.push('Artifact pack purchase and reveal in separate store')
  await nav('People');assert.equal(await page.getByRole('button',{name:/Historical Pack/}).count(),1,'People store tab survives main navigation')
  await nav('Technology')
  assert.equal(await page.locator('.technology-thumbnail svg').count(),8)
  const cells=await page.locator('.technology-thumbnail svg').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('viewBox')))
  assert.equal(new Set(cells).size,8,'each technology uses its own complete illustration cell')
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))))
  await layout('Technology illustration atlas')
  await page.screenshot({path:`${output}/technology.png`,fullPage:true,animations:'disabled'})
  assert.deepEqual(errors,[])
  await fs.writeFile(`${output}/report.json`,JSON.stringify({checks,errors},null,2))
  console.log(JSON.stringify({passed:checks.length,errors,output}))
}catch(error){await page.screenshot({path:`${output}/failure.png`,fullPage:true});throw error}
finally{await browser.close()}
