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
  [OPENLATTICE_ID_FQN]: ['9d010000-0000-0000-8000-00000001864d']
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
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbG9tb25Ab3BlbmxhdHRpY2UuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDExMTIxNzkwNTcyOTE4NzM3ODczNCIsInVzZXJfbWV0YWRhdGEiOnt9LCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsiQXV0aGVudGljYXRlZFVzZXIiLCJhZG1pbiJdLCJvcmdhbml6YXRpb25zIjpbIjAwMDAwMDAwLTAwMDAtMDAwMS0wMDAwLTAwMDAwMDAwMDAwMCJdLCJhY3RpdmF0ZWQiOiJhY3RpdmF0ZWQifSwibmlja25hbWUiOiJzb2xvbW9uIiwicm9sZXMiOlsiQXV0aGVudGljYXRlZFVzZXIiLCJhZG1pbiJdLCJpc3MiOiJodHRwczovL29wZW5sYXR0aWNlLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMTIxNzkwNTcyOTE4NzM3ODczNCIsImF1ZCI6Im84WTJVMnpiNUl3bzAxamR4TU4xVzJhaU44UHh3VmpoIiwiaWF0IjoxNTk2MTQyMDE2LCJleHAiOjE1OTYxNzgwMTZ9.ePkSDrPi6KNN7yOsGvNt07BwMwj3VORTnT5u_ZNMbME',
    orgId: '3e39ec2c-fe8e-4302-84c0-501ee2c2fbfe',
  });

  const [organizationId, setOrganizationId] = useState('3e39ec2c-fe8e-4302-84c0-501ee2c2fbfe');
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
