// @flow
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';

import { getProfileSummary } from '../sagas/ProfileActions';

type Props = {
  personId :UUID;
};

const ProfileSummary = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const needs = useSelector((state) => state.getIn(['profile', 'needs']));
  const data = useSelector((state) => state.getIn(['profile', 'data']));
  const surveys = useSelector((state) => state.getIn(['profile', 'surveys']));

  useEffect(() => {
    dispatch(getProfileSummary(personId));
  }, [dispatch, personId]);

  return (
    <>
      <GreatestNeeds needs={needs} />
      <SelfSufficiencyMatrix data={data} />
      <SurveyHistory surveys={surveys} />
    </>
  );
};

export default ProfileSummary;
