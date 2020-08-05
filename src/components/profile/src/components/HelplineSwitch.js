// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { Route, Switch } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { Match } from 'react-router';

import ProfileContainer from './ProfileContainer';
import SurveyContainer from './SurveyContainer';
import { useDispatch, useSelector } from './HelplineProvider';
import { SpinnerWrapper } from './styled';

import { INITIALIZE_HELPLINE, initializeHelpline } from '../../../../containers/app/AppActions';

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
      dispatch(initializeHelpline({ match, organizationId, root }));
    }
    // do NOT reinitialize whenever match updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));
  if (initializeState === RequestStates.PENDING || initializeState === RequestStates.STANDBY) {
    return <SpinnerWrapper><Spinner size="3x" /></SpinnerWrapper>;
  }

  return (
    <Switch>
      <Route path={`${root}/survey/:submissionId`} render={() => <SurveyContainer />} />
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default HelplineSwitch;
