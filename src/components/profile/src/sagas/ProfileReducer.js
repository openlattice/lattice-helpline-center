/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PROFILE_SUMMARY,
  GET_SURVEY,
  getProfileSummary,
  getSurvey,
} from './ProfileActions';
import {
  ANSWERS,
  GREATEST_NEEDS,
  LAST_REQUEST,
  PERSON,
  QUESTIONS,
  SELF_SUFFICIENCY,
  SURVEY,
  SURVEY_HISTORY,
} from './constants';

import { ReduxActions } from '../../../../core/redux';

const { REQUEST_STATE } = ReduxConstants;
const { RESET_REQUEST_STATE } = ReduxActions;

const INITIAL_STATE :Map = fromJS({
  [GET_PROFILE_SUMMARY]: {
    [REQUEST_STATE]: RequestStates.STANDBY
  },
  [GET_SURVEY]: {
    [REQUEST_STATE]: RequestStates.STANDBY
  },
  [ANSWERS]: Map(),
  [GREATEST_NEEDS]: List(),
  [LAST_REQUEST]: Map(),
  [PERSON]: Map(),
  [QUESTIONS]: Map(),
  [SELF_SUFFICIENCY]: List(),
  [SURVEY]: Map(),
  [SURVEY_HISTORY]: List(),
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

    case getProfileSummary.case(action.type): {
      const seqAction :SequenceAction = action;
      return getProfileSummary.reducer(state, seqAction, {
        REQUEST: () => INITIAL_STATE.setIn([GET_PROFILE_SUMMARY, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .setIn([GET_PROFILE_SUMMARY, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([GET_PROFILE_SUMMARY, REQUEST_STATE], RequestStates.FAILURE),
      });
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
