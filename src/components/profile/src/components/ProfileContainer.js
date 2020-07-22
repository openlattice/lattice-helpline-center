// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';

import GreatestNeeds from './GreatestNeeds';
import ProfileCard from './ProfileCard';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 48px;
  grid-template-columns: auto 1fr;
`;

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
`;

type Props = {
  data :any[];
  imageUrl :string;
  needs :string[];
  person :Map;
  surveys :List;
};

const ProfileContainer = (props :Props) => {
  const {
    data,
    imageUrl,
    needs,
    person,
    surveys
  } = props;
  return (
    <ProfileGrid>
      <div>
        <ProfileCard imageUrl={imageUrl} person={person} />
      </div>
      <Body>
        <GreatestNeeds needs={needs} />
        <SelfSufficiencyMatrix data={data} />
        <SurveyHistory surveys={surveys} />
      </Body>
    </ProfileGrid>
  );
};

export default ProfileContainer;
