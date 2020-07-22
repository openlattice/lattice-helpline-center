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
    <div style={{ position: 'relative' }}>
      <Header>Self-Sufficiency Matrix</Header>
      <ResponsiveContainer
          height={350}
          width="100%">
        <BarChart
            barCategoryGap="20%"
            layout="horizontal"
            data={data}>
          <CartesianGrid vertical={false} />
          <YAxis
              minTickGap={10}
              domain={[0, 80]}
              width={30}
              tickLine={false}
              axisLine={false}
              tick={{ fill: NEUTRAL.N500, fontSize: '0.75rem' }} />
          <XAxis
              dataKey="x"
              type="category"
              tickLine={false}
              tick={{ fill: NEUTRAL.N500, fontSize: '0.75rem' }} />
          <Tooltip
              position={tooltipPayload.position}
              cursor={false}
              content={<CustomTooltip {...tooltipPayload} />} />
          <Bar
              maxBarSize={60}
              onMouseOver={onMouseOver}
              dataKey="y"
              fill={PURPLE.P200} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SelfSufficiencyMatrixRechart;
