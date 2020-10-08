import React from 'react';

import { ConnectedRouter } from 'connected-react-router/immutable';
import {
  Provider,
} from 'react-redux';

import {
  helplineContext,
  helplineStore,
  useDispatch,
  useSelector,
  useStore,
} from '../../../../core/redux';
import { routerHistory } from '../../../../core/router';

export default function HelplineProvider({ children }) {
  return (
    <Provider context={helplineContext} store={helplineStore}>
      <ConnectedRouter history={routerHistory} context={helplineContext}>
        {children}
      </ConnectedRouter>
    </Provider>
  );
}

export {
  useDispatch,
  useStore,
  useSelector,
};
