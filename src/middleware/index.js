import { ACTION, STORE_KEY } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector, dataIDSelector } from '../selectors';

const isPromise = obj => !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
const handleAction = (options, dispatch) => (apiKey, payload, actionSucceeded, actionFailed) => {
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


const handleUpdateSuccess = (previousId, updateSucceededAction) =>
  payload =>
    updateSucceededAction(previousId, payload);

const apiMiddleware = ({ storeKey = STORE_KEY, endpoints = {} }) =>
  ({ dispatch, getState }) =>
    next =>
      (action) => {
        const { type, payload = {} } = action;
        if (type.startsWith(constants.ID)) {
          const { entity } = payload;
          const dataKey = constants.DATA_ID_EXP.exec(type)[1];
          const actionCreators = actionsFactory(dataKey);
          const api = endpoints[dataKey];
          const handler = handleAction(api, dispatch);
          const dataID = dataIDSelector({ storeKey, dataKey })(getState());
          if (constants.DELETE_SYNC.test(type)) {
            handler('delete', entity, actionCreators.deleteSucceededAction, actionCreators.deleteFailedAction);
          } else if (constants.LOAD_SYNC.test(type)) {
            handler('load', payload, actionCreators.loadSucceededAction, actionCreators.loadFailedAction);
          } else if (constants.UPDATE_SYNC.test(type)) {
            handler('update', entity, actionCreators.updateSucceededAction, actionCreators.updateFailedAction);
          } else if (constants.SYNC_ALL.test(type)) {
            const actions = actionsSelector({ storeKey, dataKey })(getState());
            for (let index = 0; index < actions.length; index += 1) {
              const entityAction = actions[index];
              const { type: actionType, action: actionPayload } = entityAction;
              switch (actionType) {
                case ACTION.DELETE:
                  handler('delete', actionPayload, actions.deleteSucceededAction, actions.deleteFailedAction);
                  break;
                case ACTION.UPDATE:
                  handler('update', actionPayload, handleUpdateSuccess(entity[dataID], actions.updateSucceededAction), actions.updateFailedAction);
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
