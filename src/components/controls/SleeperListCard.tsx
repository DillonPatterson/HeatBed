import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SleeperListCardProps {
  sleepers: Sleeper[];
  selectedSleeperId: string | null;
  onSelectSleeper: (id: string) => void;
  onAddSleeper: (type: SleeperType) => void;
  onRemoveSleeper: (id: string) => void;
}

const typeLabels: Record<SleeperType, string> = {
  adult: 'Adult',
  child: 'Child',
  dog: 'Dog',
  cat: 'Cat',
};

export const SleeperListCard = ({
  sleepers,
  selectedSleeperId,
  onSelectSleeper,
  onAddSleeper,
  onRemoveSleeper,
}: SleeperListCardProps) => (
  <Panel title="Sleeper List" eyebrow="Household" actions={<span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{sleepers.length}/8</span>}>
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(['adult', 'child', 'dog', 'cat'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onAddSleeper(type)}
            disabled={sleepers.length >= 8}
            className="action-btn bg-[#f6efe5] text-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + {typeLabels[type]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sleepers.map((sleeper) => (
          <div
            key={sleeper.id}
            className={`rounded-[1.1rem] border px-3 py-3 transition ${selectedSleeperId === sleeper.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white/80 text-stone-800'}`}
          >
            <button type="button" onClick={() => onSelectSleeper(sleeper.id)} className="flex w-full items-start justify-between gap-3 text-left">
              <div>
                <div className="font-semibold">{sleeper.name}</div>
                <div className={`text-xs uppercase tracking-[0.16em] ${selectedSleeperId === sleeper.id ? 'text-stone-300' : 'text-stone-500'}`}>
                  {typeLabels[sleeper.type]} · {Math.round(sleeper.weightLb)} lb · {sleeper.thermalTendency}
                </div>
              </div>
              <span
                className="mt-1 h-3.5 w-3.5 rounded-full border border-white/30"
                style={{ backgroundColor: sleeper.color }}
              />
            </button>
            <button
              type="button"
              onClick={() => onRemoveSleeper(sleeper.id)}
              className={`mt-3 text-xs font-semibold uppercase tracking-[0.16em] ${selectedSleeperId === sleeper.id ? 'text-red-200' : 'text-red-600'}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);
