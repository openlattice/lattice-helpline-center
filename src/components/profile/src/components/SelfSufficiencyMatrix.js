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

const TICK_STYLE = {
  fill: NEUTRAL.N500,
  fontSize: '0.75rem'
};

type Props = {
  data ?:Object[];
};

const SelfSufficiencyMatrix = ({ data } :Props) => {
  const [tooltipPayload, setTooltip] = useState({
    minWidth: 0,
    position: undefined,
  });

  const onMouseEnter = (bar) => {
    const {
      x,
      y,
      width,
    } = bar;

    // translate up by 36px;
    const position = { x, y: y - 36 };
    setTooltip({
      minWidth: width,
      position,
      active: true
    });
  };

  const onMouseLeave = () => {
    setTooltip({ active: false, position: undefined, minWidth: 0 });
  };

  return (
    <div>
      <Header>Self-Sufficiency Risk</Header>
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
          {
            tooltipPayload.active && (
              <Tooltip
                  content={<CustomTooltip minWidth={tooltipPayload.minWidth} />}
                  cursor={false}
                  position={tooltipPayload.position} />
            )
          }
          <Bar
              dataKey="y"
              fill={PURPLE.P200}
              maxBarSize={60}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

SelfSufficiencyMatrix.defaultProps = {
  data: []
};

export default SelfSufficiencyMatrix;
