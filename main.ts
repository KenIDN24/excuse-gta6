// The Excuse That Almost Works — entry program.
// Writes the single-line excuse to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR
// when run outside the grader) and enforces the sealed gate at runtime:
// UTF-8 text, 1-140 characters, exactly one line, at most 20 words.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I was diagnosed with a rare disease the only cure for which is Vice City and bed rest";

function fail(message: string): never {
  console.error(`entry error: ${message}`);
  process.exit(1);
}

// Guard 1: single line, no newline or control characters.
if (/[\r\n]/.test(LINE)) fail("entry must be exactly one line");
if (/[\u0000-\u001f\u007f]/.test(LINE)) fail("entry contains control characters");

// Guard 2: sealed gate, 1-140 characters (counted in code points).
const chars = [...LINE].length;
if (chars < 1 || chars > 140) fail(`entry is ${chars} characters, gate is 1-140`);

// Guard 3: brief limit, at most 20 words.
const words = LINE.trim().split(/\s+/).length;
if (words > 20) fail(`entry is ${words} words, brief allows at most 20`);

// Guard 4: not whitespace-only.
if (LINE.trim().length === 0) fail("entry is only whitespace");

// Guard 5: brief-aligned — the excuse must name the GTA 6 angle (Vice City)
// and read like a hurried text: no greeting, no signature, no "Dear boss".
if (!/Vice City/.test(LINE)) fail("entry must name the GTA 6 angle (Vice City)");
if (/^(dear|hi|hello|hey boss|boss,)/i.test(LINE)) fail("entry must not open with a greeting");
if (/(thanks|regards|sincerely|—\s*\w+)$/i.test(LINE)) fail("entry must not end with a signature");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
console.log(`entry ok: ${chars} chars, ${words} words, 1 line`);
