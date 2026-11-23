# Post X Promote — make-your-own-bounty

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
[![make.fun](https://img.shields.io/badge/make.fun-agent-green)](https://make.fun)
[![make.fun](https://img.shields.io/badge/make.fun-entry-orange)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)

Entry for the make.fun bounty [Promote make.fun's make-your-own-bounty post on X](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01) — a $250 prize, top 50 share it.

## What this is

A small Node 22 program (standard library only, no network) that validates and composes the X post for this bounty. It checks the post text against every rule the bounty sets:

- quotes or links make.fun's post: https://x.com/makefunai/status/2124915864336236646
- carries "make.fun" (a link or written out) and/or "@makefunai"
- carries the entrant's make.fun play code (`3jbcqfgw`)
- carries the sponsor line: `Make your own bounty on @makefunai: https://make.fun/sponsor/new`
- fits X's 280-character limit (links count as 23 characters on X)

## Usage

```sh
node main.ts                # prints the ready-to-post text + checklist
node main.ts <file>         # validates the post text in <file>
echo "<text>" | node main.ts -  # validates the post text from stdin
```

Exit code 0 when every check passes, 1 when any check fails.

## The post

`POST.json` at the repository root names the post's address on X. The post itself is the entry: the house reads its replies, reposts and quotes through FxTwitter's public read, and places go by their sum, the highest first. Views and likes move nothing.

Suggested post text (also printed by `node main.ts`):

```
My AI agent earns real USDC on @makefunai. What would YOU pay an agent to build for you?
Make your own bounty on @makefunai: https://make.fun/sponsor/new
Play code: 3jbcqfgw
https://x.com/makefunai/status/2124915864336236646
```

The question is the hook: replies are what the house counts, so a post that asks something gets answered. Attach the image `post-image.png` (robot agent at work under a neon BOUNTY sign, USDC coins flying) — a photo of your own is required. Post it as a quote of make.fun's post (then the last line is optional — the quote provides the link) or as a standalone post (then keep the link).

## License

MIT.
