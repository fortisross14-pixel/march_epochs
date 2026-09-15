import test from 'node:test'
import assert from 'node:assert/strict'
import {createActionGate,formatCurrency,loadMenuState,saveMenuState} from '../src/uiFeedback.js'
import {loadMeta,saveMeta} from '../src/storage.js'
import {START_META} from '../src/data.js'

test('repeat tap protection permits deliberate repeat actions and separate actions',()=>{
  let now=0;const allow=createActionGate(()=>now)
  assert.equal(allow('train:warrior'),true);assert.equal(allow('train:warrior'),false)
  now=399;assert.equal(allow('train:warrior'),false)
  now=400;assert.equal(allow('train:warrior'),true)
  assert.equal(allow('equip:armor'),true)
})
test('large currencies remain compact while early-game balances remain exact',()=>{
  assert.equal(formatCurrency(7),'7');assert.equal(formatCurrency(9999),'9999')
  assert.equal(formatCurrency(15320),'15.3K');assert.equal(formatCurrency(1500000),'1.5M')
})
test('saving reports failure without discarding the active progress',()=>{
  const original=globalThis.localStorage,meta=structuredClone(START_META);meta.gold=123
  try{
    globalThis.localStorage={setItem(){throw new Error('quota')}}
    assert.equal(saveMeta(meta),false);assert.equal(meta.gold,123)
    let saved=null;globalThis.localStorage={setItem(key,value){saved=value},getItem(){return saved}}
    assert.equal(saveMeta(meta),true);assert.equal(loadMeta().gold,123)
  }finally{globalThis.localStorage=original}
})
test('menu state failure does not interfere with game progression',()=>{
  const original=globalThis.sessionStorage
  try{
    globalThis.sessionStorage={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')}}
    assert.deepEqual(loadMenuState(),{});assert.doesNotThrow(()=>saveMenuState({screen:'armies'}))
    for(const raw of ['oops','null','1','[]']){globalThis.sessionStorage={getItem(){return raw}};assert.deepEqual(loadMenuState(),{})}
    globalThis.sessionStorage={getItem(){return '{"screen":"armies","unit":"warrior"}'}}
    assert.deepEqual(loadMenuState(),{screen:'armies',unit:'warrior'})
  }finally{globalThis.sessionStorage=original}
})
