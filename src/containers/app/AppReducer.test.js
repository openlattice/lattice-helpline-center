import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import reducer from './AppReducer';
import {
  INITIALIZE_HELPLINE,
  initializeHelpline,
} from './AppActions';

const MOCK_APP_NAME = 'TestApp';
const MOCK_ERR_STATUS = 500;
const MOCK_ERR_RESPONSE = {
  response: {
    status: MOCK_ERR_STATUS,
  },
};

describe('AppReducer', () => {

  const INITIAL_STATE = reducer(undefined, { type: '__TEST__' });

  test('INITIAL_STATE', () => {
    expect(INITIAL_STATE).toBeInstanceOf(Map);
    expect(INITIAL_STATE.toJS()).toEqual({
      [INITIALIZE_HELPLINE]: {
        requestState: RequestStates.STANDBY,
      },
      appConfig: {},
      root: '',
      match: {},
    });
  });

  describe(INITIALIZE_HELPLINE, () => {

    test(initializeHelpline.REQUEST, () => {

      const { id } = initializeHelpline();
      const requestAction = initializeHelpline.request(id, MOCK_APP_NAME);
      const state = reducer(INITIAL_STATE, requestAction);
      expect(state.getIn([INITIALIZE_HELPLINE, 'requestState'])).toEqual(RequestStates.PENDING);
    });

    test(initializeHelpline.SUCCESS, () => {

      const { id } = initializeHelpline();
      const requestAction = initializeHelpline.request(id, MOCK_APP_NAME);
      let state = reducer(INITIAL_STATE, requestAction);
      state = reducer(state, initializeHelpline.success(id));
      expect(state.getIn([INITIALIZE_HELPLINE, 'requestState'])).toEqual(RequestStates.SUCCESS);
    });

    test(initializeHelpline.FAILURE, () => {

      const { id } = initializeHelpline();
      const requestAction = initializeHelpline.request(id, MOCK_APP_NAME);
      let state = reducer(INITIAL_STATE, requestAction);
      state = reducer(state, initializeHelpline.failure(id, MOCK_ERR_RESPONSE));
      expect(state.getIn([INITIALIZE_HELPLINE, 'requestState'])).toEqual(RequestStates.FAILURE);
    });

    test(initializeHelpline.FINALLY, () => {

      const { id } = initializeHelpline();
      let state = reducer(INITIAL_STATE, initializeHelpline.request(id, MOCK_APP_NAME));
      state = reducer(state, initializeHelpline.success(id));
      state = reducer(state, initializeHelpline.finally(id));
      expect(state.getIn([INITIALIZE_HELPLINE, 'requestState'])).toEqual(RequestStates.SUCCESS);
    });

  });

});
