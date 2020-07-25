import React from 'react';

import { ProfileCard } from '..';

export default {
  title: 'Profile Card',
  component: ProfileCard,
};

export const ToStorybook = () => (
  <ProfileCard />
);

ToStorybook.story = {
  name: 'Profile Card'
};
