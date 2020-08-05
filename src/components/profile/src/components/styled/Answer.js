import styled, { css } from 'styled-components';
import { Colors, StyleUtils } from 'lattice-ui-kit';

const {
  NEUTRAL,
  GREEN,
  YELLOW,
  RED,
} = Colors;
const { getStyleVariation } = StyleUtils;

const getColorVariation = getStyleVariation('color', {
  default: css`
    background-color: ${NEUTRAL.N50};
    color: ${NEUTRAL.N700};
  `,
  green: css`
    background-color: ${GREEN.G200};
    color: white;
  `,
  yellow: css`
  background-color: ${YELLOW.Y100};
  color: ${YELLOW.Y500};
`,
  red: css`
  background-color: ${RED.R200};
  color: ${RED.R500};
`,
  neutral: css`
    background-color: ${NEUTRAL.N300};
    color: ${NEUTRAL.N900};
  `,
}, css`
  background-color: ${NEUTRAL.N50};
  color: ${NEUTRAL.N800};
`);

const Answer = styled.div`
  align-items: center;
  border-radius: 3px;
  display: flex;
  height: 60px;
  justify-content: center;
  line-height: 1.2;
  padding: 0 16px;
  text-align: center;
  vertical-align: center;
  width: 100%;
  ${getColorVariation};
`;

export default Answer;
