// @flow
import React from 'react';

import styled from 'styled-components';
import { Map, getIn } from 'immutable';
import { Constants } from 'lattice';
import { StyleUtils } from 'lattice-ui-kit';

import HelplineProvider from './HelplineProvider';
import ProfileBody from './ProfileBody';
import ProfileCard from './ProfileCard';

const { OPENLATTICE_ID_FQN } = Constants;
const { media } = StyleUtils;

const Centered = styled.div`
  align-items: center;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: auto 1fr;
  ${media.phone`
    grid-template-columns: auto;
  `}
`;

type Props = {
  imageUrl ?:string;
  organizationId :UUID;
  person :Map | Object;
};

const ProfileContainer = (props :Props) => {
  const {
    imageUrl,
    organizationId,
    person,
  } = props;

  const personId = getIn(person, [OPENLATTICE_ID_FQN, 0]);

  return (
    <HelplineProvider>
      <ProfileGrid>
        <Centered>
          <ProfileCard imageUrl={imageUrl} person={person} />
        </Centered>
        <ProfileBody organizationId={organizationId} personId={personId} />
      </ProfileGrid>
    </HelplineProvider>
  );
};

ProfileContainer.defaultProps = {
  imageUrl: '',
};

export default ProfileContainer;
