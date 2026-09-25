export const DEFAULT_GAZE_OPTIONS = Object.freeze({
  innerPadding: 6, minimumEnterRadius: 220, enterRadiusFactor: 2.5,
  exitRadiusMargin: 40, gazeOverridesHover: true, sectorHysteresisDegrees: 4,
});
const normalize = (value) => ((value % 360) + 360) % 360;
const signedAngle = (from, to) => ((to - from + 540) % 360) - 180;
export const clockwiseAngle = (origin, point) => normalize(Math.atan2(point.x-origin.x, -(point.y-origin.y))*180/Math.PI);

export function rendererFrameForPoint(rect, point, spriteVersionNumber = 1) {
  if (spriteVersionNumber !== 2) return null;
  const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  if (Math.hypot(point.x-origin.x, point.y-origin.y) <= 1) return null;
  const sector = Math.round(clockwiseAngle(origin, point) / 22.5) % 16;
  return { columnIndex: sector % 8, frameDurationMs: 0, rowIndex: 9 + Math.floor(sector / 8) };
}

export function computeGaze({ cursor, mascot, previousActive=false, previousSector=null, options={} }) {
  const c = { ...DEFAULT_GAZE_OPTIONS, ...options };
  const origin = { x: mascot.left+mascot.width/2, y: mascot.top+mascot.height/2 };
  const hover = cursor.x>=mascot.left-c.innerPadding && cursor.x<=mascot.left+mascot.width+c.innerPadding && cursor.y>=mascot.top-c.innerPadding && cursor.y<=mascot.top+mascot.height+c.innerPadding;
  if (!c.gazeOverridesHover && hover) return { active:false, sector:null, reason:"inner-hover-zone" };
  const enter = Math.max(c.minimumEnterRadius, Math.max(mascot.width, mascot.height)*c.enterRadiusFactor);
  if (Math.hypot(cursor.x-origin.x,cursor.y-origin.y) > enter+(previousActive?c.exitRadiusMargin:0)) return { active:false, sector:null, reason:"outside-activation-radius" };
  const angle=clockwiseAngle(origin,cursor), candidate=Math.round(angle/22.5)%16;
  if(previousActive&&previousSector!==null&&candidate!==previousSector&&Math.abs(signedAngle(previousSector*22.5,angle))<11.25+c.sectorHysteresisDegrees) return {active:true,sector:previousSector,reason:"sector-hysteresis"};
  return {active:true,sector:candidate,reason:"active"};
}
