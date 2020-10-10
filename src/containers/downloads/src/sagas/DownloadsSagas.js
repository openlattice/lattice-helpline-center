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
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  DOWNLOAD_SURVEYS_BY_DATE_RANGE,
  GET_PEOPLE_PROVIDERS,
  GET_SURVEY_PEOPLE,
  downloadSurveysByDateRange,
  getPeopleProviders,
  getSurveyPeople,
} from './DownloadsActions';
import {
  PERSON_BY_SURVEY,
  PROVIDER_BY_PERSON,
  SURVEYS,
} from './constants';

import { AppTypes } from '../../../../core/edm/constants';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getSearchTerm } from '../../../../utils/QueryUtils';
import { getESIDFromConfig } from '../../../app/AppUtils';
import { APP_PATHS } from '../../../app/constants';
import { getSurveyResults } from '../../../profile/src/sagas/ProfileActions';
import { getSurveyResultsWorker } from '../../../profile/src/sagas/ProfileSagas';

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
    yield put(getSurveyPeople.failure(action.id));
  }

  return response;
}

function* getSurveyPeopleWatcher() :Saga<void> {
  yield takeLatest(GET_SURVEY_PEOPLE, getSurveyPeopleWorker);
}

function* getPeopleProvidersWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let response :WorkerResponse = {
    data: undefined,
  };

  try {
    const { value: peopleIds } = action;
    if (!(Array.isArray(peopleIds) && peopleIds.every(isValidUUID))) throw ERR_ACTION_VALUE_TYPE;
    yield put(getPeopleProviders.request(action.id));

    const config = yield select((store) => store.getIn(APP_PATHS.APP_CONFIG));
    const assessedByESID = getESIDFromConfig(config, AppTypes.ASSESSED_BY);
    const peopleESID = getESIDFromConfig(config, AppTypes.PEOPLE);
    const providerESID = getESIDFromConfig(config, AppTypes.PROVIDER);

    const providerResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: peopleESID,
        filter: {
          entityKeyIds: peopleIds,
          edgeEntitySetIds: [assessedByESID],
          destinationEntitySetIds: [providerESID],
          sourceEntitySetIds: [],
        }
      })
    );

    if (providerResponse.error) throw providerResponse.error;
    const providerResponseData = fromJS(providerResponse.data)
      .map((people) => people.getIn([0, 'neighborDetails']));
    response = { data: providerResponseData };
    yield put(getPeopleProviders.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response = { error };
    yield put(getPeopleProviders.failure(action.id));
  }

  return response;
}

function* getPeopleProvidersWatcher() :Saga<void> {
  yield takeLatest(GET_PEOPLE_PROVIDERS, getPeopleProvidersWorker);
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

    const surveyResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );
    if (surveyResponse.error) throw surveyResponse.error;

    const surveys = surveyResponse?.data?.hits;
    const surveysById = Map(surveys.map((entity) => [getEntityKeyId(entity), fromJS(entity)]));

    response.data = Map({
      [SURVEYS]: surveysById,
    });

    const surveyIds = surveys?.map(getEntityKeyId) || [];

    // find survey results and people
    if (surveyIds.length) {
      const surveyResultsRequest = call(getSurveyResultsWorker, getSurveyResults(surveyIds));
      const surveyPeopleRequest = call(getSurveyPeopleWorker, getSurveyPeople(surveyIds));
      const [surveyResultsResponse, surveyPeopleResponse] = yield all([
        surveyResultsRequest,
        surveyPeopleRequest,
      ]);
      if (surveyResultsResponse.error) throw surveyResultsResponse.error;
      if (surveyPeopleResponse.error) throw surveyPeopleResponse.error;

      response.data = response?.data?.merge({
        [PERSON_BY_SURVEY]: surveyPeopleResponse.data,
      }).merge(surveyResultsResponse.data);

      const peopleIds = [];
      surveyPeopleResponse?.data?.forEach((person) => {
        peopleIds.push(getEntityKeyId(person));
      });

      // find providers for people
      if (peopleIds.length) {
        const peopleProvidersResponse = yield call(getPeopleProvidersWorker, getPeopleProviders(peopleIds));
        if (peopleProvidersResponse.error) throw peopleProvidersResponse;
        response.data = response?.data?.merge({
          [PROVIDER_BY_PERSON]: peopleProvidersResponse.data
        });
      }

    }

    yield put(downloadSurveysByDateRange.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response = { error };
    yield put(downloadSurveysByDateRange.failure(action.id));
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
  getPeopleProvidersWatcher,
  getPeopleProvidersWorker,
};
