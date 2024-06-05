

import { combineReducers } from '@reduxjs/toolkit';

import itemsReducer from './itemsReducer';
import containersReducer from './containersReducer';

const rootReducer = combineReducers({
  items: itemsReducer,
  containers: containersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
