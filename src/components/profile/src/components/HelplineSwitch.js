// @flow
import React, { useEffect } from 'react';

import { ValidationUtils } from 'lattice-utils';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router';

import ProfileContainer from './ProfileContainer';
import SurveyContainer from './SurveyContainer';
import { useDispatch } from './HelplineProvider';

import { initializeHelpline } from '../../../../containers/app/AppActions';

const { isValidUUID } = ValidationUtils;

type Props = {
  match :Match;
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const HelplineSwitch = ({
  match,
  organizationId,
  personId,
  root,
} :Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isValidUUID) {
      dispatch(initializeHelpline(organizationId));
    }
  }, [dispatch, organizationId]);

  return (
    <Switch>
      <Route path={`${root}/survey/:submissionId`} render={() => <SurveyContainer match={match} root={root} />} />
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default HelplineSwitch;
