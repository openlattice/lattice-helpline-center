// @flow
import React from 'react';

import { Breadcrumbs } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import SurveySection from './SurveySection';
import { formatSurveyData, getFirstLastFromPerson, getRelativeRoot } from './utils';

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbWrapper } from '../../../../components/breadcrumbs';
import { Caption, Header } from '../../../../components/typography';
import { PropertyTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../../core/redux';
import { getPropertyValue } from '../../../../utils/EntityUtils';
import { APP_PATHS } from '../../../app/constants';
import { PROFILE_PATHS } from '../sagas/constants';

const { formatAsDate, formatAsTime } = DateTimeUtils;

const { DATE_TIME, FULL_NAME } = PropertyTypes;
type Props = {
  surveyId :any;
}

const SocialNeedsSurvey = ({ surveyId } :Props) => {
  // get person and pass to breadcrumb
  const person = useSelector((store) => store.getIn(PROFILE_PATHS.person));
  const provider = useSelector((store) => store.getIn(PROFILE_PATHS.provider));
  const submission = useSelector((store) => store.getIn([...PROFILE_PATHS.submissions, surveyId]));
  const questions = useSelector((store) => store.getIn(PROFILE_PATHS.questions));
  const answers = useSelector((store) => store.getIn(PROFILE_PATHS.answers));
  const answersByQuestion = useSelector(
    (store) => store.getIn([...PROFILE_PATHS.submissionAnswersByQuestion, surveyId])
  );
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const datetime = getPropertyValue(submission, DATE_TIME);
  const name = getFirstLastFromPerson(person).trim();
  const providerName = getPropertyValue(provider, FULL_NAME);

  let formattedDate = '';
  let formattedTime = '';
  if (typeof datetime === 'string') {
    formattedDate = formatAsDate(datetime, '');
    formattedTime = formatAsTime(datetime, '');
  }

  const surveyData = formatSurveyData(questions, answers, answersByQuestion);
  const relRoot = getRelativeRoot(root, match);

  let caption = 'Submitted ';
  if (providerName) caption += `by ${providerName} `;
  if (name) caption += `for participant ${name} `;
  if (formattedDate && formattedTime) caption += `at ${formattedTime} on ${formattedDate}`;

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumbs>
          <BreadcrumbLink to={relRoot}>{name}</BreadcrumbLink>
          <BreadcrumbItem>{`Social Needs Survey ${formattedDate}`}</BreadcrumbItem>
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <div>
        <Header>Social Needs</Header>
        <Caption>
          {caption}
        </Caption>
        {
          surveyData.entrySeq().map(([sectionTitle, sectionData]) => (
            <SurveySection
                key={sectionTitle}
                sectionData={sectionData}
                title={sectionTitle} />
          ))
        }
      </div>
    </div>
  );
};

export default SocialNeedsSurvey;
