// @flow
import React from 'react';

import StyledTooltip from './styled/StyledTooltip';

type Props = {
  minWidth ?:number;
  payload :any[];
};

const SelfSufficiencyTooltip = ({
  minWidth,
  payload,
} :Props) => {

  let display = '';
  if (payload[0]) {
    display = payload[0].value;
  }

  return (
    <StyledTooltip minWidth={minWidth}>
      {display}
      <span />
    </StyledTooltip>
  );
};

SelfSufficiencyTooltip.defaultProps = {
  minWidth: 0,
  payload: [],
};

export default SelfSufficiencyTooltip;
