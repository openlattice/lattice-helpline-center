/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';

import * as AppSagas from '../../containers/app/AppSagas';
import * as DownloadsSagas from '../../containers/downloads/src/sagas/DownloadsSagas';
import * as EDMSagas from '../edm/EDMSagas';
import * as ProfileSagas from '../../containers/profile/src/sagas/ProfileSagas';
import * as RoutingSagas from '../router/RoutingSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // "lattice-auth" sagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // AppSagas
    fork(AppSagas.initializeHelplineWatcher),

    // EDMSagas
    fork(EDMSagas.getEntityDataModelTypesWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    fork(ProfileSagas.getAggregateResultsWatcher),
    fork(ProfileSagas.getPersonWatcher),
    fork(ProfileSagas.getProfileSummaryWatcher),
    fork(ProfileSagas.getSubmissionsWatcher),
    fork(ProfileSagas.getSubmissionResultsWatcher),
    fork(ProfileSagas.getSurveyWatcher),

    fork(DownloadsSagas.downloadSurveysByDateRangeWatcher),
  ]);
}
