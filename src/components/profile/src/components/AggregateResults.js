// @flow
import React, { useEffect } from 'react';

import AggregateQuestionCard from './AggregateQuestionCard';
import { useDispatch, useSelector } from './HelplineProvider';
import { formatAggregateResultsData } from './utils';

import { Caption, Header } from '../../../typography';
import { getAggregateResults } from '../sagas/ProfileActions';
import { PROFILE_PATHS } from '../sagas/constants';

type Props = {
  personId :UUID;
};

const AggregateResults = ({ personId } :Props) => {
  const dispatch = useDispatch();
  const surveys = useSelector((store) => store.getIn(PROFILE_PATHS.surveys));
  const questions = useSelector((store) => store.getIn(PROFILE_PATHS.questions));
  const answers = useSelector((store) => store.getIn(PROFILE_PATHS.answers));
  const surveyAnswersByQuestion = useSelector((store) => store.getIn(PROFILE_PATHS.surveyAnswersByQuestion));
  useEffect(() => {
    dispatch(getAggregateResults(personId));
  }, [dispatch, personId]);

  const aggregateResults = formatAggregateResultsData(questions, answers, surveyAnswersByQuestion, surveys);

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
