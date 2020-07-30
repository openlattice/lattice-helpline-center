/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_HELPLINE,
  initializeHelpline,
} from './AppActions';

import { ReduxActions } from '../../core/redux';

const { REQUEST_STATE } = ReduxConstants;
const { RESET_REQUEST_STATE } = ReduxActions;

const INITIAL_STATE :Map = fromJS({
  [INITIALIZE_HELPLINE]: { [REQUEST_STATE]: RequestStates.STANDBY },
  appConfig: {},
  appTypes: [],
  edm: {}
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
