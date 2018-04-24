import { createStore } from 'redux';
import { reducersFactory } from '../../src/reducer';
const reducers = reducersFactory({ USERS: "id" });
const store = createStore(reducers);
export default store;