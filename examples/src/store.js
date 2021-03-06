import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducerFactory, REDUX_PATHS, ApiMiddleware } from 'redux-records';
import { reducer as formReducer } from 'redux-form';

const dataReducer = reducerFactory();
const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));
const defaultOptions = {
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
  method: 'POST',
};
const baseUrl = process.env.REACT_APP_API_URI;
console.log(baseUrl);
const delayTime = 2000;
const entityPoint = entity => ({
  delete: ({ id }) => fetch(`${baseUrl}/${entity}/${id}`, {
    ...defaultOptions,
    method: 'DELETE',
  }).then(delay(delayTime)),
  update: ({ id, ...entityBody }) => {
    if (id) {
      return fetch(`${baseUrl}/${entity}/${id}`, {
        ...defaultOptions,
        body: JSON.stringify(entityBody),
        method: 'PUT',
      }).then(response => response.json()).then(delay(delayTime));
    }
    return fetch(`${baseUrl}/${entity}`, {
      ...defaultOptions,
      body: JSON.stringify(entityBody),
    }).then(response => response.json()).then(delay(delayTime));
  },
  load: (params) => {
    const query = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    return fetch(`${baseUrl}/${entity}?${query}`, {
      ...defaultOptions,
      method: 'GET',
    }).then(response => response.json()).then(delay(delayTime));
  },
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(ApiMiddleware({
  endpoints: {
    USERS: entityPoint('USERS'),
    POSTS: entityPoint('POSTS'),
    COMMENTS: entityPoint('COMMENTS'),
  },
})));

const store = createStore(
  combineReducers({
    [REDUX_PATHS.STORE_KEY]: dataReducer,
    form: formReducer,
  }),
  enhancer,
);
export default store;
