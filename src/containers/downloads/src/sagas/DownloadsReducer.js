/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  DOWNLOAD_SURVEYS_BY_DATE_RANGE,
  downloadSurveysByDateRange,
} from './DownloadsActions';
import {
  ANSWERS,
  PERSON_BY_SUBMISSION,
  PROVIDER_BY_SUBMISSION,
  QUESTIONS,
  SUBMISSIONS,
  SUBMISSION_ANSWERS_BY_QUESTION,
} from './constants';

import { RESET_REQUEST_STATE } from '../../../../core/redux/ReduxActions';

const { REQUEST_STATE } = ReduxConstants;

const INITIAL_STATE :Map = fromJS({
  [DOWNLOAD_SURVEYS_BY_DATE_RANGE]: {
    [REQUEST_STATE]: RequestStates.STANDBY
  },
  [ANSWERS]: Map(),
  [PERSON_BY_SUBMISSION]: Map(),
  [PROVIDER_BY_SUBMISSION]: Map(),
  [QUESTIONS]: Map(),
  [SUBMISSIONS]: Map(),
  [SUBMISSION_ANSWERS_BY_QUESTION]: Map(),
});

export default function downloadsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      const { path } = action;
      if (path && state.hasIn(path)) {
        return state.setIn([...path, REQUEST_STATE], RequestStates.STANDBY);
      }
      return state;
    }

    case downloadSurveysByDateRange.case(action.type): {
      const seqAction :SequenceAction = action;
      return downloadSurveysByDateRange.reducer(state, seqAction, {
        REQUEST: () => INITIAL_STATE
          .setIn([DOWNLOAD_SURVEYS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .setIn([DOWNLOAD_SURVEYS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([DOWNLOAD_SURVEYS_BY_DATE_RANGE, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
