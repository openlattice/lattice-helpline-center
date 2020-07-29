// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { StyleUtils } from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { Provider, useDispatch } from 'react-redux';

import GreatestNeeds from './GreatestNeeds';
import ProfileCard from './ProfileCard';
import SelfSufficiencyMatrix from './SelfSufficiencyMatrix';
import SurveyHistory from './SurveyHistory';

import initializeReduxStore from '../../../../core/redux/ReduxStore';
import initializeRouterHistory from '../../../../core/router/RouterHistory';
import { initializeHelpline } from '../../../../containers/app/AppActions';

const routerHistory = initializeRouterHistory();
const helplineStore = initializeReduxStore(routerHistory);
const { isValidUUID } = ValidationUtils;

const { media } = StyleUtils;

const Centered = styled.div`
  place-items: center;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: auto 1fr;
  ${media.phone`
    grid-template-columns: auto;
  `}
`;

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
  padding: 0 30px;
  ${media.phone`
    padding: 0 15px;
  `}
`;

type Props = {
  data ?:Object[];
  imageUrl ?:string;
  needs :string[];
  organizationId ?:UUID;
  person :Map | Object;
  surveys :List | Object[];
};

const ProfileContainer = (props :Props) => {
  const {
    data,
    imageUrl,
    needs,
    organizationId,
    person,
    surveys,
  } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    if (isValidUUID) {
      dispatch(initializeHelpline(organizationId));
    }
  }, [dispatch, organizationId]);

  return (
    <ProfileGrid>
      <Centered>
        <ProfileCard imageUrl={imageUrl} person={person} />
      </Centered>
      <Body>
        <GreatestNeeds needs={needs} />
        <SelfSufficiencyMatrix data={data} />
        <SurveyHistory surveys={surveys} />
      </Body>
    </ProfileGrid>
  );
};

ProfileContainer.defaultProps = {
  imageUrl: '',
  needs: [],
  data: [],
  surveys: [],
  organizationId: ''
};

export default ProfileContainer;
