# <a href='https://github.com/ivanvarga/redux-records'><img src="https://raw.githubusercontent.com/ivanvarga/redux-records/master/examples/src/RR_logo-color.svg?sanitize=true" height="60"/></a>

Lightweight yet powerful redux solution for data management that makes reduces boilerplate code necessary for data manipulation.
## Installation
```console
npm install redux-records
```
Library has redux as peer dependency, so make sure you have it installed.
## Getting started
### Container
In case you are using library in react project you might wanna define react container for ease of use:
```js
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
```
### Container configuration
With container defined you can use it to inject new record types into your presentation components like this:
```js
import dataContainer from '../../components/datacontainer';
const presentationComponent = ...
const simpleUsersComponent = dataContainer('USERS')(presentationComponent);
```
This will insert Users data and actions for loading, editing, creating and deleting User records.

There multiple ways to initialize data container:
```js
 const arrayConfigComponent = dataContainer(['USERS','COMMENTS'])(presentationComponent);

 const objectConfigComponent = dataContainer({ 
   storeKey: 'RRECORDS',
   dataID: 'id',
   dataKey:'USERS',
   destroyOnUnmount: false,
   initializeOnMount: true,
   loadOnMount: false,
   relations: {},
  })(presentationComponent); 

  const mixedConfigComponent = dataContainer([{ 
   storeKey: 'RRECORDS',
   dataID: 'id',
   dataKey:'USERS',
   destroyOnUnmount: false,
   initializeOnMount: true,
   loadOnMount: false,
   relations: {},
  },
  'COMMENTS'])(presentationComponent); 
```
## Configuration
There are few important configuration keys used in configuration of library and in library code, so for easier understanding of library usage and how it works under the hood it's important to understand what they mean:
* **storeKey:**
Store location of root redux-records reducer/state. Default value is 'RRECORDS' and in most cases you don't need to change this value.
* **dataKey:**
Unique Record type identifier, used as part of the store path and action constants
* **dataID**
Record type identifier property, default value is 'id'
