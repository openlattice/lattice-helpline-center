/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getQuestionsFromAnswers, getSubmissionAnswers } from './ProfileActions';
import { getQuestionsFromAnswersWorker, getSubmissionAnswersWorker } from './ProfileSagas';
import {
  GET_SURVEY,
  getSurvey,
} from './SurveyActions';
import {
  CATEGORY_BY_QUESTION_NUMBER,
  PERSON,
} from './constants';

import { getESIDFromConfig } from '../../../../containers/app/AppUtils';
import { STORE_PATHS } from '../../../../containers/app/constants';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const { isValidUUID } = ValidationUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('SurveySagas');

function* getSurveyWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: submissionId } = action;
    if (!isValidUUID(submissionId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSurvey.request(action.id));

    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const personESID = getESIDFromConfig(config, AppTypes.PEOPLE);

    // get all answers to submission
    const answersResponse = yield call(getSubmissionAnswersWorker, getSubmissionAnswers(submissionId));
    if (answersResponse.error) throw answersResponse.error;
    const answers = answersResponse.data;
    const answersIds = answers.map((answer) => answer.get('neighborId'));

    // get question to each answer
    const questionsResponse = yield call(getQuestionsFromAnswersWorker, getQuestionsFromAnswers(answersIds.toJS()));
    const questions = questionsResponse.data;

    yield put(getSurvey.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSurvey.failure(action.id, error));
  }
  return response;
}

function* getSurveyWatcher() :Saga<any> {
  yield takeLatest(GET_SURVEY, getSurveyWorker);
}

// function* getSurveyWorker(action :SequenceAction) :Saga<any> {
//   const response = {};
//   try {
//     yield put(getSurvey.request(action.id));
//     yield put(getSurvey.success(action.id));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     response.error = error;
//     yield put(getSurvey.failure(action.id, error));
//   }
//   return response;
// }

// function* getSurveyWatcher() :Saga<any> {
//   yield takeLatest(GET_SURVEY, getSurveyWorker);
// }

export {
  getSurveyWorker,
  getSurveyWatcher,
};
