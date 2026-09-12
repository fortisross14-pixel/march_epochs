export const RARITIES = {
  Common: { color: '#aeb8c3', maxLevel: 3, weight: 50 },
  Uncommon: { color: '#75d3a1', maxLevel: 3, weight: 28 },
  Rare: { color: '#62aef1', maxLevel: 4, weight: 15 },
  Epic: { color: '#b793ff', maxLevel: 5, weight: 6 },
  Legend: { color: '#f2c66c', maxLevel: 6, weight: 1 },
}

export const COPY_THRESHOLDS = [1, 2, 4, 6, 8, 10]
export const GOLD_UPGRADE_COSTS = [0, 150, 250, 500, 1000, 2000]

export const PEOPLE = {
  elder: {
    id: 'elder', type: 'leader', name: 'Tribal Elder', rarity: 'Common', era: 'Dawn', archetype: 'Growth', icon: '☀',
    bio: 'A respected clan elder whose experience keeps a young settlement supplied and organized.',
    levels: [
      '+8% Gold after victories',
      '+15% reinforcement speed',
      '+5% inter-battle recovery',
    ]
  },
  merchant: {
    id: 'merchant', type: 'leader', name: 'Merchant Prince', rarity: 'Uncommon', era: 'Dawn', archetype: 'Trade', icon: '◉',
    bio: 'An early trading magnate who turns successful campaigns into more resources and better purchases.',
    levels: [
      '+12% Gold after victories',
      'Shops cost 8% less',
      '+20% Gold after victories',
    ]
  },
  narmer: {
    id:'narmer', type:'leader', name:'Narmer', rarity:'Rare', era:'First Kingdoms', archetype:'Unification', icon:'♛',
    bio:'Narmer is traditionally associated with the political unification of Upper and Lower Egypt around the beginning of the Early Dynastic period.',
    levels:['+8% army Health','+10% Gold after victories','+1 reinforcement strength step','Egyptian units gain +8 Armor']
  },
  sargon: {
    id:'sargon', type:'general', name:'Sargon of Akkad', rarity:'Epic', era:'First Empires', archetype:'Expansion', icon:'⚔', signatureUnit:'bronzeGuard', signatureLevel:1,
    bio:'Sargon founded the Akkadian Empire and became the archetype of the conquering Mesopotamian king. Details of individual campaigns are fragmentary, but his expansion was extraordinary.',
    levels:['Unlock Bronze Guard and +8% melee Damage','+15% melee Damage','+1 starting army slot','Campaign Momentum: +10% attack speed after each battle won','Bronze Guard gains +25% Health']
  },
  thutmose: {
    id:'thutmose', type:'general', name:'Thutmose III', rarity:'Epic', era:'New Kingdom', archetype:'Maneuver', icon:'⚑', signatureUnit:'chariot', signatureLevel:1, special:'Royal Charge', specialLevel:4,
    bio:'Thutmose III expanded New Kingdom Egypt through repeated campaigns and is closely associated with the Battle of Megiddo.',
    levels:['Unlock Chariots and +10% mounted Damage','+15% mounted Speed','+1 starting army slot','Unlock Royal Charge','Chariots gain +25% Health and +20% charge damage']
  },
  ramesses: {
    id:'ramesses', type:'leader', name:'Ramesses II', rarity:'Rare', era:'New Kingdom', archetype:'Monumental State', icon:'☀', signatureUnit:'chariot', signatureLevel:3,
    bio:'Ramesses II ruled Egypt for more than six decades and fought the Hittites at Kadesh, later celebrating the encounter extensively in royal inscriptions.',
    levels:['+10% reinforcement speed','+12% Gold after victories','Unlock Chariots regardless of technology','+10% all army Health']
  },
  cyrus: {
    id:'cyrus', type:'leader', name:'Cyrus the Great', rarity:'Epic', era:'Achaemenid', archetype:'Integration', icon:'✦',
    bio:'Cyrus II created the Achaemenid Persian Empire by conquering Media, Lydia and Babylon while preserving a reputation for pragmatic imperial rule.',
    levels:['+10% Gold and +5% Health','+15% reinforcement speed','+1 technology slot','Surviving squads recover +8% more between battles','Combined Arms: +8% Damage when fielding 3+ unit roles']
  },

  cleopatra: {
    id: 'cleopatra', type: 'leader', name: 'Cleopatra', rarity: 'Legend', era: 'Classical', archetype: 'Wealth', icon: '♛', premiumArt: true,
    bio: 'Cleopatra VII was the last active ruler of Ptolemaic Egypt. She combined political skill, dynastic ambition and personal charisma while navigating the struggle between Egypt and Rome.',
    signatureUnit: 'egyptianGuard',
    levels: [
      '+15% Gold after victories',
      '+25% Gold after victories',
      'Reinforce restores +8% more HP',
      '+1 Technology slot for this run',
      'Unlock Royal Egyptian Guard',
      'Golden Age: +1 starting squad and +20% reinforcement speed',
    ]
  },
  veteran: {
    id: 'veteran', type: 'general', name: 'Veteran Commander', rarity: 'Common', era: 'Dawn', archetype: 'Balanced', icon: '⚔',
    bio: 'A seasoned field commander who makes a basic army more dependable without changing its identity.',
    levels: [
      '+6% all unit damage',
      '+10% reinforcement speed',
      '+8% all unit health',
    ]
  },
  hunter: {
    id: 'hunter', type: 'general', name: 'Hunter Captain', rarity: 'Uncommon', era: 'Dawn', archetype: 'Skirmish', icon: '➹',
    bio: 'A skirmish commander used to reading terrain, keeping distance and concentrating missile fire.',
    levels: [
      '+8% ranged damage',
      '+10% ranged attack speed',
      '+12% ranged range',
    ]
  },
  hannibal: {
    id: 'hannibal', type: 'general', name: 'Hannibal', rarity: 'Epic', era: 'Classical', archetype: 'Flanking', icon: '🐘', premiumArt: true,
    bio: 'Hannibal Barca was the Carthaginian commander who crossed the Alps and brought war into the Roman heartland. His maneuver warfare and battlefield imagination made him one of antiquity’s defining generals.',
    signatureUnit: 'warElephant', special: 'Double Envelopment', specialLevel: 4,
    levels: [
      '+10% shock-unit damage and unlock War Elephants',
      '+20% shock-unit damage',
      '+1 starting army slot',
      '+30% shock-unit damage and unlock Double Envelopment',
      'War Elephants become elite: +35% HP, +25% damage and Fear',
    ]
  },
  napoleon: {
    id: 'napoleon', type: 'general', name: 'Napoleon', rarity: 'Legend', era: 'Revolution', archetype: 'Artillery Tempo', icon: '★', premiumArt: true,
    bio: 'Napoleon Bonaparte rose from artillery officer to Emperor of the French. His campaigns transformed operational warfare, administration and the political map of Europe.',
    signatureUnit: 'imperialGuard', special: 'Grand Battery', specialLevel: 4,
    levels: [
      '+10% all unit damage and unlock Imperial Guard',
      '+15% attack speed for firearm units',
      '+1 starting army slot',
      'Unlock Grand Battery battle action',
      'Imperial Guard gain +30% HP and +25% damage',
      'Purple Star: first Rally and Grand Battery begin fully charged',
    ]
  }
}

