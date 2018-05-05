import { createStore, combineReducers } from 'redux';
import { reducerFactory, REDUX_PATHS } from 'redux-records';
import { reducer as formReducer } from 'redux-form';

const dataReducer = reducerFactory();
const store = createStore(
  combineReducers({
    [REDUX_PATHS.STORE_KEY]: dataReducer,
    form: formReducer,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
export default store;
