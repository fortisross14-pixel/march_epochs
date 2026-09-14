export const RARITIES = {
  Common: { color: '#aeb8c3', maxLevel: 3, weight: 50 },
  Uncommon: { color: '#75d3a1', maxLevel: 3, weight: 28 },
  Rare: { color: '#62aef1', maxLevel: 4, weight: 15 },
  Epic: { color: '#b793ff', maxLevel: 5, weight: 6 },
  Legend: { color: '#f2c66c', maxLevel: 6, weight: 1 },
}



export const AGES = {
  origins:{id:'origins',name:'Origins & First States',era:'c. 10,000–1600 BCE',campaigns:['dawn']},
  bronzeIron:{id:'bronzeIron',name:'Bronze & Iron Empires',era:'c. 1600–500 BCE',campaigns:['firstcities']},
  classical:{id:'classical',name:'Classical Antiquity',era:'499–30 BCE',campaigns:['greekPersian','romeCarthage']},
  lateAntiquity:{id:'lateAntiquity',name:'Late Antiquity',era:'9–600 CE',campaigns:['lateAntiquity']},
  earlyMedieval:{id:'earlyMedieval',name:'Early Medieval World',era:'500–1000',campaigns:['earlyMedieval','arabExpansion']},
  medieval:{id:'medieval',name:'High & Late Medieval',era:'1000–1453',campaigns:['crusadesSteppe','lateMedieval']},
  renaissance:{id:'renaissance',name:'Renaissance & Exploration',era:'1453–1700',campaigns:['renaissanceWars','oceansEmpires']},
  revolution:{id:'revolution',name:'Enlightenment & Revolution',era:'1700–1815',campaigns:['kingsRevolution']},
  industrial:{id:'industrialAge',name:'Industrial Nations',era:'1815–1914',campaigns:['industrialNations']},
  worldWars:{id:'worldWars',name:'World Wars',era:'1914–1945',campaigns:['worldWars']},
  modern:{id:'modernAge',name:'Modern Warfare',era:'1945–present',campaigns:['modernBattlefield']},
}

export const HERO_CATALOG = {
  origins:{
    common:['Tribal Elder · Leader','Veteran Commander · General'],
    uncommon:['Merchant Prince · Leader','Village Lawgiver · Leader','Hunter Captain · General','Sling Master · General'],
    rare:['Narmer · Leader','Ur-Nammu · Leader','Gudea · Leader','Eannatum · General','Lugal-Zage-Si · General','Naram-Sin · General'],
    epic:['Hammurabi · Leader','Enheduanna · Leader','Sargon of Akkad · General','Shulgi · General'],
    legend:['Gilgamesh · Leader','Sargon the Great · General']
  },
  bronzeIron:{
    common:['Palace Steward · Leader','Bronze Captain · General'],
    uncommon:['Temple Administrator · Leader','Chariot Officer · General','Bow Captain · General'],
    rare:['Hatshepsut · Leader','Suppiluliuma I · Leader','Tiglath-Pileser III · Leader','Seti I · General','Muwatalli II · General','Horemheb · General','Ashurbanipal · General','Necho II · Leader'],
    epic:['Ramesses II · Leader','Cyrus the Great · Leader','Thutmose III · General','Nebuchadnezzar II · General'],
    legend:['Darius I · Leader','Thutmose III the Conqueror · General']
  },
  classical:{
    common:['Greek Archon · Leader','Roman Magistrate · Leader','Greek Strategos · General','Roman Tribune · General'],
    uncommon:['Persian Satrap · Leader','Carthaginian Suffete · Leader','Hoplite Captain · General','Legion Legate · General'],
    rare:['Pericles · Leader','Darius III · Leader','Philip II · Leader','Leonidas · General','Miltiades · General','Themistocles · General','Pyrrhus · General','Julius Caesar · General'],
    epic:['Cleopatra VII · Leader','Scipio Africanus · Leader','Hannibal Barca · General','Epaminondas · General'],
    legend:['Augustus · Leader','Alexander the Great · General']
  },
  lateAntiquity:{
    common:['Provincial Governor · Leader','Frontier Comes · General'],
    uncommon:['Imperial Prefect · Leader','Foederati Chief · General','Cavalry Magister · General'],
    rare:['Diocletian · Leader','Theodosius I · Leader','Alaric · Leader','Stilicho · General','Aetius · General','Narses · General','Attila · General','Clovis · Leader'],
    epic:['Constantine I · Leader','Theodoric · Leader','Belisarius · General','Aurelian · General'],
    legend:['Justinian I · Leader','Belisarius the Last Roman · General']
  },
  earlyMedieval:{
    common:['Medieval Baron · Leader','Household Captain · General'],
    uncommon:['Abbey Patron · Leader','Shieldwall Captain · General','Mounted Thane · General'],
    rare:['Alfred the Great · Leader','Æthelstan · Leader','Harald Bluetooth · Leader','Charles Martel · General','Harald Hardrada · General','William the Conqueror · General','El Cid · General','Basil II · Leader'],
    epic:['Charlemagne · Leader','Otto I · Leader','Nikephoros II · General','William the Conqueror · General'],
    legend:['Charlemagne the Emperor · Leader','Khalid ibn al-Walid · General']
  },
  medieval:{
    common:['Feudal Lord · Leader','Crusader Captain · General'],
    uncommon:['Guild Prince · Leader','Knight Commander · General','Steppe Noyan · General'],
    rare:['Eleanor of Aquitaine · Leader','Richard I · Leader','Frederick II · Leader','Saladin · General','Subutai · General','Edward I · General','Baybars · General','Joan of Arc · General'],
    epic:['Saladin · Leader','Mehmed II · Leader','Genghis Khan · General','Timur · General'],
    legend:['Mehmed II the Conqueror · Leader','Genghis Khan · General']
  },
  renaissance:{
    common:['Renaissance Prince · Leader','Mercenary Captain · General'],
    uncommon:['Colonial Governor · Leader','Condottiero · General','Sea Captain · General'],
    rare:['Francis I · Leader','Charles V · Leader','Akbar · Leader','Gonzalo Fernández de Córdoba · General','Hernán Cortés · General','Oda Nobunaga · General','Maurice of Nassau · General','Tokugawa Ieyasu · Leader'],
    epic:['Suleiman the Magnificent · Leader','Elizabeth I · Leader','Yi Sun-sin · General','Gustavus Adolphus · General'],
    legend:['Elizabeth I · Leader','Gonzalo Fernández de Córdoba · General']
  },
  revolution:{
    common:['Court Minister · Leader','Regimental Colonel · General'],
    uncommon:['Enlightened Reformer · Leader','Artillery Officer · General','Cavalry Marshal · General'],
    rare:['Maria Theresa · Leader','George Washington · Leader','Frederick II · Leader','Suvorov · General','Wellington · General','Marlborough · General','Turenne · General','Lafayette · General'],
    epic:['Catherine II · Leader','George Washington · Leader','Frederick the Great · General','Wellington · General'],
    legend:['Catherine the Great · Leader','Napoleon Bonaparte · General']
  },
  industrialAge:{
    common:['Industrial Statesman · Leader','Rifle Colonel · General'],
    uncommon:['Railway Minister · Leader','Staff Officer · General','Artillery Brigadier · General'],
    rare:['Abraham Lincoln · Leader','Bismarck · Leader','Meiji · Leader','Ulysses S. Grant · General','Robert E. Lee · General','Sherman · General','Garibaldi · General','MacMahon · General'],
    epic:['Lincoln · Leader','Bismarck · Leader','Helmuth von Moltke · General','Grant · General'],
    legend:['Abraham Lincoln · Leader','Helmuth von Moltke the Elder · General']
  },
  worldWars:{
    common:['War Cabinet Minister · Leader','Division Commander · General'],
    uncommon:['Home Front Organizer · Leader','Armored Colonel · General','Air Marshal · General'],
    rare:['Woodrow Wilson · Leader','Franklin D. Roosevelt · Leader','Winston Churchill · Leader','Foch · General','Patton · General','Montgomery · General','MacArthur · General','Rommel · General'],
    epic:['Franklin D. Roosevelt · Leader','Winston Churchill · Leader','Eisenhower · General','Zhukov · General'],
    legend:['Winston Churchill · Leader','Georgy Zhukov · General']
  },
  modernAge:{
    common:['Modern President · Leader','Brigade Commander · General'],
    uncommon:['Defense Minister · Leader','Combined-Arms Commander · General','Air Wing Commander · General'],
    rare:['Charles de Gaulle · Leader','Harry Truman · Leader','Konrad Adenauer · Leader','Matthew Ridgway · General','Moshe Dayan · General','Vo Nguyen Giap · General','Norman Schwarzkopf · General','James Mattis · General'],
    epic:['Charles de Gaulle · Leader','Lee Kuan Yew · Leader','Vo Nguyen Giap · General','Norman Schwarzkopf · General'],
    legend:['Charles de Gaulle · Leader','Norman Schwarzkopf · General']
  }
}

