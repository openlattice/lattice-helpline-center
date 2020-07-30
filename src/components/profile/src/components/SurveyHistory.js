// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List as iList } from 'immutable';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValues } from '../../../../utils/EntityUtils';
import { Header } from '../../../typography';

const { formatAsDate } = DateTimeUtils;

const { NAME, DATE_TIME, ID } = PropertyTypes;

const SurveyName = styled.span`
  font-weight: 500;
`;

type Props = {
  surveys :iList | Object[];
}

const SurveyHistory = ({ surveys } :Props) => (
  <div>
    <Header>
      Survey History
    </Header>
    <List>
      {
        surveys.map((survey, index) => {
          const [name, datetime, id] = getPropertyValues(survey, [
            NAME,
            DATE_TIME,
            ID
          ]);

          const formattedDateTime = formatAsDate(datetime);

          const isLast = iList.isList(surveys)
            // $FlowFixMe
            ? (index === surveys.size - 1)
            : (index === surveys.length - 1);

          return (
            <ListItem key={id} divider={!isLast}>
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

SurveyHistory.defaultProps = {
  surveys: []
};

export default SurveyHistory;
