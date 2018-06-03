import { ACTION, STORE_KEY, ENTITY_STATE } from '../reducer/constants';
import * as constants from '../actions/constants';
import actionsFactory from '../actions';
import { actionsSelector, dataIDSelector } from '../selectors';

const isPromise = obj => !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

const ApiWrapperFactory = (options, dispatch) =>
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
          return resultPromise.then(
            result => result,
            (error) => {
              dispatch(actionFailed(error));
            },
          ).then((resolvedResponse) => {
            dispatch(actionSucceeded(resolvedResponse));
            return resolvedResponse;
          });
        }
        dispatch(actionFailed('Invalid method implementation'));
        return Promise.reject(new Error('Invalid method implementation'));
      } catch (exception) {
        dispatch(actionFailed(exception));
        return Promise.reject(exception);
      }
    } else {
      dispatch(actionFailed('Method not implemented'));
      return Promise.reject(new Error('Method not implemented'));
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
const handleStateActionFactory = ({
  getState,
  storeKey,
  endpoints,
  dispatch,
  recordKey,
  dataKey,
  ID,
  loadPayload,
}) => {
  const actionCreators = actionsFactory(dataKey);
  const stateAction = loadPayload ? {
    ACTION: ACTION.LOAD,
    PAYLOAD: loadPayload,
  } :
    actionsSelector({
      storeKey,
      dataKey,
      ID,
    })(getState())[0];

  const {
    ACTION: type,
    PAYLOAD: payload,
    STATE,
  } = stateAction;
  const api = endpoints[dataKey];
  const handler = ApiWrapperFactory(api, dispatch);
  const { entity: { [recordKey]: currentId, ...entityData } = {}, entityId } = payload;
  const entity = { ...entityData };
  const id = currentId || entityId;
  if (STATE !== ENTITY_STATE.NEW) {
    entity[recordKey] = id;
  }
  switch (type) {
    case ACTION.DELETE:
      return {
        dataKey,
        action: () => handler({
          actionKey: 'delete',
          payload: entity,
          actionSucceeded: handleDeleteSuccess(id, actionCreators.deleteSucceededAction),
          actionFailed: handleDeleteFailed(id, actionCreators.deleteFailedAction),
        }),
      };
    case ACTION.UPDATE:
      return {
        dataKey,
        action: () => handler({
          actionKey: 'update',
          payload: entity,
          actionSucceeded: handleUpdateSuccess(id, actionCreators.updateSucceededAction),
          actionFailed: handleUpdateFailed(id, actionCreators.updateFailedAction),
        }),
      };
    case ACTION.LOAD:
      return {
        dataKey,
        action: () => handler({
          actionKey: 'load',
          payload,
          actionSucceeded: actionCreators.loadSucceededAction,
          actionFailed: actionCreators.loadFailedAction,
        }),
      };
    default:
      return {
        dataKey,
        action: () => Promise.reject(new Error('Unhandled action')),
      };
  }
};

const handleStatesActionFactory = props =>
  (actionProps) => {
    const actions = actionProps.map(actionProp =>
      handleStateActionFactory({ ...props, ...actionProp }));
    actions.forEach(({ action }) => {
      action();
    });
  };

const apiMiddleware = ({ storeKey = STORE_KEY, endpoints = {} }) => ({ dispatch, getState }) => {
  const handleStatesAction = handleStatesActionFactory({
    getState,
    storeKey,
    endpoints,
    dispatch,
  });
  return next => (action) => {
    next(action);
    const { type, payload = {} } = action;
    if (type.startsWith(constants.ID)) {
      const dataKey = constants.DATA_ID_EXP.exec(type)[1];
      const recordKey = dataIDSelector({ storeKey, dataKey })(getState());
      if (constants.DELETE_SYNC.test(type) ||
        constants.UPDATE_SYNC.test(type)) {
        const { entity, entityId } = payload;
        handleStatesAction([{
          recordKey,
          dataKey,
          ID: entityId || (entity && entity[recordKey]),
        }]);
      } else if (constants.LOAD.test(type)) {
        handleStatesAction([{
          recordKey,
          dataKey,
          loadPayload: payload,
        }]);
      } else if (constants.SYNC_ALL.test(type)) {
        const actions = actionsSelector({ storeKey, dataKey })(getState())
          .map(({ [recordKey]: ID }) => ({ recordKey, dataKey, ID }));

        handleStatesAction(actions);
      }
    }
  };
};

export default apiMiddleware;
