// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import AggregateQuestionCard from './AggregateQuestionCard';
import { CenterWrapper } from './styled';
import { formatAggregateResultsData } from './utils';

import { Caption, Header } from '../../../../components/typography';
import { useDispatch, useSelector } from '../../../../core/redux';
import { GET_AGGREGATE_RESULTS, getAggregateResults } from '../sagas/ProfileActions';
import { PROFILE, PROFILE_PATHS } from '../sagas/constants';

const { REQUEST_STATE } = ReduxConstants;

type Props = {
  personId :UUID;
};

const AggregateResults = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const submissions = useSelector((store) => store.getIn(PROFILE_PATHS.submissions));
  const questions = useSelector((store) => store.getIn(PROFILE_PATHS.questions));
  const answers = useSelector((store) => store.getIn(PROFILE_PATHS.answers));
  const surveyAnswersByQuestion = useSelector((store) => store.getIn(PROFILE_PATHS.submissionAnswersByQuestion));
  const fetchState = useSelector((state) => state.getIn([PROFILE, GET_AGGREGATE_RESULTS, REQUEST_STATE]));

  useEffect(() => {
    dispatch(getAggregateResults(personId));
  }, [dispatch, personId]);

  if (fetchState === RequestStates.PENDING) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  const aggregateResults = formatAggregateResultsData(questions, answers, surveyAnswersByQuestion, submissions);

  return (
    <div>
      <Header>Aggregate Survey Results</Header>
      <Caption>Below are the survey results for every survey this person has taken.</Caption>
      {
        aggregateResults.map((questionResult) => (
          <AggregateQuestionCard key={questionResult.get('id')} questionData={questionResult} />
        ))
      }
    </div>
  );
};

export default AggregateResults;
