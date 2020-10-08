// @flow
import React from 'react';

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

import { AggregateQuestionTooltip } from '../../../../components/tooltips';

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
  const data = questionData.get('data');

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
            <Tooltip
                content={<AggregateQuestionTooltip />}
                cursor={{ fill: NEUTRAL.N50 }} />
            <Bar
                barSize={30}
                dataKey="score"
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