export const TECHS = {
  fire: { id:'fire', name:'Fire', icon:'🔥', tier:1, cost:0, prereq:[], desc:'Root technology. Enables incendiary upgrades and later Gunpowder.' },
  archery: { id:'archery', name:'Archery', icon:'🏹', tier:1, cost:0, prereq:[], desc:'Unlocks Archers and ranged upgrade paths.' },
  wheel: { id:'wheel', name:'Wheel', icon:'◉', tier:1, cost:0, prereq:[], desc:'Unlocks mobile and chariot branches.' },
  agriculture: { id:'agriculture', name:'Agriculture', icon:'🌾', tier:1, cost:2, prereq:[], startSlots:1, reinforceMult:1.15, recovery:.03, desc:'+1 starting squad, faster reinforcements and better recovery.' },
  domestication: { id:'domestication', name:'Domestication', icon:'🐎', tier:1, cost:2, prereq:[], desc:'Unlocks mounted units.' },
  writing: { id:'writing', name:'Writing', icon:'✎', tier:1, cost:2, prereq:[], desc:'Unlocks organization and advanced state technologies.' },
  copper: { id:'copper', name:'Copper Working', icon:'◇', tier:1, cost:2, prereq:[], desc:'First metalworking step.' },
  bronze: { id:'bronze', name:'Bronze Working', icon:'⬡', tier:2, cost:3, prereq:['copper'], desc:'Unlocks Bronze Axemen and heavier armor.' },
  irrigation: { id:'irrigation', name:'Irrigation', icon:'≋', tier:2, cost:3, prereq:['agriculture'], reinforceMult:1.15, recovery:.04, desc:'Improves reinforcement and recovery.' },
  organization: { id:'organization', name:'Military Organization', icon:'⚑', tier:2, cost:5, prereq:['writing'], startSlots:1, desc:'+1 starting squad and disciplined formations.' },
  roads: { id:'roads', name:'Roads', icon:'═', tier:2, cost:4, prereq:['wheel'], reinforceMult:1.25, desc:'Reinforcement meter fills much faster.' },
  fortification: { id:'fortification', name:'Fortification', icon:'▥', tier:2, cost:4, prereq:['writing'], desc:'Defensive doctrines and fortified unit upgrades.' },
  iron: { id:'iron', name:'Iron Working', icon:'◆', tier:3, cost:6, prereq:['bronze'], desc:'Prerequisite for Metallurgy.' },
  metallurgy: { id:'metallurgy', name:'Metallurgy', icon:'⚒', tier:4, cost:8, prereq:['iron'], desc:'Advanced armor and firearm components.' },
  gunpowder: { id:'gunpowder', name:'Gunpowder', icon:'✹', tier:4, cost:9, prereq:['fire','writing'], desc:'Explosives and firearm technology.' },
  firearms: { id:'firearms', name:'Firearms', icon:'⌁', tier:5, cost:12, prereq:['gunpowder','metallurgy'], startSlots:1, desc:'+1 starting squad and firearm units.' },
  industrial: { id:'industrial', name:'Industrialization', icon:'⚙', tier:5, cost:14, prereq:['roads','metallurgy'], reinforceMult:1.35, desc:'Mass production and faster replacement flow.' },
  machinegun: { id:'machinegun', name:'Machine Guns', icon:'▰', tier:6, cost:18, prereq:['firearms','industrial'], startSlots:2, desc:'+2 starting squad capacity and machine-gun evolutions.' },
  ballistics: { id:'ballistics', name:'Ballistics', icon:'⌖', tier:6, cost:18, prereq:['firearms'], desc:'Long-range precision branch.' },
  rocketry: { id:'rocketry', name:'Rocketry', icon:'🚀', tier:6, cost:22, prereq:['gunpowder','ballistics'], desc:'Rocket artillery and missiles.' },
}

