import { makeEmptyState } from './factories';
import { Presets } from '../../presets.js';

const deepClone = (value) => JSON.parse(JSON.stringify(value));

export const buildPresetState = (presetId) => {
  if (presetId === 'empty-scratch') {
    return makeEmptyState();
  }

  const preset = Presets && Presets[presetId];
  if (!preset) return null;

  const nextState = deepClone(preset);
  nextState.sections = (nextState.sections || []).map((section) => ({
    type: 'section',
    ...section
  }));
  return nextState;
};
