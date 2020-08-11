// @flow
import React, { useEffect } from 'react';

import { useDispatch } from './HelplineProvider';

import { getSurveyResults } from '../sagas/ProfileActions';

type Props = {
  personId :UUID;
};

const AggregateResults = ({ personId } :Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSurveyResults(personId));
  }, [dispatch, personId]);

  return <div>results</div>;
};

export default AggregateResults;
