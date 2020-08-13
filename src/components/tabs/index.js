import styled, { css } from 'styled-components';
import { Button, Colors } from 'lattice-ui-kit';

import TabPanel from './TabPanel';

const { NEUTRAL } = Colors;

const TabGroup = styled.div`
  margin-right: auto;

  button:first-of-type {
    border-radius: 3px 0 0 3px;
  }

  button:last-of-type {
    border-radius: 0 3px 3px 0;
  }
`;

const getActiveStyles = ({ active }) => {
  if (active) {
    return css`
      background-color: ${NEUTRAL.N400};
      border-color: ${NEUTRAL.N400};
      color: white;
    `;
  }
  return null;
};

const TabButton = styled(Button)`
  border-radius: 0;
  ${getActiveStyles};
`;

export {
  TabButton,
  TabGroup,
  TabPanel,
};
