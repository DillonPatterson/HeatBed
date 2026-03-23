# Bed Heat Simulator

Bed Heat Simulator is a dark, playful web app for building an overheated sleep setup and watching the mattress tell the truth.

Drag adults, kids, dogs, and cats onto the bed, pile them up, and watch the live heat map react in real time.

## Click-To-Open Local Version

Run this once whenever you want a fresh standalone file:

```bash
npm install
npm run build
```

That build now generates [launch.html](C:\Users\dillo\Desktop\BedHeatMap\launch.html) in the repo root.

After that, double-click [launch.html](C:\Users\dillo\Desktop\BedHeatMap\launch.html) from Windows Explorer. It opens with `file://` and does not need `npm run dev` or a local web server.

## Windows Launcher

If you want the live dev version instead, double-click [Launch-BedHeatSimulator.cmd](C:\Users\dillo\Desktop\BedHeatMap\Launch-BedHeatSimulator.cmd).

That launcher starts Vite locally and opens the app in your browser automatically.

## Dev Mode

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

`npm run build` also regenerates the standalone [launch.html](C:\Users\dillo\Desktop\BedHeatMap\launch.html).

## Product Shape

- Big stage-first bed scene
- Compact bed setup controls
- Sleeper tray for building the pile
- Selected sleeper editor with advanced tweaks hidden by default
- Live Gaussian-style heat field with contact intensification
- Estimated temperature ranges in F and C
- Local persistence with migration for theme-safe sleeper colors
- Dark export screenshots that match the live app

## Notes

- This is a believable consumer toy, not a scientific instrument.
- The thermal model is intentionally lightweight and responsive.
- Export is still a download action, not a hosted share flow.