export const UNITS = {
  warrior: { id:'warrior', name:'Warriors', rarity:'Common', role:'MELEE', health:112, armor:4, damage:11, attackSpeed:1.0, range:0, moveSpeed:42, unlock:'Starting army', desc:'Basic close-combat squad.' },
  spear: { id:'spear', name:'Spearmen', rarity:'Common', role:'SPEAR', health:118, armor:6, damage:10, attackSpeed:1.05, range:0, moveSpeed:39, antiMounted:1.7, requires:['copper'], unlock:'Research Copper Working', desc:'+70% damage against mounted units.' },
  slinger: { id:'slinger', name:'Slingers', rarity:'Uncommon', role:'RANGED', health:72, armor:0, damage:8.5, attackSpeed:.95, range:190, moveSpeed:37, unlock:'Starting army', desc:'Primitive ranged harassment.' },
  archer: { id:'archer', name:'Archers', rarity:'Uncommon', role:'RANGED', health:80, armor:0, damage:10, attackSpeed:1.18, range:235, moveSpeed:34, requires:['archery'], unlock:'Research Archery', desc:'Long-range projectile squad.' },
  cavalry: { id:'cavalry', name:'Horsemen', rarity:'Rare', role:'MOUNTED', health:126, armor:5, damage:15, attackSpeed:1.15, range:0, moveSpeed:71, charge:1.55, requires:['domestication'], unlock:'Research Domestication', desc:'Fast flanking unit.' },
  horseArcher: { id:'horseArcher', name:'Horse Archers', rarity:'Epic', role:'MOUNTED RANGED', health:94, armor:3, damage:11.5, attackSpeed:1.08, range:205, moveSpeed:67, requires:['archery','domestication'], unlock:'Research Archery + Domestication', desc:'Mobile ranged cavalry.' },
  chariot: { id:'chariot', name:'Chariots', rarity:'Epic', role:'MOUNTED', health:140, armor:8, damage:17, attackSpeed:1.2, range:0, moveSpeed:75, charge:1.78, requires:['wheel','domestication'], unlock:'Research Wheel + Domestication, or obtain Thutmose III / Ramesses II', desc:'Shock chariots.' },
  rangedChariot: { id:'rangedChariot', name:'Ranged Chariots', rarity:'Epic', role:'MOUNTED RANGED', health:108, armor:5, damage:13, attackSpeed:1.14, range:212, moveSpeed:71, requires:['wheel','archery','domestication'], unlock:'Research Wheel + Archery + Domestication', desc:'Mobile archery platform.' },
  axeman: { id:'axeman', name:'Bronze Axemen', rarity:'Rare', role:'MELEE', health:122, armor:10, damage:15, attackSpeed:1.08, range:0, moveSpeed:40, requires:['bronze'], unlock:'Research Bronze Working', desc:'High-damage bronze melee troops.' },
  bronzeGuard: { id:'bronzeGuard', name:'Bronze Guard', rarity:'Epic', role:'MELEE', health:155, armor:26, damage:13, attackSpeed:1.05, range:0, moveSpeed:36, requires:['bronze','organization'], unlock:'Research Bronze Working + Military Organization, or obtain Sargon', desc:'Durable bronze infantry.' },
  cityArcher: { id:'cityArcher', name:'City Bowmen', rarity:'Rare', role:'RANGED', health:84, armor:4, damage:11, attackSpeed:1.15, range:250, moveSpeed:32, requires:['archery','writing'], unlock:'Research Archery + Writing', desc:'Organized city archers.' },
  warElephant: { id:'warElephant', name:'War Elephants', rarity:'Legend', role:'MOUNTED HEAVY', health:220, armor:18, damage:20, attackSpeed:.74, range:0, moveSpeed:46, charge:1.9, signature:'hannibal', unlock:'Obtain Hannibal', fear:true, desc:'Hannibal signature shock unit.' },
  egyptianGuard: { id:'egyptianGuard', name:'Royal Egyptian Guard', rarity:'Legend', role:'MELEE', health:176, armor:24, damage:16, attackSpeed:1.02, range:0, moveSpeed:38, signature:'cleopatra', unlock:'Raise Cleopatra to Level 5', desc:'Elite guard unlocked by Cleopatra at high level.' },
  imperialGuard: { id:'imperialGuard', name:'Imperial Guard', rarity:'Legend', role:'FIREARM', health:166, armor:19, damage:22, attackSpeed:1.0, range:185, moveSpeed:44, signature:'napoleon', unlock:'Obtain Napoleon', desc:'Napoleon signature infantry.' },
  marines: { id:'marines', name:'Marines', rarity:'Legend', role:'FIREARM MELEE', health:220, armor:20, damage:19, attackSpeed:1.22, range:210, moveSpeed:50, requires:['firearms','organization'], unlock:'Research Firearms + Military Organization', desc:'A future-era professional formation. Its Level 1 base stats intentionally exceed a fully trained primitive Warrior.' },
}

