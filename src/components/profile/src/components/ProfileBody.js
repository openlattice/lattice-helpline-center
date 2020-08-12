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
import { useSelector } from './HelplineProvider';
import { SpinnerWrapper } from './styled';

import { INITIALIZE_HELPLINE } from '../../../../containers/app/AppActions';
import { APP_PATHS } from '../../../../containers/app/constants';
import { TabButton, TabGroup, TabPanel } from '../../../tabs';

const { media } = StyleUtils;

const BodyWrapper = styled.div`
  padding: 0 16px;

  .MuiTabPanel-root {
    padding: 16px 0;
  };

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
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  const [tab, setTab] = React.useState('summary');

  if (initializeState === RequestStates.PENDING) {
    return <SpinnerWrapper><Spinner size="3x" /></SpinnerWrapper>;
  }

  return (
    <BodyWrapper>
      <TabWrapper>
        <TabGroup>
          <TabButton
              active={tab === 'summary'}
              name="summary-btn"
              type="button"
              onClick={() => setTab('summary')}>
            Summary
          </TabButton>
          <TabButton
              active={tab === 'scores'}
              name="scores-btn"
              type="button"
              onClick={() => setTab('scores')}>
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
