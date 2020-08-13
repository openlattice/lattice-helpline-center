// @flow
import React from 'react';

import StyledTooltip from './styled/StyledTooltip';

type Props = {
  payload :any[];
};

const AggregateQuestionTooltip = ({
  payload,
} :Props) => {

  const text = payload[0]?.payload?.text;
  const score = payload[0]?.payload?.score;
  const display = `${text} (${score})`;

  return (
    <StyledTooltip maxWidth={300}>
      {display}
    </StyledTooltip>
  );
};

AggregateQuestionTooltip.defaultProps = {
  payload: [],
};

export default AggregateQuestionTooltip;