export const UNIT_LEVEL_MAX = 100
export function unitLevelCost(level){
  const l=Math.max(1,level)
  return Math.round(7 + l*2.1 + Math.pow(l,1.22)*0.72)
}
export function unitStatsAtLevel(id,level=1){
  const u=UNITS[id]
  if(!u)return null
  const lv=clampLevel(level)
  let healthSteps=0,speedSteps=0,damageSteps=0,armorSteps=0
  for(let n=2;n<=lv;n++){
    const phase=(n-2)%4
    if(phase===0)healthSteps++
    else if(phase===1)speedSteps++
    else if(phase===2)damageSteps++
    else armorSteps++
  }
  return {
    ...u,
    health: +(u.health*(1+healthSteps*.012)).toFixed(1),
    attackSpeed: +(u.attackSpeed*(1+speedSteps*.007)).toFixed(3),
    damage: +(u.damage*(1+damageSteps*.010)).toFixed(2),
    armor: +(u.armor+armorSteps*.4).toFixed(1),
    level:lv,
  }
}
export function unitNextLevelBonus(level){
  const next=Math.min(UNIT_LEVEL_MAX,Math.max(1,level)+1)
  const phase=(next-2)%4
  if(phase===0)return 'Health +1.2% base'
  if(phase===1)return 'Attack Speed +0.7% base'
  if(phase===2)return 'Damage +1.0% base'
  return 'Armor +0.4'
}
function clampLevel(level){return Math.max(1,Math.min(UNIT_LEVEL_MAX,Math.floor(level||1)))}

const firstWarTypes = [
  ['warrior'],
  ['warrior','slinger'],
  ['warrior','warrior','slinger'],
  ['warrior','slinger','slinger'],
  ['warrior','spear','slinger'],
  ['spear','warrior','slinger'], ['spear','spear','slinger'], ['warrior','archer','spear'], ['spear','archer','warrior'], ['spear','spear','archer'],
  ['warrior','spear','archer','slinger'], ['spear','archer','archer','warrior'], ['spear','spear','archer','warrior'], ['spear','spear','archer','slinger','warrior'], ['spear','spear','archer','archer','warrior']
]
const bronzeTypes = [
  ['warrior','spear'], ['chariot','spear'], ['axeman','cityArcher'], ['chariot','cityArcher','spear'], ['bronzeGuard','cityArcher','spear'],
  ['bronzeGuard','axeman','cityArcher'], ['chariot','bronzeGuard','cityArcher'], ['bronzeGuard','bronzeGuard','cityArcher'], ['chariot','axeman','cityArcher','spear'],
  ['bronzeGuard','cityArcher','cityArcher','chariot'], ['bronzeGuard','axeman','cityArcher','chariot','spear'], ['bronzeGuard','bronzeGuard','cityArcher','chariot','axeman'],
  ['bronzeGuard','bronzeGuard','cityArcher','cityArcher','chariot'], ['bronzeGuard','bronzeGuard','axeman','cityArcher','chariot','spear'], ['bronzeGuard','bronzeGuard','cityArcher','cityArcher','chariot','axeman']
]

