import crypto from "node:crypto";
import fs from "node:fs";

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const sha256File = (filePath) => sha256(fs.readFileSync(filePath));
