#!/usr/bin/env node
/**
 * Remotion video renderer for LinkedIn content.
 * 
 * Usage:
 *   node render.mjs --composition TextReveal --output out/my-video.mp4 --props '{"lines":["Hello","World"],"accentColor":"#6366F1"}'
 *   node render.mjs --composition QuoteCard --output out/quote.mp4 --props '{"quote":"Build fast. Learn faster.","accentColor":"#10B981"}'
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  
  let composition = "TextReveal";
  let outputPath = "out/video.mp4";
  let propsJson = "{}";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--composition" && args[i + 1]) {
      composition = args[i + 1];
      i++;
    } else if (args[i] === "--output" && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === "--props" && args[i + 1]) {
      propsJson = args[i + 1];
      i++;
    }
  }

  const inputProps = JSON.parse(propsJson);

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Bundling Remotion project...`);

  const entry = path.join(__dirname, "src", "index.ts");
  const bundleLocation = await bundle({
    entryPoint: entry,
    webpackOverride: (config) => config,
  });

  console.log(`Selecting composition: ${composition}`);
  const comp = await selectComposition({
    serveUrl: bundleLocation,
    id: composition,
    inputProps,
  });

  console.log(`Rendering to: ${outputPath}`);
  await renderMedia({
    composition: comp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      if (Math.floor(progress * 100) % 10 === 0) {
        console.log(`  Progress: ${Math.floor(progress * 100)}%`);
      }
    },
  });

  console.log(`Done! Video saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
