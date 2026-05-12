# Build Error Fixes — blog.tanay.tech

Reference for diagnosing and fixing `npm run build` failures on this Astro + Starlight blog.

---

## npm install errors

| Symptom | Fix |
|---|---|
| `ERESOLVE` peer dep conflict | `npm install --legacy-peer-deps` |
| Engine mismatch (`engines` field) | Check `node --version`; align or remove `--engine-strict` |
| Missing lockfile | Delete `node_modules/`, run `npm install` fresh |
| 401 from registry | Check `.npmrc`, run `npm login` |

After any `npm install` run, always check if `package-lock.json` changed:

```bash
git diff --quiet package-lock.json || git add package-lock.json
```

---

## Astro build errors

### Module not found / missing import

```bash
cat /tmp/pr_build.log | grep "Cannot find"
# Install the missing package
npm install <package-name>
```

### TypeScript errors in `.astro` or `.ts` files

Astro's build runs `tsc` internally. Common causes after a dependency bump:
- Type definitions changed in a package update (e.g. `@types/*` or inline types)
- Check `tsconfig.json` for `strict` or `noImplicitAny` settings

```bash
# Find the erroring file from the log
cat /tmp/pr_build.log | grep "error TS"
# Fix type annotations in the indicated file
# Then re-run:
npm run build
```

### Starlight / `@astrojs/starlight` config errors

When `@astrojs/starlight` is bumped, `astro.config.mjs` options may change:

```bash
# Check what changed in the package
gh pr diff "$PR" -- package-lock.json | grep "starlight" | head -20
# Read the build error carefully — Starlight often prints helpful migration hints
cat /tmp/pr_build.log | grep -A5 "Error"
```

Common fixes:
- Renamed config options → update `astro.config.mjs`
- Removed plugin APIs → remove or replace the call

### `sharp` / image processing errors

`sharp` is a native addon that can break on Node.js version changes:

```bash
# Rebuild sharp from source
npm rebuild sharp
# Or reinstall
npm uninstall sharp && npm install sharp
```

### MDX / remark plugin errors

This repo uses `remark-directive`, `remark-gfm`, and `remark-parse`. If a remark package bumps a major version, the plugin API may change:

```bash
cat /tmp/pr_build.log | grep -i "remark\|unified\|plugin"
# Check changelog at https://github.com/remarkjs/remark/releases
# Update plugin usage in astro.config.mjs if the API changed
```

### `astro-expressive-code` / `@expressive-code/plugin-line-numbers` errors

These are tightly coupled. If one bumps without the other, peer dep errors surface:

```bash
# Check versions
npm ls astro-expressive-code @expressive-code/plugin-line-numbers
# Align them if needed
npm install astro-expressive-code@<version> @expressive-code/plugin-line-numbers@<version>
```

---

## Checking what a PR actually changed

Before fixing, understand what the PR upgraded:

```bash
# Show diff of package.json and package-lock.json
gh pr diff "$PR" -- package.json package-lock.json

# Check just the version bumps
gh pr diff "$PR" -- package.json
```

---

## Astro config reference

The main config is `astro.config.mjs`. Changes to Starlight, expressive-code, or remark may require edits here. Read the file before making changes:

```bash
# astro.config.mjs location
cat /home/tanay/Projects/blog.tanay.tech/astro.config.mjs
```

---

## Re-running the build after fixes

```bash
npm run build 2>&1 | tee /tmp/pr_build.log
echo "Exit: $?"
```

A successful Astro build ends with output like:
```
 building client...
 built client...
 Complete!
```

Exit code 0 means the build passed.
