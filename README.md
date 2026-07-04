# Ledger of the Lost

A single-file browser game — a noir afterlife-bureaucracy roguelite that mixes:

- **Pixel-art RPG hub** — talk to three NPCs (plus a hidden fourth) with dialogue that reacts to your progress
- **Roguelike dungeon crawler** — 8 floors across two biomes (Filing Department, then the reskinned "Deep Archive" from floor 6), fog-of-war with a minimap, turn-based combat, three regular enemy types, a boss (floor 3), a miniboss (floor 5), and a two-phase final boss (floor 8)
- **Six FFVII-style ability shards**, each from a distinct source (dungeon pickups, two puzzle vaults, the miniboss, the final boss)
- **Equipment** — a single-slot trinket system (4 trinkets: bonus damage, max HP, crit chance, vision range), offered as an equip/swap choice when found
- **Two puzzle vault types** — a Matter.js physics puzzle and a "lights out" logic puzzle
- **A first-person memory sequence** (Three.js) that branches into two different endings depending on whether you've beaten the final boss
- **New Game+** — after the true ending, carry a reduced level into a fresh case file; also unlocks Nightmare difficulty
- **Juice & sound** — screen shake, particles, floating damage numbers, smoothed motion, synthesized SFX with a volume slider
- **Replayability** — Standard/Hardcore/Nightmare difficulty, an optional dungeon seed for reproducible runs, a run-stats screen, and 8 achievements
- **Quality-of-life** — a quest log (📋 in the title bar) and a settings panel (⚙, volume + colorblind-safe palette toggle)
- **A hidden easter egg** — type `ANDY` anywhere to unlock a visitor
- **The Konami code** — ↑↑↓↓←→←→BA anywhere triggers a full heal, 10 seconds of invincibility, and a confetti burst
- **A very rare joke enemy** — "The Intern (Unpaid)" shows up about 1 in 40 spawns, has 3 HP, and has its own defeat lines
- **Gamepad support** — plug in any standard controller; left stick/d-pad to move, button A to act/dash/advance
- **A bestiary** (🗂 in the title bar) — fills in with each enemy type as you encounter it
- **Ambient music** — a soft synthesized drone loop under the SFX, controlled by the same volume slider
- **A speedrun timer** — live in the HUD, with a persisted best-time tracked across all case files
- **Save export/import** — a shareable "case file code" in Settings, so a save (or a specific seed + progress) can be copied out and loaded back in anywhere

No build step, no assets to manage — it's one `index.html` file. All art is drawn procedurally on `<canvas>`. Playable on desktop (keyboard) or mobile (on-screen d-pad + ACT button).

## Play it locally

Just open `index.html` in a browser. That's it.

## Deploy to GitHub Pages

1. Create a new repo and push these files (`index.html`, this `README.md`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. Your game will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Controls

- `WASD` / Arrow keys / on-screen d-pad — move, attack (bump into enemies), navigate menus and puzzles
- `SPACE` / ACT button — dash (once you've found Hollow Step) / advance dialogue / flip a switch in the Archive puzzle
- Dialogue choices — click/tap
- 📋 / 🗂 / ⚙ / 🔊 in the title bar — quest log, bestiary, settings, mute
- Any standard gamepad works too — left stick/d-pad to move, A to act
- Type `ANDY` any time — you'll know if it worked
- ↑↑↓↓←→←→BA any time — classic cheat code, classic result

## QA notes (for the developer reading this)

A few real bugs were caught and fixed in a review pass:
- The two puzzle rooms (Vault, Archive) had no way to exit without solving them — a genuine softlock risk. There's now a "✕ LEAVE" button plus Escape-key support, and gamepad button A backs out of the Vault too.
- The achievement counter on the stats screen was hardcoded and had drifted out of sync with the actual number of achievements (showed "/10" when there were 12). It now reads `ACHIEVEMENT_IDS.length` instead of a magic number.
- Picking up a trinket mid-dungeon opened a choice dialogue, but the game kept running the enemy turn underneath it — enemies could act (and hit you) before you'd actually made a choice. Turn resolution is now deferred until after the choice.
- Gamepad support only covered grid-based movement (hub/dungeon/archive); the physics Vault puzzle and the memory sequence silently ignored a connected controller. Gamepad input now mirrors onto the same key-state those modes already read, so it works everywhere.

## Design notes for extending it

The whole game lives in `index.html`, organized into clearly labeled sections in the `<script>` block:

1. Global state, leveling, seeded RNG, sound, juice, stats, and the Andy easter egg
2. Procedural pixel sprites (8×8 character-grid sprites)
3. Input handling (keyboard + touch)
4. Hub scene + state-aware NPC dialogue
5. Dungeon generation, fog-of-war, minimap, and combat
6. Matter.js puzzle room (the Vault)
7. The Archive — a lights-out logic puzzle
8. Three.js memory sequence
9. Menu/overlay/panel screens (menu, quest log, settings, win/game over)

A few things worth knowing if you're going to poke at the code:

- **`rng()`** is the seeded generator used only for dungeon layout/spawns (`genDungeon`, `makeEnemy`, the Archive scramble) — combat rolls and enemy wandering still use real `Math.random()`.
- **`TRINKET_DEFS`** is a small, easy-to-extend object — add a new key with a `dmg`/`hp`/`crit`/`vision` field and it's automatically wired into `trinketBonus()`.
- **`state.mode`** now includes `'PANEL'` for the quest log/settings modal — it pauses input the same way `'DIALOGUE'` does.
- **`showWin()`** branches on `state.finalBossDefeated` for the normal vs. true ending; **`startNewGamePlus()`** handles the NG+ carry-over.
- The build stamp in the title bar (top-left) is clickable and cycles through a few dev in-jokes.
- Want to change the byline on the easter egg? Look for `unlockAndy()` and the `talkToNpc` block for `key==='andy'`.

Natural next steps if you want to go further: a true key-remapping UI (currently movement keys are hardcoded), more trinkets/equipment slots, a second memory sequence per ending, line-of-sight raycasting for fog-of-war (currently radius-based), and real pixel-art sprite sheets instead of procedural blocks.



