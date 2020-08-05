// @flow
import React from 'react';

import styled from 'styled-components';
import { List } from 'immutable';
import { Constants } from 'lattice';

import SurveyQuestion from './SurveyQuestion';

import { Subheader } from '../../../typography';

const { OPENLATTICE_ID_FQN } = Constants;

const SectionWrapper = styled.div`
  margin-bottom: 24px;
`;

type Props = {
  sectionData :List;
  title :string;
};

const SurveySection = ({ sectionData, title } :Props) => (
  <SectionWrapper>
    <Subheader>{title}</Subheader>
    {
      sectionData.map((data) => {
        const questionId = data.getIn(['question', OPENLATTICE_ID_FQN, 0]);
        const question = data.get('question');
        const answer = data.get('answer');
        return (
          <SurveyQuestion
              answer={answer}
              question={question}
              key={questionId} />
        );
      })
    }
  </SectionWrapper>
);

export default SurveySection;
