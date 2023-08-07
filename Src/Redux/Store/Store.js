import {configureStore} from '@reduxjs/toolkit';
import mapReducer from '../Slices/MapSlices';
let store = configureStore({
  reducer: {
    mapReducer,
  },
});

export {store};
