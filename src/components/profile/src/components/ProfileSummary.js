// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';
import { useDispatch, useSelector } from './HelplineProvider';
import { SpinnerWrapper } from './styled';

import { getProfileSummary } from '../sagas/ProfileActions';
import { PROFILE_PATHS } from '../sagas/constants';

type Props = {
  personId :UUID;
};

const ProfileSummary = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const needs = useSelector((state) => state.getIn(PROFILE_PATHS.greatestNeeds));
  const selfSufficiency = useSelector((state) => state.getIn(PROFILE_PATHS.selfSufficiency));
  const surveys = useSelector((state) => state.getIn(PROFILE_PATHS.surveyHistory));
  const fetchState = useSelector((state) => state.getIn(PROFILE_PATHS.requestState));
  const lastRequest = useSelector((state) => state.getIn(PROFILE_PATHS.lastRequest));

  useEffect(() => {
    // fetch if lastRequest.personId doesn't match, or if age is more than 5 minutes
    const time :number = lastRequest.get(personId);
    if (!time || DateTime.local().valueOf() - time > 300000) {
      dispatch(getProfileSummary(personId));
    }
  }, [dispatch, lastRequest, personId]);

  if (fetchState === RequestStates.PENDING) {
    return <SpinnerWrapper><Spinner size="3x" /></SpinnerWrapper>;
  }

  return (
    <>
      <GreatestNeeds needs={needs} />
      <SelfSufficiencyMatrix data={selfSufficiency.toJS()} />
      <SurveyHistory surveys={surveys} />
    </>
  );
};

export default ProfileSummary;
