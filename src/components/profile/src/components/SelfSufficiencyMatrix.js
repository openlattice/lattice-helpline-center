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

import { Header } from '../../../typography';

const { PURPLE, NEUTRAL } = Colors;

type Props = {
  data :any[];
};

const SelfSufficiencyMatrixRechart = ({ data } :Props) => {
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
    const position = { x, y: y - 35 };
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
      <ResponsiveContainer height={350} width="100%">
        <BarChart
            barCategoryGap="20%"
            data={data}
            layout="horizontal">
          <CartesianGrid vertical={false} />
          <YAxis
              axisLine={false}
              domain={[0, 80]}
              minTickGap={10}
              tick={{ fill: NEUTRAL.N500, fontSize: '0.75rem' }}
              tickLine={false}
              width={30} />
          <XAxis
              dataKey="x"
              tick={{ fill: NEUTRAL.N500, fontSize: '0.75rem' }}
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

export default SelfSufficiencyMatrixRechart;
