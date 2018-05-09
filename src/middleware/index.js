import { ACTION } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector } from '../selectors';

const isPromise = obj => !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
const handleAction = (options, dispatch) => (payload, apiKey, actionSucceeded, actionFailed) => {
  if (options && apiKey && options[apiKey] && typeof options[apiKey] === 'function') {
    try {
      const resultPromise = options[apiKey](payload);
      if (isPromise(resultPromise)) {
        resultPromise.then((result) => {
          dispatch(actionSucceeded(result));
        }, (error) => {
          dispatch(actionFailed(error));
        });
      } else {
        dispatch(actionFailed('Invalid method implementation'));
      }
    } catch (exception) {
      dispatch(actionFailed(exception));
    }
  } else {
    dispatch(actionFailed('Method not implemented'));
  }
};


const handleUpdateSuccess = (previousId, updateSucceededAction) => payload => updateSucceededAction(previousId, updateSucceededAction);


const apiMiddleware = options => ({ dispatch, getState }) => next => (action) => {
  const { type, payload } = action;
  if (type.startsWith(constants.ID)) {
    const id = constants.DATA_ID_EXP.exec(type)[0];
    const actionCreators = actionsFactory(id);
    const api = options[id];
    const handler = handleAction(api, dispatch);
    if (constants.DELETE_SYNC.test(type)) {
      handler('delete', actionCreators.deleteSucceededAction, actionCreators.deleteFailedAction, payload);
    } else if (constants.LOAD_SYNC.test(type)) {
      handler('load', actionCreators.loadSucceededAction, actionCreators.loadFailedAction, payload);
    } else if (constants.LOAD_SYNC.test(type)) {
      handler('update', actionCreators.updateSucceededAction, actionCreators.updateFailedAction, payload);
    } else if (constants.SYNC_ALL.test(type)) {
      const actions = actionsSelector(getState(), id);

      for (let index = 0; index < actions.length; index += 1) {
        const entityAction = actions[index];


        const { type: actionType, action: actionPayload } = entityAction;
        switch (actionType) {
          case ACTION.DELETE:
            handler('delete', actions.deleteSucceededAction, actions.deleteFailedAction, actionPayload);
            break;
          case ACTION.UPDATE:
            handler('update', (result) => {

            }, handleUpdateSuccess(id, actions.updateSucceededAction), actions.updateFailedAction, actionPayload);
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
