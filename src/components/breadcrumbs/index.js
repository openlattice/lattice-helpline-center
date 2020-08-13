import styled, { css } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { Link } from 'react-router-dom';

const { NEUTRAL, PURPLE } = Colors;

const breadcrumbStyle = css`
  font-size: 1rem;
  font-weight: 600;
`;

const BreadcrumbLink = styled(Link)`
  ${breadcrumbStyle};
  color: ${PURPLE.P300};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

const BreadcrumbItem = styled.span`
  ${breadcrumbStyle};
  color: ${NEUTRAL.N500};
`;

const BreadcrumbWrapper = styled.div`
  margin-bottom: 32px;
`;

export {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbWrapper,
};
