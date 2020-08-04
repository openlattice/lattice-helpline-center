/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_SURVEY,
  getSurvey,
} from './SurveyActions';
import {
  PERSON,
} from './constants';

import { ReduxActions } from '../../../../core/redux';

const { REQUEST_STATE } = ReduxConstants;
const { RESET_REQUEST_STATE } = ReduxActions;

const INITIAL_STATE :Map = fromJS({
  [GET_SURVEY]: {
    [REQUEST_STATE]: RequestStates.STANDBY
  },
  [PERSON]: Map(),
});

export default function profileReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      const { path } = action;
      if (path && state.hasIn(path)) {
        return state.setIn([...path, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case getSurvey.case(action.type): {
      const seqAction :SequenceAction = action;
      return getSurvey.reducer(state, seqAction, {
        REQUEST: () => state.setIn([GET_SURVEY, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .setIn([GET_SURVEY, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([GET_SURVEY, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