export const TECHNOLOGY_CATALOG = {
  origins:['Fire','Archery','Wheel','Agriculture','Domestication','Writing','Copper Working','Irrigation'],
  bronzeIron:['Bronze Working','Iron Working','Composite Bow','Military Organization','Roads','Fortification','Early Siegecraft','Chariotry'],
  classical:['Steelmaking','Coinage','Engineering','Advanced Siegecraft','Logistics','Military Drill','Medicine','Advanced Shipbuilding'],
  lateAntiquity:['Heavy Armor','Stirrup Precursors','Fortified Cities','Professional Cavalry','Late Roman Logistics','Composite Horse Bow'],
  earlyMedieval:['Stirrup','Castles','Crossbow','Feudal Levy','Heavy Cavalry','Ocean Sailing','Horse Archery'],
  medieval:['Trebuchet Engineering','Professional Levies','Plate Armor','Longbow Doctrine','Gunpowder','Compass','Pike Drill'],
  renaissance:['Printing Press','Matchlock','Cartography','Banking','Oceanic Shipbuilding','Field Artillery','Military Academies'],
  revolution:['Flintlock','Bayonet','Rifling Precursors','Standardized Artillery','Mass Conscription','Staff Colleges'],
  industrialAge:['Steam Power','Railroads','Telegraph','Rifling','Breech Loading','Industrial Chemistry','Mass Production'],
  worldWars:['Machine Guns','Combustion','Radio','Armored Warfare','Aviation','Radar','Ballistics'],
  modernAge:['Jet Propulsion','Rocketry','Electronics','Computing','Precision Guidance','Satellites','Unmanned Systems']
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
  warrior: { id:'warrior', name:'Warriors', ageId:'origins', ageIndex:1, rarity:'Common', role:'MELEE', health:112, armor:4, damage:11, attackSpeed:1.0, range:0, moveSpeed:42, unlock:'Starting army', desc:'Basic close-combat squad.' },
  spear: { id:'spear', name:'Spearmen', ageId:'origins', ageIndex:1, rarity:'Common', role:'SPEAR', health:118, armor:6, damage:10, attackSpeed:1.05, range:0, moveSpeed:39, antiMounted:1.7, requires:['copper'], unlock:'Research Copper Working', desc:'+70% damage against mounted units.' },
  slinger: { id:'slinger', name:'Slingers', ageId:'origins', ageIndex:1, rarity:'Uncommon', role:'RANGED', health:72, armor:0, damage:8.5, attackSpeed:.95, range:190, moveSpeed:37, unlock:'Starting army', desc:'Primitive ranged harassment.' },
  archer: { id:'archer', name:'Archers', ageId:'origins', ageIndex:1, rarity:'Uncommon', role:'RANGED', health:80, armor:0, damage:10, attackSpeed:1.18, range:235, moveSpeed:34, requires:['archery'], unlock:'Research Archery', desc:'Long-range projectile squad.' },
  cavalry: { id:'cavalry', name:'Horsemen', ageId:'origins', ageIndex:1, rarity:'Rare', role:'MOUNTED', health:126, armor:5, damage:15, attackSpeed:1.15, range:0, moveSpeed:71, charge:1.55, requires:['domestication'], unlock:'Research Domestication', desc:'Fast flanking unit.' },
  horseArcher: { id:'horseArcher', name:'Horse Archers', ageId:'bronzeIron', ageIndex:2, rarity:'Epic', role:'MOUNTED RANGED', health:94, armor:3, damage:11.5, attackSpeed:1.08, range:205, moveSpeed:67, requires:['archery','domestication'], unlock:'Research Archery + Domestication', desc:'Mobile ranged cavalry.' },
  chariot: { id:'chariot', name:'Chariots', ageId:'bronzeIron', ageIndex:2, rarity:'Epic', role:'MOUNTED', health:140, armor:8, damage:17, attackSpeed:1.2, range:0, moveSpeed:75, charge:1.78, requires:['wheel','domestication'], unlock:'Research Wheel + Domestication, or obtain Thutmose III / Ramesses II', desc:'Shock chariots.' },
  rangedChariot: { id:'rangedChariot', name:'Ranged Chariots', ageId:'bronzeIron', ageIndex:2, rarity:'Epic', role:'MOUNTED RANGED', health:108, armor:5, damage:13, attackSpeed:1.14, range:212, moveSpeed:71, requires:['wheel','archery','domestication'], unlock:'Research Wheel + Archery + Domestication', desc:'Mobile archery platform.' },
  axeman: { id:'axeman', name:'Bronze Axemen', ageId:'bronzeIron', ageIndex:2, rarity:'Rare', role:'MELEE', health:122, armor:10, damage:15, attackSpeed:1.08, range:0, moveSpeed:40, requires:['bronze'], unlock:'Research Bronze Working', desc:'High-damage bronze melee troops.' },
  bronzeGuard: { id:'bronzeGuard', name:'Bronze Guard', ageId:'bronzeIron', ageIndex:2, rarity:'Epic', role:'MELEE', health:155, armor:26, damage:13, attackSpeed:1.05, range:0, moveSpeed:36, requires:['bronze','organization'], unlock:'Research Bronze Working + Military Organization, or obtain Sargon', desc:'Durable bronze infantry.' },
  cityArcher: { id:'cityArcher', name:'City Bowmen', ageId:'bronzeIron', ageIndex:2, rarity:'Rare', role:'RANGED', health:84, armor:4, damage:11, attackSpeed:1.15, range:250, moveSpeed:32, requires:['archery','writing'], unlock:'Research Archery + Writing', desc:'Organized city archers.' },
  warElephant: { id:'warElephant', name:'War Elephants', ageId:'classical', ageIndex:3, rarity:'Legend', role:'MOUNTED HEAVY', health:220, armor:18, damage:20, attackSpeed:.74, range:0, moveSpeed:46, charge:1.9, signature:'hannibal', unlock:'Obtain Hannibal', fear:true, desc:'Hannibal signature shock unit.' },
  egyptianGuard: { id:'egyptianGuard', name:'Royal Egyptian Guard', ageId:'classical', ageIndex:3, rarity:'Legend', role:'MELEE', health:176, armor:24, damage:16, attackSpeed:1.02, range:0, moveSpeed:38, signature:'cleopatra', unlock:'Raise Cleopatra to Level 5', desc:'Elite guard unlocked by Cleopatra at high level.' },
  imperialGuard: { id:'imperialGuard', name:'Imperial Guard', ageId:'revolution', ageIndex:8, rarity:'Legend', role:'FIREARM', health:166, armor:19, damage:22, attackSpeed:1.0, range:185, moveSpeed:44, signature:'napoleon', unlock:'Obtain Napoleon', desc:'Napoleon signature infantry.' },
  marines: { id:'marines', name:'Marines', ageId:'industrialAge', ageIndex:9, rarity:'Legend', role:'FIREARM MELEE', health:220, armor:20, damage:19, attackSpeed:1.22, range:210, moveSpeed:50, requires:['firearms','organization'], unlock:'Research Firearms + Military Organization', desc:'A future-era professional formation. Its Level 1 base stats intentionally exceed a fully trained primitive Warrior.' },

  // Full-game shell units. These already exist in the catalogue even when their final art, recipes and balance are still placeholders.
  hunterBand:{id:'hunterBand',name:'Hunter Bands',ageId:'origins',ageIndex:1,rarity:'Common',role:'RANGED',health:76,armor:1,damage:9,attackSpeed:1.0,range:150,moveSpeed:39,unlock:'Origins technology / campaign discovery',shell:true,desc:'Early hunting parties adapted for skirmish warfare.'},
  warCart:{id:'warCart',name:'War Carts',ageId:'origins',ageIndex:1,rarity:'Rare',role:'MOUNTED',health:128,armor:5,damage:14,attackSpeed:.9,range:0,moveSpeed:60,unlock:'Wheel + Domestication',shell:true,desc:'Primitive wheeled shock formation.'},
  compositeBowmen:{id:'compositeBowmen',name:'Composite Bowmen',ageId:'bronzeIron',ageIndex:2,rarity:'Rare',role:'RANGED',health:88,armor:4,damage:12,attackSpeed:1.12,range:255,moveSpeed:34,unlock:'Composite Bow technology',shell:true,desc:'Powerful Bronze/Iron Age missile troops.'},
  assyrianSpears:{id:'assyrianSpears',name:'Assyrian Spearmen',ageId:'bronzeIron',ageIndex:2,rarity:'Epic',role:'SPEAR',health:150,armor:20,damage:14,attackSpeed:1.08,range:0,moveSpeed:38,unlock:'Bronze & Iron hero/technology path',shell:true,desc:'Disciplined imperial spear infantry.'},
  hoplite:{id:'hoplite',name:'Hoplites',ageId:'classical',ageIndex:3,rarity:'Rare',role:'SPEAR MELEE',health:160,armor:25,damage:15,attackSpeed:.94,range:0,moveSpeed:34,unlock:'Iron Working + Military Drill',shell:true,desc:'Heavy shield-and-spear infantry.'},
  phalanx:{id:'phalanx',name:'Macedonian Phalanx',ageId:'classical',ageIndex:3,rarity:'Epic',role:'SPEAR FORMATION',health:175,armor:24,damage:17,attackSpeed:.86,range:0,moveSpeed:31,unlock:'Military Drill + Philip/Alexander path',shell:true,desc:'Deep pike formation with exceptional frontal power.'},
  legion:{id:'legion',name:'Roman Legion',ageId:'classical',ageIndex:3,rarity:'Epic',role:'MELEE FORMATION',health:182,armor:27,damage:18,attackSpeed:1.05,range:0,moveSpeed:39,unlock:'Iron Working + Organization',shell:true,desc:'Flexible professional heavy infantry.'},
  peltast:{id:'peltast',name:'Peltasts',ageId:'classical',ageIndex:3,rarity:'Rare',role:'RANGED',health:94,armor:5,damage:12,attackSpeed:1.20,range:175,moveSpeed:49,unlock:'Classical skirmish technology',shell:true,desc:'Mobile javelin skirmishers.'},
  immortals:{id:'immortals',name:'Persian Immortals',ageId:'classical',ageIndex:3,rarity:'Legend',role:'MELEE RANGED',health:168,armor:20,damage:17,attackSpeed:1.10,range:120,moveSpeed:43,unlock:'Achaemenid hero path',shell:true,desc:'Elite Persian guard formation.'},
  companionCavalry:{id:'companionCavalry',name:'Companion Cavalry',ageId:'classical',ageIndex:3,rarity:'Legend',role:'MOUNTED',health:165,armor:18,damage:24,attackSpeed:1.12,range:0,moveSpeed:82,charge:2.0,unlock:'Alexander the Great',shell:true,desc:'Elite Macedonian shock cavalry.'},
  ballista:{id:'ballista',name:'Ballista',ageId:'classical',ageIndex:3,rarity:'Epic',role:'SIEGE RANGED',health:100,armor:3,damage:30,attackSpeed:.42,range:330,moveSpeed:20,unlock:'Engineering + Siegecraft',shell:true,desc:'Long-range torsion artillery.'},
  lateLegion:{id:'lateLegion',name:'Late Roman Infantry',ageId:'lateAntiquity',ageIndex:4,rarity:'Rare',role:'MELEE SPEAR',health:190,armor:28,damage:18,attackSpeed:1.0,range:0,moveSpeed:38,unlock:'Late Antiquity military reform',shell:true,desc:'Late imperial heavy infantry.'},
  cataphract:{id:'cataphract',name:'Cataphracts',ageId:'lateAntiquity',ageIndex:4,rarity:'Epic',role:'MOUNTED HEAVY',health:210,armor:36,damage:24,attackSpeed:.88,range:0,moveSpeed:63,charge:1.8,unlock:'Heavy Armor + cavalry technology',shell:true,desc:'Heavily armored cavalry.'},
  hunnicHorseArcher:{id:'hunnicHorseArcher',name:'Hunnic Horse Archers',ageId:'lateAntiquity',ageIndex:4,rarity:'Epic',role:'MOUNTED RANGED',health:115,armor:8,damage:15,attackSpeed:1.15,range:220,moveSpeed:78,unlock:'Horse Archery path',shell:true,desc:'Fast mounted archers.'},
  skoutatoi:{id:'skoutatoi',name:'Byzantine Skoutatoi',ageId:'lateAntiquity',ageIndex:4,rarity:'Rare',role:'SPEAR MELEE',health:195,armor:30,damage:18,attackSpeed:.98,range:0,moveSpeed:36,unlock:'Eastern Roman military technology',shell:true,desc:'Disciplined shield-and-spear infantry.'},
  shieldwall:{id:'shieldwall',name:'Shieldwall Infantry',ageId:'earlyMedieval',ageIndex:5,rarity:'Rare',role:'MELEE FORMATION',health:200,armor:28,damage:19,attackSpeed:.94,range:0,moveSpeed:35,unlock:'Early Medieval organization',shell:true,desc:'Dense shieldwall infantry.'},
  knight:{id:'knight',name:'Knights',ageId:'medieval',ageIndex:6,rarity:'Epic',role:'MOUNTED HEAVY',health:230,armor:38,damage:28,attackSpeed:.9,range:0,moveSpeed:69,charge:2.0,unlock:'Stirrup + Heavy Armor',shell:true,desc:'Armored feudal shock cavalry.'},
  crossbow:{id:'crossbow',name:'Crossbowmen',ageId:'medieval',ageIndex:6,rarity:'Rare',role:'RANGED',health:110,armor:10,damage:21,attackSpeed:.68,range:265,moveSpeed:32,unlock:'Crossbow technology',shell:true,desc:'Slow, powerful armor-piercing missile troops.'},
  longbow:{id:'longbow',name:'Longbowmen',ageId:'medieval',ageIndex:6,rarity:'Epic',role:'RANGED',health:106,armor:7,damage:18,attackSpeed:1.0,range:315,moveSpeed:34,unlock:'Longbow doctrine',shell:true,desc:'Exceptional long-range bowmen.'},
  mongolHorseArcher:{id:'mongolHorseArcher',name:'Mongol Horse Archers',ageId:'medieval',ageIndex:6,rarity:'Legend',role:'MOUNTED RANGED',health:135,armor:12,damage:18,attackSpeed:1.25,range:245,moveSpeed:86,unlock:'Genghis Khan or advanced Horse Archery',shell:true,desc:'Elite mobile ranged cavalry.'},
  trebuchet:{id:'trebuchet',name:'Trebuchets',ageId:'medieval',ageIndex:6,rarity:'Epic',role:'SIEGE RANGED',health:125,armor:4,damage:48,attackSpeed:.28,range:390,moveSpeed:16,unlock:'Trebuchet Engineering',shell:true,desc:'Heavy counterweight siege artillery.'},
  arquebusier:{id:'arquebusier',name:'Arquebusiers',ageId:'renaissance',ageIndex:7,rarity:'Rare',role:'FIREARM',health:120,armor:8,damage:22,attackSpeed:.72,range:235,moveSpeed:34,unlock:'Gunpowder + Matchlock',shell:true,desc:'Early firearm infantry.'},
  tercio:{id:'tercio',name:'Tercios',ageId:'renaissance',ageIndex:7,rarity:'Legend',role:'FIREARM SPEAR FORMATION',health:230,armor:25,damage:24,attackSpeed:.90,range:210,moveSpeed:31,unlock:'Firearms + Pike Drill + Organization',shell:true,desc:'Combined pike-and-shot formation.'},
  janissary:{id:'janissary',name:'Janissaries',ageId:'renaissance',ageIndex:7,rarity:'Epic',role:'FIREARM',health:170,armor:16,damage:25,attackSpeed:1.02,range:230,moveSpeed:39,unlock:'Ottoman hero/technology path',shell:true,desc:'Elite gunpowder infantry.'},
  conquistador:{id:'conquistador',name:'Conquistadores',ageId:'renaissance',ageIndex:7,rarity:'Epic',role:'FIREARM MELEE',health:180,armor:28,damage:25,attackSpeed:.92,range:175,moveSpeed:42,unlock:'Hernán Cortés or Exploration path',shell:true,desc:'Armored expeditionary troops.'},
  fieldCannon:{id:'fieldCannon',name:'Field Cannon',ageId:'renaissance',ageIndex:7,rarity:'Epic',role:'ARTILLERY RANGED',health:130,armor:5,damage:52,attackSpeed:.34,range:400,moveSpeed:22,unlock:'Field Artillery technology',shell:true,desc:'Mobile gunpowder artillery.'},
  lineInfantry:{id:'lineInfantry',name:'Line Infantry',ageId:'revolution',ageIndex:8,rarity:'Rare',role:'FIREARM FORMATION',health:185,armor:10,damage:27,attackSpeed:1.0,range:250,moveSpeed:39,unlock:'Flintlock + Bayonet',shell:true,desc:'Disciplined volley infantry.'},
  grenadier:{id:'grenadier',name:'Grenadiers',ageId:'revolution',ageIndex:8,rarity:'Epic',role:'FIREARM MELEE',health:205,armor:14,damage:30,attackSpeed:.95,range:220,moveSpeed:40,unlock:'Professional army technology',shell:true,desc:'Elite assault infantry.'},
  dragoon:{id:'dragoon',name:'Dragoons',ageId:'revolution',ageIndex:8,rarity:'Rare',role:'MOUNTED FIREARM',health:175,armor:12,damage:26,attackSpeed:.88,range:200,moveSpeed:72,unlock:'Mounted Firearms',shell:true,desc:'Mounted firearm troops.'},
  riflemen:{id:'riflemen',name:'Riflemen',ageId:'industrialAge',ageIndex:9,rarity:'Rare',role:'FIREARM',health:205,armor:12,damage:31,attackSpeed:1.08,range:285,moveSpeed:43,unlock:'Rifling',shell:true,desc:'Accurate industrial-era infantry.'},
  machineGunTeam:{id:'machineGunTeam',name:'Machine Gun Detachment',ageId:'worldWars',ageIndex:10,rarity:'Epic',role:'FIREARM HEAVY',health:190,armor:16,damage:36,attackSpeed:1.8,range:280,moveSpeed:29,unlock:'Machine Guns',shell:true,desc:'High-rate defensive firepower.'},
  tank:{id:'tank',name:'Tank',ageId:'worldWars',ageIndex:10,rarity:'Epic',role:'ARMORED RANGED',health:340,armor:55,damage:44,attackSpeed:.72,range:245,moveSpeed:55,unlock:'Armored Warfare + Combustion',shell:true,desc:'Armored breakthrough vehicle.'},
  motorized:{id:'motorized',name:'Motorized Infantry',ageId:'worldWars',ageIndex:10,rarity:'Rare',role:'FIREARM MOBILE',health:235,armor:20,damage:33,attackSpeed:1.15,range:240,moveSpeed:65,unlock:'Combustion + Organization',shell:true,desc:'Fast mobile infantry.'},
  fighter:{id:'fighter',name:'Fighter Aircraft',ageId:'worldWars',ageIndex:10,rarity:'Legend',role:'AIR',health:210,armor:15,damage:46,attackSpeed:1.15,range:360,moveSpeed:110,unlock:'Aviation',shell:true,desc:'Air-superiority aircraft.'},
  mechanized:{id:'mechanized',name:'Mechanized Infantry',ageId:'modernAge',ageIndex:11,rarity:'Rare',role:'FIREARM ARMORED',health:300,armor:38,damage:40,attackSpeed:1.22,range:260,moveSpeed:70,unlock:'Modern mechanization',shell:true,desc:'Protected mobile infantry.'},
  mainBattleTank:{id:'mainBattleTank',name:'Main Battle Tank',ageId:'modernAge',ageIndex:11,rarity:'Legend',role:'ARMORED RANGED',health:430,armor:72,damage:60,attackSpeed:.78,range:310,moveSpeed:68,unlock:'Advanced Armored Warfare',shell:true,desc:'Modern armored core unit.'},
  attackHelicopter:{id:'attackHelicopter',name:'Attack Helicopter',ageId:'modernAge',ageIndex:11,rarity:'Epic',role:'AIR RANGED',health:260,armor:24,damage:52,attackSpeed:1.20,range:360,moveSpeed:105,unlock:'Aviation + Electronics',shell:true,desc:'Mobile modern close-air support.'},
  rocketArtillery:{id:'rocketArtillery',name:'Rocket Artillery',ageId:'modernAge',ageIndex:11,rarity:'Epic',role:'ARTILLERY RANGED',health:210,armor:18,damage:70,attackSpeed:.35,range:460,moveSpeed:50,unlock:'Rocketry + Ballistics',shell:true,desc:'Long-range saturation fire.'},
  airDefense:{id:'airDefense',name:'Air Defense Battery',ageId:'modernAge',ageIndex:11,rarity:'Epic',role:'RANGED AIRDEFENSE',health:230,armor:22,damage:50,attackSpeed:.8,range:410,moveSpeed:45,unlock:'Radar + Electronics',shell:true,desc:'Defensive anti-air formation.'},
  droneUnit:{id:'droneUnit',name:'Drone Detachment',ageId:'modernAge',ageIndex:11,rarity:'Legend',role:'AIR RANGED',health:170,armor:8,damage:45,attackSpeed:1.25,range:430,moveSpeed:100,unlock:'Unmanned Systems + Computing',shell:true,desc:'Networked unmanned combat unit.'},
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
  ['warrior'],
  ['warrior','slinger'],
  ['warrior','warrior'],
  ['warrior','slinger'],
  ['warrior','warrior','slinger'],
  ['warrior','slinger','slinger'],
  ['warrior','warrior','slinger'],
  ['warrior','warrior','slinger','slinger'],
  ['warrior','warrior','warrior','slinger'],
  ['warrior','warrior','slinger','slinger'],
  ['warrior','warrior','warrior','slinger','slinger'],
  ['warrior','warrior','slinger','slinger','slinger'],
  ['warrior','warrior','warrior','slinger','slinger'],
  ['warrior','warrior','warrior','slinger','slinger','slinger']
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
    // Campaign I is now tuned as a full Age I onboarding arc: a fresh account should be able
    // to progress steadily, unlock People mid-run journey, and clear the campaign with a couple
    // of retries once artifacts / levels / better formations are understood.
    mult: second ? (.88 + i*.030) : ([.60,.62,.60,.62,.62,.64,.66,.68,.70,.72,.73,.74,.76,.78,.80][i] ?? .70),
    gold: second ? (20 + i*4) : ([12,14,16,18,20,22,24,26,28,30,34,38,44,50,65][i] ?? 22),
    xp: second ? (14 + i*2) : ([8,9,10,12,14,14,15,16,18,19,21,23,26,30,36][i] ?? 12),
    tp: second && [0,2,4,6,8,10,12,14].includes(i) ? 1 : 0,
    boss:i===14,
    elite:[3,7,10,12].includes(i)
  }))
}

