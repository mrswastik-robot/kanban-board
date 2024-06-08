

import { combineReducers } from '@reduxjs/toolkit';

import itemsReducer from './itemsReducer';
import containersReducer from './containersReducer';

import authReducer from './authReducer';

const rootReducer = combineReducers({
  items: itemsReducer,
  containers: containersReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
