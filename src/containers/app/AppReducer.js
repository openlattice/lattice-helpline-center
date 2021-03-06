/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_HELPLINE,
  SET_ROOT,
  initializeHelpline,
} from './AppActions';

import { RESET_REQUEST_STATE } from '../../core/redux/ReduxActions';

const { REQUEST_STATE } = ReduxConstants;

const INITIAL_STATE :Map = fromJS({
  [INITIALIZE_HELPLINE]: { [REQUEST_STATE]: RequestStates.STANDBY },
  appConfig: {},
  root: '',
  match: {},
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      const { path } = action;
      if (path && state.hasIn(path)) {
        return state.setIn([...path, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case SET_ROOT: {
      const { value } = action;
      return state.set('root', value);
    }

    case initializeHelpline.case(action.type): {
      const seqAction :SequenceAction = action;
      return initializeHelpline.reducer(state, seqAction, {
        REQUEST: () => state.setIn([INITIALIZE_HELPLINE, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .setIn([INITIALIZE_HELPLINE, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([INITIALIZE_HELPLINE, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
