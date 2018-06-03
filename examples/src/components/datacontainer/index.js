import React, { Component } from 'react';
import { dataContainer } from 'redux-records'
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

const hocContainer = WrappedComponent => class Container extends Component {
  componentWillMount() {
    const { rr_actions: { onMount } } = this.props;
    onMount();
  }

  componentWillUnmount() {
    const { rr_actions: { onUnmount } } = this.props;
    onUnmount();
  }

  render() {
    return (<WrappedComponent
      {...this.props}
    />);
  }
};

const container = (config, mapStateToProps) => compose(
  dataContainer(connect, config, mapStateToProps),
  hocContainer,
);

export default container;
