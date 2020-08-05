// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';

import { Answer } from './styled';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValues } from '../../../../utils/EntityUtils';

const { NEUTRAL } = Colors;

const SCORE_CATEGORY_COLOR_MAP = {
  0: 'neutral',
  1: 'green',
  2: 'yellow',
  3: 'red'
};

const TitleWrapper = styled.ul`
  list-style-position: inside;
  padding-inline-start: 0;
  margin: 0;
`;

const Title = styled.li`
  color: ${NEUTRAL.N500};
  margin: 16px 0;
`;

const AnswerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  grid-gap: 16px 24px;
  padding-bottom: 8px;
`;

const {
  TITLE,
  VALUES,
  SCORE_CATEGORY,
} = PropertyTypes;

type Props = {
  question :Map;
  answer :Map;
};

const SurveyQuestion = ({ question, answer } :Props) => {
  const [title, options] = getPropertyValues(question, [TITLE, VALUES]);
  const [scoreCategory, value] = getPropertyValues(answer, [SCORE_CATEGORY, VALUES]);

  // Integration has options in a single string delimited by ; instead of multiplicity
  const parsedOptions = options.split(';');

  return (
    <div>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      <AnswerWrapper>
        {
          parsedOptions.map((option) => {
            const label = option.replace(/\([^()]*\)/g, '');
            const color = SCORE_CATEGORY_COLOR_MAP[scoreCategory];

            return (
              <Answer
                  color={value === option ? color : 'default'}
                  disableFocusRipple>
                {label}
              </Answer>
            );
          })
        }
      </AnswerWrapper>
    </div>
  );
};

export default SurveyQuestion;
