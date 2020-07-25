// @flow
import React from 'react';

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

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
  place-items: center;

  span {
    background-color: ${NEUTRAL.N800};
    box-sizing: border-box;
    content: '""';
    display: block;
    height: 10px;
    margin: auto;
    overflow: hidden;
    position: absolute;
    transform: translateY(1rem) rotate(45deg);
    width: 10px;
  }
`;

type Props = {
  minWidth ?:number;
  value ?:any;
};

const CustomTooltip = ({ minWidth, value } :Props) => (
  <StyledTooltip minWidth={minWidth}>
    {value}
    <span />
  </StyledTooltip>
);

CustomTooltip.defaultProps = {
  minWidth: 0,
  value: '',
};

export default CustomTooltip;
