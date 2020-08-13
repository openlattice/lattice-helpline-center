// @flow
import { DateTime } from 'luxon';

import { PropertyTypes } from '../../../core/edm/constants';

const {
  DATE_TIME,
  NAME,
  ID,
} = PropertyTypes;

const createMockSufficiencyData = (bars :number = 6) :any[] => {
  const data = [];
  for (let i = 0; i < bars; i += 1) {
    data.push({
      y: Math.round(Math.random() * 75),
      x: DateTime.local().minus({ months: bars - i - 1 }).toLocaleString(DateTime.DATE_SHORT)
    });
  }
  return data;
};

const createMockSurveyHistoryData = (count :number = 6) :Object[] => {
  const surveys = [];
  for (let i = 0; i < count; i += 1) {
    surveys.push({
      // $FlowFixMe invalid-computed-prop for FQN
      [NAME]: ['Social Needs Survey'],
      // $FlowFixMe invalid-computed-prop for FQN
      [DATE_TIME]: [DateTime.local().minus({ months: i }).toString()],
      // $FlowFixMe invalid-computed-prop for FQN
      [ID]: [i],
    });
  }

  return surveys;
};

export {
  createMockSufficiencyData,
  createMockSurveyHistoryData,
};
