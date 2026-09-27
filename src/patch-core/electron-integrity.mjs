import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { calculateIntegrityDigestForApp, getRawHeader } from "@electron/asar";

const INTEGRITY_DIGEST_SENTINEL = Buffer.from("AGbevlPCksUGKNL8TSn7wGmJEuJsXb2A");
const DIGEST_LENGTH = 32;

export function computeAsarHeaderSha256(appAsarPath) {
  const { headerString } = getRawHeader(appAsarPath);
  return crypto.createHash("sha256").update(headerString).digest("hex");
}

function findSentinels(bytes) {
  const offsets = [];
  let cursor = 0;
  while (cursor < bytes.length) {
    const offset = bytes.indexOf(INTEGRITY_DIGEST_SENTINEL, cursor);
    if (offset < 0) break;
    offsets.push(offset);
    cursor = offset + INTEGRITY_DIGEST_SENTINEL.length;
  }
  return offsets;
}

function frameworkExecutableCandidates(appPath) {
  const frameworks = path.join(appPath, "Contents", "Frameworks");
  if (!fs.existsSync(frameworks)) return [];
  return fs.readdirSync(frameworks, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(" Framework.framework"))
    .map((entry) => {
      const frameworkPath = path.join(frameworks, entry.name);
      const executableName = entry.name.slice(0, -".framework".length);
      return path.join(frameworkPath, executableName);
    })
    .filter((candidate) => fs.existsSync(candidate));
}

export function locateEmbeddedIntegrityExecutable(appPath) {
  const matches = [];
  for (const candidate of frameworkExecutableCandidates(appPath)) {
    const bytes = fs.readFileSync(candidate);
    if (findSentinels(bytes).length > 0) matches.push(candidate);
  }
  if (matches.length === 0) return null;
  if (matches.length !== 1) throw new Error(`Expected one embedded ASAR-integrity framework executable, found ${matches.length}`);
  return matches[0];
}

function readStoredDigestFromBytes(bytes) {
  const offsets = findSentinels(bytes);
  if (offsets.length === 0) return null;
  const values = offsets.map((offset) => {
    const used = bytes.readUInt8(offset + INTEGRITY_DIGEST_SENTINEL.length) === 1;
    if (!used) return { used: false };
    const version = bytes.readUInt8(offset + INTEGRITY_DIGEST_SENTINEL.length + 1);
    if (version !== 1) throw new Error(`Unsupported embedded ASAR-integrity digest version: ${version}`);
    return {
      used: true,
      version,
      sha256Digest: Buffer.from(bytes.subarray(offset + INTEGRITY_DIGEST_SENTINEL.length + 2, offset + INTEGRITY_DIGEST_SENTINEL.length + 2 + DIGEST_LENGTH)),
    };
  });
  const canonical = JSON.stringify({ used: values[0].used, version: values[0].version, sha256: values[0].sha256Digest?.toString("hex") });
  for (const value of values.slice(1)) {
    const current = JSON.stringify({ used: value.used, version: value.version, sha256: value.sha256Digest?.toString("hex") });
    if (current !== canonical) throw new Error("Embedded ASAR-integrity sentinels disagree");
  }
  return values[0];
}

export function inspectEmbeddedIntegrityDigest(appPath) {
  const executablePath = locateEmbeddedIntegrityExecutable(appPath);
  if (executablePath == null) return { present: false, used: false, executablePath: null };
  const stored = readStoredDigestFromBytes(fs.readFileSync(executablePath));
  return { present: true, executablePath, used: stored.used, version: stored.version ?? null, sha256: stored.sha256Digest?.toString("hex") ?? null };
}

export function updateEmbeddedIntegrityDigest(appPath) {
  const before = inspectEmbeddedIntegrityDigest(appPath);
  if (!before.present || !before.used) return before;
  if (before.version !== 1) throw new Error(`Unsupported embedded ASAR-integrity digest version: ${before.version}`);
  const calculated = calculateIntegrityDigestForApp(appPath, 1);
  const bytes = fs.readFileSync(before.executablePath);
  const offsets = findSentinels(bytes);
  if (offsets.length === 0) throw new Error("Embedded ASAR-integrity sentinel disappeared before update");
  for (const offset of offsets) {
    bytes.writeUInt8(1, offset + INTEGRITY_DIGEST_SENTINEL.length);
    bytes.writeUInt8(1, offset + INTEGRITY_DIGEST_SENTINEL.length + 1);
    calculated.sha256Digest.copy(bytes, offset + INTEGRITY_DIGEST_SENTINEL.length + 2);
  }
  fs.writeFileSync(before.executablePath, bytes);
  return inspectEmbeddedIntegrityDigest(appPath);
}

export function verifyEmbeddedIntegrityDigest(appPath) {
  const stored = inspectEmbeddedIntegrityDigest(appPath);
  if (!stored.present || !stored.used) return stored;
  const calculated = calculateIntegrityDigestForApp(appPath, 1);
  const calculatedHex = calculated.sha256Digest.toString("hex");
  if (stored.sha256 !== calculatedHex) throw new Error(`Embedded ASAR-integrity digest mismatch: stored=${stored.sha256} calculated=${calculatedHex}`);
  return { ...stored, calculatedSha256: calculatedHex, verified: true };
}
