// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_SURVEYS_BY_DATE_RANGE :'DOWNLOAD_SURVEYS_BY_DATE_RANGE' = 'DOWNLOAD_SURVEYS_BY_DATE_RANGE';
const downloadSurveysByDateRange :RequestSequence = newRequestSequence(DOWNLOAD_SURVEYS_BY_DATE_RANGE);

const GET_SURVEY_PEOPLE :'GET_SURVEY_PEOPLE' = 'GET_SURVEY_PEOPLE';
const getSurveyPeople :RequestSequence = newRequestSequence(GET_SURVEY_PEOPLE);

const GET_SUBMISSION_PROVIDERS :'GET_SUBMISSION_PROVIDERS' = 'GET_SUBMISSION_PROVIDERS';
const getSubmissionProviders :RequestSequence = newRequestSequence(GET_SUBMISSION_PROVIDERS);

export {
  DOWNLOAD_SURVEYS_BY_DATE_RANGE,
  GET_SURVEY_PEOPLE,
  GET_SUBMISSION_PROVIDERS,
  downloadSurveysByDateRange,
  getSurveyPeople,
  getSubmissionProviders,
};
