import { Set } from 'immutable';

import * as AppActions from './AppActions';

import { testShouldExportActionTypes, testShouldExportRequestSequences } from '../../utils/testing/TestUtils';

const ACTION_TYPES = Set([
  'INITIALIZE_HELPLINE',
]).sort();

const REQSEQ_NAMES = Set([
  'initializeHelpline',
]).sort();

describe('AppActions', () => {

  testShouldExportActionTypes(AppActions, ACTION_TYPES.toJS());
  testShouldExportRequestSequences(AppActions, ACTION_TYPES.toJS(), REQSEQ_NAMES.toJS());
});
