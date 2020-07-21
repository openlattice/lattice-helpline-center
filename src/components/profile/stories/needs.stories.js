import React from 'react';

import { GreatestNeeds } from '..';

export default {
  title: 'Greatest Needs',
  component: GreatestNeeds,
};

export const ToStorybook = () => (
  <GreatestNeeds needs={['Food', 'Employment', 'Childcare']} />
);

ToStorybook.story = {
  name: 'Greatest Needs'
};
