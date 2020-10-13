// @flow
import React from 'react';

import { faFileCheck, faFileExclamation } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, IconSplash, Spinner } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';

import { useSelector } from '../../../../core/redux';
import { DOWNLOAD_SURVEYS_BY_DATE_RANGE } from '../sagas/DownloadsActions';

const { GREEN, RED } = Colors;
const SuccessIcon = () => <FontAwesomeIcon icon={faFileCheck} color={GREEN.G300} size="3x" />;
const ErrorIcon = () => <FontAwesomeIcon icon={faFileExclamation} color={RED.R300} size="3x" />;

const DownloadStatus = () => {
  const downloadSurveysRequestState = useSelector(
    (state) => state.getIn(['downloads', DOWNLOAD_SURVEYS_BY_DATE_RANGE, 'requestState'])
  );

  switch (downloadSurveysRequestState) {
    case RequestStates.PENDING: {
      return <IconSplash caption="Generating CSV..." icon={() => <Spinner size="3x" />} />;
    }

    case RequestStates.SUCCESS: {
      return <IconSplash caption="Success!" icon={SuccessIcon} size="3x" />;
    }

    case RequestStates.FAILURE: {
      return (
        <IconSplash
            caption="An error has occurred. Please try again or contact support"
            icon={ErrorIcon}
            size="3x" />
      );
    }

    default:
      return null;
  }
};

export default DownloadStatus;
