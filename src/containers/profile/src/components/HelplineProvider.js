// @flow
import React from 'react';
import type { Node } from 'react';

import { ConnectedRouter } from 'connected-react-router/immutable';
import { Provider } from 'react-redux';

import { helplineContext, helplineStore } from '../../../../core/redux';
import { routerHistory } from '../../../../core/router';

type Props = {
  children :Node;
}

export default function HelplineProvider({ children } :Props) {
  return (
    <Provider context={helplineContext} store={helplineStore}>
      <ConnectedRouter history={routerHistory} context={helplineContext}>
        {children}
      </ConnectedRouter>
    </Provider>
  );
}
