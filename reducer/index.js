import { STORE_PATH, ACTION, ENTITY_STATE } from './constants';
import constantsFactory from '../actions/constants';


const initialState = {
  [STORE_PATH.DATA]: [],
  [STORE_PATH.STATE]: {
  },
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
  const reducerOptions = { ...options, key };
  return (state = initialState, { type, payload }) => {
    const id = payload[reducerOptions.key];
    let newState;
    switch (type) {
      case CONSTANTS.DELETE:
        newState = { ...state };
        newState[STORE_PATH.STATE][id] = {
          ACTION: ACTION.DELETE,
          STATE: ENTITY_STATE.SYNCING,
          PAYLOAD: payload,
        };
        return newState;
      case CONSTANTS.DELETE_FAILED:
        newState = { ...state };
        newState[STORE_PATH.STATE][id].STATE = ENTITY_STATE.SYNC_FAILED;
        newState[STORE_PATH.STATE][id].MSG = payload.error;
        return newState;
      case CONSTANTS.DELETE_SUCCEEDED:
        newState = { ...state };
        delete newState[STORE_PATH.STATE][id];
        delete newState[STORE_PATH.DATA][id];
        return newState;
      case CONSTANTS.LOAD:
        newState = { ...state };
        newState[STORE_PATH.STATE].LOAD = {
          ACTION: ACTION.LOAD,
          STATE: ENTITY_STATE.SYNCING,
          PAYLOAD: payload,
        };
        return newState;
      case CONSTANTS.LOAD_FAILED:
        newState = { ...state };
        newState[STORE_PATH.STATE].LOAD.STATE = ENTITY_STATE.SYNC_FAILED;
        newState[STORE_PATH.STATE].LOAD.MSG = payload.error;
        return newState;
      case CONSTANTS.LOAD_SUCCEEDED:
        newState = { ...state };
        delete newState[STORE_PATH.STATE].LOAD;
        newState[STORE_PATH.DATA] = mergeEntities(newState[STORE_PATH.DATA], payload);
        return newState;
      case CONSTANTS.UPDATE:
        newState = { ...state };
        newState[STORE_PATH.STATE][id] = {
          ACTION: ACTION.UPDATE,
          STATE: ENTITY_STATE.SYNCING,
          PAYLOAD: payload,
        };
        return newState;
      case CONSTANTS.UPDATE_FAILED:
        newState = { ...state };
        newState[STORE_PATH.STATE][id].STATE = ENTITY_STATE.SYNC_FAILED;
        newState[STORE_PATH.STATE][id].MSG = payload.error;
        return newState;
      case CONSTANTS.UPDATE_SUCCEEDED:
        newState = { ...state };
        newState[STORE_PATH.DATA][id] = newState[STORE_PATH.STATE][id].PAYLOAD;
        newState[STORE_PATH.STATE][id].STATE = ENTITY_STATE.SYNCED;
        return newState;
      case CONSTANTS.SYNC_ALL:
        return state;
      default:
        return state;
    }
  };
};
export default reducerFactory;
