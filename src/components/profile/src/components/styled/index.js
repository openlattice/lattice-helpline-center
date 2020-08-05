import styled from 'styled-components';

import Answer from './Answer';

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
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