const FIRST_WAR_BRIEFS = [
  {name:'Nataruk Shore',date:'c. 7500 BCE',history:'At Nataruk near Lake Turkana, archaeologists found evidence of lethal group violence among hunter-gatherers. It is an archaeological site, not a documented named battle.',tip:'The water edge limits movement. Keep ranged troops behind your melee screen and avoid getting pinned against the shore.',terrain:{river:true,bridges:[2]}},
  {name:'Talheim Settlement',date:'c. 5000 BCE',history:'Talheim in present-day Germany is one of several Neolithic mass-grave sites showing that organized violence could strike farming settlements.',tip:'Protect your fragile ranged unit. A compact formation is safer than spreading across the whole field.',terrain:{mountains:[{x:170,y:250,w:100,h:100}]}},
  {name:'Schletz Ditch',date:'c. 5000 BCE',history:'The fortified Neolithic settlement at Schletz-Asparn had defensive ditches and evidence of violent destruction.',tip:'Use the obstacle as a wall. Spears can hold the approach while ranged units fire around the open side.',terrain:{mountains:[{x:110,y:265,w:105,h:110},{x:350,y:320,w:90,h:100}]}},
  {name:'Hamoukar Sling Storm',date:'c. 3500 BCE',history:'Hamoukar in northern Mesopotamia preserves evidence of violent destruction and large numbers of clay sling bullets—an unusually vivid trace of early urban warfare.',tip:'Slingers matter here. Place them far enough back to exploit range while your melee squads buy time.',terrain:{}},
  {name:'Uruk Frontier',date:'c. 3500 BCE · inspired',history:'Uruk-period influence spread widely across Mesopotamia. The exact military events are poorly documented, so this encounter is historically inspired rather than a named battle.',tip:'Do not chase across the river. Let enemies cross a bridge into concentrated defenders.',terrain:{river:true,bridges:[1,3]}},
  {name:'Nile River Settlements',date:'c. 3300 BCE · inspired',history:'Growing communities along the Nile depended on river corridors for food, movement and communication. This scenario uses that geography as its tactical puzzle.',tip:'Ranged units can fire across water; melee troops need a crossing. Use that asymmetry.',terrain:{river:true,bridges:[2]}},
  {name:'Early Dynastic Muster',date:'c. 2900 BCE · inspired',history:'The first Sumerian city-states increasingly fielded organized forces under rulers and temple institutions.',tip:'A balanced formation works best: spear in front, ranged behind, fast troops on open flanks.',terrain:{}},
  {name:'Kish Plain',date:'3rd millennium BCE · inspired',history:'Kish repeatedly appears in early Mesopotamian political traditions as a center of kingship and competition among city-states.',tip:'The open center favors direct combat. Use Rally to reposition a threatened squad before it is surrounded.',terrain:{}},
  {name:'Umma Canal Border',date:'c. 2500 BCE',history:'Lagash and Umma fought over irrigated borderland. The conflict is one of the earliest wars known from contemporary inscriptions.',tip:'Canals split the battlefield. Concentrate on one crossing rather than fighting everywhere at once.',terrain:{river:true,bridges:[1,3]}},
  {name:'Gu-Edin',date:'c. 2450 BCE',history:'The Stele of the Vultures commemorates Lagash’s victory over Umma and depicts tightly ordered infantry—one of the earliest visual records of organized battle formation.',tip:'Keep your melee line together. Ranged troops should support from behind rather than crossing first.',terrain:{river:true,bridges:[2]}},
  {name:'Stele Formation',date:'c. 2450 BCE · tactical study',history:'This encounter turns the Stele of the Vultures into a formation exercise: cohesion and a protected rear line matter more than chasing individual enemies.',tip:'Deploy close together and use Focus only after enemy units are committed.',terrain:{}},
  {name:'Mari Frontier',date:'3rd millennium BCE · inspired',history:'Mari controlled important Euphrates routes. Warfare around river corridors and fortified towns became increasingly important.',tip:'Use the river to delay heavy enemies while ranged squads wear them down.',terrain:{river:true,bridges:[1,3]}},
  {name:'Akkadian Levy',date:'c. 2350 BCE · inspired',history:'Sargon of Akkad built one of the earliest territorial empires, implying repeated campaigns and increasingly organized military logistics.',tip:'Enemy numbers are rising. Preserve squads—reinforcement is now more valuable than a reckless chase.',terrain:{}},
  {name:'Uruk Rebellion',date:'late 3rd millennium BCE · inspired',history:'Early Mesopotamian kings repeatedly faced coalitions and revolts among powerful cities. Exact battlefield detail is sparse.',tip:'Mountains break line of sight. Reposition ranged squads before using Focus Fire.',terrain:{mountains:[{x:135,y:255,w:105,h:110},{x:345,y:350,w:105,h:110}]}},
  {name:'Coalition of the Cities',date:'3rd millennium BCE · finale',history:'The campaign finale represents the transition from local raiding to organized city-state warfare. It combines rivers, formations and larger armies.',tip:'Use everything learned: hold crossings, protect ranged units, and reinforce before a squad collapses.',terrain:{river:true,bridges:[1,3],mountains:[{x:390,y:245,w:85,h:95}]}}
]

