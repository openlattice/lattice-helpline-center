/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  INTERNET_SESSION: FQN.of('app.internetsession'),
  REGISTERED_FOR: FQN.of('app.registeredfor'),
  PART_OF: FQN.of('app.partof'),
  ASSESSED_BY: FQN.of('app.assessedby2'),
  ADDRESSES: FQN.of('app.addresses'),
  SURVEY: FQN.of('app.survey'),
  RESPONDS_WITH: FQN.of('app.respondswith'),
  PROVIDER: FQN.of('app.provider'),
  SUMMARY_SET: FQN.of('app.summaryset'),
  PEOPLE: FQN.of('app.people'),
  LOCATION: FQN.of('app.location'),
  LOCATED_AT: FQN.of('app.locatedat'),
  ANSWER: FQN.of('app.answer'),
  SUBMISSION: FQN.of('app.submission'),
  PARTICIPATED_IN: FQN.of('app.participatedin'),
  QUESTION: FQN.of('app.question'),
};

export default APP_TYPE_FQNS;
