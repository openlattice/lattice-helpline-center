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
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_GREATEST_NEEDS,
  GET_PROFILE_SUMMARY,
  GET_QUESTIONS_FROM_ANSWERS,
  GET_SUBMISSIONS,
  GET_SUBMISSION_ANSWERS,
  GET_SUMMARY_SETS,
  getGreatestNeeds,
  getProfileSummary,
  getQuestionsFromAnswers,
  getSubmissionAnswers,
  getSubmissions,
  getSummarySets,
} from './ProfileActions';
import {
  CATEGORY_BY_QUESTION_NUMBER,
  GREATEST_NEEDS,
  PERSON,
  SELF_SUFFICIENCY,
  SURVEY_HISTORY,
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

const LOG = new Logger('ProfileSagas');

function* getProfileSummaryWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileSummary.request(action.id, personId));
    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const personESID = getESIDFromConfig(config, AppTypes.PEOPLE);

    const personResponse = yield call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: personESID,
        entityKeyId: personId
      })
    );

    if (personResponse.error) throw personResponse.error;
    const personData = fromJS(personResponse.data);

    // get survey history
    const submissionsResponse = yield call(getSubmissionsWorker, getSubmissions(personId));
    if (submissionsResponse.error) throw submissionsResponse.error;
    const surveyHistory = submissionsResponse.data;

    // get summary set for most recent 7 surveys
    const recentSurveyIds = surveyHistory
      .slice(0, 7)
      .map((survey) => survey.getIn([OPENLATTICE_ID_FQN, 0]));

    const summarySetsResponse = yield call(getSummarySetsWorker, getSummarySets(recentSurveyIds.toJS()));
    if (summarySetsResponse.error) throw summarySetsResponse.error;

    const selfSufficiency = surveyHistory
      .slice(0, 7)
      .map((survey) => {
        const surveyId = survey.getIn([OPENLATTICE_ID_FQN, 0]);
        const surveyDate = survey.getIn([PropertyTypes.DATE_TIME, 0]);
        const score = summarySetsResponse.data.getIn([surveyId, 0, 'neighborDetails', PropertyTypes.VALUES, 0]);
        const parsedScore = parseInt(score, 10) || 0;

        return {
          x: DateTime.fromISO(surveyDate).toFormat('LL/dd'),
          y: parsedScore
        };
      });

    const greatestNeedsResponse = yield call(getGreatestNeedsWorker, getGreatestNeeds(recentSurveyIds.first()));
    if (greatestNeedsResponse.error) throw greatestNeedsResponse.error;

    response.data = Map({
      [PERSON]: personData,
      [SURVEY_HISTORY]: submissionsResponse.data,
      [SELF_SUFFICIENCY]: selfSufficiency,
      [GREATEST_NEEDS]: greatestNeedsResponse.data
    });

    yield put(getProfileSummary.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getProfileSummary.failure(action.id, error));
  }
  return response;
}

function* getProfileSummaryWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PROFILE_SUMMARY, getProfileSummaryWorker);
}

function* getSubmissionsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getSubmissions.request(action.id, personId));
    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const peopleESID = getESIDFromConfig(config, AppTypes.PEOPLE);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const respondsWithESID = getESIDFromConfig(config, AppTypes.RESPONDS_WITH);

    const submissionsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [personId],
        edgeEntitySetIds: [respondsWithESID],
        destinationEntitySetIds: [submissionsESID],
        sourceEntitySetIds: [],
      }
    };

    const submissionsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(submissionsSearchParams)
    );

    if (submissionsResponse.error) throw submissionsResponse.error;

    response.data = fromJS(submissionsResponse.data)
      .get(personId, List())
      .map((report :Map) => report.get('neighborDetails'))
      .toSet()
      .toList()
      .sortBy((report :Map) :number => {
        const time = DateTime.fromISO(report.getIn([PropertyTypes.DATE_TIME, 0]));

        return -time.valueOf();
      });
    yield put(getSubmissions.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSubmissions.failure(action.id, error));
  }
  return response;
}

function* getSubmissionsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SUBMISSIONS, getSubmissionsWorker);
}

function* getSummarySetsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: submissionIds } = action;
    yield put(getSummarySets.request(action.id, submissionIds));
    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const summarySetESID = getESIDFromConfig(config, AppTypes.SUMMARY_SET);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const registeredForESID = getESIDFromConfig(config, AppTypes.REGISTERED_FOR);

    const summarySetsSearchParams = {
      entitySetId: submissionsESID,
      filter: {
        entityKeyIds: submissionIds,
        edgeEntitySetIds: [registeredForESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [summarySetESID],
      }
    };

    const summarySetsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(summarySetsSearchParams)
    );
    if (summarySetsResponse.error) throw summarySetsResponse.error;

    response.data = fromJS(summarySetsResponse.data);
    yield put(getSummarySets.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSummarySets.failure(action.id, error));

  }
  return response;
}

function* getSummarySetWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SUMMARY_SETS, getSummarySetsWorker);
}

function* getGreatestNeedsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: submissionId } = action;
    if (!isValidUUID(submissionId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getGreatestNeeds.request(action.id, submissionId));

    // get all answers to submission
    const answersResponse = yield call(getSubmissionAnswersWorker, getSubmissionAnswers(submissionId));
    if (answersResponse.error) throw answersResponse.error;
    const answers = answersResponse.data;
    const answersIds = answers.map((answer) => answer.get('neighborId'));

    // get question to each answer
    const questionsResponse = yield call(getQuestionsFromAnswersWorker, getQuestionsFromAnswers(answersIds.toJS()));
    const questions = questionsResponse.data;

    // match answer score to question number
    const scoreByQuestion :Map = answers.reduce((scores :Map, answer) => {
      const answerId = answer.get('neighborId');
      const answerScore = answer.getIn(['neighborDetails', PropertyTypes.SCORE_VALUE, 0]);
      const questionNumber = questions.getIn([answerId, 0, 'neighborDetails', PropertyTypes.CODE, 0]);
      return scores.set(questionNumber, answerScore);
    }, Map());

    const scoreByCategory = scoreByQuestion.reduce((scores, value, questionNumber) => {
      const category = CATEGORY_BY_QUESTION_NUMBER[questionNumber];
      const currentScore = scores.get(category) || 0;
      return scores.set(category, value + currentScore);
    }, Map());

    // get top 3 scoring categories
    const greatestNeeds = scoreByCategory
      .sort((a, b) => b - a)
      .keySeq()
      .toList()
      .slice(0, 3);

    response.data = greatestNeeds;

    yield put(getGreatestNeeds.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getGreatestNeeds.failure(action.id, error));
  }
  return response;
}

function* getGreatestNeedsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_GREATEST_NEEDS, getGreatestNeedsWorker);
}

function* getSubmissionAnswersWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: submissionId } = action;
    if (!isValidUUID(submissionId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSubmissionAnswers.request(action.id, submissionId));

    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const answerESID = getESIDFromConfig(config, AppTypes.ANSWER);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const partOfESID = getESIDFromConfig(config, AppTypes.PART_OF);

    const answersSearchParams = {
      entitySetId: submissionsESID,
      filter: {
        entityKeyIds: [submissionId],
        edgeEntitySetIds: [partOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [answerESID],
      }
    };

    const answersResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(answersSearchParams)
    );
    if (answersResponse.error) throw answersResponse.error;

    response.data = fromJS(answersResponse.data).get(submissionId);
    yield put(getSubmissionAnswers.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSubmissionAnswers.failure(action.id, error));
  }
  return response;
}

function* getSubmissionAnswersWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SUBMISSION_ANSWERS, getSubmissionAnswersWorker);
}

function* getQuestionsFromAnswersWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: answersIds } = action;
    yield put(getQuestionsFromAnswers.request(action.id, answersIds));

    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const answerESID = getESIDFromConfig(config, AppTypes.ANSWER);
    const questionESID = getESIDFromConfig(config, AppTypes.QUESTION);
    const addressesESID = getESIDFromConfig(config, AppTypes.ADDRESSES);

    const answersSearchParams = {
      entitySetId: answerESID,
      filter: {
        entityKeyIds: answersIds,
        edgeEntitySetIds: [addressesESID],
        destinationEntitySetIds: [questionESID],
        sourceEntitySetIds: [],
      }
    };

    const answersResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(answersSearchParams)
    );
    if (answersResponse.error) throw answersResponse.error;

    response.data = fromJS(answersResponse.data);
    yield put(getQuestionsFromAnswers.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getQuestionsFromAnswers.failure(action.id, error));
  }
  return response;
}

function* getQuestionsFromAnswersWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_QUESTIONS_FROM_ANSWERS, getQuestionsFromAnswersWorker);
}

export {
  getGreatestNeedsWatcher,
  getGreatestNeedsWorker,
  getProfileSummaryWatcher,
  getProfileSummaryWorker,
  getQuestionsFromAnswersWatcher,
  getQuestionsFromAnswersWorker,
  getSubmissionAnswersWatcher,
  getSubmissionAnswersWorker,
  getSubmissionsWatcher,
  getSubmissionsWorker,
  getSummarySetWatcher,
  getSummarySetsWorker,
};
