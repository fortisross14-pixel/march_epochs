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
  warrior: { id:'warrior', name:'Warriors', rarity:'Common', role:'MELEE', health:112, armor:4, damage:11, attackSpeed:1.0, range:0, moveSpeed:42, desc:'Basic close-combat squad.' },
  spear: { id:'spear', name:'Spearmen', rarity:'Common', role:'SPEAR', health:118, armor:6, damage:10, attackSpeed:1.05, range:0, moveSpeed:39, antiMounted:1.7, desc:'+70% damage against mounted units.' },
  slinger: { id:'slinger', name:'Slingers', rarity:'Uncommon', role:'RANGED', health:72, armor:0, damage:8.5, attackSpeed:.95, range:190, moveSpeed:37, desc:'Primitive ranged harassment.' },
  archer: { id:'archer', name:'Archers', rarity:'Uncommon', role:'RANGED', health:80, armor:0, damage:10, attackSpeed:1.18, range:235, moveSpeed:34, requires:['archery'], desc:'Long-range projectile squad.' },
  cavalry: { id:'cavalry', name:'Horsemen', rarity:'Rare', role:'MOUNTED', health:126, armor:5, damage:15, attackSpeed:1.15, range:0, moveSpeed:71, charge:1.55, requires:['domestication'], desc:'Fast flanking unit.' },
  horseArcher: { id:'horseArcher', name:'Horse Archers', rarity:'Epic', role:'MOUNTED RANGED', health:94, armor:3, damage:11.5, attackSpeed:1.08, range:205, moveSpeed:67, requires:['archery','domestication'], desc:'Mobile ranged cavalry.' },
  chariot: { id:'chariot', name:'Chariots', rarity:'Epic', role:'MOUNTED', health:140, armor:8, damage:17, attackSpeed:1.2, range:0, moveSpeed:75, charge:1.78, requires:['wheel','domestication'], desc:'Shock chariots.' },
  rangedChariot: { id:'rangedChariot', name:'Ranged Chariots', rarity:'Epic', role:'MOUNTED RANGED', health:108, armor:5, damage:13, attackSpeed:1.14, range:212, moveSpeed:71, requires:['wheel','archery'], desc:'Mobile archery platform.' },
  axeman: { id:'axeman', name:'Bronze Axemen', rarity:'Rare', role:'MELEE', health:122, armor:10, damage:15, attackSpeed:1.08, range:0, moveSpeed:40, requires:['bronze'], desc:'High-damage bronze melee troops.' },
  bronzeGuard: { id:'bronzeGuard', name:'Bronze Guard', rarity:'Epic', role:'MELEE', health:155, armor:26, damage:13, attackSpeed:1.05, range:0, moveSpeed:36, requires:['bronze','organization'], desc:'Durable bronze infantry.' },
  cityArcher: { id:'cityArcher', name:'City Bowmen', rarity:'Rare', role:'RANGED', health:84, armor:4, damage:11, attackSpeed:1.15, range:250, moveSpeed:32, requires:['archery','writing'], desc:'Organized city archers.' },
  warElephant: { id:'warElephant', name:'War Elephants', rarity:'Legend', role:'MOUNTED HEAVY', health:220, armor:18, damage:20, attackSpeed:.74, range:0, moveSpeed:46, charge:1.9, signature:'hannibal', fear:true, desc:'Hannibal signature shock unit.' },
  egyptianGuard: { id:'egyptianGuard', name:'Royal Egyptian Guard', rarity:'Legend', role:'MELEE', health:176, armor:24, damage:16, attackSpeed:1.02, range:0, moveSpeed:38, signature:'cleopatra', desc:'Elite guard unlocked by Cleopatra at high level.' },
  imperialGuard: { id:'imperialGuard', name:'Imperial Guard', rarity:'Legend', role:'FIREARM', health:166, armor:19, damage:22, attackSpeed:1.0, range:185, moveSpeed:44, signature:'napoleon', desc:'Napoleon signature infantry.' },
}

