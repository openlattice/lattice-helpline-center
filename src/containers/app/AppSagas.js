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
import {
  AppApiActions,
  AppApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_HELPLINE,
  initializeHelpline,
} from './AppActions';

import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { isValidUUID } = ValidationUtils;
const { isDefined } = LangUtils;

const { getApp, getAppConfigs } = AppApiActions;
const { getAppWorker, getAppConfigsWorker } = AppApiSagas;

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
    const { value: { match, organizationId, root } } = action;
    if (!isValidUUID(organizationId)) throw ERR_ACTION_VALUE_TYPE;
    if (typeof root !== 'string') throw ERR_ACTION_VALUE_TYPE;
    if (!isDefined(match)) throw ERR_ACTION_VALUE_TYPE;
    yield put(initializeHelpline.request(action.id));

    /*
     * 1. load App
     */
    const response :any = yield call(getAppWorker, getApp(APP_NAME));
    if (response.error) throw response.error;

    /*
     * 2. load AppConfig, AppTypes
     */

    const app = response.data;
    const appConfigsResponse = yield call(getAppConfigsWorker, getAppConfigs(app.id));
    if (appConfigsResponse.error) throw appConfigsResponse.error;
    const appConfig = appConfigsResponse.data.reduce((acc, config) => {
      let selectedConfig = acc;
      if (config.organization.id === organizationId) {
        selectedConfig = config;
      }
      return selectedConfig;
    }, {});

    workerResponse.data = {
      appConfig,
      root,
      match,
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
