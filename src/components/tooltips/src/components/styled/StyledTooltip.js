import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const StyledTooltip = styled.div`
  background-color: ${NEUTRAL.N800};
  border-radius: 3px;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : 0)};
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : null)};
  padding: 5px 10px;
  place-items: center;

  span {
    overflow: hidden;
    position: absolute;
    box-sizing: border-box;
    content: '""';
    margin: auto;
    display: block;
    width: 10px;
    height: 10px;
    background-color: ${NEUTRAL.N800};
    transform: translateY(1rem) rotate(45deg);
  }
`;

export default StyledTooltip;
