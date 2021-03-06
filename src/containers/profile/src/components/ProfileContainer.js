// @flow
import React from 'react';

import styled from 'styled-components';
import { Breadcrumbs, StyleUtils } from 'lattice-ui-kit';

import ProfileAside from './ProfileAside';
import ProfileBody from './ProfileBody';
import { getFirstLastFromPerson } from './utils';

import { BreadcrumbItem, BreadcrumbWrapper } from '../../../../components/breadcrumbs';
import { useSelector } from '../../../../core/redux';
import { PROFILE_PATHS } from '../sagas/constants';

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

const ProfileContainer = ({ personId } :Props) => {
  const person = useSelector((store) => store.getIn(PROFILE_PATHS.person));
  const name = getFirstLastFromPerson(person);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumbs>
          <BreadcrumbItem>{name}</BreadcrumbItem>
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <ProfileGrid>
        <ProfileAside />
        <ProfileBody personId={personId} />
      </ProfileGrid>
    </div>
  );
};

export default ProfileContainer;
