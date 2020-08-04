// @flow
import React from 'react';

import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';

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
  personId :UUID;
};

const ProfileContainer = ({ personId } :Props) => (
  <ProfileGrid>
    <ProfileAside />
    <ProfileBody personId={personId} />
  </ProfileGrid>
);

export default ProfileContainer;
