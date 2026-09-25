# Adding an optional pet capability

Keep generic runtime logic under `src/features/`, deterministic semantics under `src/model/`, and pet-specific assets/config outside both. Capability lookup must normalize only known namespaces, validate the canonical ID, and fail to standard behaviour when absent or invalid. New work must not widen durable states or repurpose V1/V2 rows implicitly. Add a redistributable fixture and tests before adding private examples locally.
