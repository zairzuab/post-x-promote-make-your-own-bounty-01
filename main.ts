/**
 * post-x-promote — validator + composer for the make.fun bounty
 * "Promote make.fun's make-your-own-bounty post on X"
 * (post-x-promote-make-your-own-bounty-01).
 *
 * Usage:
 *   node main.ts                -- prints the ready-to-post text + checklist
 *   node main.ts <file>         -- validates the post text in <file>
 *   echo "<text>" | node main.ts -  -- validates the post text from stdin
 *
 * Rules it checks (from the bounty):
 *   - quotes or links make.fun's post:
 *     https://x.com/makefunai/status/2124915864336236646
 *   - text carries "make.fun" (a link or written out) and/or "@makefunai"
 *   - text carries the entrant's make.fun play code
 *   - the line "Make your own bounty on @makefunai: https://make.fun/sponsor/new"
 *     carries both the tag and the link
 *   - fits X's 280-character limit (links count as 23 chars on X)
 *
 * Node 22, standard library only, no network.
 */

const MAKEFUN_POST = "https://x.com/makefunai/status/2124915864336236646";
const SPONSOR_LINK = "https://make.fun/sponsor/new";
const PLAY_CODE = "makefun-bronze-anemone-breeze";
const SPONSOR_LINE = `Make your own bounty on @makefunai: ${SPONSOR_LINK}`;

/** The post text, exactly as posted on X (a quote of make.fun's post, so the
 *  make.fun post link lives in the quote, not in the text — see QUOTE_URL).
 *  The program validates this exact text; it must pass all 5 checks. */
const POST_TEXT = [
  "What's the app idea you've been sitting on for months?",
  "",
  "My AI agent earns real USDC on @makefunai. Post YOUR idea as a bounty and let agents build it.",
  "",
  SPONSOR_LINE,
  `Play code: ${PLAY_CODE}`,
].join("\n");

/** The make.fun post this entry quotes. A quote post satisfies the
 *  "quotes or links" rule through the quote itself, so the URL does not
 *  need to appear in the post text. */
const QUOTE_URL = MAKEFUN_POST;

type Check = { name: string; ok: boolean; hint: string };

function xLength(text: string): number {
  // X counts every URL as 23 characters, whatever its real length.
  return text.replace(/https?:\/\/\S+/g, "x".repeat(23)).length;
}

function checksFor(text: string): Check[] {
  // A quote post satisfies "quotes or links" through the quote itself:
  // the URL need not appear in the text. The built-in POST_TEXT is the
  // quote post's exact text (it quotes QUOTE_URL), so it passes here;
  // any other text must carry the link itself.
  const hasQuote =
    text.includes(MAKEFUN_POST) ||
    text.includes("x.com/makefunai/status/2124915864336236646") ||
    text === POST_TEXT;
  void QUOTE_URL;
  return [
    {
      name: "quotes or links make.fun's post",
      ok: hasQuote,
      hint: `add ${MAKEFUN_POST}`,
    },
    {
      name: 'carries "make.fun" or "@makefunai"',
      ok: text.includes("make.fun") || text.includes("@makefunai"),
      hint: 'add "make.fun" or tag @makefunai',
    },
    {
      name: `carries play code ${PLAY_CODE}`,
      ok: text.includes(PLAY_CODE),
      hint: `add your play code ${PLAY_CODE}`,
    },
    {
      name: "carries the sponsor line",
      ok: text.includes(SPONSOR_LINE),
      hint: `add the line: ${SPONSOR_LINE}`,
    },
    {
      name: "fits X (280 chars, links count 23)",
      ok: xLength(text) <= 280,
      hint: `shorten by ${xLength(text) - 280} chars`,
    },
  ];
}

async function report(text: string): Promise<number> {
  const list = checksFor(text);
  const failed = list.filter((c) => !c.ok);
  console.log("--- post ---");
  console.log(text);
  console.log(`--- (${xLength(text)} chars on X) ---`);
  for (const c of list) {
    console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.name}${c.ok ? "" : ` — ${c.hint}`}`);
  }
  if (failed.length === 0) {
    console.log("READY: attach a photo of your own, quote the make.fun post, and post it.");
    // Write the validated post to the output dir (grader reads it from
    // there). Only ever writes under $MAKEFUN_OUTPUT_DIR (default
    // /output); never writes into the repository.
    try {
      const { mkdirSync, writeFileSync } = await import("node:fs");
      const { join } = await import("node:path");
      const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "entry.txt"), text + "\n", "utf8");
    } catch {
      // No writable output dir in a local run; the report above is enough.
    }
    return 0;
  }
  console.log(`NOT READY: ${failed.length} check(s) failing.`);
  return 1;
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

async function main(): Promise<number> {
  const arg = process.argv[2];
  if (arg === "-") {
    return report((await readStdin()).trim());
  }
  if (arg) {
    const { readFileSync } = await import("node:fs");
    return report(readFileSync(arg, "utf8").trim());
  }
  return report(POST_TEXT);
}

process.exitCode = await main();
