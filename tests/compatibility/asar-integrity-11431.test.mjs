import assert from "node:assert/strict";
import child from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createPackage } from "@electron/asar";
import { verifyIntegrity, verifySignature } from "../../src/patch-core/app.mjs";

const official = process.env.CODEX_SOURCE_APP ?? "/Applications/ChatGPT.app";
const officialMatches = fs.existsSync(official) && child.execFileSync(
  "/usr/libexec/PlistBuddy",
  ["-c", "Print :CFBundleVersion", path.join(official, "Contents/Info.plist")],
  { encoding: "utf8" },
).trim() === "11431";

test("official build 11431 header declaration and embedded digest verify", { skip: !officialMatches }, () => {
  const integrity = verifyIntegrity(official);
  assert.equal(integrity.headerSha256, "67110bf78615ade46ee4fe30e970947506a95ace1fa5e50f2274d962bf7749cc");
  assert.equal(integrity.declaredHeaderSha256, integrity.headerSha256);
  assert.notEqual(integrity.artifactSha256, integrity.headerSha256);
  assert.equal(integrity.embeddedIntegrity.used, true);
  assert.equal(integrity.embeddedIntegrity.verified, true);
});

const candidate = process.env.CODEX_PATCHED_APP;
const candidateAvailable = candidate && fs.existsSync(candidate);

test("rebuilt candidate keeps artifact, header declaration, embedded digest, and signature coherent", { skip: !candidateAvailable }, () => {
  const integrity = verifyIntegrity(candidate);
  assert.equal(integrity.declaredHeaderSha256, integrity.headerSha256);
  assert.notEqual(integrity.artifactSha256, integrity.headerSha256);
  if (integrity.embeddedIntegrity.used) assert.equal(integrity.embeddedIntegrity.verified, true);
  assert.doesNotThrow(() => verifySignature(candidate));
});

test("an intentional ASAR declaration mismatch fails closed", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pet-enhancer-integrity-"));
  const source = path.join(root, "source");
  const app = path.join(root, "Fixture.app");
  fs.mkdirSync(source, { recursive: true });
  fs.writeFileSync(path.join(source, "fixture.txt"), "fixture\n");
  fs.mkdirSync(path.join(app, "Contents", "Resources"), { recursive: true });
  await createPackage(source, path.join(app, "Contents", "Resources", "app.asar"));
  fs.writeFileSync(path.join(app, "Contents", "Info.plist"), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>ElectronAsarIntegrity</key><dict><key>Resources/app.asar</key><dict><key>hash</key><string>${"0".repeat(64)}</string></dict></dict></dict></plist>\n`);
  assert.throws(() => verifyIntegrity(app), /ASAR header integrity mismatch/u);
  fs.rmSync(root, { recursive: true, force: true });
});
