import { ACTION, STORE_KEY, ENTITY_STATE } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector, dataIDSelector } from '../selectors';

const isPromise = obj => !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

const handleActionFactory = (options, dispatch) =>
  ({
    actionKey,
    payload,
    actionSucceeded,
    actionFailed,
  }) => {
    const { [actionKey]: action } = options || {};
    if (typeof action === 'function') {
      try {
        const resultPromise = options[actionKey](payload);
        if (isPromise(resultPromise)) {
          resultPromise.then(result => {
            return result;
          }, (error) => {
            dispatch(actionFailed(error));
          }).then((resolvedResponse) => {
            dispatch(actionSucceeded(resolvedResponse));
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


const handleUpdateSuccess = (id, updateSucceededAction) =>
  payload =>
    updateSucceededAction(payload, id);

const handleUpdateFailed = (id, updateFailedAction) =>
  payload =>
    updateFailedAction(id, payload);

const handleDeleteSuccess = (id, deleteSucceededAction) =>
  payload =>
    deleteSucceededAction(id, payload);

const handleDeleteFailed = (id, deleteFailedAction) =>
  payload =>
    deleteFailedAction(id, payload);

const handleStateActionFactory = ({ handler, actionCreators, dataID }) =>
  ({ ACTION: type, PAYLOAD: payload, STATE }) => {
    const { entity: { [dataID]: id, ...entityData } = {} } = payload;
    const entity = { ...entityData };
    if (STATE !== ENTITY_STATE.NEW) {
      entity[dataID] = id;
    }
    switch (type) {
      case ACTION.DELETE:
        handler({
          actionKey: 'delete',
          payload: entity,
          actionSucceeded: handleDeleteSuccess(id, actionCreators.deleteSucceededAction),
          actionFailed: handleDeleteFailed(id, actionCreators.deleteFailedAction),
        });
        break;
      case ACTION.UPDATE:
        handler({
          actionKey: 'update',
          payload: entity,
          actionSucceeded: handleUpdateSuccess(id, actionCreators.updateSucceededAction),
          actionFailed: handleUpdateFailed(id, actionCreators.updateFailedAction),
        });
        break;
      case ACTION.LOAD:
        handler({
          actionKey: 'load',
          payload,
          actionSucceeded: actionCreators.loadSucceededAction,
          actionFailed: actionCreators.loadFailedAction,
        });
        break;
      default:
        break;
    }
  };

const apiMiddleware = ({ storeKey = STORE_KEY, endpoints = {} }) =>
  ({ dispatch, getState }) =>
    next =>
      (action) => {
        next(action);
        const { type, payload = {} } = action;
        if (type.startsWith(constants.ID)) {
          const dataKey = constants.DATA_ID_EXP.exec(type)[1];
          const actionCreators = actionsFactory(dataKey);
          const api = endpoints[dataKey];
          const handler = handleActionFactory(api, dispatch);
          const dataID = dataIDSelector({ storeKey, dataKey })(getState());
          const handleStateAction = handleStateActionFactory({ handler, actionCreators, dataID });

          if (constants.DELETE_SYNC.test(type) ||
            constants.UPDATE_SYNC.test(type)) {
            const { entity, entityId } = payload;
            const stateAction = actionsSelector({
              storeKey,
              dataKey,
              ID: entityId || (entity && entity[dataID]),
            })(getState())[0];
            handleStateAction(stateAction);
          } else if (constants.LOAD.test(type)) {
            handleStateAction({ ACTION: ACTION.LOAD, PAYLOAD: payload });
          } else if (constants.SYNC_ALL.test(type)) {
            const actions = actionsSelector({ storeKey, dataKey })(getState());
            for (let index = 0; index < actions.length; index += 1) {
              handleStateAction(actions[index]);
            }
          }
        }
      };

export default apiMiddleware;