export const CAMPAIGN_ORDER = [
  'dawn','firstcities','greekPersian','romeCarthage','lateAntiquity','earlyMedieval','arabExpansion','crusadesSteppe','lateMedieval','renaissanceWars','oceansEmpires','kingsRevolution','industrialNations','worldWars','modernBattlefield'
]

// The full campaign backbone. Later campaigns intentionally use shell-level descriptions/encounters for now;
// the names and historical progression are locked so content can be filled without redesigning the game again.
export const CAMPAIGN_SHELL_BATTLES = {
  bronzeKingdoms:['Battle of the Nile Valley','Siege of Ebla','Mari on the Euphrates','Sargon’s Northern Campaign','Ur III Frontier','Elamite Incursion','Old Babylonian Levy','Battle for Eshnunna','Siege of Larsa','Hammurabi’s Coalition','Hittite Border War','Hyksos Chariot Raid','Siege of Avaris','Ahmose’s Pursuit','Rise of the New Kingdom'],
  greekPersian:['Ionian Revolt','Battle of Marathon','Thermopylae','Artemisium','Salamis','Plataea','Eurymedon','Battle of Delium','Cunaxa','Leuctra','Mantinea','Granicus','Issus','Siege of Tyre','Gaugamela'],
  romeCarthage:['Agrigentum','Mylae','Bagradas River','Drepana','Trebia','Lake Trasimene','Cannae','Metaurus','Zama','Cynoscephalae','Pydna','Numantia','Alesia','Pharsalus','Actium'],
  lateAntiquity:['Teutoburg Forest','Milvian Bridge','Mursa Major','Adrianople','Frigidus','Catalaunian Plains','Cape Bon','Dara','Callinicum','Tricamarum','Taginae','Mons Lactarius','Melitene','Nineveh 627','Fall of Ctesiphon'],
  earlyMedieval:['Mons Badonicus','Vouillé','Deorham','Winwaed','Nechtansmere','Tours','Roncevaux Pass','Edington','Lechfeld','Maldon','Clontarf','Brunanburh','Stamford Bridge','Hastings','Manzikert'],
  arabExpansion:['Badr','Uhud','The Trench','Mu’tah','Yarmouk','al-Qadisiyyah','Jalula','Nahavand','Heliopolis','Alexandria','Sufetula','Battle of the Masts','Second Fitna','Talas','Great Abbasid Muster'],
  crusadesSteppe:['Dorylaeum','Siege of Antioch','Jerusalem 1099','Montgisard','Hattin','Arsuf','Las Navas de Tolosa','Kalka River','Legnica','Mohi','Ain Jalut','Lake Peipus','Bouvines','Muret','Fall of Acre'],
  lateMedieval:['Bannockburn','Crécy','Poitiers','Kosovo Field','Nicopolis','Grunwald','Agincourt','Orléans','Varna','Castillon','Constantinople','Towton','Bosworth Field','Nancy','End of the Medieval Order'],
  renaissanceWars:['Fornovo','Cerignola','Garigliano','Agnadello','Ravenna','Novara','Marignano','Bicocca','Pavia','Mohács','Vienna 1529','Ceresole','Mühlberg','St. Quentin','Rocroi'],
  oceansEmpires:['Tenochtitlan','Cajamarca','First Panipat','Khanwa','Haldighati','Nagashino','Spanish Armada Landing Drill','Sekigahara','Kinsale','White Mountain','Breitenfeld','Lützen','Marston Moor','Dunbar','Blenheim'],
  kingsRevolution:['Poltava','Malplaquet','Fontenoy','Plassey','Leuthen','Quebec','Saratoga','Yorktown','Valmy','Austerlitz','Jena-Auerstedt','Wagram','Borodino','Leipzig','Waterloo'],
  industrialNations:['Alma','Balaclava','Inkerman','Solferino','First Bull Run','Antietam','Gettysburg','Vicksburg','Königgrätz','Sedan','Isandlwana','Rorke’s Drift','Omdurman','Spion Kop','Mukden'],
  worldWars:['First Marne','Tannenberg','Verdun','The Somme','Cambrai','Amiens','Poland 1939','Fall of France','El Alamein','Stalingrad','Kursk','Normandy','Operation Bagration','Battle of the Bulge','Berlin'],
  modernBattlefield:['Inchon','Chosin Reservoir','Dien Bien Phu','Ia Drang','Tet Offensive','Golan Heights 1973','Sinai 1973','Goose Green','73 Easting','Mogadishu','Takur Ghar','Second Fallujah','Marjah','Modern Combined-Arms Exercise','Networked Battlefield Finale']
}

