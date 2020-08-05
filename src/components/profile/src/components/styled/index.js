import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';

import Answer from './Answer';

const { media } = StyleUtils;

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
  padding: 0 30px;
  ${media.phone`
    padding: 0 15px;
  `}
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export {
  Answer,
  Body,
  SpinnerWrapper
};
