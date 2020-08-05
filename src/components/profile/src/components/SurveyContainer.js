// @flow
import React, { useEffect } from 'react';

import { useRouteMatch } from 'react-router';

import SocialNeedsSurvey from './SocialNeedsSurvey';
import { useDispatch } from './HelplineProvider';

import { getSurvey } from '../sagas/ProfileActions';

const SurveyContainer = () => {
  // get person and pass to breadcrumb
  const dispatch = useDispatch();
  const { params: { submissionId } } = useRouteMatch();

  useEffect(() => {
    dispatch(getSurvey(submissionId));
  }, [dispatch, submissionId]);

  return <SocialNeedsSurvey />;
};

export default SurveyContainer;
