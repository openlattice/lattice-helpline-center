/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  CODE: FQN.of('ol.code'),
  DATE_TIME: FQN.of('ol.datetime'),
  DOB: FQN.of('nc.PersonBirthDate'),
  FULL_NAME: FQN.of('general.fullname'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  ID: FQN.of('ol.id'),
  NAME: FQN.of('ol.name'),
  SCORE_CATEGORY: FQN.of('ol.scorecategory'),
  SCORE_VALUE: FQN.of('ol.scorevalue'),
  SSN: FQN.of('general.ssnlast4'),
  SURNAME: FQN.of('nc.PersonSurName'),
  TITLE: FQN.of('ol.title'),
  VALUES: FQN.of('ol.values'),
};

export default PROPERTY_TYPE_FQNS;