const shellEnemyByAge={
  origins:['warrior','slinger'],bronzeIron:['spear','chariot','cityArcher'],classical:['hoplite','peltast','cavalry'],lateAntiquity:['lateLegion','cataphract','hunnicHorseArcher'],earlyMedieval:['shieldwall','archer','cavalry'],medieval:['knight','crossbow','longbow'],renaissance:['arquebusier','tercio','fieldCannon'],revolution:['lineInfantry','dragoon','fieldCannon'],industrialAge:['riflemen','marines','fieldCannon'],worldWars:['motorized','machineGunTeam','tank'],modernAge:['mechanized','mainBattleTank','rocketArtillery']
}
function makeShellStages(names,ageId){
  const pool=shellEnemyByAge[ageId]||['warrior']
  return names.map((name,i)=>({
    index:i+1,name,date:'',history:`${name} is part of the ${AGES[ageId]?.name||'historical'} campaign shell. A full historical briefing and bespoke conditions will be added during the content pass.`,
    tip:'Use the terrain, unit counters, Rally, Focus Fire and Reinforcement to create a local advantage.',
    terrain:i%5===1?{river:true,bridges:[2]}:i%5===3?{mountains:[{x:145,y:255,w:105,h:105},{x:350,y:330,w:90,h:95}]}:{},
    types:Array.from({length:Math.min(6,2+Math.floor(i/4))},(_,j)=>pool[(i+j)%pool.length]),mult:.82+i*.035,gold:25+i*4,xp:18+i*2,tp:i%2===0?1:0,boss:i===names.length-1,elite:[4,9,13].includes(i)
  }))
}

