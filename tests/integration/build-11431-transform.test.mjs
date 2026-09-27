import assert from "node:assert/strict";
import child from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { openAsar, closeAsar, readAsarEntry } from "../../src/patch-core/asar.mjs";
import { loadManifest, verifySourceApp } from "../../src/compatibility/verify.mjs";
import { applyPointerGaze } from "../../src/features/pointer-gaze/patch.mjs";
import { applyDurableStates } from "../../src/features/durable-states/patch.mjs";
import { applySleep } from "../../src/features/sleep/patch.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = process.env.CODEX_SOURCE_APP;
const matches = source && fs.existsSync(source) && child.execFileSync(
  "/usr/libexec/PlistBuddy",
  ["-c", "Print :CFBundleVersion", path.join(source, "Contents/Info.plist")],
  { encoding: "utf8" },
).trim() === "11431";

test("build 11431 transforms apply only after exact verification", { skip: !matches }, () => {
  const manifest = loadManifest(path.join(root, "compatibility/26.924.20706-build-11431.json"));
  verifySourceApp(source, manifest);
  const archive = openAsar(path.join(source, manifest.source.asarPath));
  const entries = new Map();
  try {
    for (const entryPath of Object.keys(manifest.targets)) entries.set(entryPath, readAsarEntry(archive, entryPath));
  } finally {
    closeAsar(archive);
  }
  const gaze = { enabled: true, gazeOverridesHover: true, enterRadiusPx: 220, exitHysteresisPx: 40, sectorHysteresisDegrees: 4 };
  const durable = { enabled: true, states: ["running", "review"] };
  const sleep = { enabled: true };
  const capabilities = { "generic-v2-debug-pet": { enabled: true, inactivityMs: 180000, assetDataUrl: "data:image/png;base64,fixture", frameCount: 8, frameDurationMs: 420, loop: true } };
  applyPointerGaze(entries, gaze, manifest.transformProfile);
  applyDurableStates(entries, durable, manifest.transformProfile);
  applySleep(entries, sleep, capabilities, manifest.transformProfile);

  const main = entries.get(".vite/build/main-BefHSPFJ.js").toString("utf8");
  const renderer = entries.get("webview/assets/app-initial-0a6dd402dd72.js").toString("utf8");
  const mascot = entries.get("webview/assets/avatar-mascot-button-7586001b9adf.js").toString("utf8");
  const overlay = entries.get("webview/assets/avatar-overlay-native-page-8ad39727be0b.js").toString("utf8");
  assert.match(main, /phase1PhysicalGazeActive/u);
  assert.match(main, /computerUseCursorPoint!=null/u);
  assert.match(renderer, /if\(e===`running`\|\|e===`review`\)return\{frames:n,loopStartIndex:0\}/u);
  assert.match(renderer, /p\?\.assetDataUrl\?\?i\.spritesheetUrl/u);
  assert.match(mascot, /onPointerDownCapture:P3d/u);
  assert.match(mascot, /P3i=s\.petId\?\?s\.assetRef/u);
  assert.match(overlay, /hasNotifications:pn,lookFrame:Mr/u);
});
