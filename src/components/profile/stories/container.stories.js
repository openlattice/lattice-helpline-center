import React, { useState } from 'react';

import { Constants, configure } from 'lattice';
import {
  Button,
  Card,
  CardSegment,
  Input,
  Label,
} from 'lattice-ui-kit';

import { PropertyTypes } from '../../../core/edm/constants';
import { ProfileContainer } from '..';

const { OPENLATTICE_ID_FQN } = Constants;

const {
  DOB,
  GIVEN_NAME,
  SURNAME,
} = PropertyTypes;

export default {
  title: 'Profile Container',
  component: ProfileContainer,
};

const imageUrl = 'https://vignette.wikia.nocookie.net/spongebob/images/4/4f/One_Krabs_Trash_091.jpg/revision/latest?cb=20181228163723';
const person = {
  [GIVEN_NAME]: ['Smitty'],
  [SURNAME]: ['Werbenjagermanjensen'],
  [DOB]: ['2002-02-22'],
  [OPENLATTICE_ID_FQN]: ['']
};

export const ProfileContainerStory = () => (
  <ProfileContainer
      imageUrl={imageUrl}
      person={person} />
);

ProfileContainerStory.story = {
  name: 'Profile Container'
};

export const LiveProfileContainerStory = () => {
  const [inputData, setInputs] = useState({
    jwt: '',
    orgId: '',
  });

  const [organizationId, setOrganizationId] = useState('');
  const { jwt, orgId } = inputData;

  const onConfigure = (e) => {
    e.preventDefault();
    configure({
      baseUrl: 'https://api.openlattice.com',
      authToken: jwt
    });
    setOrganizationId(orgId);
  };

  const onChange = (e) => {
    setInputs({
      ...inputData,
      [e.target.name]: e.target.value.trim()
    });
  };

  return (
    <>
      <Card>
        <CardSegment>
          <form onSubmit={onConfigure}>
            <Label htmlFor="jwt" subtle>JWT</Label>
            <Input id="jwt" name="jwt" onChange={onChange} value={inputData.jwt} />
            <Label htmlFor="org-id" subtle>Org ID</Label>
            <Input id="org-id" name="orgId" onChange={onChange} value={inputData.orgId} />
            <Button color="primary" type="submit">Configure</Button>
          </form>
        </CardSegment>
      </Card>
      <ProfileContainer
          organizationId={organizationId}
          imageUrl={imageUrl}
          person={person} />
    </>
  );
};

LiveProfileContainerStory.story = {
  name: 'Live Profile Container'
};
