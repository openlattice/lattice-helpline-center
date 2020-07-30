// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PROFILE :'GET_PROFILE' = 'GET_PROFILE';
const getProfile :RequestSequence = newRequestSequence(GET_PROFILE);

const GET_SURVEYS :'GET_SURVEYS' = 'GET_SURVEYS';
const getSurveys :RequestSequence = newRequestSequence(GET_SURVEYS);

const GET_SUBMISSIONS :'GET_SUBMISSIONS' = 'GET_SUBMISSIONS';
const getSubmissions :RequestSequence = newRequestSequence(GET_SUBMISSIONS);

const GET_PROFILE_SUMMARY :'GET_PROFILE_SUMMARY' = 'GET_PROFILE_SUMMARY';
const getProfileSummary :RequestSequence = newRequestSequence(GET_PROFILE_SUMMARY);

export {
  GET_PROFILE,
  GET_PROFILE_SUMMARY,
  GET_SUBMISSIONS,
  GET_SURVEYS,
  getProfile,
  getProfileSummary,
  getSubmissions,
  getSurveys,
};
