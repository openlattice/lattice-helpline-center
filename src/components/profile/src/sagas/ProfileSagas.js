/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn,
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

import {
  GET_GREATEST_NEEDS,
  GET_PROFILE_SUMMARY,
  GET_QUESTIONS_FROM_ANSWERS,
  GET_SUBMISSIONS,
  GET_SUBMISSION_ANSWERS,
  GET_SUMMARY_SETS,
  GET_SURVEY,
  GET_SURVEY_RESULTS,
  getGreatestNeeds,
  getProfileSummary,
  getQuestionsFromAnswers,
  getSubmissionAnswers,
  getSubmissions,
  getSummarySets,
  getSurvey,
  getSurveyResults,
} from './ProfileActions';
import {
  ANSWERS,
  CATEGORY_BY_QUESTION_NUMBER,
  GREATEST_NEEDS,
  LAST_REQUEST,
  PERSON,
  QUESTIONS,
  SELF_SUFFICIENCY,
  SURVEY,
  SURVEY_HISTORY,
} from './constants';

import { getESIDFromConfig } from '../../../../containers/app/AppUtils';
import { APP_PATHS } from '../../../../containers/app/constants';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const { isValidUUID } = ValidationUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('ProfileSagas');

function* getProfileSummaryWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileSummary.request(action.id, personId));
    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
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

    response.data = fromJS({
      [PERSON]: personData,
      [SURVEY_HISTORY]: submissionsResponse.data,
      [SELF_SUFFICIENCY]: selfSufficiency,
      [GREATEST_NEEDS]: greatestNeedsResponse.data,
      [LAST_REQUEST]: {
        [personId]: DateTime.local().valueOf
      }
    });

    yield put(getProfileSummary.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getProfileSummary.failure(action.id, error));
  }
  return response;
}

function* getProfileSummaryWatcher() :Saga<any> {
  yield takeLatest(GET_PROFILE_SUMMARY, getProfileSummaryWorker);
}

function* getSubmissionsWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getSubmissions.request(action.id, personId));
    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
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

function* getSubmissionsWatcher() :Saga<any> {
  yield takeLatest(GET_SUBMISSIONS, getSubmissionsWorker);
}

function* getSummarySetsWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: submissionIds } = action;
    yield put(getSummarySets.request(action.id, submissionIds));
    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
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

function* getSummarySetWatcher() :Saga<any> {
  yield takeLatest(GET_SUMMARY_SETS, getSummarySetsWorker);
}

function* getGreatestNeedsWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: submissionId } = action;
    if (!isValidUUID(submissionId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getGreatestNeeds.request(action.id, submissionId));

    // get all answers to submission
    const answersResponse = yield call(getSubmissionAnswersWorker, getSubmissionAnswers([submissionId]));
    if (answersResponse.error) throw answersResponse.error;
    const answers = answersResponse.data.get(submissionId);
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

function* getGreatestNeedsWatcher() :Saga<any> {
  yield takeLatest(GET_GREATEST_NEEDS, getGreatestNeedsWorker);
}

function* getSubmissionAnswersWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: submissionIds } = action;
    if (!(Array.isArray(submissionIds) && submissionIds.every(isValidUUID))) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSubmissionAnswers.request(action.id, submissionIds));

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const answerESID = getESIDFromConfig(config, AppTypes.ANSWER);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const partOfESID = getESIDFromConfig(config, AppTypes.PART_OF);

    const answersSearchParams = {
      entitySetId: submissionsESID,
      filter: {
        entityKeyIds: submissionIds,
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

    response.data = fromJS(answersResponse.data);
    yield put(getSubmissionAnswers.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSubmissionAnswers.failure(action.id, error));
  }
  return response;
}

function* getSubmissionAnswersWatcher() :Saga<any> {
  yield takeLatest(GET_SUBMISSION_ANSWERS, getSubmissionAnswersWorker);
}

function* getQuestionsFromAnswersWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: answersIds } = action;
    yield put(getQuestionsFromAnswers.request(action.id, answersIds));

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const answerESID = getESIDFromConfig(config, AppTypes.ANSWER);
    const questionESID = getESIDFromConfig(config, AppTypes.QUESTION);
    const addressesESID = getESIDFromConfig(config, AppTypes.ADDRESSES);

    const questionsSearchParams = {
      entitySetId: answerESID,
      filter: {
        entityKeyIds: answersIds,
        edgeEntitySetIds: [addressesESID],
        destinationEntitySetIds: [questionESID],
        sourceEntitySetIds: [],
      }
    };

    const questionsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(questionsSearchParams)
    );
    if (questionsResponse.error) throw questionsResponse.error;

    response.data = fromJS(questionsResponse.data);
    yield put(getQuestionsFromAnswers.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getQuestionsFromAnswers.failure(action.id, error));
  }
  return response;
}

function* getQuestionsFromAnswersWatcher() :Saga<any> {
  yield takeLatest(GET_QUESTIONS_FROM_ANSWERS, getQuestionsFromAnswersWorker);
}

function* getSurveyWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: submissionId } = action;
    if (!isValidUUID(submissionId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSurvey.request(action.id));

    // get person
    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const peopleESID = getESIDFromConfig(config, AppTypes.PEOPLE);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const respondsWithESID = getESIDFromConfig(config, AppTypes.RESPONDS_WITH);

    const personSearchParams = {
      entitySetId: submissionsESID,
      filter: {
        entityKeyIds: [submissionId],
        edgeEntitySetIds: [respondsWithESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      }
    };

    const personRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(personSearchParams)
    );

    // get submission
    const submissionRequest = call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: submissionsESID,
        entityKeyId: submissionId
      })
    );

    // get all answers to submission
    const answersRequest = call(getSubmissionAnswersWorker, getSubmissionAnswers([submissionId]));

    const [answersResponse, personResponse, submissionResponse] = yield all([
      answersRequest,
      personRequest,
      submissionRequest
    ]);
    if (answersResponse.error) throw answersResponse.error;
    if (personResponse.error) throw personResponse.error;
    if (submissionResponse.error) throw submissionResponse.error;
    const survey = fromJS(submissionResponse.data);

    const person = getIn(personResponse, ['data', submissionId, '0', 'neighborDetails']);

    const answers = answersResponse.data.get(submissionId);
    const answersIds = answers.map((answer) => answer.get('neighborId'));
    const answersById = Map(answers.map((answer) => [answer.get('neighborId'), answer.get('neighborDetails')]));

    // get question to each answer
    const questionsResponse = yield call(getQuestionsFromAnswersWorker, getQuestionsFromAnswers(answersIds.toJS()));
    const questions = questionsResponse.data.map((question) => question.getIn([0, 'neighborDetails']));

    response.data = fromJS({
      [ANSWERS]: answersById,
      [PERSON]: person,
      [QUESTIONS]: questions,
      [SURVEY]: survey,
    });

    yield put(getSurvey.success(action.id, response.data));
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

function* getSurveyResultsWorker(action :SequenceAction) :Saga<any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSurveyResults.request(action.id));

    const submissionsResponse = yield call(getSubmissionsWorker, getSubmissions(personId));
    if (submissionsResponse.error) throw submissionsResponse.error;
    const submissions = submissionsResponse.data;
    const submissionsIds = submissions.map((submission) => submission.get('neighborId'));

    // get all answers to submission
    const answersResponse = yield call(getSubmissionAnswersWorker, getSubmissionAnswers(submissionsIds));
    if (answersResponse.error) throw answersResponse.error;
    const answersBySubmission = answersResponse.data;
    const answersIds = answersBySubmission.map((answers) => answers.get('neighborId'));
    const answersById = Map(answers.map((answer) => [answer.get('neighborId'), answer.get('neighborDetails')]));

    // // get question to each answer
    // const questionsResponse = yield call(getQuestionsFromAnswersWorker, getQuestionsFromAnswers(answersIds.toJS()));
    // const questions = questionsResponse.data.map((question) => question.getIn([0, 'neighborDetails']));

    // get surveyHistory
    // get all answers from each submission
    // get all questions from each answer
    // denormalize

    // for each question
      // for each survey
        // get the answer that matches the question
    yield put(getSurveyResults.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getSurveyResults.failure(action.id, error));
  }
  return response;
}

function* getSurveyResultsWatcher() :Saga<any> {
  yield takeLatest(GET_SURVEY_RESULTS, getSurveyResultsWorker);
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
  getSurveyResultsWatcher,
  getSurveyResultsWorker,
  getSurveyWatcher,
  getSurveyWorker,
};
