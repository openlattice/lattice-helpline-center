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
    overflow: hidden;
    position: absolute;
    width: 5px
    height: 5px;
    box-sizing: border-box;
    content: '""';
    margin: auto;
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${NEUTRAL.N800};
    transform: translateY(1rem) rotate(45deg);
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
