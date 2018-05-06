import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { STORE_KEY } from '../reducer/constants';
import { stateSelector, dataSelector } from '../selectors';
import actionsFactory from '../actions/index';

const DataContainerHOC = ({ destroyOnUnmount, dataID }) =>
  WrappedComponent => class DataContainer extends Component {
    componentWillMount() {
      const { initializeStore } = this.props;
      initializeStore(dataID);
    }

    componentWillUnmount() {
      const { destructStore } = this.props;
      if (destroyOnUnmount) {
        destructStore();
      }
    }

    render() {
      return (<WrappedComponent
        {...this.props}
      />);
    }
  };

const dataContainer = ({
  storeKey = STORE_KEY, dataID = 'id', dataKey, ID, destroyOnUnmount = false, mapStateToProps,
}) => {
  const dataSel = dataSelector({ storeKey, dataKey, ID });
  const stateSel = stateSelector({ storeKey, dataKey, ID });
  return compose(
    connect(
      (state) => {
        const data = dataSel(state);
        const dataState = stateSel(state);
        const props = !mapStateToProps ? {} : mapStateToProps(state, data, dataState);
        return {
          data,
          dataState,
          ...props,
        };
      },
      actionsFactory(dataKey),
    ),
    DataContainerHOC({ ID, dataID, destroyOnUnmount }),
  );
};


export default dataContainer;

