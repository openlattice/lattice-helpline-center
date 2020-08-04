// @flow
import React, { useEffect } from 'react';

import { ValidationUtils } from 'lattice-utils';
import { useRouteMatch } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import ProfileContainer from './ProfileContainer';
import SurveyContainer from './SurveyContainer';
import { useDispatch } from './HelplineProvider';

import { initializeHelpline } from '../../../../containers/app/AppActions';

const { isValidUUID } = ValidationUtils;

type Props = {
  organizationId :UUID;
  personId :UUID;
};

const HelplineSwitch = ({ organizationId, personId } :Props) => {
  const dispatch = useDispatch();
  const match = useRouteMatch();

  useEffect(() => {
    if (isValidUUID) {
      dispatch(initializeHelpline(organizationId));
    }
  }, [dispatch, organizationId]);

  return (
    <Switch>
      <Route path={`${match.url}/survey/:submissionId`} component={SurveyContainer} />
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default HelplineSwitch;
