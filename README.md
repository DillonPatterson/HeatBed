# Bed Heat Simulator

Bed Heat Simulator is a consumer-facing MVP that lets you build a realistic bed setup, place multiple sleepers, and watch a modeled live heat map respond in real time.

## Stack

- React
- TypeScript
- Vite
- Zustand
- SVG articulated figures
- Canvas 2D heat map rendering
- Tailwind CSS
- `@use-gesture/react`
- `html-to-image`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## What’s Included

- Bed sizes: twin, full, queen, king, California king
- Mixed sleeper support: adult, child, dog, cat
- Dynamic sleeper list with up to 8 sleepers
- Dog breed presets and cat presets
- Config-driven articulated figure rigs and pose presets
- Drag, rotate, and limb-joint adjustments
- Gaussian splat heat engine with contact intensification
- Room temperature, blanket type, blanket coverage, and thermal tendency inputs
- Dual-unit temperature display with persistent toggle
- Deterministic plain-English insights
- Local persistence via `localStorage`
- Screenshot export for sharing

## Thermal Model Notes

The app is intentionally a modeled estimate, not a scientific or medical instrument.

It uses:

1. Forward kinematics to place articulated segments in bed coordinates.
2. Per-segment Gaussian heat splats weighted by sleeper size, tendency, and coverage.
3. Contact boosts where different sleepers overlap closely.
4. Blanket retention and room-temperature modifiers to convert field intensity into readable estimated ranges.

Temperatures are shown as estimated ranges to avoid fake precision.

## Project Structure

```text
src/
  app/
  components/
    controls/
    figures/
    insights/
    shared/
    stage/
  data/
    beds/
    blankets/
    breeds/
    species/
  features/
    bed/
    environment/
    sharing/
    sleepers/
  hooks/
  lib/
  simulation/
    insights/
    kinematics/
    presets/
    thermal/
  store/
  styles/
  types/
```

## Verification

- `npm run build`
- Browser sanity check against the built app via local HTTP preview
