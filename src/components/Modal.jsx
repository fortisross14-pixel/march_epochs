import { useEffect, useId, useRef } from 'react'
import { ASSETS } from '../assets'

const dialogs=[]
let bodyOverflow=''

export default function Modal({open,onClose,title,children,wide=false,menu=false,flow=false,back=false}){
  const titleId=useId(),card=useRef(null),closeRef=useRef(onClose)
  closeRef.current=onClose
  useEffect(()=>{
    if(!open)return
    const previous=document.activeElement,element=card.current,underneath=dialogs.at(-1)
    if(!dialogs.length)bodyOverflow=document.body.style.overflow
    if(underneath)underneath.inert=true
    dialogs.push(element)
    document.body.style.overflow='hidden'
    element?.focus({preventScroll:true})
    function onKey(event){
      if(dialogs.at(-1)!==element)return
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeRef.current?.();return}
      if(event.key!=='Tab')return
      const targets=[...element.querySelectorAll('button:not(:disabled),a[href],summary,input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.closest('[inert]'))
      const first=targets[0],last=targets.at(-1)
      if(!first){event.preventDefault();return}
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===card.current)){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===card.current)){event.preventDefault();first.focus()}
    }
    document.addEventListener('keydown',onKey,true)
    return()=>{
      const index=dialogs.indexOf(element);if(index>=0)dialogs.splice(index,1)
      const top=dialogs.at(-1);if(top)top.inert=false
      if(!dialogs.length)document.body.style.overflow=bodyOverflow
      document.removeEventListener('keydown',onKey,true)
      if(previous?.isConnected&&!previous.closest('[inert]'))previous.focus({preventScroll:true})
      else top?.focus({preventScroll:true})
    }
  },[open])
  if(!open) return null
  return <div className={`modal-backdrop ${menu?'menu-dialog':''} ${flow?'menu-flow':''}`} onMouseDown={e=>{if(e.target===e.currentTarget&&!flow)onClose?.()}}>
    <div ref={card} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`modal-card ${wide?'wide':''}`}>
      <div className={`modal-header ${back?'has-back':''}`}><h2 id={titleId}>{title}</h2>{onClose&&<button aria-label={back?'Back':'Close'} onClick={onClose}>{back?<span aria-hidden="true">‹</span>:ASSETS.ui?.close?<img src={ASSETS.ui.close} alt=""/>:'✕'}</button>}</div>
      {children}
    </div>
  </div>
}
