// @flow
import React, { useEffect } from 'react';

import { useDispatch } from './HelplineProvider';

import { getAggregateResults } from '../sagas/ProfileActions';

type Props = {
  personId :UUID;
};

const AggregateResults = ({ personId } :Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAggregateResults(personId));
  }, [dispatch, personId]);

  return <div>results</div>;
};

export default AggregateResults;
