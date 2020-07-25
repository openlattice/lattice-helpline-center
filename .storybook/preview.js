import React from 'react';

import { addDecorator } from '@storybook/react';
import { StylesProvider } from 'lattice-ui-kit';

addDecorator(storyFn => <StylesProvider injectFirst>{storyFn()}</StylesProvider>);
