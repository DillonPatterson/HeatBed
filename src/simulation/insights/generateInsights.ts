import type { BlanketProfile, HeatField, Sleeper } from '../../types';

const listNames = (names: string[]) => {
  if (names.length === 0) return 'nobody in particular';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

export const generateInsights = ({
  sleepers,
  heatField,
  blanket,
}: {
  sleepers: Sleeper[];
  heatField: HeatField;
  blanket: BlanketProfile;
}) => {
  const nameLookup = new Map(sleepers.map((sleeper) => [sleeper.id, sleeper.name]));
  const hotspotNames = heatField.summary.hotspot.dominantSleeperIds
    .map((id) => nameLookup.get(id))
    .filter((name): name is string => Boolean(name));
  const coolspotNames = heatField.summary.coolspot.dominantSleeperIds
    .map((id) => nameLookup.get(id))
    .filter((name): name is string => Boolean(name));

  const insights = [
    `The warmest zone is ${heatField.summary.hotspot.zoneLabel}, driven mostly by ${listNames(hotspotNames)}.`,
    `The coolest pocket stays around the ${heatField.summary.coolspot.zoneLabel}${coolspotNames.length ? `, away from ${listNames(coolspotNames)}` : ''}.`,
  ];

  if (heatField.summary.overlapCount > 4) {
    insights.push(
      `${Math.round(heatField.summary.overlapCount)} overlap contacts are creating a serious shared heat pocket near the middle lanes.`,
    );
  } else if (heatField.summary.overlapCount > 0) {
    insights.push('A few direct contact zones are intensifying the hottest patch more than body size alone would suggest.');
  } else {
    insights.push('Bodies are spaced enough that the bed is warming in separate islands instead of one giant heat blob.');
  }

  insights.push(`${blanket.label} keeps this layout ${blanket.note.toLowerCase()}`);
  return insights.slice(0, 4);
};
