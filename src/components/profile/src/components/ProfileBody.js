// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Spinner,
  StyleUtils,
  Tab,
  TabContext,
  TabPanel,
  Tabs
} from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';

import AggregateResults from './AggregateResults';
import ProfileSummary from './ProfileSummary';
import { useSelector } from './HelplineProvider';
import { SpinnerWrapper } from './styled';

import { INITIALIZE_HELPLINE } from '../../../../containers/app/AppActions';
import { APP_PATHS } from '../../../../containers/app/constants';

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

type Props = {
  personId :UUID;
};

const ProfileBody = ({ personId } :Props) => {

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  const [value, setValue] = React.useState('summary');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (initializeState === RequestStates.PENDING) {
    return <SpinnerWrapper><Spinner size="3x" /></SpinnerWrapper>
  }

  return (
    <BodyWrapper>
      <TabContext value={value}>
        <Tabs
            value={value}
            onChange={handleChange}
            scrollButtons="auto">
          <Tab label="Summary" value="summary" />
          <Tab label="Scores" value="scores" />
        </Tabs>
        <TabPanel value="summary">
          <ProfileSummary personId={personId} />
        </TabPanel>
        <TabPanel value="scores">
          <AggregateResults personId={personId} />
        </TabPanel>
      </TabContext>
    </BodyWrapper>
  );
};

export default ProfileBody;
