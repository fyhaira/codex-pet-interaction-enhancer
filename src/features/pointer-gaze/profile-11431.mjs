import fs from "node:fs";
import { replaceExactlyOnce } from "../../shared/replace.mjs";

export const MAIN_11431 = ".vite/build/main-BefHSPFJ.js";
export const MASCOT_11431 = "webview/assets/avatar-mascot-button-7586001b9adf.js";

function configured(config) {
  let method = fs.readFileSync(new URL("./runtime-method-11431.js.txt", import.meta.url), "utf8").trimEnd();
  method = replaceExactlyOnce(method, "Math.max(220,extent*2.5)", `Math.max(${config.enterRadiusPx},extent*2.5)`, "gaze radius");
  method = replaceExactlyOnce(method, "this.phase1PhysicalGazeActive?40:0", `this.phase1PhysicalGazeActive?${config.exitHysteresisPx}:0`, "exit hysteresis");
  method = replaceExactlyOnce(method, "fromPrevious<15.25", `fromPrevious<${11.25 + config.sectorHysteresisDegrees}`, "sector hysteresis");
  if (!config.gazeOverridesHover) method = method.replace("!process.argv.includes(`--codex-pet-gaze-hover-jumps`)", "!1");
  return method;
}

export function applyPointerGaze11431(entries, config) {
  const source = entries.get(MAIN_11431).toString("utf8");
  const startMarker = "updateCssPetControlsProximityTracking(){";
  const endMarker = "setPetPointerProximity(e){";
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0 || source.indexOf(startMarker, start + 1) >= 0) throw new Error("Could not identify exactly one build-11431 proximity method");
  entries.set(MAIN_11431, Buffer.from(source.slice(0, start) + configured(config) + source.slice(end)));
  const mascot = entries.get(MASCOT_11431).toString("utf8");
  entries.set(MASCOT_11431, Buffer.from(replaceExactlyOnce(
    mascot,
    "let b=f?i:null,x;",
    "let b=i!=null&&d===`jumping`?i:f?i:null,x;",
    "build-11431 hover/gaze priority",
  )));
  return { changedEntries: [MAIN_11431, MASCOT_11431] };
}
