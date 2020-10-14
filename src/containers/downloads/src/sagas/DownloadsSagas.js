// @flow
import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  get,
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DataUtils, Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  DOWNLOAD_SURVEYS_BY_DATE_RANGE,
  GET_SUBMISSION_PROVIDERS,
  GET_SURVEY_PEOPLE,
  downloadSurveysByDateRange,
  getSubmissionProviders,
  getSurveyPeople,
} from './DownloadsActions';
import {
  PERSON_BY_SUBMISSION,
  PROVIDER_BY_SUBMISSION,
  SUBMISSIONS,
  SUMMARY_SET_BY_SUBMISSION,
} from './constants';
import { generateHelplineSubmissionsCSV } from './utils';

import { AppTypes } from '../../../../core/edm/constants';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getSearchTerm } from '../../../../utils/QueryUtils';
import { getESIDFromConfig } from '../../../app/AppUtils';
import { APP_PATHS } from '../../../app/constants';
import { getSubmissionResults, getSummarySets } from '../../../profile/src/sagas/ProfileActions';
import { getSubmissionResultsWorker, getSummarySetsWorker } from '../../../profile/src/sagas/ProfileSagas';

const { getEntityKeyId } = DataUtils;
const { isValidUUID } = ValidationUtils;
const {
  searchEntitySetData,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  searchEntitySetDataWorker,
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

const LOG = new Logger('DownloadsSagas');

function* getSurveyPeopleWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let response :WorkerResponse = {
    data: undefined,
  };

  try {
    const { value: submissionIds } = action;
    if (!(Array.isArray(submissionIds) && submissionIds.every(isValidUUID))) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSurveyPeople.request(action.id));

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const peopleESID = getESIDFromConfig(config, AppTypes.PEOPLE);
    const respondsWithESID = getESIDFromConfig(config, AppTypes.RESPONDS_WITH);
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: submissionsESID,
        filter: {
          entityKeyIds: submissionIds,
          edgeEntitySetIds: [respondsWithESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [peopleESID],
        }
      })
    );

    if (peopleResponse.error) throw peopleResponse.error;
    const peopleResponseData = fromJS(peopleResponse.data)
      .map((people) => people.getIn([0, 'neighborDetails']));

    response = { data: peopleResponseData };
    yield put(getSurveyPeople.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response = { error };
    yield put(getSurveyPeople.failure(action.id, error));
  }
  finally {
    yield put(getSurveyPeople.finally(action.id));
  }

  return response;
}

function* getSurveyPeopleWatcher() :Saga<void> {
  yield takeLatest(GET_SURVEY_PEOPLE, getSurveyPeopleWorker);
}

function* getSubmissionProvidersWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let response :WorkerResponse = {
    data: undefined,
  };

  try {
    const { value: submissionIds } = action;
    if (!(Array.isArray(submissionIds) && submissionIds.every(isValidUUID))) throw ERR_ACTION_VALUE_TYPE;
    yield put(getSubmissionProviders.request(action.id));

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const occurredAtESID = getESIDFromConfig(config, AppTypes.OCCURRED_AT);
    const submissionESID = getESIDFromConfig(config, AppTypes.SUBMISSION);
    const providerESID = getESIDFromConfig(config, AppTypes.PROVIDER);

    const providerResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: submissionESID,
        filter: {
          entityKeyIds: submissionIds,
          edgeEntitySetIds: [occurredAtESID],
          destinationEntitySetIds: [providerESID],
          sourceEntitySetIds: [],
        }
      })
    );

    if (providerResponse.error) throw providerResponse.error;
    const providerResponseData = fromJS(providerResponse.data)
      .map((people) => people.getIn([0, 'neighborDetails']));
    response = { data: providerResponseData };
    yield put(getSubmissionProviders.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response = { error };
    yield put(getSubmissionProviders.failure(action.id, error));
  }
  finally {
    yield put(getSubmissionProviders.finally(action.id));
  }

  return response;
}

function* getSubmissionProvidersWatcher() :Saga<void> {
  yield takeLatest(GET_SUBMISSION_PROVIDERS, getSubmissionProvidersWorker);
}

function* downloadSurveysByDateRangeWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let response = {
    data: undefined,
  };

  try {
    yield put(downloadSurveysByDateRange.request(action.id));
    const { value } = action;
    if (!Map.isMap(value)) throw ERR_ACTION_VALUE_TYPE;

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const submissionsESID = getESIDFromConfig(config, AppTypes.SUBMISSION);

    const startTerm = get(value, 'dateStart') || '*';
    const endTerm = get(value, 'dateEnd') || '*';

    // TODO: add getPropertyTypeId API to lattice-js/sagas to fetch ol.datetime PTID
    const datetimePTID = '87f38161-9c95-4166-9721-8514882dac22';
    const searchTerm = getSearchTerm(datetimePTID, `[${startTerm} TO ${endTerm}]`);

    // search for reports within date range
    const searchConstraints = {
      entitySetIds: [submissionsESID],
      start: 0,
      maxHits: 10000,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields: [
            {
              searchTerm,
              property: datetimePTID
            }
          ]
        }]
      }],
      sort: {
        propertyTypeId: datetimePTID,
        type: 'field'
      }
    };

    const submissionsResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );
    if (submissionsResponse.error) throw submissionsResponse.error;

    const submissions = submissionsResponse?.data?.hits;
    const submissionsById = Map(submissions.map((entity) => [getEntityKeyId(entity), fromJS(entity)]));

    let csvData = Map({
      [SUBMISSIONS]: submissionsById,
    });

    const submissionIds = submissions?.map(getEntityKeyId) || [];

    // find submission results and people
    if (submissionIds.length) {
      const submissionResultsRequest = call(getSubmissionResultsWorker, getSubmissionResults(submissionIds));
      const submissionPeopleRequest = call(getSurveyPeopleWorker, getSurveyPeople(submissionIds));
      const submissionProvidersRequest = yield call(
        getSubmissionProvidersWorker, getSubmissionProviders(submissionIds)
      );
      const submissionSummarySetsRequest = call(getSummarySetsWorker, getSummarySets(submissionIds));

      const [
        submissionResultsResponse,
        submissionPeopleResponse,
        submissionProvidersResponse,
        submissionSummarySetsResponse,
      ] = yield all([
        submissionResultsRequest,
        submissionPeopleRequest,
        submissionProvidersRequest,
        submissionSummarySetsRequest
      ]);

      if (submissionResultsResponse.error) throw submissionResultsResponse.error;
      if (submissionPeopleResponse.error) throw submissionPeopleResponse.error;
      if (submissionProvidersResponse.error) throw submissionProvidersResponse.error;
      if (submissionSummarySetsResponse.error) throw submissionSummarySetsResponse.error;

      const summarySetResponseData = fromJS(submissionSummarySetsResponse.data)
        .map((summarySets) => summarySets.getIn([0, 'neighborDetails']));

      csvData = csvData.merge({
        [PERSON_BY_SUBMISSION]: submissionPeopleResponse.data,
        [PROVIDER_BY_SUBMISSION]: submissionProvidersResponse.data,
        [SUMMARY_SET_BY_SUBMISSION]: summarySetResponseData,
      }).merge(submissionResultsResponse.data);
    }

    const startDate = DateTime.fromISO(startTerm).toFormat('yyyyLLdd');
    const endDate = DateTime.fromISO(endTerm).toFormat('yyyyLLdd');
    const filename = `surveys_${startDate}-${endDate}.csv`;

    generateHelplineSubmissionsCSV(csvData, filename);

    yield put(downloadSurveysByDateRange.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response = { error };
    yield put(downloadSurveysByDateRange.failure(action.id));
  }
  finally {
    yield put(downloadSurveysByDateRange.finally(action.id));
  }

  return response;
}

function* downloadSurveysByDateRangeWatcher() :Saga<void> {
  yield takeLatest(DOWNLOAD_SURVEYS_BY_DATE_RANGE, downloadSurveysByDateRangeWorker);
}

export {
  downloadSurveysByDateRangeWatcher,
  downloadSurveysByDateRangeWorker,
  getSurveyPeopleWatcher,
  getSurveyPeopleWorker,
  getSubmissionProvidersWatcher,
  getSubmissionProvidersWorker,
};
