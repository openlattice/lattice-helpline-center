/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  DATE_TIME: FQN.of('ol.datetime'),
  DOB: FQN.of('nc.PersonBirthDate'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  ID: FQN.of('ol.id'),
  NAME: FQN.of('ol.name'),
  SURNAME: FQN.of('nc.PersonSurName'),
  VALUES: FQN.of('ol.values'),
};

export default PROPERTY_TYPE_FQNS;
