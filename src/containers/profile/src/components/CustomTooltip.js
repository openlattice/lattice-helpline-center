// @flow
import React from 'react';

import styled from 'styled-components';
import { Colors, StyleUtils } from 'lattice-ui-kit';

const { getStyleVariation } = StyleUtils;

const getAlignment = getStyleVariation('orientation', {
  top: 'center',
  right: 'start',
}, 'center');

const { NEUTRAL } = Colors;

const StyledTooltip = styled.div`
  background-color: ${NEUTRAL.N800};
  border-radius: 3px;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : 0)};
  padding: 5px 10px;
  align-items: ${getAlignment};
  justify-content: center;
`;

type Props = {
  minWidth ?:number;
  orientation ?:'top' | 'right';
  payload :any[];
};

const CustomTooltip = ({
  minWidth,
  orientation,
  payload,
} :Props) => {

  let display = '';
  if (payload[0]) {
    display = payload[0].value;
  }

  return (
    <StyledTooltip minWidth={minWidth} orientation={orientation}>
      {display}
      <span />
    </StyledTooltip>
  );
};

CustomTooltip.defaultProps = {
  minWidth: 0,
  orientation: 'top',
  payload: [],
};

export default CustomTooltip;
