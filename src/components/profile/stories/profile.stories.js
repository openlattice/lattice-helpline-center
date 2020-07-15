import React from 'react';

import ProfileCard from '..';
import { PropertyTypes } from '../../../core/edm/constants';

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
      person={{
        [GIVEN_NAME]: ['Smitty'],
        [SURNAME]: ['Werbenjagermanjensen'],
        [DOB]: ['1991-09-02']
      }} />
);

ToStorybook.story = {
  name: 'Profile Card'
};
