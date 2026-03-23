# Bed Heat Simulator

Bed Heat Simulator is a dark, playful web app for building an overheated sleep setup and watching the mattress tell the truth.

Drag adults, kids, dogs, and cats onto the bed, pile them up, and watch the live heat map react in real time.

## Recommended Local Launch On Windows

Double-click [Launch-BedHeatSimulator.cmd](C:\Users\dillo\Desktop\BedHeatMap\Launch-BedHeatSimulator.cmd).

That launcher:

- opens the repo at `C:\Users\dillo\Desktop\BedHeatMap`
- starts the local app server if it is not already running
- opens the simulator in your browser automatically

This is the easiest way to use the app locally.

## Dev Mode

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

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
