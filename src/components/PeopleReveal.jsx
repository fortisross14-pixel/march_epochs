import {useState} from 'react'
import PersonCard from './PersonCard'
import {PEOPLE} from '../data'
import {emitFeedback} from '../uiFeedback.js'

export default function PeopleReveal({pack,meta,onClose}){
  const [index,setIndex]=useState(0),result=pack.results[index],last=index===pack.results.length-1
  function next(){if(last)onClose();else{setIndex(i=>i+1);emitFeedback('reward')}}
  return <div className="people-unveiling">
    <div className="discovery-heading" key={`heading-${index}`} role="status"><span>{result.isNew?'A NEW CHAPTER':'YOUR COLLECTION GROWS'}</span><h3>{result.isNew?'New discovery':'Another step to greatness'}</h3><small>{index+1} of {pack.results.length} · {PEOPLE[result.id].rarity}</small></div>
    <div className="discovery-stage" key={`card-${index}`}><div className="discovery-rays" aria-hidden="true"/><PersonCard id={result.id} meta={meta} reveal/></div>
    <p className="discovery-note">{result.isNew?`${PEOPLE[result.id].name} joins your collection.`:`Another ${PEOPLE[result.id].name} copy collected.`}</p>
    <div className="pack-bonus">{pack.bonus>0?`+ ${pack.bonus} Gold · `:''}Rewards saved</div>
    <button className="primary big" onClick={next}>{last?'Continue':'Reveal next'}</button>
  </div>
}
