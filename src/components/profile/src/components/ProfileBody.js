// @flow
import React from 'react';

import { Spinner } from 'lattice-ui-kit';
import { Route, Switch } from 'react-router';
import { RequestStates } from 'redux-reqseq';

import AggregateResults from './AggregateResults';
import ProfileSummary from './ProfileSummary';
import { useSelector } from './HelplineProvider';
import { Body, SpinnerWrapper } from './styled';

import { INITIALIZE_HELPLINE } from '../../../../containers/app/AppActions';

type Props = {
  personId :UUID;
};

const ProfileBody = ({ personId } :Props) => {

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));

  return (
    <Body>
      {
        initializeState === RequestStates.PENDING
          ? <SpinnerWrapper><Spinner size="3x" /></SpinnerWrapper>
          : (
            <Switch>
              <Route path="/results" component={AggregateResults} />
              <Route render={() => <ProfileSummary personId={personId} />} />
            </Switch>
          )
      }
    </Body>
  );

};

export default ProfileBody;
