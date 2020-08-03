import React from 'react';

import styled from 'styled-components';

import ProfileCard from './ProfileCard';
import { useSelector } from './HelplineProvider';

import { PROFILE_PATHS } from '../sagas/constants';

const Centered = styled.div`
  align-items: center;
`;

const ProfileAside = () => {
  const person = useSelector((store) => store.getIn(PROFILE_PATHS.person));

  return (
    <Centered>
      <ProfileCard person={person} />
    </Centered>
  );
};

export default ProfileAside;
