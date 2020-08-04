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

const GET_SUMMARY_SETS :'GET_SUMMARY_SETS' = 'GET_SUMMARY_SETS';
const getSummarySets :RequestSequence = newRequestSequence(GET_SUMMARY_SETS);

const GET_SUBMISSION_ANSWERS :'GET_SUBMISSION_ANSWERS' = 'GET_SUBMISSION_ANSWERS';
const getSubmissionAnswers :RequestSequence = newRequestSequence(GET_SUBMISSION_ANSWERS);

const GET_QUESTIONS_FROM_ANSWERS :'GET_QUESTIONS_FROM_ANSWERS' = 'GET_QUESTIONS_FROM_ANSWERS';
const getQuestionsFromAnswers :RequestSequence = newRequestSequence(GET_QUESTIONS_FROM_ANSWERS);

const GET_GREATEST_NEEDS :'GET_GREATEST_NEEDS' = 'GET_GREATEST_NEEDS';
const getGreatestNeeds :RequestSequence = newRequestSequence(GET_GREATEST_NEEDS);

const GET_SURVEY :'GET_SURVEY' = 'GET_SURVEY';
const getSurvey :RequestSequence = newRequestSequence(GET_SURVEY);

export {
  GET_GREATEST_NEEDS,
  GET_PROFILE,
  GET_PROFILE_SUMMARY,
  GET_QUESTIONS_FROM_ANSWERS,
  GET_SUBMISSIONS,
  GET_SUBMISSION_ANSWERS,
  GET_SUMMARY_SETS,
  GET_SURVEY,
  GET_SURVEYS,
  getGreatestNeeds,
  getProfile,
  getProfileSummary,
  getQuestionsFromAnswers,
  getSubmissionAnswers,
  getSubmissions,
  getSummarySets,
  getSurvey,
  getSurveys,
};
