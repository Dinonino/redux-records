import { bindActionCreators } from 'redux';
import { STORE_KEY, ENTITY_STATE } from '../reducer/constants';
import { stateSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';


/**
 * Based on https://github.com/Steve-Fenton/TypeScriptUtilities
 * implementation of GUID
 * @returns {string} GUID string
 */
const getGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;// eslint-disable-line no-bitwise
  const v = c === 'x' ? r : ((r & 0x3) | 0x8);// eslint-disable-line no-bitwise
  return v.toString(16);
});


const entityMapStateToProps = (state, ownProps, {
  storeKey = STORE_KEY,
  dataKey,
  ID,
  mapStateToProps,
  onIdUpdated,
}) => {
  const entityID = (ID instanceof Function ? ID(ownProps) : ID);
  const data = dataSelector({
    storeKey, dataKey, ID: entityID,
  })(state);
  const dataState = stateSelector({ storeKey, dataKey, ID: entityID })(state);
  if (dataState &&
    dataState.STATE === ENTITY_STATE.ID_UPDATED &&
    onIdUpdated &&
    (onIdUpdated instanceof Function)) {
    onIdUpdated(entityID, dataState.UPDATED_ID);
  }
  const props = !mapStateToProps ? {} : mapStateToProps(state, data, dataState);
  return {
    data,
    dataState,
    ...props,
  };
};

const calculateConfig = (config) => {
  const calcConfig = [];
  if (typeof config === 'string' || config instanceof String) {
    calcConfig.push({
      storeKey: STORE_KEY, dataID: 'id', dataKey: config, destroyOnUnmount: false, relations: {},
    });
  } else if (config && typeof config === 'object' && config.constructor === Object) {
    calcConfig.push(config);
  } else if (config && typeof config === 'object' && config.constructor === Array) {
    for (let index = 0; index < config.length; index += 1) {
      const element = config[index];
      if (typeof element === 'string' || element instanceof String) {
        calcConfig.push({
          storeKey: STORE_KEY, dataID: 'id', dataKey: element, destroyOnUnmount: false, relations: {},
        });
      } else if (element && typeof element === 'object' && element.constructor === Object) {
        calcConfig.push(element);
      } else {
        throw new Error('Invalid container configuration');
      }
    }
  } else {
    throw new Error('Invalid container configuration');
  }
  return calcConfig;
};

const dataContainer = (connect, config, mapStateToProps) => {
  const configurations = calculateConfig(config);
  const mapProps = (state, ownProps) => {
    const data = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const element = configurations[index];
      const { dataKey } = element;
      data[dataKey] = entityMapStateToProps(
        state,
        ownProps,
        element,
      );
    }
    if (mapStateToProps) {
      return {
        data,
        ...mapStateToProps(state, data),
      };
    }
    return { rr_data: data };
  };

  const mapActions = (dispatch) => {
    const mappedActions = {};
    const onMount = [];
    const onUnmount = [];
    for (let index = 0; index < configurations.length; index += 1) {
      const {
        dataKey, onIdUpdated, dataID, destroyOnUnmount, relations,
      } = configurations[index];
      const actions = bindActionCreators(actionsFactory(dataKey), dispatch);
      onMount.push(() => actions.initializeStore(dataID, relations));
      if (destroyOnUnmount) {
        onUnmount.push(() => actions.destructStore());
      }
      mappedActions[dataKey] = {
        ...actions,
        updateAction: ({ id, ...entity }) => {
          if (id) {
            actions.updateAction({ id, ...entity });
          } else {
            const tempId = getGUID();
            actions.updateAction(entity, tempId);
            if (onIdUpdated && (onIdUpdated instanceof Function)) {
              onIdUpdated(null, tempId);
            }
          }
        },
        updateSyncAction: ({ id, ...entity }) => {
          if (id) {
            actions.updateSyncAction({ id, ...entity });
          } else {
            const tempId = getGUID();
            actions.updateSyncAction(entity, tempId);
            if (onIdUpdated && (onIdUpdated instanceof Function)) {
              onIdUpdated(null, tempId);
            }
          }
        },
      };
    }
    return {
      rr_actions: {
        ...mappedActions,
        onMount: () => {
          onMount.forEach(onMntFnc => onMntFnc());
        },
        onUnmount: () => {
          onUnmount.forEach(onUnMntFnc => onUnMntFnc());
        },
      },
    };
  };

  return connect(mapProps, mapActions);
};


export default dataContainer;