export const CAMPAIGNS = {
  dawn:{id:'dawn',number:1,ageId:'origins',name:'First Wars',era:'c. 7500–2300 BCE',maxTechTier:2,desc:'From archaeological evidence of early group violence to the first documented city-state wars.',boss:'Coalition of the Cities',art:'firstWars',stages:makeHistoricalStages(FIRST_WAR_BRIEFS,firstWarTypes)},

  firstcities:{id:'firstcities',number:2,ageId:'bronzeIron',name:'Bronze & Iron Empires',era:'1457–525 BCE',maxTechTier:3,requires:'dawn',desc:'Chariots, fortified cities and the great imperial armies of Egypt, Assyria and Persia.',boss:'Battle of Pelusium',art:'bronzeEmpires',stages:makeHistoricalStages(BRONZE_BRIEFS,bronzeTypes,true)},
  greekPersian:{id:'greekPersian',number:3,ageId:'classical',name:'Greeks, Persia & Macedon',era:'499–323 BCE',maxTechTier:4,requires:'firstcities',desc:'Hoplites, Persian imperial armies and the Macedonian transformation of warfare.',boss:'Gaugamela',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.greekPersian,'classical')},
  romeCarthage:{id:'romeCarthage',number:4,ageId:'classical',name:'Rome, Carthage & Republics',era:'264–30 BCE',maxTechTier:4,requires:'greekPersian',desc:'Legions, elephants, cavalry and the wars that created Mediterranean empires.',boss:'Actium',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.romeCarthage,'classical')},
  lateAntiquity:{id:'lateAntiquity',number:5,ageId:'lateAntiquity',name:'Empire in Crisis',era:'9–628 CE',maxTechTier:4,requires:'romeCarthage',desc:'Late Rome, migrations, armored cavalry and the struggle for the old imperial world.',boss:'Fall of Ctesiphon',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.lateAntiquity,'lateAntiquity')},
  earlyMedieval:{id:'earlyMedieval',number:6,ageId:'earlyMedieval',name:'Kingdoms of the Early Middle Ages',era:'500–1071',maxTechTier:5,requires:'lateAntiquity',desc:'Shieldwalls, mounted elites, Vikings and new kingdoms after Rome.',boss:'Manzikert',art:'firstWars',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.earlyMedieval,'earlyMedieval')},
  arabExpansion:{id:'arabExpansion',number:7,ageId:'earlyMedieval',name:'Caliphates & Expansion',era:'624–900',maxTechTier:5,requires:'earlyMedieval',desc:'The rapid expansion of the early caliphates and the armies that reshaped the Mediterranean and Near East.',boss:'Great Abbasid Muster',art:'firstWars',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.arabExpansion,'earlyMedieval')},
  crusadesSteppe:{id:'crusadesSteppe',number:8,ageId:'medieval',name:'Crusades & Steppe Empires',era:'1097–1291',maxTechTier:5,requires:'arabExpansion',desc:'Knights, horse archers, crusader states and the Mongol shock across Eurasia.',boss:'Fall of Acre',art:'firstWars',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.crusadesSteppe,'medieval')},
  lateMedieval:{id:'lateMedieval',number:9,ageId:'medieval',name:'Late Medieval Wars',era:'1314–1485',maxTechTier:5,requires:'crusadesSteppe',desc:'Longbows, pikes, early gunpowder and the end of the medieval battlefield.',boss:'End of the Medieval Order',art:'firstWars',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.lateMedieval,'medieval')},
  renaissanceWars:{id:'renaissanceWars',number:10,ageId:'renaissance',name:'Renaissance Wars',era:'1494–1650',maxTechTier:6,requires:'lateMedieval',desc:'Pike-and-shot, artillery and the rise of professional early-modern armies.',boss:'Rocroi',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.renaissanceWars,'renaissance')},
  oceansEmpires:{id:'oceansEmpires',number:11,ageId:'renaissance',name:'Oceans & Empires',era:'1492–1704',maxTechTier:6,requires:'renaissanceWars',desc:'Exploration, global empires, gunpowder expansion and warfare across continents.',boss:'Blenheim',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.oceansEmpires,'renaissance')},
  kingsRevolution:{id:'kingsRevolution',number:12,ageId:'revolution',name:'Kings, Enlightenment & Revolution',era:'1700–1815',maxTechTier:6,requires:'oceansEmpires',desc:'Line infantry, mass artillery, revolutions and Napoleonic warfare.',boss:'Waterloo',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.kingsRevolution,'revolution')},
  industrialNations:{id:'industrialNations',number:13,ageId:'industrialAge',name:'Industrial Nations',era:'1854–1905',maxTechTier:6,requires:'kingsRevolution',desc:'Rifles, railways, machine guns and industrial-scale armies.',boss:'Mukden',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.industrialNations,'industrialAge')},
  worldWars:{id:'worldWars',number:14,ageId:'worldWars',name:'World at War',era:'1914–1945',maxTechTier:6,requires:'industrialNations',desc:'Trenches, armor, air power and mechanized combined-arms warfare.',boss:'Berlin',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.worldWars,'worldWars')},
  modernBattlefield:{id:'modernBattlefield',number:15,ageId:'modernAge',name:'The Modern Battlefield',era:'1950–present',maxTechTier:6,requires:'worldWars',desc:'Mechanized armies, helicopters, precision weapons and networked warfare.',boss:'Networked Battlefield Finale',art:'bronzeEmpires',stages:makeShellStages(CAMPAIGN_SHELL_BATTLES.modernBattlefield,'modernAge')}
}


