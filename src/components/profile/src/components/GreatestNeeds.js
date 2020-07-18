// @flow
import React from 'react';

import styled from 'styled-components';
import { Chip } from 'lattice-ui-kit';

import { Caption, Header } from '../../../typography';

const StyledChip = styled(Chip)`
  font-size: 1rem;
  margin-right: 8px;
`;

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type Props = {
  needs :string[];
};

const GreatestNeeds = ({ needs = [] } :Props) => (
  <div>
    <Header>Greatest Needs</Header>
    <Caption>Below are the categories in which this person scored the lowest on in the most recent survey.</Caption>
    <ChipsWrapper>
      {
        // eslint-disable-next-line react/no-array-index-key
        needs.map((need, index) => <StyledChip key={index} label={need} />)
      }
    </ChipsWrapper>
  </div>
);

GreatestNeeds.defaultProps = {
  needs: []
};

export default GreatestNeeds;
