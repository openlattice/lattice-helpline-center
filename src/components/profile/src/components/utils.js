// @flow
import {
  Map,
  OrderedMap,
  fromJS,
  getIn,
} from 'immutable';
import { Constants } from 'lattice';
import type { Match } from 'react-router';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue } from '../../../../utils/EntityUtils';
import { CATEGORY_BY_QUESTION_NUMBER } from '../sagas/constants';

const { OPENLATTICE_ID_FQN } = Constants;

const getFirstLastFromPerson = (person :Map | Object) => {
  const firstName = getIn(person, [PropertyTypes.GIVEN_NAME, 0], '').trim();
  const last = getIn(person, [PropertyTypes.SURNAME, 0], '').trim();

  return `${firstName} ${last}`;
};

const formatSurveyData = (questions :Map, answers :Map, answersByQuestion :Map) :OrderedMap => {
  const surveyData = fromJS(CATEGORY_BY_QUESTION_NUMBER)
    .sortBy((category, number) => parseInt(number, 10))
    .reduce((grouped, category, number) => {
      const question = questions.find((q) => getPropertyValue(q, PropertyTypes.CODE) === number);
      if (question) {
        const questionId = getPropertyValue(question, OPENLATTICE_ID_FQN);
        const answerId = answersByQuestion.get(questionId);
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

const getRelativeRoot = (root :string, match :Match) => {
  if (match.params) {
    return Object.entries(match.params)
      // $FlowFixMe
      .reduce((newRoot, [param, value]) => newRoot.replace(RegExp(`:${param}`, 'g'), value), root);
  }
  return root;
};

export {
  formatSurveyData,
  getFirstLastFromPerson,
  getRelativeRoot,
};
