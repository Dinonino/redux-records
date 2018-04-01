import { STORE_KEY, STORE_PATH } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector } from '../selectors';
import { ACTION } from '../reducer/constants'

const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
const handleAction = (options, entityKey, dispatch) => (payload, apiKey, actionSucceeded, actionFailed) => {
  if (options && apiKey && options[apiKey] && typeof options[apiKey] === 'function') {
    try {
      const resultPromise = options[apiKey](payload);
      if (isPromise(resultPromise)) {
        resultPromise.then(result => {
          dispatch(actionSucceeded(result));
        }, error => {
          dispatch(actionFailed(error));
        });
      } else {
        dispatch(actionFailed("Invalid method implementation"));
      }
    } catch (exception) {
      dispatch(actionFailed(exception));
    }
  }
  else {
    dispatch(actionFailed("Method not implemented"));
  }
}

let keys = null;
const handleUpdateSuccess = (previousId, updateSucceededAction) => payload => updateSucceededAction(previousId, updateSucceededAction);


const apiMiddleware = options => ({ dispatch, getState }) => next => action => {
  const { type, payload } = action;
  if (type.startsWith(constants.ID)) {
    if (!keys) {
      for (const [key, value] of Object.entries(getState())) {
        if (value[STORE_PATH.KEY] === STORE_KEY) {
          keys = object.entries(value).reduce((acc, [dataId, value]) => {
            acc[dataId] = value[STORE_PATH.KEY];
            return acc;
          }, {});
          break;
        }
      }
    }
    const id = constants.DATA_ID_EXP.exec(type)[0];
    const actions = actionsFactory(id);
    const api = options[id];
    const handler = handleAction(api,keys[api], dispatch);
    if (constants.DELETE.test(type)) {
      handler("delete", actions.deleteSucceededAction, actions.deleteFailedAction, payload);
    } else if (constants.LOAD.test(type)) {
      handler("load", actions.loadSucceededAction, actions.loadFailedAction, payload);
    } else if (constants.UPDATE.test(type)) {

      handler("update", actions.updateSucceededAction, actions.updateFailedAction, payload);
    } else if (constants.SYNC_ALL.test(type)) {
      const actions = actionsSelector(getState(), id);
      for (let action of actions) {
        const { type, payload } = action;
        switch (type) {
          case ACTION.DELETE:
            handler("delete", actions.deleteSucceededAction, actions.deleteFailedAction, payload);
            break;
          case ACTION.UPDATE:
            handler("update", result => {

            }, handleUpdateSuccess(,actions.updateSucceededAction), actions.updateFailedAction, payload);
            break;
          default:
            break;
        }

      }
    }
  }
  next(action);
};

export default apiMiddleware;
