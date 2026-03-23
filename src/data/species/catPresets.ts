import type { BreedProfile } from '../../types';

export const catPresets: BreedProfile[] = [
  { id: 'small-shorthair', label: 'Small short-hair', defaultWeightLb: 8, heatMultiplier: 0.82, spreadMultiplier: 0.8, lengthMultiplier: 0.82, widthMultiplier: 0.78, blurb: 'Small, compact warmth with fast curl pockets.' },
  { id: 'medium-shorthair', label: 'Medium short-hair', defaultWeightLb: 11, heatMultiplier: 0.9, spreadMultiplier: 0.9, lengthMultiplier: 0.92, widthMultiplier: 0.88, blurb: 'Balanced cat heat with typical sprawl behavior.' },
  { id: 'long-hair', label: 'Long-hair floof', defaultWeightLb: 12, heatMultiplier: 1.04, spreadMultiplier: 1.04, lengthMultiplier: 0.95, widthMultiplier: 0.96, blurb: 'Fluff creates a softer, wider warm halo.' },
  { id: 'large-cat', label: 'Large cat', defaultWeightLb: 16, heatMultiplier: 1.1, spreadMultiplier: 1.06, lengthMultiplier: 1.08, widthMultiplier: 1.02, blurb: 'Substantial little furnace that claims territory fast.' },
];
