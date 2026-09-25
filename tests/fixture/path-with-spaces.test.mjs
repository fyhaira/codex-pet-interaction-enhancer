import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("fixture tests resolve filesystem paths containing spaces", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "Codex Pet Toolkit Test "));
  const copiedRoot = path.join(temporaryRoot, "repository with spaces");
  try {
    fs.mkdirSync(path.join(copiedRoot, "tests", "fixture"), { recursive: true });
    fs.cpSync(path.join(root, "fixtures"), path.join(copiedRoot, "fixtures"), { recursive: true });
    fs.copyFileSync(path.join(root, "tests", "fixture", "fixture.test.mjs"), path.join(copiedRoot, "tests", "fixture", "fixture.test.mjs"));
    const result = childProcess.spawnSync(process.execPath, ["--test", path.join(copiedRoot, "tests", "fixture", "fixture.test.mjs")], { encoding: "utf8" });
    assert.equal(result.status, 0, `fixture test failed in a path containing spaces:\n${result.stdout}\n${result.stderr}`);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
