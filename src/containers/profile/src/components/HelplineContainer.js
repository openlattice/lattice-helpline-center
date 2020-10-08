// @flow
import React from 'react';

import type { Match } from 'react-router';

import HelplineProvider from './HelplineProvider';
import HelplineSwitch from './HelplineSwitch';

type Props = {
  match :Match;
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const HelplineContainer = (props :Props) => {
  const {
    organizationId,
    personId,
    match,
    root,
  } = props;

  return (
    <HelplineProvider>
      <HelplineSwitch
          match={match}
          organizationId={organizationId}
          personId={personId}
          root={root} />
    </HelplineProvider>
  );
};

export default HelplineContainer;
