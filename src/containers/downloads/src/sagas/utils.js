// @flow
import Papa from 'papaparse';
import fs from 'file-saver';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import { DataUtils } from 'lattice-utils';

import {
  ANSWERS,
  PERSON_BY_SURVEY,
  PROVIDER_BY_PERSON,
  QUESTIONS,
  SURVEYS,
  SURVEY_ANSWERS_BY_QUESTION,
} from './constants';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue, getPropertyValues } from '../../../../utils/EntityUtils';

const { getEntityKeyId } = DataUtils;

const { OPENLATTICE_ID_FQN } = Constants;

const {
  CODE,
  DATE_TIME,
  FULL_NAME,
  GIVEN_NAME,
  ID,
  SCORE_CATEGORY,
  SCORE_VALUE,
  SSN,
  SURNAME,
  TITLE,
  VALUES,
} = PropertyTypes;

const INITIAL_HEADERS = [
  'id',
  'datetime',
  'survey ol id',
  'provider',
  'first name',
  'last name',
  'last 4 digits of ssn',
  'person ol id',
];

const getHeaders = (questions :Map) => {
  const headers = [...INITIAL_HEADERS];
  questions.forEach((question) => {
    const code = getPropertyValue(question, CODE);
    headers.push(
      `q${code} title`,
      `q${code} value`,
      `q${code} score`,
      `q${code} score category`
    );
  });

  return headers;
};

const getSurveyResponseData = (questions :Map, answers :Map, answersByQuestion :Map) => {
  const data = [];
  questions.forEach((question, questionId) => {
    const title = getPropertyValue(question, TITLE);
    const answerId = answersByQuestion.get(questionId);
    const answer = answers.get(answerId);
    const answerProperties = getPropertyValues(answer, [
      VALUES,
      SCORE_VALUE,
      SCORE_CATEGORY,
    ]);
    data.push(title, ...answerProperties);
  });

  return data;
};

const generateHelplineSurveyCSV = (data :Map, filename :string) => {
  const answers = data.get(ANSWERS, Map());
  const personBySurvey = data.get(PERSON_BY_SURVEY, Map());
  const providerByPerson = data.get(PROVIDER_BY_PERSON, Map());
  const questions = data.get(QUESTIONS, Map());
  const surveyAnswersByQuestion = data.get(SURVEY_ANSWERS_BY_QUESTION, Map());
  const surveys = data.get(SURVEYS, Map());

  const headers = getHeaders(questions);
  const surveyData = surveys.reduce((accumulator :Array<any>, survey :Map, surveyId :string) => {
    const person = personBySurvey.get(surveyId);
    const personId = getEntityKeyId(person);
    const provider = providerByPerson.get(personId, Map());

    const surveyProperties = getPropertyValues(survey, [
      ID,
      DATE_TIME,
      OPENLATTICE_ID_FQN
    ]);
    const providerProperties = getPropertyValues(provider, [FULL_NAME]);
    const personProperties = getPropertyValues(personBySurvey.get(surveyId), [
      GIVEN_NAME,
      SURNAME,
      SSN,
      OPENLATTICE_ID_FQN
    ]);
    const answersByQuestion = surveyAnswersByQuestion.get(surveyId, Map());
    const surveyResponseData = getSurveyResponseData(questions, answers, answersByQuestion);

    const row = [].concat(surveyProperties, providerProperties, personProperties, surveyResponseData);
    accumulator.push(row);
    return accumulator;
  }, []);

  const csv = Papa.unparse({
    fields: headers,
    data: surveyData
  });

  const blob = new Blob([csv], {
    type: 'text/csv'
  });

  fs.saveAs(blob, filename);
};

export {
  getSurveyResponseData,
  generateHelplineSurveyCSV
};
