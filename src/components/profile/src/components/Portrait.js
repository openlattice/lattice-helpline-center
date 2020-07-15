// @flow
import React from 'react';

import styled from 'styled-components';
import { LangUtils } from 'lattice-utils';

import { OLPortrait } from '../../../../assets/svg/icons';

const { isEmptyString } = LangUtils;

type Props = {
  imageUrl ? :string;
  height ? :string;
  width ? :string;
}
const Image = styled.img`
  border-radius: 10%;
  object-fit: cover;
  object-position: 50% 50%;
`;

const Portrait = (props :Props) => {
  const {
    height,
    imageUrl,
    width,
  } = props;

  if (isEmptyString(imageUrl)) {
    return (
      <OLPortrait />
    );
  }

  return <Image src={imageUrl} height={height} width={width} />;
};

Portrait.defaultProps = {
  height: '247',
  width: '247',
  imageUrl: ''
};

export default Portrait;
