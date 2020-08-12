// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Card, CardSegment, Colors } from 'lattice-ui-kit';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import CustomTooltip from './CustomTooltip';

const {
  GREEN,
  NEUTRAL,
  RED,
  YELLOW,
} = Colors;

const TICK_STYLE = {
  fill: NEUTRAL.N500,
  fontSize: '0.75rem'
};

/* eslint-disable quote-props */
const SCORE_CATEGORY_COLORS = {
  '0': NEUTRAL.N300,
  '1': GREEN.G200,
  '2': YELLOW.Y100,
  '3': RED.R200,
};
/* eslint-enable quote-props */

const MarginCard = styled(Card)`
  margin-bottom: 24px;
`;

const MinBar = (props :any) => {
  const {
    stroke,
    fill,
    x,
    y,
    width,
    height
  } = props;
  return (
    <rect
        x={x}
        y={y}
        width={width || 5}
        height={height}
        stroke={stroke}
        fill={fill} />
  );
};

type Props = {
  questionData :Map;
}

const AggregateQuestionCard = ({ questionData } :Props) => {
  const title = questionData.get('title');
  const data = questionData.get('data');
  const [tooltipPayload, setTooltip] = useState({
    active: false,
    position: undefined
  });

  const onMouseEnter = (bar) => {
    const {
      width,
      x,
      y,
    } = bar;
    const position = { x: x + width + 10, y };
    setTooltip({ active: true, position });
  };

  const onMouseLeave = () => {
    setTooltip({ active: false, position: undefined });
  };

  // length * bar height + (length + 1) * gap
  const containerHeight = data.length * 30 + (data.length + 1) * 10;

  return (
    <MarginCard>
      <CardSegment>
        <div>{title}</div>
        <ResponsiveContainer width="100%" height={containerHeight}>
          <BarChart
              data={data}
              layout="vertical">
            <YAxis
                dataKey="date"
                type="category"
                axisLine={false}
                minTickGap={10}
                tick={TICK_STYLE}
                tickLine={false}
                width={70} />
            <XAxis
                dataKey="score"
                axisLine={false}
                domain={[0, 25]}
                tickCount={0}
                height={0}
                tick={TICK_STYLE}
                type="number"
                tickLine={false} />
            {
              tooltipPayload.active && (
                <Tooltip
                    content={<CustomTooltip orientation="right" />}
                    cursor={false}
                    position={tooltipPayload.position} />
              )
            }
            <Bar
                barSize={30}
                dataKey="score"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                shape={<MinBar />}>
              {
                data.map((payload) => (
                  <Cell fill={SCORE_CATEGORY_COLORS[payload.scoreCategory]} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardSegment>
    </MarginCard>
  );
};

export default AggregateQuestionCard;
