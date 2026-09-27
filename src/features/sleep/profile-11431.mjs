import { replaceExactlyOnce } from "../../shared/replace.mjs";

export const ROOT_11431 = "webview/assets/app-initial-0a6dd402dd72.js";
export const MASCOT_11431 = "webview/assets/avatar-mascot-button-7586001b9adf.js";
export const OVERLAY_11431 = "webview/assets/avatar-overlay-native-page-8ad39727be0b.js";

function rootPatch(source) {
  const swaps = [
    ["function Gga(e,t){return`${e.columnIndex/(Kga-1)*100}% ${t==null?`calc(-${e.rowIndex} * var(--codex-pet-frame-height))`:`${e.rowIndex/(t-1)*100}%`}`}", "function Gga(e,t){return`${e.columnIndex/(Kga-1)*100}% ${t==null?`calc(-${e.rowIndex} * var(--codex-pet-frame-height))`:t===1?`0%`:`${e.rowIndex/(t-1)*100}%`}" + "`}"],
    ["r_a=({assetMap:e,className:t,lookFrame:n,respondToHover:r=!1,source:i,state:a=`idle`})=>{\"use forget\";", "r_a=({assetMap:e,className:t,lookFrame:n,respondToHover:r=!1,sleepPresentation:p=null,source:i,state:a=`idle`})=>{\"use forget\";"],
    ["l=rEe(),u=r&&o?`jumping`:a,d=i.assetRef==null?i.spriteRowCount:R6.rows;", "l=rEe(),u=p!=null?`sleep`:r&&o?`jumping`:a,d=p!=null?1:i.assetRef==null?i.spriteRowCount:R6.rows;"],
    ["if(n!=null){e.style.backgroundPosition=Gga(n,d);return}let t=Uga(u,l),r=t.frames", "if(p==null&&n!=null){e.style.backgroundPosition=Gga(n,d);return}let t=p!=null?{frames:Array.from({length:l?1:p.frameCount},(e,t)=>({columnIndex:t,frameDurationMs:p.frameDurationMs,rowIndex:0})),loopStartIndex:l||!p.loop?null:0}:Uga(u,l),r=t.frames"],
    ["},[u,n,l,d]),", "},[u,n,l,d,p]),"],
    ["backgroundImage:`url(${i.spritesheetUrl??e[i.assetRef]})`,backgroundSize:", "backgroundImage:`url(${p?.assetDataUrl??i.spritesheetUrl??e[i.assetRef]})`,backgroundSize:"],
  ];
  let result = source;
  for (const [before, after] of swaps) result = replaceExactlyOnce(result, before, after, "build-11431 sleep renderer fragment");
  return result;
}

function mascotPatch(source, capabilities) {
  const registry = JSON.stringify(capabilities);
  const lookup = "P3i=s.petId??s.assetRef,P3k=typeof P3i===`string`&&P3i.startsWith(`custom:`)?P3i.slice(7):P3i,P3p=typeof P3k===`string`&&/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(P3k)?P3c[P3k]??null:null";
  const sleep = `[l,u]=(0,M.useState)(!1),[P3s,P3S]=(0,M.useState)(!1),[P3r,P3R]=(0,M.useState)(0),${lookup},P3e=P3p!=null&&P3p.enabled===!0&&re===\`idle\`&&P3n===!1&&ne==null,P3a=P3s&&P3e;(0,M.useEffect)(()=>{if(!P3e){P3s&&P3S(!1);return}if(P3s)return;let e=window.setTimeout(()=>P3S(!0),P3p.inactivityMs);return()=>window.clearTimeout(e)},[P3e,P3s,P3r,P3p?.inactivityMs]);let d=`;
  const swaps = [
    ["function le(e){let t=(0,de.c)(20),", `var P3c=${registry};function le(e){let t=(0,de.c)(21),`],
    ["{ariaLabel:n,className:r,lookFrame:i,notificationBadge:a,", "{ariaLabel:n,className:r,hasNotifications:P3n=!1,lookFrame:i,notificationBadge:a,"],
    ["[l,u]=(0,M.useState)(!1),d=", sleep],
    ["d=ne??(l?`jumping`:re)", "d=P3a?`sleep`:ne??(l?`jumping`:re)"],
    ["let _=n==null&&!p||void 0,v,y;", "let _=n==null&&!p||void 0,v,y,P3d;"],
    ["(v=()=>{u(!0)},y=()=>{u(!1)},t[2]=v,t[3]=y):(v=t[2],y=t[3]);", "(v=()=>{u(!0)},y=()=>{u(!1)},P3d=e=>{e.button===0&&(P3S(!1),P3R(e=>e+1))},t[2]=v,t[3]=y,t[20]=P3d):(v=t[2],y=t[3],P3d=t[20]);"],
    ["let b=i!=null&&d===`jumping`?i:f?i:null", "let b=P3a?null:i!=null&&d===`jumping`?i:f?i:null"],
    ["lookFrame:b,source:s,state:d", "lookFrame:b,sleepPresentation:P3a?P3p:null,source:s,state:d"],
    ["role:h,onContextMenu:o,onPointerEnter:v", "role:h,onContextMenu:o,onPointerDownCapture:P3d,onPointerEnter:v"],
    ["\"data-testid\":`avatar-mascot-button`", "\"data-testid\":`avatar-mascot-button`,\"data-codex-pet-semantic-state\":re,\"data-codex-pet-sleep-eligible\":P3e,\"data-codex-pet-sleeping\":P3a||void 0"],
  ];
  let result = source;
  for (const [before, after] of swaps) result = replaceExactlyOnce(result, before, after, "build-11431 sleep mascot fragment");
  return result;
}

export function applySleep11431(entries, config, capabilities) {
  entries.set(ROOT_11431, Buffer.from(rootPatch(entries.get(ROOT_11431).toString("utf8"))));
  entries.set(MASCOT_11431, Buffer.from(mascotPatch(entries.get(MASCOT_11431).toString("utf8"), capabilities)));
  const overlay = entries.get(OVERLAY_11431).toString("utf8");
  entries.set(OVERLAY_11431, Buffer.from(replaceExactlyOnce(
    overlay,
    "lookFrame:Mr,notificationBadge:wn||Ar?void 0:ji",
    "hasNotifications:pn,lookFrame:Mr,notificationBadge:wn||Ar?void 0:ji",
    "build-11431 notification signal",
  )));
  return { changedEntries: [ROOT_11431, MASCOT_11431, OVERLAY_11431], capabilityPetIds: Object.keys(capabilities) };
}
