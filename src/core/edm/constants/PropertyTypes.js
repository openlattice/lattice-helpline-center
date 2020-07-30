/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  DOB: FQN.of('nc.PersonBirthDate'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  NAME: FQN.of('ol.name'),
  DATE_TIME: FQN.of('ol.datetime'),
  ID: FQN.of('ol.id'),
  SURNAME: FQN.of('nc.PersonSurName'),
};

export default PROPERTY_TYPE_FQNS;
