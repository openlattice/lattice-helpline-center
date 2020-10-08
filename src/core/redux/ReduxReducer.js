/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';

import { REDUCERS } from './constants';

import ProfileReducer from '../../containers/profile/src/sagas/ProfileReducer';
import { AppReducer } from '../../containers/app';
import { DataReducer } from '../data';
import { EDMReducer } from '../edm';

export default function reduxReducer(routerHistory :any) {

  return combineReducers({
    [REDUCERS.APP]: AppReducer,
    [REDUCERS.DATA]: DataReducer,
    [REDUCERS.EDM]: EDMReducer,
    router: connectRouter(routerHistory),
    profile: ProfileReducer,
  });
}
