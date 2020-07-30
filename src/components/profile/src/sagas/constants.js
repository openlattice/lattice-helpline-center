// @flow
/* eslint-disable quote-props */
import { ReduxConstants } from 'lattice-utils';

import { GET_PROFILE_SUMMARY } from './ProfileActions';

const { REQUEST_STATE } = ReduxConstants;

const PROFILE = 'profile';
const SURVEY_HISTORY = 'surveyHistory';
const GREATEST_NEEDS = 'greatestNeeds';
const SELF_SUFFICIENCY = 'selfSufficiency';

const PROFILE_PATHS = {
  [SURVEY_HISTORY]: [PROFILE, SURVEY_HISTORY],
  [GREATEST_NEEDS]: [PROFILE, GREATEST_NEEDS],
  [SELF_SUFFICIENCY]: [PROFILE, SELF_SUFFICIENCY],
  [REQUEST_STATE]: [PROFILE, GET_PROFILE_SUMMARY, REQUEST_STATE]
};

const SHELTER = 'Shelter';
const FOOD = 'Food';
const TRANSPORTATION = 'Transportation';
const EMPLOYMENT_INCOME = 'Employment & Income';
const FINANCIAL_STRAIN = 'Financial Strain';
const CHILDCARE = 'Childcare';
const HEALTHCARE = 'Healthcare';
const MENTAL_HEALTH = 'Mental Health';
const SUBSTANCE_USE = 'Substance Use';
const SAFETY = 'Safety';

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
  PROFILE,
  SURVEY_HISTORY,
  GREATEST_NEEDS,
  SELF_SUFFICIENCY,
  PROFILE_PATHS,
  SHELTER,
  FOOD,
  TRANSPORTATION,
  EMPLOYMENT_INCOME,
  FINANCIAL_STRAIN,
  CHILDCARE,
  HEALTHCARE,
  MENTAL_HEALTH,
  SUBSTANCE_USE,
  SAFETY,
  CATEGORY_BY_QUESTION_NUMBER,
};
