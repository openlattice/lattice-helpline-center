// @flow
import React from 'react';
import type { Node } from 'react';

type Props = {
  activeName :string;
  children :Node;
  name :string;
}
const TabPanel = (props :Props) => {
  const {
    activeName,
    children,
    name,
  } = props;

  return (
    <div
        aria-labelledby={`tab-${name}`}
        hidden={activeName !== name}
        id={`tabpanel-${name}`}
        role="tabpanel">
      { activeName === name && children }
    </div>
  );
};

export default TabPanel;