const BRONZE_BRIEFS = [
  {name:'Battle of Megiddo',date:'1457 BCE',history:'Thutmose III defeated a Canaanite coalition at Megiddo. The surviving Egyptian account makes it one of the earliest battles described in substantial detail.',tip:'The historical approach used a risky narrow route. In-game, use the constrained lane to concentrate superior force.',terrain:{mountains:[{x:100,y:265,w:110,h:120},{x:350,y:285,w:110,h:120}]}},
  {name:'Battle of Kadesh',date:'1274 BCE',history:'Ramesses II fought the Hittite king Muwatalli II near Kadesh in one of antiquity’s most famous chariot battles.',tip:'The Orontes-like river makes crossings critical. Spears near bridges are the best answer to chariot charges.',terrain:{river:true,bridges:[2]}},
  {name:'Battle of Nihriya',date:'c. 1230 BCE',history:'Assyria and the Hittite Empire fought for influence in northern Mesopotamia. The Assyrian victory weakened Hittite power in the east.',tip:'Open ground favors mobile troops. Do not leave ranged units exposed on the flanks.',terrain:{}},
  {name:'Battle of the Delta',date:'c. 1175 BCE',history:'Ramesses III’s inscriptions describe fighting against Sea Peoples in and around the Nile Delta. The propaganda is vivid even if modern reconstruction is debated.',tip:'Treat water as a defensive barrier. Ranged fire across the channel can decide the engagement.',terrain:{river:true,bridges:[1,3]}},
  {name:'Battle of Qarqar',date:'853 BCE',history:'Shalmaneser III of Assyria fought a large Levantine coalition at Qarqar. Both sides claimed success, and the strategic result remains debated.',tip:'This is a numbers fight. Focus Fire can remove one enemy squad quickly before the full line reaches you.',terrain:{}},
  {name:'Siege of Lachish',date:'701 BCE',history:'Sennacherib’s assault on Lachish is famously depicted in Assyrian palace reliefs, giving us unusually rich evidence for siege warfare.',tip:'Obstacles favor defenders. Place ranged units where mountains block a direct melee approach.',terrain:{mountains:[{x:155,y:240,w:120,h:130},{x:365,y:315,w:95,h:110}]}},
  {name:'Battle of Halule',date:'691 BCE',history:'Assyria fought a coalition including Babylonian and Elamite forces near the Tigris. Ancient sources give strongly partisan accounts.',tip:'The river divides the field. Force the enemy to cross into concentrated spear and ranged fire.',terrain:{river:true,bridges:[2]}},
  {name:'Battle of the Ulai',date:'653 BCE',history:'Ashurbanipal’s Assyrians defeated Elamite forces near the Ulai River, an event also represented in dramatic palace reliefs.',tip:'Do not cross early. Use the river as a delay and let ranged units exploit clear lines of fire.',terrain:{river:true,bridges:[1,3]}},
  {name:'Fall of Nineveh',date:'612 BCE',history:'A coalition of Medes and Babylonians captured Nineveh, helping end the Neo-Assyrian Empire.',tip:'The battlefield is constricted like an assault on a fortified city. Advance one protected group at a time.',terrain:{mountains:[{x:130,y:250,w:105,h:115},{x:330,y:250,w:105,h:115}]}},
  {name:'Battle of Harran',date:'609 BCE',history:'After Nineveh’s fall, remaining Assyrian forces and Egyptian allies attempted to recover Harran but failed against the Babylonian-Median coalition.',tip:'You are facing a stronger combined force. Preserve health and use reinforcement as soon as a key squad drops below half.',terrain:{}},
  {name:'Battle of Megiddo II',date:'609 BCE',history:'Pharaoh Necho II defeated Judah’s King Josiah at Megiddo while moving north to aid the remaining Assyrians.',tip:'The open field rewards speed. Keep your rear line mobile and use Rally to escape an approaching melee unit.',terrain:{}},
  {name:'Battle of Carchemish',date:'605 BCE',history:'Nebuchadnezzar’s Babylonian army defeated Egypt at Carchemish, securing Babylonian dominance in Syria and the Levant.',tip:'The Euphrates setting makes crossing control valuable. Concentrate fire on units emerging from a bridge.',terrain:{river:true,bridges:[2]}},
  {name:'Battle of Thymbra',date:'c. 547 BCE',history:'Cyrus the Great defeated Croesus of Lydia. Later traditions emphasize clever use of unusual troop deployment, though details are uncertain.',tip:'Expect cavalry pressure. Spears in the forward line and protected ranged units are the safest counter.',terrain:{}},
  {name:'Battle of Opis',date:'539 BCE',history:'Cyrus’s Persian army defeated Babylonian forces near Opis on the Tigris shortly before Babylon itself fell.',tip:'Use the river to separate enemy groups; Focus Fire the first unit that commits across a crossing.',terrain:{river:true,bridges:[1,3]}},
  {name:'Battle of Pelusium',date:'525 BCE',history:'Cambyses II’s Persian army defeated Egypt near Pelusium, opening the way to the conquest of the country. Later anecdotes are colorful but not all are reliable.',tip:'Finale: maintain a coherent front, reinforce early, and use Focus to remove dangerous ranged units before they accumulate damage.',terrain:{mountains:[{x:405,y:255,w:85,h:95}]}}
]

function makeHistoricalStages(briefs, types, second=false){
  return briefs.map((brief,i)=>({
    index:i+1,
    ...brief,
    types:types[i],
    // Campaign I is deliberately a tutorial wall: a fresh account normally wins 0–2 battles.
    // Account progression, artifacts, unit levels and People should make the next 2–3 runs visibly deeper.
    mult: second ? (.88 + i*.030) : ([.72,.72,.62,.74,.64,.68,.68,.72,.74,.76,.76,.78,.80,.80,.84][i] ?? .76),
    gold: second ? (20 + i*4) : ([10,12,14,16,24,22,24,26,28,30,34,38,42,48,60][i] ?? 20),
    xp: second ? (14 + i*2) : ([8,9,10,11,16,14,15,16,17,18,20,22,24,27,34][i] ?? 10),
    tp: second && [0,2,4,6,8,10,12,14].includes(i) ? 1 : 0,
    boss:i===14,
    elite:[3,7,10,12].includes(i)
  }))
}

