import React from 'react';

import { createMockSufficiencyData, createMockSurveyHistoryData } from './utils';

import { PropertyTypes } from '../../../core/edm/constants';
import {
  ProfileContainer,
} from '..';

const {
  DOB,
  GIVEN_NAME,
  SURNAME,
} = PropertyTypes;

export default {
  title: 'Profile Container',
  component: ProfileContainer,
};

const data = createMockSufficiencyData();
const imageUrl = 'https://vignette.wikia.nocookie.net/spongebob/images/4/4f/One_Krabs_Trash_091.jpg/revision/latest?cb=20181228163723';
const needs = ['Food', 'Employment', 'Childcare'];
const person = {
  [GIVEN_NAME]: ['Smitty'],
  [SURNAME]: ['Werbenjagermanjensen'],
  [DOB]: ['2002-02-22']
};
const surveys = createMockSurveyHistoryData();

export const ProfileContainerStory = () => (
  <ProfileContainer
      imageUrl={imageUrl}
      data={data}
      person={person}
      needs={needs}
      surveys={surveys} />
);

ProfileContainerStory.story = {
  name: 'Profile Container'
};
