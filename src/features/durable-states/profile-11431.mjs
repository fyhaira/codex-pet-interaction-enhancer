import { replaceExactlyOnce } from "../../shared/replace.mjs";

export const RENDERER_11431 = "webview/assets/app-initial-0a6dd402dd72.js";
const BEFORE = "function Uga(e,t){let n=Xga[e];if(t)return{frames:[Wga(n,0)],loopStartIndex:null};if(e===`idle`)return{frames:Yga,loopStartIndex:0};let r=[...n,...n,...n];return{frames:[...r,...Yga],loopStartIndex:r.length}}";
const AFTER = "function Uga(e,t){let n=Xga[e];if(t)return{frames:[Wga(n,0)],loopStartIndex:null};if(e===`idle`)return{frames:Yga,loopStartIndex:0};if(e===`running`||e===`review`)return{frames:n,loopStartIndex:0};let r=[...n,...n,...n];return{frames:[...r,...Yga],loopStartIndex:r.length}}";

export function applyDurableStates11431(entries, config) {
  const source = entries.get(RENDERER_11431).toString("utf8");
  entries.set(RENDERER_11431, Buffer.from(replaceExactlyOnce(source, BEFORE, AFTER, "build-11431 animation planner")));
  return { changedEntries: [RENDERER_11431], durableStates: [...config.states] };
}
