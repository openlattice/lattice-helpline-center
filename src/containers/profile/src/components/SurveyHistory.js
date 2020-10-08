// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List as iList } from 'immutable';
import { Constants } from 'lattice';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { Link } from 'react-router-dom';

import { useSelector } from './HelplineProvider';
import { getRelativeRoot } from './utils';

import { Header } from '../../../../components/typography';
import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValues } from '../../../../utils/EntityUtils';
import { APP_PATHS } from '../../../app/constants';

const { formatAsDate } = DateTimeUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { NAME, DATE_TIME } = PropertyTypes;

const SurveyName = styled.span`
  font-weight: 500;
`;

type Props = {
  surveys :iList | Object[];
}

const SurveyHistory = ({ surveys } :Props) => {
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));

  const relRoot = getRelativeRoot(root, match);

  return (
    <div>
      <Header>
        Survey History
      </Header>
      <List>
        {
          surveys.map((survey, index) => {
            const [name = 'Social Needs Survey', datetime, surveyId] = getPropertyValues(survey, [
              NAME,
              DATE_TIME,
              OPENLATTICE_ID_FQN
            ]);

            const formattedDateTime = formatAsDate(datetime);

            const isLast = iList.isList(surveys)
              // $FlowFixMe
              ? (index === surveys.size - 1)
              : (index === surveys.length - 1);

            return (
              <ListItem
                  button
                  component={Link}
                  divider={!isLast}
                  to={`${relRoot}/survey/${surveyId}`}
                  key={surveyId}>
                <ListItemAvatar>
                  <FontAwesomeIcon icon={faFileAlt} />
                </ListItemAvatar>
                <ListItemText primary={<SurveyName>{name}</SurveyName>} secondary={formattedDateTime} />
              </ListItem>
            );
          })
        }
      </List>
    </div>
  );
};

SurveyHistory.defaultProps = {
  surveys: []
};

export default SurveyHistory;
