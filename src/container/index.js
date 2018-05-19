import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { STORE_KEY } from '../reducer/constants';
import { stateSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';


/**
 * Based on https://github.com/Steve-Fenton/TypeScriptUtilities
 * implementation of GUID
 * @returns {string} GUID string
 */
const getGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;// eslint-disable-line no-bitwise
  const v = c === 'x' ? r : (r & 0x3 | 0x8);// eslint-disable-line no-bitwise
  return v.toString(16);
});


const DataContainerHOC = entities =>
  WrappedComponent => class DataContainer extends Component {
    componentWillMount() {
      for (let index = 0; index < entities.length; index += 1) {
        const { dataID, dataKey } = entities[index];
        const { [dataKey]: { actions: { initializeStore } = {} } = {} } = this.props;
        initializeStore(dataID);
      }
    }

    componentWillUnmount() {
      for (let index = 0; index < entities.length; index += 1) {
        const { destroyOnUnmount, dataKey } = entities[index];
        const { [dataKey]: { actions: { destructStore } = {} } = {} } = this.props;
        if (destroyOnUnmount) {
          destructStore();
        }
      }
    }

    render() {
      return (<WrappedComponent
        {...this.props}
      />);
    }
  };

const entityMapStateToProps = (state, ownProps, {
  storeKey = STORE_KEY,
  dataKey,
  ID,
  mapStateToProps,
  tempId,
}) => {
  const entityID = tempId ||
    (ID instanceof Function ? ID(ownProps) : ID);
  const data = dataSelector({
    storeKey, dataKey, ID: entityID,
  })(state);
  const dataState = stateSelector({ storeKey, dataKey, ID: entityID })(state);
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
      storeKey: STORE_KEY, dataID: 'id', dataKey: config, destroyOnUnmount: false,
    });
  } else if (config && typeof config === 'object' && config.constructor === Object) {
    calcConfig.push(config);
  } else if (config && typeof config === 'object' && config.constructor === Array) {
    for (let index = 0; index < config.length; index += 1) {
      const element = config[index];
      if (typeof element === 'string' || element instanceof String) {
        calcConfig.push({
          storeKey: STORE_KEY, dataID: 'id', dataKey: element, destroyOnUnmount: false,
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

const dataContainer = (config, mapStateToProps) => {
  const configurations = calculateConfig(config);
  const tempId = {};
  const mapProps = (state, ownProps) => {
    const data = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const element = configurations[index];
      const { dataKey } = element;
      data[dataKey] = entityMapStateToProps(
        state,
        ownProps,
        { ...element, tempId: tempId[dataKey] },
      );
    }
    if (mapStateToProps) {
      return {
        data,
        ...mapStateToProps(state, data),
      };
    }
    return { data };
  };

  const mapActions = (dispatch) => {
    const mappedActions = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const { dataKey } = configurations[index];
      const actions = bindActionCreators(actionsFactory(dataKey), dispatch);
      mappedActions[dataKey] = {
        ...actions,
        updateAction: ({ id, ...entity }) => {
          if (id) {
            actions.updateAction({ id, ...entity });
          } else {
            tempId[dataKey] = tempId[dataKey] || getGUID();
            actions.updateAction(entity, tempId[dataKey]);
          }
        },
        updateSyncAction: ({ id, ...entity }) => {
          if (id) {
            actions.updateSyncAction({ id, ...entity });
          } else {
            tempId[dataKey] = tempId[dataKey] || getGUID();
            actions.updateSyncAction(entity, tempId[dataKey]);
          }
        },
      };
    }
    return mappedActions;
  };

  const mergeProps = ({ data, ...restOfData }, actions, ownProps) => {
    const entities = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const { dataKey } = configurations[index];
      entities[dataKey] = {
        data: data[dataKey].data,
        state: data[dataKey].state,
        actions: actions[dataKey],
      };
    }
    return { ...entities, ...restOfData, ...ownProps };
  };

  return compose(
    connect(
      mapProps,
      mapActions,
      mergeProps,
    ),
    DataContainerHOC(configurations),
  );
};


export default dataContainer;

