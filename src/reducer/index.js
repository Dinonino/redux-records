import { STORE_PATH, ACTION, ENTITY_STATE, STORE_KEY } from './constants';
import { constantsFactory, CONSTANTS_REGEX } from '../actions';

/**
 * Based on https://github.com/Steve-Fenton/TypeScriptUtilities
 * implementation of GUID
 * @returns {string} GUID string
 */
const getGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  let r = Math.random() * 16 | 0,
    v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});


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


const reducerFactory = ({ ID, dataID }) => {
  const CONSTANTS = constantsFactory(ID);
  const initialState = {
    [STORE_PATH.KEY]: ID,
    [STORE_PATH.DATA]: [],
    [STORE_PATH.STATE]: {
      [STORE_PATH.ENTITIES_STATE]: {},
    },
  };
  return (state = initialState, { type, payload }) => {
    const { entity: { [dataID]: id = '', ...data } = {}, previousId } = payload || {};
    const entityId = previousId || id || getGUID();
    const entity = state[STORE_PATH.DATA].find(el => el[dataID] === entityId);
    if (Object.keys(data).length && !state[STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][entityId]) {
      state[STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][entityId] = { ACTIONS: [] };
    }
    const entityState = state[STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][entityId];

    const globalState = state[STORE_PATH.STATE];
    switch (type) {
      case CONSTANTS.DELETE:
      case CONSTANTS.DELETE_SYNC:
        if (entityState.ACTIONS[entityState.HISTORY_INDEX].ACTION !== ACTION.DELETE) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          entityState.STATE = type === CONSTANTS.DELETE ? ENTITY_STATE.OUT_OF_SYNC : ENTITY_STATE.SYNCING;

          if (entityState.ACTIONS.length && entityState.ACTIONS.length > (entityState.HISTORY_INDEX + 1)) {
            entityState.ACTIONS.splice(state.HISTORY_INDEX);
          }

          entityState.ACTIONS.push({ ACTION: ACTION.DELETE, PAYLOAD: payload, SNAPSHOT: entity });
          entityState.HISTORY_INDEX = state.ACTIONS.length - 1;
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
        break;
      case CONSTANTS.LOAD:
        globalState.STATE = ENTITY_STATE.SYNCING;
        return state;
      case CONSTANTS.LOAD_FAILED:
        globalState.STATE = ENTITY_STATE.SYNC_FAILED;
        globalState.SYNC_MSG = payload.error;
        return state;
      case CONSTANTS.LOAD_SUCCEEDED:
        state[STORE_PATH.DATA] = mergeEntities(state[STORE_PATH.DATA], payload);
        globalState.STATE = ENTITY_STATE.SYNCED;
        globalState.SYNC_MSG = '';
        return state;
      case CONSTANTS.UPDATE:
      case CONSTANTS.UPDATE_SYNC:
        if (Object.keys(data).length) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          state[STORE_PATH.DATA].push({ ...data, [dataID]: entityId });
          entityState.STATE = type === CONSTANTS.UPDATE ? ENTITY_STATE.OUT_OF_SYNC : ENTITY_STATE.SYNCING;

          if (entityState.ACTIONS.length && entityState.ACTIONS.length > (entityState.HISTORY_INDEX + 1)) {
            entityState.ACTIONS.splice(entityState.HISTORY_INDEX);
          }

          entityState.ACTIONS.push({ ACTION: ACTION.DELETE, PAYLOAD: payload, SNAPSHOT: entity });
          entityState.HISTORY_INDEX = entityState.ACTIONS.length - 1;
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
        Object.assign(entity, { id, ...data });
        if (previousId !== id) {
          state[STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][id] = entityState;
          delete state[STORE_PATH.STATE][STORE_PATH.ENTITIES_STATE][previousId];
        }
        break;
      case CONSTANTS.REDO:
        if (entityState.ACTIONS.length && entityState.ACTIONS.length > (entityState.HISTORY_INDEX + 1)) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          entityState.HISTORY_INDEX += 1;
          state[STORE_PATH.DATA].push(entityState.ACTIONS[entityState.HISTORY_INDEX].SNAPSHOT);
        }
        return state;
      case CONSTANTS.UNDO:
        if (entityState.ACTIONS.length && entityState.HISTORY_INDEX > 0) {
          state[STORE_PATH.DATA] = state[STORE_PATH.DATA].filter(el => entity === el);
          entityState.HISTORY_INDEX -= 1;
          state[STORE_PATH.DATA].push(entityState.ACTIONS[entityState.HISTORY_INDEX].SNAPSHOT);
        }
        return state;
      case CONSTANTS.DISCARD:
        entityState.ACTIONS = [];
        entityState.HISTORY_INDEX = undefined;
        return state;
      case CONSTANTS.SYNC_ALL:
        return state;
      default:
        return state;
    }
  };
};

export const reducersFactory = () => {
  const dataState = {};
  return (state = {}, action) => {
    const { type, payload: { dataID } = {} } = action;
    if (type.startsWith(CONSTANTS_REGEX.ID)) {
      const ID = CONSTANTS_REGEX.DATA_ID_EXP.exec(type)[1];
      if (CONSTANTS_REGEX.INITIALIZE.test(type) && !dataState[ID]) {
        dataState[ID] = reducerFactory({ ID, dataID });
        state[ID] = dataState[ID](state[ID], action);
      } else if (CONSTANTS_REGEX.DESTRUCT.test(type)) {
        delete dataState[ID];
        delete state[ID];
      } else {
        state[ID] = dataState[ID](state[ID], action);
      }
    }
    return state;
  };
};

export default reducersFactory;

export { STORE_PATH, ACTION, ENTITY_STATE, STORE_KEY };
