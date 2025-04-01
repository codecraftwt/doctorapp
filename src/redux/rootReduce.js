import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './authslice';
import userReducer from './userSlice';
import locationReducer from './locationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
});

export default rootReducer;
