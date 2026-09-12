export default function Modal({open,onClose,title,children,wide=false}){
  if(!open) return null
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose?.()}}>
    <div className={`modal-card ${wide?'wide':''}`}>
      <div className="modal-header"><h2>{title}</h2><button onClick={onClose}>✕</button></div>
      {children}
    </div>
  </div>
}
