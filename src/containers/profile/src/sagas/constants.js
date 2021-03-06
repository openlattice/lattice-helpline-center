// @flow
/* eslint-disable quote-props */

const GREATEST_NEEDS = 'greatestNeeds';
const PERSON = 'person';
const PROFILE = 'profile';
const SELF_SUFFICIENCY = 'selfSufficiency';
const SURVEY_HISTORY = 'surveyHistory';
const SUBMISSIONS = 'submissions';
const QUESTIONS = 'questions';
const ANSWERS = 'answers';
const LAST_REQUEST = 'lastRequest';
const SUBMISSION_ANSWERS_BY_QUESTION = 'submissionAnswersByQuestion';
const PROVIDER = 'provider';

const PROFILE_PATHS = {
  [ANSWERS]: [PROFILE, ANSWERS],
  [GREATEST_NEEDS]: [PROFILE, GREATEST_NEEDS],
  [LAST_REQUEST]: [PROFILE, LAST_REQUEST],
  [PERSON]: [PROFILE, PERSON],
  [PROVIDER]: [PROFILE, PROVIDER],
  [QUESTIONS]: [PROFILE, QUESTIONS],
  [SELF_SUFFICIENCY]: [PROFILE, SELF_SUFFICIENCY],
  [SUBMISSIONS]: [PROFILE, SUBMISSIONS],
  [SUBMISSION_ANSWERS_BY_QUESTION]: [PROFILE, SUBMISSION_ANSWERS_BY_QUESTION],
  [SURVEY_HISTORY]: [PROFILE, SURVEY_HISTORY],
};

const CHILDCARE = 'Childcare';
const EMPLOYMENT_INCOME = 'Employment & Income';
const FINANCIAL_STRAIN = 'Financial Strain';
const FOOD = 'Food';
const HEALTHCARE = 'Healthcare';
const MENTAL_HEALTH = 'Mental Health';
const SAFETY = 'Safety';
const SHELTER = 'Shelter';
const SUBSTANCE_USE = 'Substance Use';
const TRANSPORTATION = 'Transportation';

const CATEGORY_BY_QUESTION_NUMBER = Object.freeze({
  '1': SHELTER,
  '2': FOOD,
  '3': FOOD,
  '4': TRANSPORTATION,
  '5': EMPLOYMENT_INCOME,
  '6': EMPLOYMENT_INCOME,
  '7': FINANCIAL_STRAIN,
  '8': FINANCIAL_STRAIN,
  '9': CHILDCARE,
  '10': HEALTHCARE,
  '11': HEALTHCARE,
  '12': MENTAL_HEALTH,
  '13': MENTAL_HEALTH,
  '14': SUBSTANCE_USE,
  '15': SUBSTANCE_USE,
  '16': SUBSTANCE_USE,
  '17': SAFETY,
});

export {
  ANSWERS,
  CATEGORY_BY_QUESTION_NUMBER,
  CHILDCARE,
  EMPLOYMENT_INCOME,
  FINANCIAL_STRAIN,
  FOOD,
  GREATEST_NEEDS,
  HEALTHCARE,
  LAST_REQUEST,
  MENTAL_HEALTH,
  PERSON,
  PROFILE,
  PROFILE_PATHS,
  PROVIDER,
  QUESTIONS,
  SAFETY,
  SELF_SUFFICIENCY,
  SHELTER,
  SUBSTANCE_USE,
  SUBMISSIONS,
  SUBMISSION_ANSWERS_BY_QUESTION,
  SURVEY_HISTORY,
  TRANSPORTATION,
};
