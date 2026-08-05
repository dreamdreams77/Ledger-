# Ledger of the Lost

A noir afterlife roguelite. You die; the paperwork doesn't. Report to the Department of Postmortem Affairs, descend eight floors of the Filing Department, and collect back the pieces of one evening you already lived, before any of this needed filing.

Built at the crossing of three influences: the deadpan, department-issue melancholy of **Grim Fandango**, the point-and-click logic and insult-trading of **Monkey Island**, and the shard-and-Limit-Break structure of **Final Fantasy VII**, its lead influence throughout.

Single HTML file. No build step, no bundler, no asset pipeline ... every sprite, tile, and effect is drawn procedurally on a `<canvas>` at runtime. Two CDN dependencies (Three.js, for the first-person memory sequence; Matter.js, for the physics vault), both optional in the sense that the game degrades gracefully to a text-only fallback if either fails to load.

## Playing it

Open `index.html` in a browser. That's the whole install. Works on desktop (keyboard) and touch (on-screen D-pad + ACT button); a gamepad is picked up automatically if one's connected. Full controls and every system are documented in-game under **☰ MENU → 📕 Procedures Manual**.

## Installing it as a phone app

This repo is set up as an installable PWA:

1. Push this repo to GitHub, keeping `index.html`, `manifest.json`, `sw.js`, and the `icons/` folder all in the same directory.
2. Turn on **GitHub Pages** for the repo (Settings → Pages → deploy from the branch/root).
3. Open the Pages URL on a phone, then use the browser's **Add to Home Screen** (Chrome on Android) or **Share → Add to Home Screen** (Safari on iOS).
4. It launches standalone from there ... full-screen, its own icon, and it keeps working offline after the first load (`sw.js` caches the app shell).

No server-side anything. Static files only.

## Project structure

```
index.html      the whole game: markup, styles, and game logic in one file
manifest.json   PWA metadata (name, icons, display mode)
sw.js           minimal offline cache (network-first for index.html, cache-first for everything else)
icons/          app icons at the sizes iOS/Android ask for
favicon.ico     browser-tab icon fallback for anything that ignores the <link> tag
.nojekyll       tells GitHub Pages to serve these files as-is, no Jekyll processing
```

## How it's built, for anyone curious

- **Rendering**: two stacked `<canvas>` elements ... a 2D canvas for the hub/dungeon/puzzle/archive views, and a 3D canvas (Three.js) for the single first-person sequence. Only one is ever visible at a time.
- **State**: one plain `state` object, no framework. UI panels (inventory, bestiary, duels, the rulebook, the exhibits) are built with direct DOM calls into a couple of reusable overlay containers, styled per "mode" via a CSS class on the container.
- **Persistence**: `localStorage`, wrapped in `try/catch` throughout ... a blocked or full storage quota degrades to "just don't save" rather than crashing anything.
- **Dungeon generation**: seeded PRNG (`mulberry32`), so a run's layout is reproducible from its seed if you want to compare notes or debug something specific.
- **Everything is additive**: shards, trinkets, and their fusions all check ownership before granting anything, so save data from an older version of this file should still load cleanly against a newer one.

## A note, buried in here rather than spelled out

There's more in this build than what's listed above. Some of it you're meant to find by playing normally. A little of it you're meant to find by looking somewhere a player wouldn't usually think to look ... closer to how you'd actually go looking for something, if you were you.

Buona notte, sogni d'oro.
