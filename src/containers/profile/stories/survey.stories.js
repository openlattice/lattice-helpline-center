// @flow
import React from 'react';

import { SocialNeedsSurvey } from '..';

export default {
  title: 'Social Needs Survey',
  component: SocialNeedsSurvey,
};

export const ToStorybook = () => (
  <SocialNeedsSurvey />
);

ToStorybook.story = {
  name: 'Social Needs Survey'
};
