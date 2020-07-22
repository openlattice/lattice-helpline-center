// @flow
import React from 'react';

import { DateTime } from 'luxon';

import { SelfSufficiencyMatrix } from '..';

export default {
  title: 'Self-Sufficiency Matrix',
  component: SelfSufficiencyMatrix,
};

const createMockData = (bars :number = 6) :any[] => {
  const data = [];
  for (let i = 0; i < bars; i += 1) {
    data.push({
      y: Math.round(Math.random() * 75),
      x: DateTime.local().minus({ months: bars - i - 1 }).toFormat('LL/dd')
    });
  }
  return data;
};

export const ToStorybook = () => (
  <SelfSufficiencyMatrix data={createMockData()} />
);

ToStorybook.story = {
  name: 'Self-Sufficiency Matrix'
};
