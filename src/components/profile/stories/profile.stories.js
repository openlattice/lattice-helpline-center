import React from 'react';

import { ProfileCard } from '..';

export default {
  title: 'Profile',
  component: ProfileCard,
};

export const ToStorybook = () => (
  <ProfileCard />
);

ToStorybook.story = {
  name: 'Profile Card'
};
