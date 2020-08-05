import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;
const Header = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0 0 24px;
`;

const Caption = styled.span`
  display: inline-block;
  color: ${NEUTRAL.N500};
  margin: 0 0 24px;
`;

const Subheader = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 24px;
`;

export {
  Caption,
  Header,
  Subheader,
};
