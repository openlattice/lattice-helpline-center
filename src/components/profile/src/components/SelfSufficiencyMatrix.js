// @flow
import React, { useState } from 'react';

import { Colors } from 'lattice-ui-kit';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import CustomTooltip from './CustomTooltip';

import { Caption, Header } from '../../../typography';

const { PURPLE, NEUTRAL } = Colors;

const TICK_STYLE = {
  fill: NEUTRAL.N500,
  fontSize: '0.75rem'
};

type Props = {
  data ?:Object[];
};

const SelfSufficiencyMatrix = ({ data } :Props) => {
  const [tooltipPayload, setTooltipCoordinate] = useState({
    label: '',
    minWidth: 0,
    position: undefined,
    value: undefined,
  });
  const onMouseOver = (bar) => {
    const {
      x,
      y,
      width,
      payload
    } = bar;

    // translate up by 36px;
    const position = { x, y: y - 36 };
    setTooltipCoordinate({
      label: payload.x,
      minWidth: width,
      position,
      value: payload.y,
    });
  };

  return (
    <div>
      <Header>Self-Sufficiency Matrix</Header>
      <Caption>
        {'The higher the score, the greater the need.\nLow: 0-25 / Moderate: 25-55 / High: 55 - 85 / Critical: 85+'}
      </Caption>
      <ResponsiveContainer height={350} width="100%">
        <BarChart
            barCategoryGap="20%"
            data={data}
            layout="horizontal">
          <CartesianGrid vertical={false} />
          <YAxis
              axisLine={false}
              domain={[0, 180]}
              minTickGap={10}
              tick={TICK_STYLE}
              tickLine={false}
              width={30} />
          <XAxis
              dataKey="x"
              tick={TICK_STYLE}
              tickLine={false}
              type="category" />
          <Tooltip
              content={(
                <CustomTooltip
                    label={tooltipPayload.label}
                    minWidth={tooltipPayload.minWidth}
                    position={tooltipPayload.position}
                    value={tooltipPayload.value} />
              )}
              cursor={false}
              position={tooltipPayload.position} />
          <Bar
              dataKey="y"
              fill={PURPLE.P200}
              maxBarSize={60}
              onMouseOver={onMouseOver} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

SelfSufficiencyMatrix.defaultProps = {
  data: []
};

export default SelfSufficiencyMatrix;
