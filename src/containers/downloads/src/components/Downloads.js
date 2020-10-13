// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Button,
  DatePicker,
  Label,
  Spinner,
  StyleUtils,
  Typography,
} from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';
import type { Match } from 'react-router';

import DownloadStatus from './DownloadStatus';

import { useDispatch, useSelector } from '../../../../core/redux';
import { resetRequestState } from '../../../../core/redux/ReduxActions';
import { INITIALIZE_HELPLINE, initializeHelpline } from '../../../app/AppActions';
import { CenterWrapper } from '../../../profile/src/components/styled';
import { DOWNLOAD_SURVEYS_BY_DATE_RANGE, downloadSurveysByDateRange } from '../sagas/DownloadsActions';

const { isValidUUID } = ValidationUtils;
const { media } = StyleUtils;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr min-content;
  grid-gap: 10px;
  margin-bottom: 32px;
  ${media.phone`
    grid-auto-flow: row;
    grid-template-columns: none;
  `}
`;

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const Downloads = ({
  match,
  organizationId,
  root,
} :Props) => {
  const dispatch = useDispatch();
  const [dateEnd, setDateEnd] = useState();
  const [dateStart, setDateStart] = useState();

  useEffect(() => {
    if (isValidUUID(organizationId)) {
      dispatch(initializeHelpline({ match, organizationId, root }));
    }
    // do NOT reinitialize whenever match updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  useEffect(() => () => dispatch(resetRequestState([DOWNLOAD_SURVEYS_BY_DATE_RANGE])));

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));

  const onSearch = (e) => {
    e.preventDefault();
    const dateRange = Map({
      dateEnd,
      dateStart,
    });

    const hasValues = dateRange.every((datetime) => DateTime.fromISO(datetime).isValid);

    if (hasValues) {
      dispatch(downloadSurveysByDateRange(dateRange));
    }
  };

  if (initializeState === RequestStates.PENDING || initializeState === RequestStates.STANDBY) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  const today = DateTime.local().toLocaleString(DateTime.DATE_SHORT);

  return (
    <div>
      <Typography variant="h1">Downloads</Typography>
      <Typography
          color="textSecondary"
          gutterBottom
          variant="subtitle1">
        Export all surveys within a provided date range to a CSV file.
      </Typography>
      <form>
        <InputGrid>
          <div>
            <Label htmlFor="date-start">Date Start</Label>
            <DatePicker
                id="date-start"
                maxDate={today}
                onChange={setDateStart} />
          </div>
          <div>
            <Label htmlFor="date-end">Date End</Label>
            <DatePicker
                id="date-end"
                maxDate={today}
                onChange={setDateEnd} />
          </div>
          <div>
            <Label stealth>Submit</Label>
            <Button
                type="submit"
                color="primary"
                disabled={!dateStart || !dateEnd}
                onClick={onSearch}
                fullWidth>
              Export
            </Button>
          </div>
        </InputGrid>
      </form>
      <DownloadStatus />
    </div>
  );
};

export default Downloads;
