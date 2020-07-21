import React from 'react';

import { PropertyTypes } from '../../../core/edm/constants';
import { ProfileCard } from '..';

const {
  GIVEN_NAME,
  SURNAME,
  DOB,
} = PropertyTypes;

export default {
  title: 'Profile',
  component: ProfileCard,
};

export const ToStorybook = () => (
  <ProfileCard
      imageUrl="https://vignette.wikia.nocookie.net/spongebob/images/4/4f/One_Krabs_Trash_091.jpg/revision/latest?cb=20181228163723"
      person={{
        [GIVEN_NAME]: ['Smitty'],
        [SURNAME]: ['Werbenjagermanjensen'],
        [DOB]: ['2002-02-22']
      }} />
);

ToStorybook.story = {
  name: 'Profile Card'
};

export const DefaultProfileCard = () => (
  <ProfileCard />
);

DefaultProfileCard.story = {
  name: 'Profile Card - default'
};
