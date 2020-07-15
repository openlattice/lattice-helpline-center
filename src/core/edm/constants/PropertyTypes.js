/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  OL_DATE_TIME: FQN.of('ol.datetime'),
  OL_ID: FQN.of('ol.id'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  SURNAME: FQN.of('nc.PersonSurName'),
  DOB: FQN.of('nc.PersonBirthDate'),
};

export default PROPERTY_TYPE_FQNS;
