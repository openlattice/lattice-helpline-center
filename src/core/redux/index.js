import React from 'react';

import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook
} from 'react-redux';

import initializeReduxStore from './ReduxStore';

import { routerHistory } from '../router';

export const helplineStore = initializeReduxStore(routerHistory);
export const helplineContext = React.createContext(null);

// Export your custom hooks if you wish to use them in other files.
export const useStore = createStoreHook(helplineContext);
export const useDispatch = createDispatchHook(helplineContext);
export const useSelector = createSelectorHook(helplineContext);
