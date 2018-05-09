import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducerFactory, REDUX_PATHS, ApiMiddleware } from 'redux-records';
import { reducer as formReducer } from 'redux-form';

const dataReducer = reducerFactory();
const entityPoint = entity => ({
  delete: ({ id }) => fetch(`http://localhost:3004/${entity}/${id}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'DELETE',
  }),
  update: ({ id, ...entityBody }) => {
    if (id) {
      return fetch(`http://localhost:3004/${entity}/id`, {
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(entityBody),
        method: 'PUT',
      });
    }
    return fetch(`http://localhost:3004/${entity}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(entityBody),
    }).then(response => response.json().id);
  },
  load: (params) => {
    const query = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    return fetch(`http://localhost:3004/${entity}?${query}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    });
  },
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(ApiMiddleware({
  USERS: entityPoint('USERS'),
  POSTS: entityPoint('POSTS'),
  COMMENTS: entityPoint('COMMENTS'),
})));

const store = createStore(
  combineReducers({
    [REDUX_PATHS.STORE_KEY]: dataReducer,
    form: formReducer,
  }),
  enhancer,
);
export default store;
