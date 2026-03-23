import type { BreedProfile } from '../../types';

export const dogBreeds: BreedProfile[] = [
  { id: 'chihuahua', label: 'Chihuahua', defaultWeightLb: 7, heatMultiplier: 0.95, spreadMultiplier: 0.74, lengthMultiplier: 0.58, widthMultiplier: 0.6, blurb: 'Tiny hotspot, surprisingly intense when tucked in.' },
  { id: 'dachshund', label: 'Dachshund', defaultWeightLb: 20, heatMultiplier: 0.84, spreadMultiplier: 0.86, lengthMultiplier: 0.92, widthMultiplier: 0.7, blurb: 'Long shape creates warm sausaging through the blanket.' },
  { id: 'french-bulldog', label: 'French Bulldog', defaultWeightLb: 24, heatMultiplier: 0.97, spreadMultiplier: 0.9, lengthMultiplier: 0.78, widthMultiplier: 0.88, blurb: 'Compact heater with a dense core.' },
  { id: 'beagle', label: 'Beagle', defaultWeightLb: 24, heatMultiplier: 0.9, spreadMultiplier: 0.92, lengthMultiplier: 0.86, widthMultiplier: 0.82, blurb: 'Moderate heat, broad little cuddle zone.' },
  { id: 'border-collie', label: 'Border Collie', defaultWeightLb: 38, heatMultiplier: 1.03, spreadMultiplier: 1.02, lengthMultiplier: 1.02, widthMultiplier: 0.94, blurb: 'Lean and rangy, spreads heat along the bed.' },
  { id: 'labrador', label: 'Labrador', defaultWeightLb: 65, heatMultiplier: 1.18, spreadMultiplier: 1.08, lengthMultiplier: 1.12, widthMultiplier: 1.06, blurb: 'Classic bed hog with strong mid-bed warming.' },
  { id: 'golden-retriever', label: 'Golden Retriever', defaultWeightLb: 68, heatMultiplier: 1.22, spreadMultiplier: 1.14, lengthMultiplier: 1.14, widthMultiplier: 1.08, blurb: 'Fur and mass make for a soft, wide heat plume.' },
  { id: 'husky', label: 'Husky', defaultWeightLb: 55, heatMultiplier: 0.92, spreadMultiplier: 1.2, lengthMultiplier: 1.08, widthMultiplier: 1.0, blurb: 'Insulated and fluffy, but less concentrated than a bulldog.' },
  { id: 'german-shepherd', label: 'German Shepherd', defaultWeightLb: 70, heatMultiplier: 1.25, spreadMultiplier: 1.16, lengthMultiplier: 1.18, widthMultiplier: 1.05, blurb: 'Large surface area with durable whole-side warming.' },
  { id: 'bernese', label: 'Bernese Mountain Dog', defaultWeightLb: 95, heatMultiplier: 1.38, spreadMultiplier: 1.24, lengthMultiplier: 1.24, widthMultiplier: 1.14, blurb: 'A moving weighted blanket.' },
  { id: 'great-dane', label: 'Great Dane', defaultWeightLb: 120, heatMultiplier: 1.45, spreadMultiplier: 1.28, lengthMultiplier: 1.42, widthMultiplier: 1.18, blurb: 'Huge spread with major overlap potential.' },
  { id: 'mixed-medium', label: 'Mixed Medium Dog', defaultWeightLb: 42, heatMultiplier: 1.0, spreadMultiplier: 1.0, lengthMultiplier: 1.0, widthMultiplier: 1.0, blurb: 'Balanced preset for the classic good mutt.' },
];
