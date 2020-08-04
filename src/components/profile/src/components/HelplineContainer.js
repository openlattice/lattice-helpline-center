// @flow
import React from 'react';

import HelplineProvider from './HelplineProvider';
import HelplineSwitch from './HelplineSwitch';

type Props = {
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const HelplineContainer = (props :Props) => {
  const {
    organizationId,
    personId,
    root,
  } = props;

  return (
    <HelplineProvider>
      <HelplineSwitch
          organizationId={organizationId}
          personId={personId}
          root={root} />
    </HelplineProvider>
  );
};

export default HelplineContainer;
