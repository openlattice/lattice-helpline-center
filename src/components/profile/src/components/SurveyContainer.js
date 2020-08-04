import React, { useEffect } from 'react';

import { useRouteMatch } from 'react-router';

import SocialNeedsSurvey from './SocialNeedsSurvey';
import { useDispatch, useSelector } from './HelplineProvider';

import { getSurvey } from '../sagas/SurveyActions';
import { PROFILE_PATHS } from '../sagas/constants';

const SurveyContainer = () => {
  // get person and pass to breadcrumb
  const dispatch = useDispatch();
  const person = useSelector((store) => store.getIn(PROFILE_PATHS.person));
  const { params: { submissionId } } = useRouteMatch();

  useEffect(() => {
    dispatch(getSurvey(submissionId));
  }, [dispatch, submissionId]);

  return <SocialNeedsSurvey />;
};

export default SurveyContainer;