export const CAMPAIGNS = {
  dawn: {
    id:'dawn', name:'First Wars', era:'c. 7500–2300 BCE', maxTechTier:2,
    desc:'From archaeological evidence of early group violence to the first documented city-state wars. Terrain and formation matter more with every battle.',
    boss:'Coalition of the Cities', art:'firstWars',
    stages: makeHistoricalStages(FIRST_WAR_BRIEFS, firstWarTypes)
  },
  firstcities: {
    id:'firstcities', name:'Bronze & Iron Empires', era:'1457–525 BCE', maxTechTier:3, requires:'dawn',
    desc:'Famous early battles: chariots, rivers, fortified cities and imperial armies. Each encounter includes a short historical clue you can use tactically.',
    boss:'Battle of Pelusium', art:'bronzeEmpires',
    stages: makeHistoricalStages(BRONZE_BRIEFS, bronzeTypes, true)
  }
}

export const ARTIFACT_COPY_THRESHOLDS = [1,2,4,6,8]
export const ARTIFACT_WORKSHOP_GOLD = [0,20,45,80,130]

export const ITEMS = {
  leatherLamellar:{id:'leatherLamellar',name:'Reinforced Leather Lamellar',slot:'unit',rarity:'Common',eligible:'ALL',price:30,maxLevel:5,effect:{healthMult:1.06},step:{healthMult:.025},desc:'A dependable early artifact. Increases Health of the equipped army type.'},
  bronzeArmor:{id:'bronzeArmor',name:'Reinforced Bronze Armor',slot:'unit',rarity:'Uncommon',eligible:'ALL',price:45,maxLevel:5,effect:{armor:4},step:{armor:1.5},desc:'Adds flat Armor to the equipped army type.'},
  edgedProjectiles:{id:'edgedProjectiles',name:'Improved Edged Projectiles',slot:'unit',rarity:'Rare',eligible:'RANGED',price:50,maxLevel:5,effect:{damageMult:1.06},step:{damageMult:.025},desc:'Improves Damage for ranged and firearm units.'},
  slingPouch:{id:'slingPouch',name:'Braided Sling Pouch',slot:'unit',rarity:'Uncommon',eligible:'SLINGER',price:38,maxLevel:5,effect:{attackSpeedMult:1.07},step:{attackSpeedMult:.025},desc:'Improves Slingers’ Attack Speed.'},
  warStandard:{id:'warStandard',name:'Carthaginian War Standard',slot:'hero',rarity:'Epic',eligible:'general',price:160,maxLevel:5,effect:{reinforceMult:1.08},step:{reinforceMult:.025},desc:'A hero relic that improves reinforcement generation.'},
  ptolemaicCoin:{id:'ptolemaicCoin',name:'Ptolemaic Royal Coin',slot:'hero',rarity:'Rare',eligible:'leader',price:130,maxLevel:5,effect:{goldMult:1.06},step:{goldMult:.02},desc:'A hero relic that improves Gold after victories.'},
  bicorne:{id:'bicorne',name:'Imperial Bicorne',slot:'hero',rarity:'Legend',eligible:'general',price:240,maxLevel:5,effect:{damageMult:1.05},step:{damageMult:.015},desc:'A late hero relic that increases army Damage.'}
}

export function itemEffectAtLevel(itemId,level=1){
  const item=ITEMS[itemId]
  if(!item)return {}
  const lv=Math.max(1,Math.min(item.maxLevel||5,level||1))
  const out={}
  for(const [key,value] of Object.entries(item.effect||{})){
    const step=item.step?.[key]||0
    if(key.endsWith('Mult'))out[key]=1 + (value-1) + step*(lv-1)
    else out[key]=value + step*(lv-1)
  }
  return out
}

