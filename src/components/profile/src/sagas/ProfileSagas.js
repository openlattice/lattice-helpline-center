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
import { List, Map, fromJS } from 'immutable';
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
  GET_PROFILE_SUMMARY,
  GET_SUBMISSIONS,
  GET_SUMMARY_SETS,
  getProfileSummary,
  getSubmissions,
  getSummarySets,
} from './ProfileActions';
import { GREATEST_NEEDS, SELF_SUFFICIENCY, SURVEY_HISTORY } from './constants';

import { getESIDFromConfig } from '../../../../containers/app/AppUtils';
import { STORE_PATHS } from '../../../../containers/app/constants';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const { isValidUUID } = ValidationUtils;

const { OPENLATTICE_ID_FQN } = Constants;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('ProfileSagas');

function* getProfileSummaryWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: personId } = action;
    if (!isValidUUID(personId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileSummary.request(action.id));
    const config = yield select((store) => store.getIn(STORE_PATHS.APP_CONFIG));
    const personESID = getESIDFromConfig(config, AppTypes.PEOPLE);
    // may need to get person here?

    // get survey history
    const submissionsResponse = yield call(getSubmissionsWorker, getSubmissions(personId));
    if (submissionsResponse.error) throw submissionsResponse.error;
    const surveyHistory = submissionsResponse.data;

    // get summary set for most recent 7 surveys
    // generate m
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

    response.data = Map({
      [SURVEY_HISTORY]: submissionsResponse.data,
      [SELF_SUFFICIENCY]: selfSufficiency,
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

    yield put(getSubmissions.request(action.id));
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
    yield put(getSummarySets.request(action.id));
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

export {
  getProfileSummaryWatcher,
  getProfileSummaryWorker,
  getSubmissionsWatcher,
  getSubmissionsWorker,
  getSummarySetWatcher,
  getSummarySetsWorker,
};
