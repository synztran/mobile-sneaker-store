# PWA Icons Required

Safari / iOS "Add to Home Screen" requires actual **PNG** files.
Generate them from `icon.svg` — any tool works (e.g. `sharp`, `rsvg-convert`, Sketch, Figma export, `squoosh`).

## Files needed in this folder

| File | Size | Used by |
|---|---|---|
| `apple-touch-icon.png` | 180×180 px | Safari "Add to Home Screen" |
| `icon-192.png` | 192×192 px | Android / Chrome PWA install |
| `icon-512.png` | 512×512 px | Android splash / app store |

## Quick generation with sharp (Node)

```js
// scripts/gen-icons.mjs
import sharp from "sharp";

const src = "public/icon.svg";
await sharp(src).resize(180).png().toFile("public/apple-touch-icon.png");
await sharp(src).resize(192).png().toFile("public/icon-192.png");
await sharp(src).resize(512).png().toFile("public/icon-512.png");
console.log("icons generated");
```

```sh
node scripts/gen-icons.mjs
```
