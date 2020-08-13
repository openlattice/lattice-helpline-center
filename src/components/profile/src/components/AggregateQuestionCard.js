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

const SCORE_CATEGORY_COLORS = [
  NEUTRAL.N300,
  GREEN.G200,
  YELLOW.Y100,
  RED.R200,
];

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
  const data = questionData.get('data').reverse();
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
      <CardSegment padding="30px 30px 20px">
        <div>{title}</div>
        <ResponsiveContainer width="100%" height={containerHeight}>
          <BarChart
              data={data}
              layout="vertical">
            <YAxis
                axisLine={false}
                dataKey="date"
                minTickGap={10}
                tick={TICK_STYLE}
                tickLine={false}
                type="category"
                width={70} />
            <XAxis
                axisLine={false}
                dataKey="score"
                domain={[0, 25]}
                height={0}
                tick={TICK_STYLE}
                tickCount={0}
                tickLine={false}
                type="number" />
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
                  <Cell fill={SCORE_CATEGORY_COLORS[payload.scoreCategory]} key={`${payload.id}`} />
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
