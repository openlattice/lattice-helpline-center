// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';
import { Body, CenterWrapper } from './styled';

import { useDispatch, useSelector } from '../../../../core/redux';
import { GET_PROFILE_SUMMARY, getProfileSummary } from '../sagas/ProfileActions';
import { PROFILE, PROFILE_PATHS } from '../sagas/constants';

const { REQUEST_STATE } = ReduxConstants;

type Props = {
  personId :UUID;
};

const ProfileSummary = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const needs = useSelector((state) => state.getIn(PROFILE_PATHS.greatestNeeds));
  const selfSufficiency = useSelector((state) => state.getIn(PROFILE_PATHS.selfSufficiency));
  const surveys = useSelector((state) => state.getIn(PROFILE_PATHS.surveyHistory));
  const fetchState = useSelector((state) => state.getIn([PROFILE, GET_PROFILE_SUMMARY, REQUEST_STATE]));
  const lastRequest = useSelector((state) => state.getIn(PROFILE_PATHS.lastRequest));

  useEffect(() => {
    // fetch if lastRequest.personId doesn't match, or if age is more than 5 minutes
    const time :number = lastRequest.get(personId);
    if (!time || DateTime.local().valueOf() - time > 300000) {
      dispatch(getProfileSummary(personId));
    }
  }, [dispatch, lastRequest, personId]);

  if (fetchState === RequestStates.PENDING) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <Body>
      <GreatestNeeds needs={needs} />
      <SelfSufficiencyMatrix data={selfSufficiency.toJS()} />
      <SurveyHistory surveys={surveys} />
    </Body>
  );
};

export default ProfileSummary;
