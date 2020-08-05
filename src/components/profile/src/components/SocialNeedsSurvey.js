// @flow
import React from 'react';

import { Breadcrumbs } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import SurveySection from './SurveySection';
import { useSelector } from './HelplineProvider';
import { formatSurveyData, getFirstLastFromPerson, getRelativeRoot } from './utils';

import { APP_PATHS } from '../../../../containers/app/constants';
import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue } from '../../../../utils/EntityUtils';
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbWrapper } from '../../../breadcrumbs';
import { Caption, Header } from '../../../typography';
import { PROFILE_PATHS } from '../sagas/constants';

const { formatAsDate, formatAsTime } = DateTimeUtils;

const { DATE_TIME } = PropertyTypes;

const SocialNeedsSurvey = () => {
  // get person and pass to breadcrumb
  const person = useSelector((store) => store.getIn(PROFILE_PATHS.person));
  const survey = useSelector((store) => store.getIn(PROFILE_PATHS.survey));
  const questions = useSelector((store) => store.getIn(PROFILE_PATHS.questions));
  const answers = useSelector((store) => store.getIn(PROFILE_PATHS.answers));
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const datetime = getPropertyValue(survey, DATE_TIME);
  const name = getFirstLastFromPerson(person);

  let formattedDate = '';
  if (typeof datetime === 'string') {
    formattedDate = formatAsDate(datetime, '');
  }
  let formattedTime = '';
  if (typeof datetime === 'string') {
    formattedTime = formatAsTime(datetime, '');
  }

  const surveyData = formatSurveyData(questions, answers);
  const relRoot = getRelativeRoot(root, match);

  return (
    <div>
      <BreadcrumbWrapper>
        <Breadcrumbs>
          <BreadcrumbLink to="/">Home</BreadcrumbLink>
          <BreadcrumbLink to={relRoot}>{name}</BreadcrumbLink>
          <BreadcrumbItem>{`Social Needs Survey ${formattedDate}`}</BreadcrumbItem>
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <div>
        <Header>Social Needs</Header>
        <Caption>{`This survey was submitted for participant ${name} at ${formattedTime} on ${formattedDate}`}</Caption>
        {
          surveyData.entrySeq().map(([sectionTitle, sectionData]) => (
            <SurveySection
                // eslint-disable-next-line react/no-array-index-key
                key={sectionTitle}
                title={sectionTitle}
                sectionData={sectionData} />
          ))
        }
      </div>
    </div>
  );
};

export default SocialNeedsSurvey;