export const ARTIFACT_CATALOG = {
  origins:['Reinforced Leather Lamellar','Braided Sling Pouch','Stone Axe Grip','Hardened Spear Shaft','Bone Charm'],
  bronzeIron:['Reinforced Bronze Armor','Hardened Bronze Edges','Bronze Spearheads','Composite Bow Limbs','Chariot Reinforcement'],
  classical:['Iron Scale Armor','Pilum Bundle','Aspis Reinforcement','Macedonian Sarissa Tips','Cavalry Breastplate','Laurel Standard'],
  lateAntiquity:['Lamellar Cuirass','Heavy Cavalry Barding','Composite Horse Bow','Late Roman Shield Boss','Imperial Eagle'],
  earlyMedieval:['Mail Hauberk','Pattern-Welded Blade','Shieldwall Boss','Stirrup Reinforcement','Viking Banner'],
  medieval:['Plate Reinforcement','Bodkin Arrows','Windlass Crossbow','Knightly Saddle','Trebuchet Counterweight','Crusader Standard'],
  renaissance:['Pike Ferrules','Matchlock Mechanism','Powder Flask','Wheel-Lock Pistols','Cannon Trunnions','Royal Standard'],
  revolution:['Flintlock Kit','Bayonet Socket','Artillery Sight','Cavalry Sabre','Regimental Colors','Officer’s Telescope'],
  industrialAge:['Rifled Barrel','Breech Mechanism','Field Telegraph Set','Steel Breastplate','Rangefinder','Railway Logistics Kit'],
  worldWars:['Steel Helmet','Machine-Gun Tripod','Tank Optics','Radio Set','Anti-Tank Sights','Field Medical Kit'],
  modernAge:['Composite Armor','Thermal Sight','Precision Optics','Reactive Armor','Encrypted Radio','Drone Targeting Module']
}

