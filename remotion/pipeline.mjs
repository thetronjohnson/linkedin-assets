#!/usr/bin/env node
/**
 * LinkedIn Content Pipeline
 * 
 * Renders a Remotion video, pushes it to the linkedin-assets GitHub repo,
 * and optionally creates a Buffer draft post with the video attached.
 * 
 * Usage:
 *   node pipeline.mjs \
 *     --composition TextReveal \
 *     --name "growth-experiment" \
 *     --props '{"lines":["text here"],"accentColor":"#6366F1"}' \
 *     --text "LinkedIn post text here..."
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

async function main() {
  const args = process.argv.slice(2);

  let composition = "TextReveal";
  let name = `video-${Date.now()}`;
  let propsJson = "{}";
  let postText = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--composition" && args[i + 1]) {
      composition = args[i + 1];
      i++;
    } else if (args[i] === "--name" && args[i + 1]) {
      name = args[i + 1];
      i++;
    } else if (args[i] === "--props" && args[i + 1]) {
      propsJson = args[i + 1];
      i++;
    } else if (args[i] === "--text" && args[i + 1]) {
      postText = args[i + 1];
      i++;
    }
  }

  const inputProps = JSON.parse(propsJson);
  const outputDir = path.join(REPO_ROOT, "queue");
  const outputPath = path.join(outputDir, `${name}.mp4`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 1: Bundle and render
  console.log(`[1/3] Rendering ${composition}...`);
  const entry = path.join(__dirname, "src", "index.ts");
  const bundleLocation = await bundle({
    entryPoint: entry,
    webpackOverride: (config) => config,
  });

  const comp = await selectComposition({
    serveUrl: bundleLocation,
    id: composition,
    inputProps,
  });

  await renderMedia({
    composition: comp,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
  });

  console.log(`  Saved: ${outputPath}`);

  // Step 2: Push to GitHub
  console.log(`[2/3] Pushing to GitHub...`);
  try {
    execSync(`cd ${REPO_ROOT} && git add queue/${name}.mp4`, { stdio: "pipe" });
    execSync(`cd ${REPO_ROOT} && git commit -m "Add video: ${name}"`, { stdio: "pipe" });
    execSync(`cd ${REPO_ROOT} && git push origin main`, { stdio: "pipe" });
    console.log(`  Pushed to GitHub: queue/${name}.mp4`);
  } catch (e) {
    console.error(`  Git push failed: ${e.message}`);
  }

  // Step 3: Output info for Buffer integration
  const rawUrl = `https://raw.githubusercontent.com/thetronjohnson/linkedin-assets/main/queue/${name}.mp4`;
  console.log(`[3/3] Done!`);
  console.log(`\nVideo URL: ${rawUrl}`);
  if (postText) {
    console.log(`\nPost text:\n${postText}`);
  }

  // Output JSON for programmatic use
  const result = {
    videoPath: outputPath,
    videoUrl: rawUrl,
    name: name,
    composition: composition,
    postText: postText,
  };
  
  const resultPath = path.join(__dirname, "out", "last-render.json");
  const outDir = path.join(__dirname, "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  console.log(`\nResult: ${resultPath}`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
