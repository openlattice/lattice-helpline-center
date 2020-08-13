/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const INITIALIZE_HELPLINE :'INITIALIZE_HELPLINE' = 'INITIALIZE_HELPLINE';
const initializeHelpline :RequestSequence = newRequestSequence(INITIALIZE_HELPLINE);

const SET_ROOT :'SET_ROOT' = 'SET_ROOT';
const setRoot = (value :string) => ({
  type: SET_ROOT,
  value
});

export {
  INITIALIZE_HELPLINE,
  initializeHelpline,
  SET_ROOT,
  setRoot,
};
