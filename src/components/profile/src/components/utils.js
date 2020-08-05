// @flow
import {
  Map,
  OrderedMap,
  fromJS,
  getIn,
} from 'immutable';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue } from '../../../../utils/EntityUtils';
import { CATEGORY_BY_QUESTION_NUMBER } from '../sagas/constants';

const getFirstLastFromPerson = (person :Map | Object) => {
  const firstName = getIn(person, [PropertyTypes.GIVEN_NAME, 0], '').trim();
  const last = getIn(person, [PropertyTypes.SURNAME, 0], '').trim();

  return `${firstName} ${last}`;
};

const formatSurveyData = (questions :Map, answers :Map) :OrderedMap => {
  const surveyData = fromJS(CATEGORY_BY_QUESTION_NUMBER)
    .sortBy((category, number) => parseInt(number, 10))
    .reduce((grouped, category, number) => {
      const entry = questions.findEntry((q) => getPropertyValue(q, PropertyTypes.CODE) === number);
      if (entry) {
        const [answerId, question] = entry;
        const answer = answers.get(answerId);
        if (grouped.has(category)) {
          return grouped.mergeIn([category], fromJS([{ answer, question }]));
        }
        return grouped.set(category, fromJS([{ answer, question }]));
      }
      return grouped;
    }, OrderedMap());

  return surveyData;
};

export {
  formatSurveyData,
  getFirstLastFromPerson,
};
