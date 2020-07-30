/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { Types } from 'lattice';
import {
  AppApiActions,
  AppApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_HELPLINE,
  initializeHelpline,
} from './AppActions';

import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { isValidUUID } = ValidationUtils;

const { SecurableTypes } = Types;
const { getApp, getAppConfigs, getAppTypes } = AppApiActions;
const { getAppWorker, getAppConfigsWorker, getAppTypesWorker } = AppApiSagas;
const { getEntityDataModelProjection } = EntityDataModelApiActions;
const { getEntityDataModelProjectionWorker } = EntityDataModelApiSagas;

const LOG = new Logger('AppSagas');

const APP_NAME = 'Helpline';

/*
 *
 * sagas
 *
 */

/*
 * initializeHelpline()
 */

function* initializeHelplineWatcher() :Generator<*, *, *> {

  yield takeEvery(INITIALIZE_HELPLINE, initializeHelplineWorker);
}

function* initializeHelplineWorker(action :SequenceAction) :Generator<*, *, *> {

  const workerResponse :Object = {};
  try {
    const { value: organizationId } = action;
    if (!isValidUUID(organizationId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(initializeHelpline.request(action.id));

    /*
     * 1. load App
     */
    let response :any = yield call(getAppWorker, getApp(APP_NAME));
    if (response.error) throw response.error;

    /*
     * 2. load AppConfig, AppTypes
     */

    const app = response.data;
    const [appConfigsResponse, appTypesResponse] = yield all([
      call(getAppConfigsWorker, getAppConfigs(app.id)),
      call(getAppTypesWorker, getAppTypes(app.appTypeIds)),
    ]);
    if (appConfigsResponse.error) throw appConfigsResponse.error;
    if (appTypesResponse.error) throw appTypesResponse.error;
    const appConfig = appConfigsResponse.data.reduce((acc, config) => {
      let selectedConfig = acc;
      if (config.organization.id === organizationId) {
        selectedConfig = config;
      }
      return selectedConfig;
    }, {});

    /*
     * 3. load EntityTypes and PropertyTypes
     */

    const appTypesMap :Object = appTypesResponse.data;
    const appTypes :Object[] = (Object.values(appTypesMap) :any);
    const projection :Object[] = appTypes.map((appType :Object) => ({
      id: appType.entityTypeId,
      include: [SecurableTypes.EntityType, SecurableTypes.PropertyTypeInEntitySet],
      type: SecurableTypes.EntityType,
    }));
    response = yield call(getEntityDataModelProjectionWorker, getEntityDataModelProjection(projection));
    if (response.error) throw response.error;

    const edm :Object = response.data;
    workerResponse.data = {
      appConfig,
      appTypes,
      edm
    };

    yield put(initializeHelpline.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse.error = error;
    yield put(initializeHelpline.failure(action.id, error));
  }
  finally {
    yield put(initializeHelpline.finally(action.id));
  }

  return workerResponse;
}

/*
 *
 * exports
 *
 */

export {
  initializeHelplineWatcher,
  initializeHelplineWorker,
};
