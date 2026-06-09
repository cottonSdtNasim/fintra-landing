# Cloud Deployment Changes

All changes made from `v1-Testing` commit to current `HEAD` required for a successful Google Cloud Run deployment.

---

## 1. `package.json` — Dependency & Script Fixes

### Fix: Correct Next.js version (`^16.2.6` → `^15.3.3`)

Next.js version 16 does not exist. The buildpack failed at `npm install` because the version couldn't be resolved from the npm registry.

```diff
-  "next": "^16.2.6",
+  "next": "^15.3.3",
```

### Fix: Correct ESLint config version (`16.2.4` → `15.3.3`)

`eslint-config-next` must stay in sync with the Next.js version.

```diff
-  "eslint-config-next": "16.2.4",
+  "eslint-config-next": "15.3.3",
```

### Add: `postbuild` script to copy static assets into standalone

Cloud Run runs `node .next/standalone/server.js`. Next.js standalone output does NOT automatically copy `public/` or `.next/static/` into the standalone directory. Without this, all CSS, images, and JS chunks return 404.

```diff
   "scripts": {
     "dev": "next dev",
     "build": "next build",
+    "postbuild": "node copy-standalone.js",
     "start": "next start",
     "lint": "eslint"
   },
```

---

## 2. `copy-standalone.js` — New File (Static Asset Copier)

Runs automatically after `next build` via the `postbuild` npm script. Copies `public/` and `.next/static/` into `.next/standalone/` so the standalone server can serve them.

```js
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync('public')) {
  copyDir('public', '.next/standalone/public');
}
if (fs.existsSync('.next/static')) {
  copyDir('.next/static', '.next/standalone/.next/static');
}
```

---

## 3. `eslint.config.mjs` — Full Rewrite (FlatCompat Migration)

The original config used `defineConfig` + a direct import of `eslint-config-next/core-web-vitals`, which is incompatible with ESLint 9 Flat Config. The build warned `"nextVitals is not iterable"` and could fail linting in CI.

**Before (broken):**
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

**After (fixed):**
```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
```

> `@eslint/eslintrc` is already installed as a transitive dependency of `eslint-config-next` — no extra install needed.

---

## 4. `src/components/layout/Market/ValueMap.jsx` — Import Casing Fix

Windows filesystem is case-insensitive, so `./HeatMap/Heatmap` worked locally. Linux (Cloud Run) is case-sensitive. The actual folder on disk is `Heatmap` (lowercase `m`), causing `Module not found` errors in Cloud Build.

```diff
-import Heatmap from "./HeatMap/Heatmap";
+import Heatmap from "./Heatmap/Heatmap";

-} from "./HeatMap/HeatmapColors";
+} from "./Heatmap/HeatmapColors";
```

---

## 5. `.env.production` — Production Environment Variables

Added and committed `.env.production` with `NEXT_PUBLIC_*` API base URLs. These are baked into the JS bundle at **build time** by Next.js.

```env
NEXT_PUBLIC_BASE_URL=https://client-testb.fintra.com.bd/api
NEXT_PUBLIC_BASE_URL_OFFICE=https://office-testb.fintra.com.bd/api
```

### `.gitignore` update

Changed the gitignore rules from wildcard to exact filenames so that `.env.production` is tracked by git (while `.env` and `.env.local` remain ignored):

```diff
-.env*
-.env.local*
+.env
+.env.local
```

---

## 6. `next.config.mjs` — Standalone Output (was already set)

Required for Cloud Run to run `node .next/standalone/server.js`. This was already set in `v1-Testing` and no change was needed:

```js
const nextConfig = {
  output: "standalone",
};
```

---

## Summary Table

| File | Change Type | Reason |
|---|---|---|
| `package.json` | Modified | Fix invalid Next.js 16.x version; add `postbuild` script |
| `copy-standalone.js` | **New** | Copy public/ and .next/static/ into standalone output |
| `eslint.config.mjs` | Modified | Migrate to FlatCompat for ESLint 9 compatibility |
| `ValueMap.jsx` | Modified | Fix case-sensitive import path for Linux (Cloud Run) |
| `.env.production` | **New** | Add production API base URLs baked in at build time |
| `.gitignore` | Modified | Allow `.env.production` to be tracked by git |

---

## Cloud Run Entrypoint

The Google Cloud Run `GOOGLE_ENTRYPOINT` and `Procfile` both point to:

```
node .next/standalone/server.js
```

This is correct and requires `output: "standalone"` in `next.config.mjs` ✅
