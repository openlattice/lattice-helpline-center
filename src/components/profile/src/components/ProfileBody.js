// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { Spinner, StyleUtils } from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import ProfileSummary from './ProfileSummary';

import { INITIALIZE_HELPLINE, initializeHelpline } from '../../../../containers/app/AppActions';

const { isValidUUID } = ValidationUtils;

const { media } = StyleUtils;

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
  padding: 0 30px;
  ${media.phone`
    padding: 0 15px;
  `}
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
