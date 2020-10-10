// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_SURVEYS_BY_DATE_RANGE :'DOWNLOAD_SURVEYS_BY_DATE_RANGE' = 'DOWNLOAD_SURVEYS_BY_DATE_RANGE';
const downloadSurveysByDateRange :RequestSequence = newRequestSequence(DOWNLOAD_SURVEYS_BY_DATE_RANGE);

const GET_SURVEY_PEOPLE :'GET_SURVEY_PEOPLE' = 'GET_SURVEY_PEOPLE';
const getSurveyPeople :RequestSequence = newRequestSequence(GET_SURVEY_PEOPLE);

const GET_PEOPLE_PROVIDERS :'GET_PEOPLE_PROVIDERS' = 'GET_PEOPLE_PROVIDERS';
const getPeopleProviders :RequestSequence = newRequestSequence(GET_PEOPLE_PROVIDERS);

export {
  DOWNLOAD_SURVEYS_BY_DATE_RANGE,
  GET_SURVEY_PEOPLE,
  GET_PEOPLE_PROVIDERS,
  downloadSurveysByDateRange,
  getSurveyPeople,
  getPeopleProviders,
};
