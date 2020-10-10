// @flow

import React from 'react';

import type { Match } from 'react-router';

import Downloads from './Downloads';

import { HelplineProvider } from '../../../profile';

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const DownloadsContainer = (props :Props) => {
  const {
    match,
    organizationId,
    root,
  } = props;

  return (
    <HelplineProvider>
      <Downloads
          match={match}
          organizationId={organizationId}
          root={root} />
    </HelplineProvider>
  );
};

export default DownloadsContainer;
