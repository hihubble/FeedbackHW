import { configureStore } from '@reduxjs/toolkit';
import featuresReducer from '../slices/featureSlice';

export default configureStore({
  reducer: {
    features: featuresReducer,
  },
});
