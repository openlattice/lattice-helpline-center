// @flow
import React from 'react';

import HelplineProvider from './HelplineProvider';
import HelplineSwitch from './HelplineSwitch';

type Props = {
  organizationId :UUID;
  personId :UUID;
};

const HelplineContainer = (props :Props) => {
  const {
    organizationId,
    personId,
  } = props;

  return (
    <HelplineProvider>
      <HelplineSwitch organizationId={organizationId} personId={personId} />
    </HelplineProvider>
  );
};

export default HelplineContainer;
