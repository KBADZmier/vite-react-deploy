import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import taskReducer from './reducers';

const composeEnhancers = composeWithDevTools({

});

const store = configureStore({
  reducer: {
    tasks: taskReducer
  },

  enhancer: composeEnhancers
});

export default store;
