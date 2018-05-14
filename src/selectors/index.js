import { STORE_PATH } from '../reducer/constants';

export const dataSelector = ({
  storeKey, dataKey, ID,
}) => (state) => {
  const data = state &&
    state[storeKey] &&
    state[storeKey][dataKey] &&
    state[storeKey][dataKey][STORE_PATH.DATA];
  const dataID = state &&
    state[storeKey] &&
    state[storeKey][dataKey] &&
    state[storeKey][dataKey][STORE_PATH.KEY];
  return data && ID && dataID ? data.find(({ [dataID]: id }) => id === ID) : data;
};

export const stateSelector = ({ storeKey, dataKey, ID }) => (state) => {
  const data = state &&
    state[storeKey] &&
    state[storeKey][dataKey] &&
    state[storeKey][dataKey][STORE_PATH.STATE];
  return data && ID ? data[STORE_PATH.ENTITIES_STATE][ID] : data;
};

export const actionsSelector = ({ storeKey, dataKey, ID }) =>
  state =>
    Object
      .entries(state[storeKey])
      .reduce((acc, [key, { [STORE_PATH.STATE]: entitiesState = [] }]) => {
        if (!dataKey || dataKey === key) {
          const actions = ID ? [entitiesState[ID]] : Object.values(entitiesState);
          return acc.concat(actions.map(({ ACTIONS, HISTORY_INDEX }) => ACTIONS[HISTORY_INDEX]));
        }
        return acc;
      }, []);

export const dataIDSelector = ({
  storeKey, dataKey,
}) => state => state &&
  state[storeKey] &&
  state[storeKey][dataKey] &&
  state[storeKey][dataKey][STORE_PATH.KEY];
