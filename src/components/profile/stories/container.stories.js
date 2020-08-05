import React, { useState } from 'react';

import { configure } from 'lattice';
import {
  Button,
  Card,
  CardSegment,
  Input,
  Label,
} from 'lattice-ui-kit';

import { HelplineContainer } from '..';

export default {
  title: 'Helpline Container',
  component: HelplineContainer,
};

export const HelplineContainerStory = () => (
  <HelplineContainer />
);

HelplineContainerStory.story = {
  name: 'Helpline Container'
};

export const LiveHelplineContainerStory = () => {
  const [inputData, setInputs] = useState({
    jwt: '',
    orgId: '',
    personId: ''
  });
  const { jwt, orgId, personId } = inputData;
  const [organizationId, setOrganization] = useState(orgId);
  const [personEKID, setPerson] = useState(personId);

  const onConfigure = (e) => {
    e.preventDefault();
    configure({
      baseUrl: 'production',
      authToken: jwt
    });
    setOrganization(orgId);
  };

  const onFetch = (e) => {
    e.preventDefault();
    setPerson(personId);
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
            <Input id="jwt" name="jwt" onChange={onChange} value={jwt} />
            <Label htmlFor="org-id" subtle>Org ID</Label>
            <Input id="org-id" name="orgId" onChange={onChange} value={orgId} />
            <Button color="primary" type="submit">Configure</Button>
          </form>
          <form onSubmit={onFetch}>
            <Label htmlFor="person-id" subtle>Person ID</Label>
            <Input id="person-id" name="personId" onChange={onChange} value={personId} />
            <Button color="primary" type="submit">Fetch Person</Button>
          </form>
        </CardSegment>
      </Card>
      <HelplineContainer
          root="/"
          organizationId={organizationId}
          personId={personEKID}
          match={{}} />
    </>
  );
};

LiveHelplineContainerStory.story = {
  name: 'Live Helpline Container'
};
