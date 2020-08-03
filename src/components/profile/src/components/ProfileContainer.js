// @flow
import React from 'react';

import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';

import HelplineProvider from './HelplineProvider';
import ProfileAside from './ProfileAside';
import ProfileBody from './ProfileBody';

const { media } = StyleUtils;

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: auto 1fr;
  ${media.phone`
    grid-template-columns: auto;
  `}
`;

type Props = {
  organizationId :UUID;
  personId :UUID;
};

const ProfileContainer = (props :Props) => {
  const {
    organizationId,
    personId
  } = props;

  return (
    <HelplineProvider>
      <ProfileGrid>
        <ProfileAside />
        <ProfileBody organizationId={organizationId} personId={personId} />
      </ProfileGrid>
    </HelplineProvider>
  );
};

export default ProfileContainer;
