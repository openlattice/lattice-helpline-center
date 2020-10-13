// @flow
import Papa from 'papaparse';
import fs from 'file-saver';
import { Map } from 'immutable';
import { Constants } from 'lattice';

import {
  ANSWERS,
  PERSON_BY_SUBMISSION,
  PROVIDER_BY_SUBMISSION,
  QUESTIONS,
  SUBMISSIONS,
  SUBMISSION_ANSWERS_BY_QUESTION,
} from './constants';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue, getPropertyValues } from '../../../../utils/EntityUtils';

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
  'submission ol id',
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

const getSubmissionResponseData = (questions :Map, answers :Map, answersByQuestion :Map) => {
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

const generateHelplineSubmissionsCSV = (data :Map, filename :string) => {
  const answers = data.get(ANSWERS, Map());
  const personBySubmission = data.get(PERSON_BY_SUBMISSION, Map());
  const providerBySubmission = data.get(PROVIDER_BY_SUBMISSION, Map());
  const questions = data.get(QUESTIONS, Map());
  const submissionAnswersByQuestion = data.get(SUBMISSION_ANSWERS_BY_QUESTION, Map());
  const submissions = data.get(SUBMISSIONS, Map());

  const headers = getHeaders(questions);
  const submissionsData = submissions.reduce((accumulator :Array<any>, submission :Map, submissionId :string) => {
    const person = personBySubmission.get(submissionId);
    const provider = providerBySubmission.get(submissionId, Map());

    const submissionProperties = getPropertyValues(submission, [
      ID,
      DATE_TIME,
      OPENLATTICE_ID_FQN
    ]);
    const providerProperties = getPropertyValues(provider, [FULL_NAME]);
    const personProperties = getPropertyValues(person, [
      GIVEN_NAME,
      SURNAME,
      SSN,
      OPENLATTICE_ID_FQN
    ]);
    const answersByQuestion = submissionAnswersByQuestion.get(submissionId, Map());
    const submissionResponseData = getSubmissionResponseData(questions, answers, answersByQuestion);

    const row = [].concat(submissionProperties, providerProperties, personProperties, submissionResponseData);
    accumulator.push(row);
    return accumulator;
  }, []);

  const csv = Papa.unparse({
    fields: headers,
    data: submissionsData
  });

  const blob = new Blob([csv], {
    type: 'text/csv'
  });

  fs.saveAs(blob, filename);
};

export {
  getSubmissionResponseData,
  generateHelplineSubmissionsCSV
};
