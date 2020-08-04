// @flow
import React from 'react';

import { Spinner } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';

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
            <ProfileSummary personId={personId} />
          )
      }
    </Body>
  );

};

export default ProfileBody;
