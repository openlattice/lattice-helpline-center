// @flow
import { Map, getIn } from 'immutable';
import type { FQN } from 'lattice';

function getESIDFromConfig(config :Map, appType :FQN) {
  return getIn(config, [appType, 'entitySetId']);
}

export {
  getESIDFromConfig
};
