import { ACTION, STORE_KEY, ENTITY_STATE } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector, dataIDSelector, stateSelector } from '../selectors';

const isPromise = obj => !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

const handleAction = (options, dispatch) =>
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

const apiMiddleware = ({ storeKey = STORE_KEY, endpoints = {} }) =>
  ({ dispatch, getState }) =>
    next =>
      (action) => {
        next(action);
        const { type, payload = {} } = action;
        if (type.startsWith(constants.ID)) {
          const { entity, entityId } = payload;
          const dataKey = constants.DATA_ID_EXP.exec(type)[1];
          const actionCreators = actionsFactory(dataKey);
          const api = endpoints[dataKey];
          const handler = handleAction(api, dispatch);
          const dataID = dataIDSelector({ storeKey, dataKey })(getState());
          const state = stateSelector({
            storeKey,
            dataKey,
            ID: entityId || (entity && entity[dataID]),
          })(getState());
          const { [dataID]: id, ...data } = entity || {};
          if (state && (state.STATE !== ENTITY_STATE.NEW)) {
            data[dataID] = id;
          }
          if (constants.DELETE_SYNC.test(type)) {
            handler({
              actionKey: 'delete',
              payload: entity,
              actionSucceeded: handleDeleteSuccess(
                entity[dataID],
                actionCreators.deleteSucceededAction,
              ),
              actionFailed: handleDeleteFailed(
                entity[dataID],
                actionCreators.deleteFailedAction,
              ),
            });
          } else if (constants.LOAD_SYNC.test(type)) {
            handler({
              actionKey: 'load',
              payload,
              actionSucceeded: actionCreators.loadSucceededAction,
              actionFailed: actionCreators.loadFailedAction,
            });
          } else if (constants.UPDATE_SYNC.test(type)) {
            handler({
              actionKey: 'update',
              payload: data,
              actionSucceeded: handleUpdateSuccess(
                entity[dataID],
                actionCreators.updateSucceededAction,
              ),
              actionFailed: handleUpdateFailed(
                entity[dataID],
                actionCreators.updateFailedAction,
              ),
            });
          } else if (constants.SYNC_ALL.test(type)) {
            const actions = actionsSelector({ storeKey, dataKey })(getState());
            for (let index = 0; index < actions.length; index += 1) {
              const entityAction = actions[index];
              const { type: actionType, action: actionPayload } = entityAction;
              const { entity: actionEntity } = actionPayload;
              switch (actionType) {
                case ACTION.DELETE:
                  handler({
                    actionKey: 'delete',
                    payload: actionEntity,
                    actionSucceeded: handleDeleteSuccess(
                      actionEntity[dataID],
                      actionCreators.deleteSucceededAction,
                    ),
                    actionFailed: handleDeleteFailed(
                      actionEntity[dataID],
                      actionCreators.deleteFailedAction,
                    ),
                  });
                  break;
                case ACTION.UPDATE:
                  handler({
                    actionKey: 'update',
                    payload: actionEntity,
                    actionSucceeded: handleUpdateSuccess(
                      entity[dataID],
                      actionCreators.updateSucceededAction,
                    ),
                    actionFailed: handleUpdateFailed(
                      entity[dataID],
                      actionCreators.updateFailedAction,
                    ),
                  });
                  break;
                default:
                  break;
              }
            }
          }
        }
      };

export default apiMiddleware;
