import { STORE_PATH } from '../reducer/constants';

export const dataSelector = ({
  storeKey, dataKey, ID, dataID,
}) => (state) => {
  const data = state &&
    state[storeKey] &&
    state[storeKey][dataKey] &&
    state[storeKey][dataKey][STORE_PATH.DATA];
  return data && ID ? data.find(({ [dataID]: id }) => id === ID) : data;
};

export const stateSelector = ({ storeKey, dataKey, ID }) => (state) => {
  const data = state &&
    state[storeKey] &&
    state[storeKey][dataKey] &&
    state[storeKey][dataKey][STORE_PATH.STATE];
  return data && ID ? data[ID] : data;
};
