// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';
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

  useEffect(() => {
    dispatch(getProfileSummary(personId));
  }, [dispatch, personId]);

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
