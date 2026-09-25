# Rollback

Each successful promotion moves an existing experimental app into `local/rollback/`. Verify a rollback app, then run:

```sh
node src/cli/rollback.mjs local/rollback/<name>.app
```

The rollback command accepts only apps inside that directory and preserves the displaced experimental copy. To remove the experiment entirely, quit it and delete ignored `local/`; the installed source app is unaffected.
