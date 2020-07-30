import React from 'react';

import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook
} from 'react-redux';

import initializeReduxStore from '../../../../core/redux/ReduxStore';
import initializeRouterHistory from '../../../../core/router/RouterHistory';

const routerHistory = initializeRouterHistory();
const helplineStore = initializeReduxStore(routerHistory);

const helplineContext = React.createContext(null);

// Export your custom hooks if you wish to use them in other files.
export const useStore = createStoreHook(helplineContext);
export const useDispatch = createDispatchHook(helplineContext);
export const useSelector = createSelectorHook(helplineContext);

export default function HelplineProvider({ children }) {
  return (
    <Provider context={helplineContext} store={helplineStore}>
      {children}
    </Provider>
  );
}