const dawnTypes = [
  ['warrior','warrior'], ['warrior','slinger'], ['spear','warrior'], ['cavalry','warrior'], ['archer','spear','warrior'],
  ['warrior','spear','slinger'], ['spear','spear','archer'], ['cavalry','warrior','archer'], ['spear','spear','warrior','slinger'],
  ['spear','archer','warrior','warrior'], ['warrior','spear','archer','slinger','cavalry'], ['spear','archer','archer','warrior','cavalry'],
  ['spear','spear','archer','cavalry','warrior'], ['spear','spear','archer','archer','cavalry','warrior'], ['spear','spear','archer','archer','cavalry','warrior']
]
const cityTypes = [
  ['warrior','spear'], ['spear','cityArcher'], ['axeman','warrior'], ['chariot','spear'], ['bronzeGuard','spear','cityArcher'],
  ['axeman','cityArcher','spear'], ['chariot','cityArcher','spear'], ['bronzeGuard','bronzeGuard','cityArcher'], ['chariot','axeman','cityArcher','spear'],
  ['bronzeGuard','cityArcher','cityArcher','chariot'], ['bronzeGuard','axeman','cityArcher','chariot','spear'], ['bronzeGuard','bronzeGuard','cityArcher','chariot','axeman'],
  ['bronzeGuard','bronzeGuard','cityArcher','cityArcher','chariot'], ['bronzeGuard','bronzeGuard','axeman','cityArcher','chariot','spear'], ['bronzeGuard','bronzeGuard','cityArcher','cityArcher','chariot','axeman']
]

function makeStages(names, types, city=false){
  return names.map((name,i)=>({
    index:i+1, name, types:types[i],
    mult: .72 + i*.028 + (city?.10:0),
    gold: 12 + i*3 + (city?4:0),
    tp: [4,7,9,13,14].includes(i)?1:0,
    boss:i===14,
    elite:[3,7,10,12].includes(i),
    terrain: i%5===0 ? {river:true, bridges:[1,3]} : i%4===1 ? {mountains:[{x:170,y:250,w:100,h:100},{x:350,y:390,w:90,h:105}]} : i%6===2 ? {river:true,bridges:[2],mountains:[{x:90,y:310,w:80,h:90}]} : {}
  }))
}

export const CAMPAIGNS = {
  dawn: {
    id:'dawn', name:'Dawn of Settlement', era:'10,000–4,000 BCE', maxTechTier:2,
    desc:'Fifteen battles through tribal warfare, river crossings and early organized settlements.',
    boss:'Great Tribal Confederation',
    stages: makeStages([
      'Riverbank Raiders','Hunters of the Ridge','Spear Clan','Mounted Scouts','Hill Ambush','Three Clans','Crossing Warband','Mounted Ambush','Stone Circle Guard','River Confederates','Five Banners','Ridge Coalition','War Council','Last Crossing','Great Tribal Confederation'
    ], dawnTypes)
  },
  firstcities: {
    id:'firstcities', name:'First Cities', era:'4,000–2,500 BCE', maxTechTier:3, requires:'dawn',
    desc:'Bronze troops, organized archers, early chariots, walls and more constrained terrain.',
    boss:'Walled City Army',
    stages: makeStages([
      'Canal Skirmish','Temple Guard','Bronze Raiders','Chariot Patrol','City Militia','Market District','River Gate','Palace Patrol','Outer Walls','Bronze Coalition','Four City League','Chariot Host','Royal Guard','Inner Gate','Walled City Army'
    ], cityTypes, true)
  }
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
  gold: 520,
  tp: 10,
  ownedTech: ['fire','archery','wheel'],
  characterCopies: { cleopatra:1, hannibal:1, elder:1, veteran:1 },
  characterLevels: { cleopatra:1, hannibal:1, elder:1, veteran:1 },
  discoveredUnits: ['warrior','spear','slinger','archer','warElephant'],
  unlockedCampaigns: ['dawn'],
  completedCampaigns: [],
  campaignStats: { dawn:{best:0,stars:0}, firstcities:{best:0,stars:0} },
  techSlots: 3,
  hpRank: 0,
  fieldMedicine: 0,
  freePack: 1,
  loadout: { leader:'cleopatra', general:'hannibal', tech:['fire','archery','wheel'] },
}
