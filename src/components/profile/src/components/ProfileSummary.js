// @flow
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';

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

  useEffect(() => {
    dispatch(getProfileSummary(personId));
  }, [dispatch, personId]);

  return (
    <>
      <GreatestNeeds needs={needs} />
      <SelfSufficiencyMatrix data={selfSufficiency.toJS()} />
      <SurveyHistory surveys={surveys} />
    </>
  );
};

export default ProfileSummary;
