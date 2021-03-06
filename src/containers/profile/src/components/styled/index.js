import styled from 'styled-components';

import Answer from './Answer';

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
`;

const CenterWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

export {
  Answer,
  Body,
  CenterWrapper
};
