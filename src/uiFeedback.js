// Visual feedback can be paired with authored audio later; no placeholder sounds.
export function emitFeedback(type,detail={}){
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('epoch:feedback',{detail:{...detail,type}}))
}
export function createActionGate(now=()=>performance.now()){
  let lastKey=null,lastTime=-Infinity
  return key=>{const time=now();if(lastKey===key&&time-lastTime<400)return false;lastKey=key;lastTime=time;return true}
}
export function formatCurrency(value){return value<10000?String(value):new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(value)}

const UI_KEY='march-of-epochs-menu-v1'
export function loadMenuState(){
  try{const state=JSON.parse(sessionStorage.getItem(UI_KEY));return state&&typeof state==='object'&&!Array.isArray(state)?state:{}}catch{return {}}
}
export function saveMenuState(state){
  try{sessionStorage.setItem(UI_KEY,JSON.stringify(state))}catch{/* UI location is optional; progression has its own save warning. */}
}
