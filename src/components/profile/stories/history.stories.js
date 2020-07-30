import React from 'react';

import { DateTime } from 'luxon';

import { PropertyTypes } from '../../../core/edm/constants';
import { SurveyHistory } from '..';

const {
  DATE_TIME,
  NAME,
  ID,
} = PropertyTypes;

export default {
  title: 'Survey History',
  component: SurveyHistory,
};

const surveys = [
  {
    [NAME]: ['Social Needs Survey'],
    [DATE_TIME]: [DateTime.local().toString()],
    [ID]: [0],
  },
  {
    [NAME]: ['Social Needs Survey'],
    [DATE_TIME]: [DateTime.local().plus({ days: 1 }).toString()],
    [ID]: [1],
  }
];

export const ToStorybook = () => (
  <SurveyHistory surveys={surveys} />
);

ToStorybook.story = {
  name: 'Survey History'
};
