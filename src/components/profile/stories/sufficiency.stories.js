// @flow
import React from 'react';

import { createMockSufficiencyData } from './utils';

import { SelfSufficiencyMatrix } from '..';

export default {
  title: 'Self-Sufficiency Matrix',
  component: SelfSufficiencyMatrix,
};

export const ToStorybook = () => (
  <SelfSufficiencyMatrix data={createMockSufficiencyData()} />
);

ToStorybook.story = {
  name: 'Self-Sufficiency Matrix'
};
