// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { useRouteMatch } from 'react-router';
import { RequestStates } from 'redux-reqseq';

import SocialNeedsSurvey from './SocialNeedsSurvey';
import { CenterWrapper } from './styled';

import { useDispatch, useSelector } from '../../../../core/redux';
import { GET_SURVEY, getSurvey } from '../sagas/ProfileActions';
import { PROFILE } from '../sagas/constants';

const { REQUEST_STATE } = ReduxConstants;

const SurveyContainer = () => {
  // get person and pass to breadcrumb
  const dispatch = useDispatch();
  const { params: { surveyId = '' } } = useRouteMatch();
  const fetchState = useSelector((state) => state.getIn([PROFILE, GET_SURVEY, REQUEST_STATE]));

  useEffect(() => {
    dispatch(getSurvey(surveyId));
  }, [dispatch, surveyId]);

  if (fetchState === RequestStates.PENDING) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return <SocialNeedsSurvey surveyId={surveyId} />;
};

export default SurveyContainer;
