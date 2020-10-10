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
  Typography
} from 'lattice-ui-kit';
import { ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { RequestStates } from 'redux-reqseq';
import type { Match } from 'react-router';

import { useDispatch, useSelector } from '../../../../core/redux';
import { INITIALIZE_HELPLINE, initializeHelpline } from '../../../app/AppActions';
import { CenterWrapper } from '../../../profile/src/components/styled';
import { downloadSurveysByDateRange } from '../sagas/DownloadsActions';

const { isValidUUID } = ValidationUtils;
const { media } = StyleUtils;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr min-content;
  grid-gap: 10px;
  align-items: flex-end;
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

  const initializeState = useSelector((state) => state.getIn(['app', INITIALIZE_HELPLINE, 'requestState']));

  const onSearch = (e) => {
    e.preventDefault();
    const dateRange = Map({
      dateEnd,
      dateStart,
    });

    const hasValues = dateRange.some((datetime) => DateTime.fromISO(datetime).isValid);

    if (hasValues) {
      dispatch(downloadSurveysByDateRange(dateRange));
    }
  };

  if (initializeState === RequestStates.PENDING || initializeState === RequestStates.STANDBY) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

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
            <DatePicker id="date-start" onChange={setDateStart} />
          </div>
          <div>
            <Label htmlFor="date-end">Date End</Label>
            <DatePicker id="date-end" onChange={setDateEnd} />
          </div>
          <div>
            <Button
                type="submit"
                color="primary"
                onClick={onSearch}
                fullWidth>
              Export
            </Button>
          </div>
        </InputGrid>
      </form>
    </div>
  );
};

export default Downloads;
