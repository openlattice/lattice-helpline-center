// @flow
import { Map, getIn } from 'immutable';

import { PropertyTypes } from '../../../../core/edm/constants';

const getFirstLastFromPerson = (person :Map | Object) => {
  const firstName = getIn(person, [PropertyTypes.GIVEN_NAME, 0], '').trim();
  const last = getIn(person, [PropertyTypes.SURNAME, 0], '').trim();

  return `${firstName} ${last}`;
};

export {
  getFirstLastFromPerson
};
