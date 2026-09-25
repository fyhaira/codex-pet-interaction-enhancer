export const DURABLE_STATES = Object.freeze(["running", "review"]);
export function buildAnimationPlan(state, reducedMotion, stateFrames, idleFrames) {
  const frames=stateFrames[state]; if(!frames) throw new RangeError(`Unknown pet state: ${state}`);
  if(reducedMotion) return {frames:[frames[0]],loopStartIndex:null};
  if(state==="idle") return {frames:idleFrames,loopStartIndex:0};
  if(DURABLE_STATES.includes(state)) return {frames,loopStartIndex:0};
  const bounded=[...frames,...frames,...frames]; return {frames:[...bounded,...idleFrames],loopStartIndex:bounded.length};
}
export function frameAtElapsed(plan, elapsedMs){let i=0,r=Math.max(0,elapsedMs);for(;;){const d=plan.frames[i].frameDurationMs;if(r<d||plan.loopStartIndex==null)return plan.frames[i];r-=d;i+=1;if(i>=plan.frames.length)i=plan.loopStartIndex??plan.frames.length-1}}
