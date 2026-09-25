const CANONICAL_PET_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function canonicalCapabilityId(runtimePetId) {
  if (typeof runtimePetId !== "string") return null;
  const canonical = runtimePetId.startsWith("custom:") ? runtimePetId.slice(7) : runtimePetId;
  return CANONICAL_PET_ID.test(canonical) ? canonical : null;
}

export function resolveCapability(capabilities, runtimePetId) {
  if (capabilities == null || typeof capabilities !== "object" || Array.isArray(capabilities)) return null;
  const canonical = canonicalCapabilityId(runtimePetId);
  return canonical != null && Object.hasOwn(capabilities, canonical) ? capabilities[canonical] ?? null : null;
}
