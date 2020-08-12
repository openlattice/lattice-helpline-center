// @flow
import {
  List,
  Map,
  OrderedMap,
  fromJS,
  getIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DateTime } from 'luxon';
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

const formatAggregateResultsData = (questions :Map, answers :Map, surveyAnswersByQuestion :Map, surveys :Map) :List => {
  const aggregateResults :List = fromJS(CATEGORY_BY_QUESTION_NUMBER)
    .sortBy((category, number) => parseInt(number, 10))
    .reduce((grouped, category, number) => {
      const entry = questions.findEntry((q) => getPropertyValue(q, PropertyTypes.CODE) === number);
      if (entry) {
        const [questionId, question] = entry;

        // for each survey, find matching answer for question
        const title = getPropertyValue(question, PropertyTypes.TITLE);
        const data = [];
        surveyAnswersByQuestion.forEach((answerByQuestion, surveyId) => {
          const survey = surveys.get(surveyId);
          const answerId = answerByQuestion.get(questionId);
          const answer = answers.get(answerId);

          const surveyDate :string = getPropertyValue(survey, PropertyTypes.DATE_TIME);
          const score :number = getPropertyValue(answer, PropertyTypes.SCORE_VALUE);
          const scoreCategory :string = getPropertyValue(answer, PropertyTypes.SCORE_CATEGORY);
          const date = DateTime.fromISO(surveyDate).toLocaleString(DateTime.DATE_SHORT);

          data.push({
            date,
            score,
            scoreCategory,
          });
        });
        const aggregateQuestion = Map({
          data,
          id: questionId,
          title,
        });

        return grouped.push(aggregateQuestion);
      }
      return grouped;
    }, List());

  return aggregateResults;
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
  formatAggregateResultsData,
  formatSurveyData,
  getFirstLastFromPerson,
  getRelativeRoot,
};
