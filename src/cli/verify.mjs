#!/usr/bin/env node
import path from"node:path";import{verifyIntegrity,verifySignature}from"../patch-core/app.mjs";const app=path.resolve(process.argv[2]??"");if(!app)throw new Error("Usage: verify.mjs <copied-app>");const hash=verifyIntegrity(app);verifySignature(app);console.log(JSON.stringify({ok:true,app,asarSha256:hash},null,2));
