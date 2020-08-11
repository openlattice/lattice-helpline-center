// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';

import GreatestNeeds from './GreatestNeeds';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';
import { useDispatch, useSelector } from './HelplineProvider';
import { SpinnerWrapper } from './styled';
import { getRelativeRoot } from './utils';

import { APP_PATHS } from '../../../../containers/app/constants';
import { GET_PROFILE_SUMMARY, getProfileSummary } from '../sagas/ProfileActions';
import { PROFILE, PROFILE_PATHS } from '../sagas/constants';

const { REQUEST_STATE } = ReduxConstants;

type Props = {
  personId :UUID;
};

const ProfileSummary = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const needs = useSelector((state) => state.getIn(PROFILE_PATHS.greatestNeeds));
  const selfSufficiency = useSelector((state) => state.getIn(PROFILE_PATHS.selfSufficiency));
  const surveys = useSelector((state) => state.getIn(PROFILE_PATHS.surveyHistory));
  const fetchState = useSelector((state) => state.getIn([PROFILE, GET_PROFILE_SUMMARY, REQUEST_STATE]));
  const lastRequest = useSelector((state) => state.getIn(PROFILE_PATHS.lastRequest));
  const relRoot = getRelativeRoot(root, match);

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
      <Link to={`${relRoot}/results`}>Results</Link>
      <GreatestNeeds needs={needs} />
      <SelfSufficiencyMatrix data={selfSufficiency.toJS()} />
      <SurveyHistory surveys={surveys} />
    </>
  );
};

export default ProfileSummary;
