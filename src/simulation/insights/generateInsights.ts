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

  const hotspotLead = listNames(hotspotNames);
  const coolspotLead = coolspotNames.length > 0 ? `away from ${listNames(coolspotNames)}` : 'where nobody is really camping out';
  const insights = [
    hotspotNames.length > 0
      ? `${hotspotLead} are turning the ${heatField.summary.hotspot.zoneLabel} into the hot side of the bed.`
      : `The ${heatField.summary.hotspot.zoneLabel} is winning the heat race right now.`,
    `The coolest escape hatch is ${heatField.summary.coolspot.zoneLabel}, ${coolspotLead}.`,
  ];

  if (heatField.summary.overlapCount > 10) {
    insights.push(
      `${Math.round(heatField.summary.overlapCount)} contact boosts means this setup is paying a serious cuddle tax.`,
    );
  } else if (heatField.summary.overlapCount > 3) {
    insights.push(
      `${Math.round(heatField.summary.overlapCount)} overlap contacts are stacking heat faster than body size alone would suggest.`,
    );
  } else if (heatField.summary.overlapCount > 0) {
    insights.push('A couple of direct contact patches are making the hottest zone flare up early.');
  } else {
    insights.push('Everybody is spaced out enough that the mattress is warming in separate little islands.');
  }

  if (blanket.id === 'none') {
    insights.push('No blanket means the edges leak heat fast, so the warm spots stay punchy instead of spreading softly.');
  } else {
    insights.push(`${blanket.label} helps the warmth linger, which makes the hot side feel extra believable.`);
  }

  return insights.slice(0, 4);
};
