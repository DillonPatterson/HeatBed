# Architecture Notes

## Overview

The app is split into four main layers:

1. Data/config
   - Bed sizes, blanket profiles, species rigs, dog breeds, and cat presets live in `src/data`.
   - Species-specific behavior is driven by configuration rather than hardcoded branches in UI components.

2. State and feature orchestration
   - `src/store/appStore.ts` owns persisted app state and editing actions.
   - Feature helpers in `src/features` handle bed helpers, sleeper creation, environment defaults, and sharing.

3. Simulation
   - `src/simulation/presets` resolves the active species/breed profile.
   - `src/simulation/kinematics` turns pose state into world-space segments.
   - `src/simulation/thermal` converts segments into a heat field and readable temperature ranges.
   - `src/simulation/insights` derives deterministic plain-English summaries from the field.

4. Presentation
   - `src/components/controls` contains editor and setup panels.
   - `src/components/stage` renders the mattress, heat map canvas, and articulated SVG bodies.
   - `src/components/figures` keeps gesture handling isolated from the rest of the stage.
   - `src/app/AppShell.tsx` only composes the main layout.

## Interaction Model

- Whole-body drag updates the sleeper root position.
- Rotation uses a dedicated top handle.
- Joint handles and sliders both mutate the same `poseState`, so the visual stage and control panel stay synchronized.

## Simulation Pipeline

1. Resolve profile multipliers from sleeper type and breed preset.
2. Build world-space body segments from root position, rotation, and pose angles.
3. Sample each segment into Gaussian heat splats.
4. Add contact splats where different sleepers are close together.
5. Accumulate a scalar heat field on a fixed-resolution bed grid.
6. Extract hotspot/coolspot summaries and convert normalized field strength into estimated temperature ranges.
7. Render the heat field in Canvas and show deterministic insights in the UI.

## Key Tradeoffs

- The articulated rigs are simplified capsules and circles rather than anatomical meshes or IK.
- The thermal engine is intentionally believable rather than scientifically exhaustive.
- Joint editing is limited to a small set of useful segments so the MVP stays fast and understandable.
- Canvas rendering is grid-based and lightweight enough for realistic 5-8 sleeper use without premature complexity.