export const ACHIEVEMENTS = {
  win1:{id:'win1',family:'Victories',order:1,name:'First Victory',desc:'Win 1 battle.',reward:20,stat:'battlesWon',target:1},
  win3:{id:'win3',family:'Victories',order:2,name:'Battle Tested',desc:'Win 3 battles.',reward:25,stat:'battlesWon',target:3},
  win5:{id:'win5',family:'Victories',order:3,name:'Learning the Field',desc:'Win 5 battles.',reward:40,stat:'battlesWon',target:5},
  win10:{id:'win10',family:'Victories',order:4,name:'Seasoned Army',desc:'Win 10 battles.',reward:60,stat:'battlesWon',target:10},
  win20:{id:'win20',family:'Victories',order:5,name:'Veterans',desc:'Win 20 battles.',reward:90,stat:'battlesWon',target:20},
  win50:{id:'win50',family:'Victories',order:6,name:'Conquerors',desc:'Win 50 battles.',reward:160,stat:'battlesWon',target:50},
  win100:{id:'win100',family:'Victories',order:7,name:'Century of Victories',desc:'Win 100 battles.',reward:300,stat:'battlesWon',target:100},
  kill1:{id:'kill1',family:'Enemy Units',order:1,name:'First Blood',desc:'Destroy 1 enemy squad.',reward:12,stat:'unitsKilled',target:1},
  kill2:{id:'kill2',family:'Enemy Units',order:2,name:'Break Their Line',desc:'Destroy 2 enemy squads.',reward:15,stat:'unitsKilled',target:2},
  kill5:{id:'kill5',family:'Enemy Units',order:3,name:'Squad Hunter',desc:'Destroy 5 enemy squads.',reward:25,stat:'unitsKilled',target:5},
  kill10:{id:'kill10',family:'Enemy Units',order:4,name:'Battlefield Threat',desc:'Destroy 10 enemy squads.',reward:40,stat:'unitsKilled',target:10},
  kill25:{id:'kill25',family:'Enemy Units',order:5,name:'Line Breaker',desc:'Destroy 25 enemy squads.',reward:75,stat:'unitsKilled',target:25},
  kill50:{id:'kill50',family:'Enemy Units',order:6,name:'Army Breaker',desc:'Destroy 50 enemy squads.',reward:120,stat:'unitsKilled',target:50},
  kill100:{id:'kill100',family:'Enemy Units',order:7,name:'Legend of the Field',desc:'Destroy 100 enemy squads.',reward:220,stat:'unitsKilled',target:100},
  firstMarch:{id:'firstMarch',family:'Progression',order:1,name:'First March',desc:'Begin your first campaign run.',reward:10,stat:'runsStarted',target:1},
  firstUnitLevel:{id:'firstUnitLevel',family:'Progression',order:2,name:'Training Day',desc:'Level any army once.',reward:20,stat:'unitLevelsBought',target:1},
  peopleUnlocked:{id:'peopleUnlocked',family:'Progression',order:3,name:'Command Structure',desc:'Reach battle 1-6 and unlock People.',reward:25,stat:'peopleFeatureUnlocked',target:1},
  firstTech:{id:'firstTech',family:'Progression',order:4,name:'Technological Advance',desc:'Research your first technology after Campaign I.',reward:35,stat:'techUnlocked',target:1},
  risingCommander:{id:'risingCommander',family:'People',order:1,name:'Rising Commander',desc:'Upgrade any Leader or General once.',reward:60,stat:'peopleUpgraded',target:1},
  firstPack:{id:'firstPack',family:'Collection',order:1,name:'Open the Chronicle',desc:'Open your first pack.',reward:15,stat:'packsOpened',target:1},
  quartermaster:{id:'quartermaster',family:'Artifacts',order:1,name:'Quartermaster',desc:'Equip your first artifact.',reward:30,stat:'itemsEquipped',target:1},
  workshop:{id:'workshop',family:'Artifacts',order:2,name:'Workshop Apprentice',desc:'Evolve an artifact once.',reward:35,stat:'artifactsEvolved',target:1},
  collector:{id:'collector',family:'Collection',order:2,name:'Growing Collection',desc:'Discover 5 different people.',reward:80,stat:'peopleDiscovered',target:5},
  campaigner:{id:'campaigner',family:'Progression',order:5,name:'Campaigner',desc:'Complete your first campaign.',reward:100,stat:'campaignsCompleted',target:1},
  flawless:{id:'flawless',family:'Combat',order:1,name:'Flawless Battle',desc:'Win a battle without losing a squad.',reward:35,stat:'flawlessBattles',target:1}
}

export const REWARD_POOL = [
  { id:'damage', name:'Battle Hardened', icon:'⚔', desc:'+12% all unit damage', apply:r=>({ ...r, damage:r.damage*1.12 }) },
  { id:'armor', name:'Tempered Armor', icon:'🛡', desc:'+10 armor to all surviving squads', apply:r=>({ ...r, armorBonus:r.armorBonus+10 }) },
  { id:'speed', name:'Drilled Attacks', icon:'⏱', desc:'+12% attack speed', apply:r=>({ ...r, attackSpeed:r.attackSpeed*1.12 }) },
  { id:'range', name:'Range Finding', icon:'◎', desc:'+12% ranged-unit range', apply:r=>({ ...r, range:r.range*1.12 }) },
  { id:'reinforceSpeed', name:'Supply Columns', icon:'⇧', desc:'+18% reinforcement meter speed', apply:r=>({ ...r, reinforceSpeed:r.reinforceSpeed*1.18 }) },
  { id:'reinforceHeal', name:'Field Replacements', icon:'✚', desc:'Reinforce restores +5% maximum HP', apply:r=>({ ...r, reinforceHeal:r.reinforceHeal+.05 }) },
  { id:'health', name:'Hardy Muster', icon:'♥', desc:'+12% maximum HP to all squads', apply:r=>({ ...r, health:r.health*1.12 }) },
]

export const START_META = {
  gold: 0,
  xp: 0,
  tp: 0,
  ownedTech: [],
  characterCopies: {},
  characterLevels: {},
  discoveredUnits: ['warrior','slinger'],
  unitLevels: { warrior:1, slinger:1 },
  unlockedCampaigns: ['dawn'],
  completedCampaigns: [],
  campaignStats: { dawn:{best:0,stars:0}, firstcities:{best:0,stars:0} },
  featureUnlocks: { artifacts:true, people:false, technology:false, relics:false },
  techSlots: 3,
  hpRank: 0,
  fieldMedicine: 0,
  freePack: 0,
  inventory: {},
  artifactLevels: {},
  unitEquipment: {},
  heroEquipment: {},
  stats: { runsStarted:0,battlesWon:0,unitsKilled:0,flawlessBattles:0,techUnlocked:0,peopleUpgraded:0,packsOpened:0,itemsEquipped:0,artifactsEvolved:0,peopleDiscovered:0,campaignsCompleted:0,unitLevelsBought:0,peopleFeatureUnlocked:0 },
  claimedAchievements: [],
  loadout: { leader:null, general:null, tech:[] },
}
