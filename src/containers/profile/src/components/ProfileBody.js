// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Spinner,
  StyleUtils,
} from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';

import AggregateResults from './AggregateResults';
import ProfileSummary from './ProfileSummary';
import { CenterWrapper } from './styled';

import { TabButton, TabGroup, TabPanel } from '../../../../components/tabs';
import { useSelector } from '../../../../core/redux';
import { INITIALIZE_HELPLINE } from '../../../app/AppActions';

const { media } = StyleUtils;

const BodyWrapper = styled.div`
  padding: 0 16px;

  .MuiTabPanel-root {
    padding: 16px 0;
  }

  ${media.phone`
    padding: 0;
  `}
`;

const TabWrapper = styled.div`
  margin-bottom: 24px;
`;

type Props = {
  personId :UUID;
};

const ProfileBody = ({ personId } :Props) => {

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));

  const [tab, setTab] = React.useState('summary');

  if (initializeState === RequestStates.PENDING) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <BodyWrapper>
      <TabWrapper>
        <TabGroup>
          <TabButton
              active={tab === 'summary'}
              name="summary-btn"
              onClick={() => setTab('summary')}
              type="button">
            Summary
          </TabButton>
          <TabButton
              active={tab === 'scores'}
              name="scores-btn"
              onClick={() => setTab('scores')}
              type="button">
            Scores
          </TabButton>
        </TabGroup>
      </TabWrapper>
      <TabPanel activeName={tab} name="summary">
        <ProfileSummary personId={personId} />
      </TabPanel>
      <TabPanel activeName={tab} name="scores">
        <AggregateResults personId={personId} />
      </TabPanel>
    </BodyWrapper>
  );
};

export default ProfileBody;
