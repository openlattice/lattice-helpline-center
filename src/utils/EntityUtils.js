// @flow
import {
  Map,
  get,
  getIn,
  isCollection
} from 'immutable';
import { Models } from 'lattice';

const { FQN } = Models;

// returns first value of an entity property by FQN
const getPropertyValue = (
  entity :Map | Object,
  fqn :FQN | string,
) :any => getIn(entity, [fqn, 0]);

const getPropertyMultiValue = (
  entity :Map | Object,
  fqn :FQN | string,
) :any[] => {
  const values = get(entity, fqn) || [];
  return isCollection(values) ? values.toJS() : values;
};

const getPropertyValues = (
  entity :Map | Object,
  fqns :any[],
) :any[] => fqns.map((fqn :FQN | string) => getPropertyValue(entity, fqn));

export {
  getPropertyMultiValue,
  getPropertyValue,
  getPropertyValues,
};
