// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_SURVEY :'GET_SURVEY' = 'GET_SURVEY';
const getSurvey :RequestSequence = newRequestSequence(GET_SURVEY);

export {
  GET_SURVEY,
  getSurvey,
};
