import { useEffect, useMemo, useState } from 'react';
import { dogBreeds } from '../../data/breeds/dogBreeds';
import { catPresets } from '../../data/species/catPresets';
import { getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import type { SleeperType, ThermalTendency } from '../../types';
import type { HumanPresentation } from '../../features/sleepers/sleeperColors';

export interface SleeperIntakePayload {
  type: SleeperType;
  name: string;
  weightLb: number;
  thermalTendency: ThermalTendency;
  breedId?: string;
  presentation?: HumanPresentation;
}

interface SleeperIntakeModalProps {
  type: SleeperType;
  onClose: () => void;
  onConfirm: (payload: SleeperIntakePayload) => void;
}

const typeTitles: Record<SleeperType, string> = {
  adult: 'Add adult',
  child: 'Add kid',
  dog: 'Add dog',
  cat: 'Add cat',
};

const defaultHumanHeight = {
  adult: { feet: 5, inches: 9 },
  child: { feet: 4, inches: 2 },
};

const suggestHumanWeight = (type: 'adult' | 'child', feet: number, inches: number) => {
  const totalInches = Math.max(feet * 12 + inches, type === 'adult' ? 58 : 42);
  const bmiTarget = type === 'adult' ? 24 : 18;
  return Math.max(
    type === 'adult' ? 100 : 30,
    Math.round((bmiTarget * totalInches * totalInches) / 703),
  );
};

export const SleeperIntakeModal = ({
  type,
  onClose,
  onConfirm,
}: SleeperIntakeModalProps) => {
  const species = getSpeciesProfile(type);
  const isHuman = type === 'adult' || type === 'child';
  const breedOptions = type === 'dog' ? dogBreeds : type === 'cat' ? catPresets : [];
  const defaultBreedId = breedOptions[0]?.id ?? '';

  const [name, setName] = useState('');
  const [feet, setFeet] = useState(defaultHumanHeight.adult.feet);
  const [inches, setInches] = useState(defaultHumanHeight.adult.inches);
  const [presentation, setPresentation] = useState<HumanPresentation>('other');
  const [thermalTendency, setThermalTendency] = useState<ThermalTendency>('neutral');
  const [breedId, setBreedId] = useState(defaultBreedId);
  const [breedQuery, setBreedQuery] = useState('');
  const [weightLb, setWeightLb] = useState(species.defaultWeightLb);

  useEffect(() => {
    setName('');
    setThermalTendency('neutral');
    setPresentation('other');

    if (type === 'adult' || type === 'child') {
      const defaults = defaultHumanHeight[type];
      setFeet(defaults.feet);
      setInches(defaults.inches);
      setWeightLb(suggestHumanWeight(type, defaults.feet, defaults.inches));
      setBreedId('');
      setBreedQuery('');
      return;
    }

    const firstBreed = breedOptions[0];
    setBreedId(firstBreed?.id ?? '');
    setBreedQuery('');
    setWeightLb(firstBreed?.defaultWeightLb ?? species.defaultWeightLb);
  }, [breedOptions, species.defaultWeightLb, type]);

  const filteredBreeds = useMemo(() => {
    if (type !== 'dog' || !breedQuery.trim()) {
      return breedOptions;
    }

    const query = breedQuery.trim().toLowerCase();
    return breedOptions.filter((breed) => breed.label.toLowerCase().includes(query));
  }, [breedOptions, breedQuery, type]);

  const activeBreed = breedOptions.find((breed) => breed.id === breedId) ?? breedOptions[0];

  const handleHumanHeightChange = (nextFeet: number, nextInches: number) => {
    setFeet(nextFeet);
    setInches(nextInches);
    setWeightLb(suggestHumanWeight(type as 'adult' | 'child', nextFeet, nextInches));
  };

  const handleConfirm = () => {
    onConfirm({
      type,
      name: name.trim() || species.label,
      weightLb,
      thermalTendency,
      breedId: breedId || undefined,
      presentation: isHuman ? presentation : undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="intake-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="panel-eyebrow">
              <span className="panel-dot" style={{ backgroundColor: 'var(--warm)' }} />
              sleeper intake
            </div>
            <div className="modal-title" id="intake-title">
              {typeTitles[type]}
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close sleeper intake">
            ×
          </button>
        </div>

        <div className="modal-body">
          <label>
            <span className="tiny-label">Name</span>
            <input
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={type === 'dog' ? 'Bean' : type === 'cat' ? 'Miso' : 'Riley'}
            />
          </label>

          {isHuman ? (
            <>
              <div>
                <span className="tiny-label">Height</span>
                <div className="height-group">
                  <label>
                    <input
                      type="number"
                      className="field"
                      min={type === 'adult' ? 4 : 2}
                      max={type === 'adult' ? 7 : 5}
                      value={feet}
                      onChange={(event) => handleHumanHeightChange(Number(event.target.value), inches)}
                    />
                  </label>
                  <label>
                    <input
                      type="number"
                      className="field"
                      min={0}
                      max={11}
                      value={inches}
                      onChange={(event) => handleHumanHeightChange(feet, Number(event.target.value))}
                    />
                  </label>
                </div>
                <div className="helper-line" style={{ marginTop: '0.35rem' }}>
                  Height only steers the quick starting weight so adding someone feels less generic.
                </div>
              </div>

              <div>
                <span className="tiny-label">Presentation</span>
                <div className="gender-row">
                  {(['male', 'female', 'other'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`gender-btn ${presentation === option ? 'is-active' : ''}`.trim()}
                      onClick={() => setPresentation(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {type === 'dog' ? (
                <label>
                  <span className="tiny-label">Find breed</span>
                  <input
                    className="field"
                    value={breedQuery}
                    onChange={(event) => setBreedQuery(event.target.value)}
                    placeholder="Search dog breeds"
                  />
                </label>
              ) : null}

              <label>
                <span className="tiny-label">{type === 'dog' ? 'Breed' : 'Cat preset'}</span>
                <select
                  className="field"
                  value={breedId}
                  onChange={(event) => {
                    const nextBreedId = event.target.value;
                    const nextBreed = breedOptions.find((breed) => breed.id === nextBreedId);
                    setBreedId(nextBreedId);
                    setWeightLb(nextBreed?.defaultWeightLb ?? species.defaultWeightLb);
                  }}
                >
                  {(type === 'dog' ? filteredBreeds : breedOptions).map((breed) => (
                    <option key={breed.id} value={breed.id}>
                      {breed.label}
                    </option>
                  ))}
                </select>
              </label>

              {activeBreed ? <div className="helper-line">{activeBreed.blurb}</div> : null}
            </div>
          )}

          <label>
            <span className="tiny-label">Weight (lb)</span>
            <input
              type="number"
              className="field"
              min={species.weightRange[0]}
              max={species.weightRange[1]}
              value={weightLb}
              onChange={(event) => setWeightLb(Number(event.target.value))}
            />
          </label>

          <div>
            <span className="tiny-label">Thermal tendency</span>
            <div className="tendency-row">
              {(['cold', 'neutral', 'warm', 'hot'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  data-t={option}
                  className={`tendency-btn ${thermalTendency === option ? 'is-active' : ''}`.trim()}
                  onClick={() => setThermalTendency(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirm}>
            Add to bed
          </button>
        </div>
      </div>
    </div>
  );
};