export const ARTIFACT_COPY_THRESHOLDS = [1,2,4,6,8]
export const ARTIFACT_WORKSHOP_GOLD = [0,20,45,80,130]

export const ITEMS = {
  leatherLamellar:{id:'leatherLamellar',name:'Reinforced Leather Lamellar',slot:'unit',rarity:'Common',eligible:'ALL',price:30,maxLevel:5,effect:{healthMult:1.06},step:{healthMult:.025},desc:'A dependable early artifact. Increases Health of the equipped army type.'},
  stoneAxeGrip:{id:'stoneAxeGrip',name:'Stone Axe Grip',slot:'unit',rarity:'Common',eligible:'MELEE',price:32,maxLevel:5,effect:{damageMult:1.05},step:{damageMult:.022},desc:'A wrapped haft and balanced grip that improves melee damage for close-combat formations.'},
  boneCharm:{id:'boneCharm',name:'Bone Charm',slot:'unit',rarity:'Uncommon',eligible:'ALL',price:30,maxLevel:5,effect:{healthMult:1.04,armor:1},step:{healthMult:.018,armor:.4},desc:'A protective charm worn by early warbands. Slightly improves Health and Armor.'},
  bronzeArmor:{id:'bronzeArmor',name:'Reinforced Bronze Armor',slot:'unit',rarity:'Rare',eligible:'ALL',price:45,maxLevel:5,effect:{armor:4},step:{armor:1.5},desc:'Adds flat Armor to the equipped army type.'},
  bronzeEdges:{id:'bronzeEdges',name:'Hardened Bronze Edges',slot:'unit',rarity:'Uncommon',eligible:'MELEE',maxAge:3,price:42,maxLevel:5,effect:{damageMult:1.06},step:{damageMult:.025},desc:'Improved edged bronze weapons for melee formations from the Bronze/Classical eras or earlier.'},
  spearheads:{id:'spearheads',name:'Reinforced Bronze Spearheads',slot:'unit',rarity:'Uncommon',eligible:'SPEAR',maxAge:3,price:42,maxLevel:5,effect:{damageMult:1.055,armor:1},step:{damageMult:.02,armor:.5},desc:'Stronger spearheads for spear formations of the Bronze/Classical eras or earlier.'},
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
  gold: 120,
  xp: 20,
  tp: 0,
  ownedTech: [],
  characterCopies: {},
  characterLevels: {},
  discoveredUnits: ['warrior','slinger'],
  unitLevels: { warrior:1, slinger:1 },
  unlockedCampaigns: ['dawn'],
  completedCampaigns: [],
  campaignStats: Object.fromEntries(CAMPAIGN_ORDER.map(id=>[id,{best:0,stars:0}])),
  featureUnlocks: { artifacts:true, people:false, technology:false, relics:false },
  techSlots: 3,
  hpRank: 0,
  fieldMedicine: 0,
  freePack: 0,
  inventory: { leatherLamellar:1, slingPouch:1 },
  artifactLevels: { leatherLamellar:1, slingPouch:1 },
  unitEquipment: {},
  heroEquipment: {},
  stats: { runsStarted:0,battlesWon:0,unitsKilled:0,flawlessBattles:0,techUnlocked:0,peopleUpgraded:0,packsOpened:0,itemsEquipped:0,artifactsEvolved:0,peopleDiscovered:0,campaignsCompleted:0,unitLevelsBought:0,peopleFeatureUnlocked:0 },
  claimedAchievements: [],
  loadout: { leader:null, general:null, tech:[] },
}
