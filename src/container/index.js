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
const relationsConfig = {
  loadOnMount: true,
  recordsPropertyName: '',
};
const defaultConfig = {
  storeKey: STORE_KEY,
  dataID: 'id',
  destroyOnUnmount: false,
  initializeOnMount: true,
  loadOnMount: false,
  relations: {},
};

const calculateRelations = (relations) => {
  const calcRelations = {};
  if (relations &&
    typeof config === 'object' &&
    relations.constructor === Object) {
    Object.entries(relations).forEach(([key, value]) => {
      if (typeof value === 'string' || value instanceof String) {
        calcRelations[key] = { ...relationsConfig, foreignRecordKey: value };
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        calcRelations[key] = { ...relationsConfig, ...value };
      }
    });
  }
  return calcRelations;
};


const calculateConfig = (config) => {
  const calcConfig = [];
  if (typeof config === 'string' || config instanceof String) {
    calcConfig.push({
      ...defaultConfig,
      dataKey: config,
    });
  } else if (config && typeof config === 'object' && config.constructor === Object) {
    calcConfig.push({
      ...defaultConfig,
      ...config,
      relations: calculateRelations(config.relations),
    });
  } else if (config && typeof config === 'object' && config.constructor === Array) {
    for (let index = 0; index < config.length; index += 1) {
      const element = config[index];
      if (typeof element === 'string' || element instanceof String) {
        calcConfig.push({
          ...defaultConfig,
          dataKey: element,
        });
      } else if (element && typeof element === 'object' && element.constructor === Object) {
        calcConfig.push({
          ...defaultConfig,
          ...element,
          relations: calculateRelations(element.relations),
        });
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
        dataKey, onIdUpdated, dataID, destroyOnUnmount, relations, initializeOnMount, loadOnMount,
      } = configurations[index];
      const actions = bindActionCreators(actionsFactory(dataKey), dispatch);
      if (initializeOnMount) {
        onMount.push(() => actions.initializeStore(dataID, relations));
      }
      if (loadOnMount) {
        onMount.push(() => actions.loadAction());
      }
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

