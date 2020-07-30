/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const INITIALIZE_HELPLINE :'INITIALIZE_HELPLINE' = 'INITIALIZE_HELPLINE';
const initializeHelpline :RequestSequence = newRequestSequence(INITIALIZE_HELPLINE);

export {
  INITIALIZE_HELPLINE,
  initializeHelpline,
};
