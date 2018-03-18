import { STORE_PATH, ACTION, ENTITY_STATE } from './constants';
import constantsFactory from '../actions/constants';

const initialState = {
  [STORE_PATH.DATA]: [],
  [STORE_PATH.STATE]: {},
};

const options = {
  key: 'ID',
};

const mergeEntities = (previousEntities, newEntities, id) => {
  const retValue = [];
  const prevDict = previousEntities.reduce((dict, elem) => ({ ...dict, [elem[id]]: elem }), {});
  const nextDict = newEntities.reduce((dict, elem) => ({ ...dict, [elem[id]]: elem }), {});

  previousEntities.forEach((element) => {
    if (nextDict[element[id]]) {
      retValue.push(nextDict[element[id]]);
    } else {
      retValue.push(element);
    }
  });

  newEntities.forEach((element) => {
    if (!prevDict[element[id]]) {
      retValue.push(element);
    }
  });
  return retValue;
};


const reducerFactory = ({ ID, key }) => {
  const CONSTANTS = constantsFactory(ID);
  return (state = initialState, { type, payload }) => {
    const { [key]: id = '', ...data } = payload || {};
    const entity = state[STORE_PATH.DATA].find(el => el[key] === id);
    const entityState = state[STORE_PATH.STATE][id];
    switch (type) {
      case CONSTANTS.DELETE:
      case CONSTANTS.DELETE_SYNC:
        if (data) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          entityState.STATE = ENTITY_STATE.OUT_OF_SYNC;

          if (entityState.ACTIONS.length && entityState.ACTIONS.length > (entityState.HISTORY_INDEX + 1)) {
            entityState.ACTIONS.splice(state.HISTORY_INDEX);
          }

          entityState.ACTIONS.push({ ACTION: ACTION.DELETE, PAYLOAD = payload, SNAPSHOT: entity });
          entityState.HISTORY_INDEX = state.HISTORY.length - 1;
        }
        return state;
      case CONSTANTS.DELETE_FAILED:
        entityState.STATE = ENTITY_STATE.SYNC_FAILED;
        entityState.SYNC_MSG = payload.error;
        return state;
      case CONSTANTS.DELETE_SUCCEEDED:
        entityState.STATE = ENTITY_STATE.SYNCED;
        entityState.SYNC_MSG = '';
        entityState.ACTIONS = [];
        entityState.HISTORY_INDEX = undefined;
        return state;
      case CONSTANTS.LOAD:
        newState = { ...state };
        newState[STORE_PATH.STATE].LOAD = {
          ACTION: ACTION.LOAD,
          STATE: ENTITY_STATE.SYNCING,
          PAYLOAD: payload,
        };
        return newState;
      case CONSTANTS.LOAD_FAILED:
        entityState.STATE = ENTITY_STATE.SYNC_FAILED;
        entityState.SYNC_MSG = payload.error;
        return state;
      case CONSTANTS.LOAD_SUCCEEDED:
        newState = { ...state };
        delete newState[STORE_PATH.STATE].LOAD;
        newState[STORE_PATH.DATA] = mergeEntities(newState[STORE_PATH.DATA], payload);
        return newState;
      case CONSTANTS.UPDATE:
      case CONSTANTS.UPDATE_SYNC:
        if (data) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          state[STORE_PATH.DATA].push(payload);
          entityState.STATE = ENTITY_STATE.OUT_OF_SYNC;

          if (entityState.ACTIONS.length && entityState.ACTIONS.length > (entityState.HISTORY_INDEX + 1)) {
            entityState.ACTIONS.splice(state.HISTORY_INDEX);
          }

          entityState.ACTIONS.push({ ACTION: ACTION.DELETE, PAYLOAD = payload, SNAPSHOT: entity });
          entityState.HISTORY_INDEX = state.HISTORY.length - 1;
        }
        return state;
      case CONSTANTS.UPDATE_FAILED:
        entityState.STATE = ENTITY_STATE.SYNC_FAILED;
        entityState.SYNC_MSG = payload.error;
        return state;
      case CONSTANTS.UPDATE_SUCCEEDED:
        entityState.STATE = ENTITY_STATE.SYNCED;
        entityState.SYNC_MSG = '';
        entityState.ACTIONS = [];
        entityState.HISTORY_INDEX = undefined;
      case CONSTANTS.SYNC_ALL:
      default:
        return state;
    }
  };
};
export default reducerFactory;
