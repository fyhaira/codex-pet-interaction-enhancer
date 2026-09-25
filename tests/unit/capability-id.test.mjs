import assert from"node:assert/strict";import test from"node:test";import{canonicalCapabilityId,resolveCapability}from"../../src/model/capability-id.mjs";
test("custom namespace is normalized once",()=>{assert.equal(canonicalCapabilityId("custom:generic.pet"),"generic.pet");assert.equal(resolveCapability({"generic.pet":1},"custom:generic.pet"),1)});
test("built-in ids remain unchanged",()=>assert.equal(canonicalCapabilityId("codex"),"codex"));
test("unknown and malformed ids fail safely",()=>{for(const id of[null,"","custom:","custom:custom:pet","unknown:pet","custom:/pet"])assert.equal(resolveCapability({pet:1},id),null)});
