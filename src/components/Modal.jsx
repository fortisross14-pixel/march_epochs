import { useEffect, useId, useRef } from 'react'
import { ASSETS } from '../assets'

export default function Modal({open,onClose,title,children,wide=false,menu=false,flow=false,back=false}){
  const titleId=useId(),card=useRef(null),closeRef=useRef(onClose)
  closeRef.current=onClose
  useEffect(()=>{
    if(!open||!menu)return
    const previous=document.activeElement,overflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    card.current?.focus()
    function onKey(event){
      if(event.key==='Escape'&&closeRef.current){event.preventDefault();closeRef.current();return}
      if(event.key!=='Tab')return
      const targets=[...card.current.querySelectorAll('button:not(:disabled),a[href],summary,[tabindex="0"]')].filter(el=>el.getClientRects().length)
      const first=targets[0],last=targets.at(-1)
      if(!first){event.preventDefault();return}
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===card.current)){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===card.current)){event.preventDefault();first.focus()}
    }
    document.addEventListener('keydown',onKey)
    return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',onKey);if(previous?.isConnected)previous.focus()}
  },[open,menu])
  if(!open) return null
  return <div className={`modal-backdrop ${menu?'menu-dialog':''} ${flow?'menu-flow':''}`} onMouseDown={e=>{if(e.target===e.currentTarget&&!flow)onClose?.()}}>
    <div ref={card} tabIndex={menu?-1:undefined} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`modal-card ${wide?'wide':''}`}>
      <div className={`modal-header ${back?'has-back':''}`}><h2 id={titleId}>{title}</h2>{onClose&&<button aria-label={back?'Back':'Close'} onClick={onClose}>{back?<span aria-hidden="true">‹</span>:ASSETS.ui?.close?<img src={ASSETS.ui.close} alt=""/>:'✕'}</button>}</div>
      {children}
    </div>
  </div>
}
