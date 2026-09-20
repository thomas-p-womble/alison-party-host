# Alison Party Host 🎂

Mobile-first **Progressive Web App** for hosting Alison’s birthday party games on **iPhone Safari** (Add to Home Screen). Pink/lilac UI, huge tap targets, scores in `localStorage`.

**Audio plays inside the app** via a **hidden YouTube IFrame** (audio-only dock) or optional **local HTML5 audio** for purchased files. No cinematic video UI. No full lyrics. No bundled MP3 binaries.

## Quick start on iPhone (recommended)

YouTube’s player usually **does not work from `file://`**. Serve the folder over HTTP on the same Wi‑Fi, then open in Safari:

### On a laptop (same Wi‑Fi as the phone)

```bash
cd alison-party-host
python3 -m http.server 8080
```

Or:

```bash
npx --yes serve .
```

1. Note the laptop’s local IP (e.g. `192.168.1.42`).
2. On the iPhone, open Safari → `http://192.168.1.42:8080/`  
   (or open `Alison-Party-Host.html` via that server path).
3. Tap **▶** on the bottom mini player (first tap unlocks audio).
4. Optional: Share → **Add to Home Screen** → name **Alison Party**.

### Single file

`Alison-Party-Host.html` is a self-contained copy (CSS + JS inlined). Prefer serving it over HTTP the same way:

```bash
python3 -m http.server 8080
# then open http://<laptop-ip>:8080/Alison-Party-Host.html
```

If you open the file directly in Files/Safari (`file://`), games still work but YouTube may stay blocked — use the tiny server above.

## Playlist (audio-focused YouTube + optional local files)

YouTube iframe is **visually hidden** (audio only). Prefer Topic / Official Audio / lyric audio.

| # | Song | YouTube ID | Kind | Local filename hint |
|---|------|------------|------|---------------------|
| 1 | Choosin' Texas — Ella Langley | `xukbqwRuN5w` | Topic (audio) | `01-choosing-texas.mp3` |
| 2 | You Belong With Me — Taylor Swift | `uD8d1KrDQcY` | Topic (TV) | `02-you-belong-with-me.mp3` |
| 3 | Sweet Caroline — Neil Diamond | `4F_RCWVoL4s` | Official Audio | `03-sweet-caroline.mp3` |
| 4 | Eye of the Tiger — Survivor | `S-LO6dctBms` | Topic | `04-eye-of-the-tiger.mp3` |
| 5 | Don't Stop Believin' — Journey | `1k8craCGpgs` | Official Audio | `05-dont-stop-believin.mp3` |
| 6 | 22 — Taylor Swift | `xGWTv4IQ7vQ` | Topic (TV) | `06-22.mp3` |
| 7 | Roar — Katy Perry | `9VcDnWMOBtw` | Topic | `07-roar.mp3` |
| 8 | Party in the USA — Miley Cyrus | `R1kOdTm9FBk` | Topic | `08-party-in-the-usa.mp3` |
| 9 | Shake It Off — Taylor Swift | `H59xVMF4zxE` | Topic (TV) | `09-shake-it-off.mp3` |

**Local audio:** use **Load my song files** (purchased tracks) or place numbered files in the same folder when serving over HTTP — local wins over YouTube.

Audio dock: **Play/Pause · Mute/Unmute · Prev/Next · title**. Games use the same player (Freeze = pause, Lyric MUTE NOW = mute, Hot Potato stop = pause).

## Games

| Screen | What it does |
|--------|----------------|
| **Name That Tune** | Teams A/B/C scores, first-tap buzz, play/pause clip |
| **3-2-1 Show** | Wipe-board reveal countdown |
| **Sing-Along Cue** | **Auto Sing** starts each song from the beginning, mutes only the catchiest shout/title hook (~3–8s), then unmutes; manual MUTE override (no full lyrics) |
| **Freeze Dance** | PLAY / FREEZE controls in-app music + eliminate counter |
| **Hot Potato / Prize Pass** | Auto music from separate tween playlist; random 8–22s secret stop |
| **Alison Quizmaster** | Rotates who asks next; editable roster |
| **Alison Quiz** | How Well Do You Know Alison? — 10 open-ended Qs + team A/B/C scores |
| **Timers** | 1 / 3 / 5 / 10 minute presets |

## Files

```
alison-party-host/
  Alison-Party-Host.html   ← single-file (best for AirDrop + local server)
  index.html
  styles.css
  app.js
  manifest.json
  sw.js
  icons/
  README.md
```

## Notes

- Scores and roster persist via `localStorage`.
- Sing-along mode never stores copyrighted lyric text — only host mute/finish cues.
- **Auto Sing:** songs always `startAt = 0` (from the beginning). Only a short catchy hook is muted (~8–12 seconds), then audio unmutes automatically.
- Keep the phone awake / plugged in during the party.

Party ASAP. Have fun! 🎉
