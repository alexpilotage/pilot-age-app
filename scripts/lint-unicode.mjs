#!/usr/bin/env node
/**
 * lint-unicode.mjs
 * Détecte les séquences \uXXXX dans les fichiers TSX/JSX
 * qui s'affichent littéralement au lieu d'être interprétées.
 *
 * Usage: node scripts/lint-unicode.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const SRC_DIR = "src";
const EXTENSIONS = [".tsx", ".jsx"];

// Match \uXXXX that is NOT inside a JS expression (rough heuristic:
// we flag all occurrences and let the dev decide)
const UNICODE_ESCAPE_RE = /\\u[0-9a-fA-F]{4}/g;

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else if (EXTENSIONS.includes(extname(entry.name))) {
      yield fullPath;
    }
  }
}

async function main() {
  let issueCount = 0;
  const problems = [];

  for await (const filePath of walkDir(SRC_DIR)) {
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;
      while ((match = UNICODE_ESCAPE_RE.exec(line)) !== null) {
        issueCount++;
        problems.push({
          file: filePath,
          line: i + 1,
          col: match.index + 1,
          sequence: match[0],
        });
      }
    }
  }

  if (issueCount === 0) {
    console.log("\x1b[32m✓ Aucune séquence \\uXXXX détectée dans les fichiers JSX/TSX\x1b[0m");
    process.exit(0);
  } else {
    console.error(`\x1b[31m✗ ${issueCount} séquence(s) \\uXXXX détectée(s) :\x1b[0m\n`);
    for (const p of problems) {
      console.error(`  ${p.file}:${p.line}:${p.col}  →  ${p.sequence}`);
    }
    console.error(
      "\n\x1b[33mUtilisez des caractères UTF-8 natifs (é, è, à, â, ê, ç, etc.) au lieu de séquences d'échappement.\x1b[0m"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Erreur lint-unicode:", err);
  process.exit(1);
});
