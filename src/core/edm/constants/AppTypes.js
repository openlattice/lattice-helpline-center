/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  ADDRESSES: FQN.of('app.addresses'),
  ANSWER: FQN.of('app.answer'),
  ASSESSED_BY: FQN.of('app.assessedby2'),
  INTERNET_SESSION: FQN.of('app.internetsession'),
  LOCATED_AT: FQN.of('app.locatedat'),
  LOCATION: FQN.of('app.location'),
  OCCURRED_AT: FQN.of('app.occurredat'),
  PARTICIPATED_IN: FQN.of('app.participatedin'),
  PART_OF: FQN.of('app.partof'),
  PEOPLE: FQN.of('app.people'),
  PROVIDER: FQN.of('app.provider'),
  QUESTION: FQN.of('app.question'),
  REGISTERED_FOR: FQN.of('app.registeredfor'),
  RESPONDS_WITH: FQN.of('app.respondswith'),
  SUBMISSION: FQN.of('app.submission'),
  SUMMARY_SET: FQN.of('app.summaryset'),
  SURVEY: FQN.of('app.survey'),
};

export default APP_TYPE_FQNS;
