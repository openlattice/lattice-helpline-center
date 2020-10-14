import React, { useState } from 'react';

import { configure } from 'lattice';
import {
  Button,
  Card,
  CardSegment,
  Input,
  Label,
} from 'lattice-ui-kit';

import DownloadsContainer from '..';

export default {
  title: 'Downloads Container',
  component: DownloadsContainer,
};

export const DownloadsContainerStory = () => (
  <DownloadsContainer />
);

DownloadsContainerStory.story = {
  name: 'Downloads Container'
};

export const LiveDownloadsContainerStory = () => {
  const [inputData, setInputs] = useState({
    jwt: '',
    orgId: '',
  });
  const { jwt, orgId } = inputData;
  const [organizationId, setOrganization] = useState(orgId);

  const onConfigure = (e) => {
    e.preventDefault();
    configure({
      baseUrl: 'production',
      authToken: jwt
    });
    setOrganization(orgId);
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
        </CardSegment>
      </Card>
      <DownloadsContainer
          root="/"
          organizationId={organizationId}
          match={{}} />
    </>
  );
};

LiveDownloadsContainerStory.story = {
  name: 'Live Downloads Container'
};
