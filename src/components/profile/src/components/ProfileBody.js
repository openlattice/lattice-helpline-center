// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import ProfileSummary from './ProfileSummary';
import { useDispatch, useSelector } from './HelplineProvider';
import { Body, SpinnerWrapper } from './styled';

import { INITIALIZE_HELPLINE, initializeHelpline } from '../../../../containers/app/AppActions';

const { isValidUUID } = ValidationUtils;

type Props = {
  organizationId :UUID;
  personId :UUID;
};

const ProfileBody = ({ organizationId, personId } :Props) => {

  const dispatch = useDispatch();
  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));

  useEffect(() => {
    if (isValidUUID) {
      dispatch(initializeHelpline(organizationId));
    }
  }, [dispatch, organizationId]);

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
