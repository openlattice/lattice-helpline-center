import React, { useState } from 'react';

import { configure } from 'lattice';
import {
  Button,
  Card,
  CardSegment,
  Input,
  Label,
} from 'lattice-ui-kit';
import { Provider } from 'react-redux';

import { createMockSufficiencyData, createMockSurveyHistoryData } from './utils';

import initializeReduxStore from '../../../core/redux/ReduxStore';
import initializeRouterHistory from '../../../core/router/RouterHistory';
import { PropertyTypes } from '../../../core/edm/constants';
import {
  ProfileContainer,
} from '..';

const routerHistory = initializeRouterHistory();
const helplineStore = initializeReduxStore(routerHistory);

const {
  DOB,
  GIVEN_NAME,
  SURNAME,
} = PropertyTypes;

export default {
  title: 'Profile Container',
  component: ProfileContainer,
};

const data = createMockSufficiencyData();
const imageUrl = 'https://vignette.wikia.nocookie.net/spongebob/images/4/4f/One_Krabs_Trash_091.jpg/revision/latest?cb=20181228163723';
const needs = ['Food', 'Employment', 'Childcare'];
const person = {
  [GIVEN_NAME]: ['Smitty'],
  [SURNAME]: ['Werbenjagermanjensen'],
  [DOB]: ['2002-02-22']
};
const surveys = createMockSurveyHistoryData();

export const ProfileContainerStory = () => (
  <Provider store={helplineStore}>
    <ProfileContainer
        imageUrl={imageUrl}
        data={data}
        person={person}
        needs={needs}
        surveys={surveys} />
  </Provider>
);

ProfileContainerStory.story = {
  name: 'Profile Container'
};

export const LiveProfileContainerStory = () => {
  const [inputData, setInputs] = useState({
    jwtToken: '',
    orgId: '',
    personId: '',
  });
  const [organizationId, setOrganizationId] = useState('');

  const onConfigure = (e) => {
    e.preventDefault();
    const { jwtToken, orgId } = inputData;
    configure({
      baseUrl: 'production',
      authToken: jwtToken
    });
    setOrganizationId(orgId);
  };

  const onFetchProfile = (e) => {
    e.preventDefault();
    const { personId } = inputData;
    console.log('fetching...', personId);
    // fetch personId
  };

  const onChange = (e) => {
    setInputs({
      ...inputData,
      [e.target.name]: e.target.value.trim()
    });
  };

  return (
    <Provider store={helplineStore}>
      <Card>
        <CardSegment>
          <form onSubmit={onConfigure}>
            <Label htmlFor="jwt-token" subtle>JWT</Label>
            <Input id="jwt-token" name="jwtToken" onChange={onChange} />
            <Label htmlFor="org-id" subtle>Org ID</Label>
            <Input id="org-id" name="orgId" onChange={onChange} />
            <Button color="primary" type="submit">Configure</Button>
          </form>
          <form onSubmit={onFetchProfile}>
            <Label htmlFor="person-id" subtle>Person ID</Label>
            <Input id="person-id" name="personId" onChange={onChange} />
            <Button color="primary" type="submit">Fetch Profile</Button>
          </form>
        </CardSegment>
      </Card>
      <ProfileContainer
          organizationId={organizationId}
          imageUrl={imageUrl}
          data={data}
          person={person}
          needs={needs}
          surveys={surveys} />
    </Provider>
  );
};

LiveProfileContainerStory.story = {
  name: 'Live Profile Container'
};
