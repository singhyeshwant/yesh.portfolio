/**
 * optimize-model.mjs — visually-lossless optimizer for the hero .glb
 * ---------------------------------------------------------------------------
 * Shrinks a glTF/GLB by Draco-compressing the geometry and recompressing the
 * embedded textures, WITHOUT lowering texture resolution or changing topology.
 * The torso.glb in this repo was produced with this script (48MB -> ~12MB).
 *
 * It is intentionally NOT wired into package.json so the normal `npm install`
 * / GitHub Pages build stays lean (sharp + gltf-transform are heavy, native
 * deps). Run it manually only when you replace the 3D model.
 *
 * USAGE (one-off, from the repo root):
 *   npm i -D @gltf-transform/core @gltf-transform/extensions \
 *            @gltf-transform/functions draco3dgltf sharp
 *   node scripts/optimize-model.mjs <input.glb> [output.glb]
 *
 *   # defaults: input/output = public/assets/model/torso.glb
 *   # ALWAYS keep your original high-res master somewhere safe and point the
 *   # script at THAT — re-running it on an already-Draco'd file is refused.
 *
 * Why these settings are "visually lossless":
 *   - Draco position quantization is 14-bit => ~0.002% of the model height of
 *     deviation (sub-pixel on screen); triangle count is preserved exactly.
 *   - Textures keep their native resolution (e.g. 4096x4096). They are only
 *     re-encoded from near-100 quality down to high quality. The normal map
 *     uses 4:4:4 chroma (no subsampling) to avoid shading artifacts. Measured
 *     on-screen PSNR (after mip minification) stays >= ~44 dB everywhere.
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { dedup, prune, draco } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import fs from "fs";

const IN = process.argv[2] || "public/assets/model/torso.glb";
const OUT = process.argv[3] || "public/assets/model/torso.glb";

// Per-slot texture quality. Color tolerates 4:2:0; data-bearing maps (normal,
// metallic-roughness) keep 4:4:4 so no channel is chroma-subsampled.
const TEXTURE = {
  baseColor:  { quality: 90, chromaSubsampling: "4:2:0" },
  normal:     { quality: 92, chromaSubsampling: "4:4:4" },
  metalRough: { quality: 90, chromaSubsampling: "4:4:4" },
  emissive:   { quality: 90, chromaSubsampling: "4:4:4" },
  occlusion:  { quality: 90, chromaSubsampling: "4:4:4" },
};

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

const doc = await io.read(IN);
const root = doc.getRoot();

// Guard: don't double-compress an already-optimized file.
if (root.listExtensionsUsed().some((e) => e instanceof KHRDracoMeshCompression)) {
  console.error(
    `\nRefusing to run: "${IN}" is already Draco-compressed.\n` +
      `Point the script at your original high-res master instead.\n`
  );
  process.exit(1);
}

// Map each texture to the material slot that uses it (so we pick the right quality).
const role = new Map();
for (const mat of root.listMaterials()) {
  const tag = (tex, name) => tex && role.set(tex, name);
  tag(mat.getBaseColorTexture(), "baseColor");
  tag(mat.getNormalTexture(), "normal");
  tag(mat.getMetallicRoughnessTexture(), "metalRough");
  tag(mat.getEmissiveTexture(), "emissive");
  tag(mat.getOcclusionTexture(), "occlusion");
}

// Lossless structural cleanup.
await doc.transform(dedup(), prune());

// Re-encode every texture at its native resolution (no resize).
for (const tex of root.listTextures()) {
  const cfg = TEXTURE[role.get(tex) || "baseColor"];
  const before = tex.getImage().byteLength;
  const out = await sharp(Buffer.from(tex.getImage()))
    .jpeg({ quality: cfg.quality, chromaSubsampling: cfg.chromaSubsampling, mozjpeg: true })
    .toBuffer();
  tex.setImage(new Uint8Array(out)).setMimeType("image/jpeg");
  console.log(
    `  texture[${role.get(tex) || "baseColor"}]  ${(before / 1048576).toFixed(2)}MB -> ${(out.length / 1048576).toFixed(2)}MB`
  );
}

// Draco geometry compression (high quantization = visually lossless).
await doc.transform(
  draco({
    method: "edgebreaker",
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
    quantizeColor: 16,
    quantizeGeneric: 14,
  })
);

await io.write(OUT, doc);

const a = fs.statSync(IN).size;
const b = fs.statSync(OUT).size;
console.log(
  `\nDONE  ${(a / 1048576).toFixed(2)}MB -> ${(b / 1048576).toFixed(2)}MB  ` +
    `(${(100 * (1 - b / a)).toFixed(1)}% smaller, ${(a / b).toFixed(1)}x)\n`
);
