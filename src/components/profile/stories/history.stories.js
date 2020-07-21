import React from 'react';

import { DateTime } from 'luxon';

import { PropertyTypes } from '../../../core/edm/constants';
import { SurveyHistory } from '..';

const {
  OL_DATE_TIME,
  NAME,
  OL_ID,
} = PropertyTypes;

export default {
  title: 'Survey History',
  component: SurveyHistory,
};

const surveys = [
  {
    [NAME]: ['Social Needs Survey'],
    [OL_DATE_TIME]: [DateTime.local().toString()],
    [OL_ID]: [0],
  },
  {
    [NAME]: ['Social Needs Survey'],
    [OL_DATE_TIME]: [DateTime.local().plus({ days: 1 }).toString()],
    [OL_ID]: [1],
  }
];

export const ToStorybook = () => (
  <SurveyHistory surveys={surveys} />
);

ToStorybook.story = {
  name: 'Survey History'
};
