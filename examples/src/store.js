import { createStore, combineReducers } from 'redux';
import { reducerFactory, ACTION_CONSTANTS } from 'redux-records';
const dataReducer = reducerFactory();
const store = createStore(
    combineReducers({ [ACTION_CONSTANTS.CONSTANTS_REGEX.ID]: dataReducer }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;