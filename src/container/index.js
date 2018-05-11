import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { STORE_KEY } from '../reducer/constants';
import { stateSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';

const DataContainerHOC = entities =>
  WrappedComponent => class DataContainer extends Component {
    componentWillMount() {
      for (let index = 0; index < entities.length; index += 1) {
        const { dataID, dataKey } = entities[index];
        const { [`${dataKey}_Actions`]: { initializeStore } = {} } = this.props;
        initializeStore(dataID);
      }
    }

    componentWillUnmount() {
      for (let index = 0; index < entities.length; index += 1) {
        const { destroyOnUnmount, dataKey } = entities[index];
        const { [`${dataKey}_Actions`]: { destructStore } = {} } = this.props;
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
  storeKey = STORE_KEY, dataID = 'id', dataKey, ID, mapStateToProps,
}) => {
  const entityID = (ID instanceof Function) ? ID(ownProps) : ID;
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

  const mapProps = (state, ownProps) => {
    const ret = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const element = configurations[index];
      const { dataKey } = element;
      ret[dataKey] = entityMapStateToProps(state, ownProps, element);
    }
    if (mapStateToProps) {
      return {
        ...ret,
        ...mapStateToProps(state, ret),
      };
    }
    return ret;
  };

  const mapActions = (dispatch) => {
    const ret = {};
    for (let index = 0; index < configurations.length; index += 1) {
      const { dataKey } = configurations[index];
      ret[`${dataKey}_Actions`] = bindActionCreators(actionsFactory(dataKey), dispatch);
    }
    return ret;
  };

  return compose(
    connect(
      mapProps,
      mapActions,
    ),
    DataContainerHOC(configurations),
  );
};


export default dataContainer;

