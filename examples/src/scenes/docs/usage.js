import React from 'react';
import { Header, Divider, Segment, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/ext/language_tools';
import 'brace/mode/jsx';
import 'brace/mode/html';
import 'brace/theme/tomorrow';

const container = `import React, { Component } from 'react';
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

export default container;`;

const config_1 = `import dataContainer from '../../components/datacontainer';
const presentationComponent = ...
const simpleUsersComponent = dataContainer('USERS')(presentationComponent);`;

const config_2 = `const arrayConfigComponent = dataContainer(['USERS','COMMENTS'])(presentationComponent);

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
 'COMMENTS'])(presentationComponent); `;
const Usage = () => (
  <Container>
    <Header as='h1' dividing>Usage</Header>
    <Header as='h3'>Container</Header>
    <p>In case you are using library in react project you might wanna define react container for ease of use:</p>
    <AceEditor
      mode={'jsx'}
      theme='tomorrow'
      width='100%'
      height='100px'
      enableBasicAutocompletion
      enableLiveAutocompletion
      editorProps={{ $blockScrolling: Infinity }}
      highlightActiveLine={false}
      maxLines={Infinity}
      showGutter={true}
      showPrintMargin={false}
      tabSize={2}
      value={container}
      readOnly={true}
    />
    <Header as='h3'>Container configuration</Header>
    <p>With container defined you can use it to inject new record types into your presentation components like this:</p>
    <AceEditor
      mode={'jsx'}
      theme='tomorrow'
      width='100%'
      height='100px'
      enableBasicAutocompletion
      enableLiveAutocompletion
      editorProps={{ $blockScrolling: Infinity }}
      highlightActiveLine={false}
      maxLines={Infinity}
      showGutter={true}
      showPrintMargin={false}
      tabSize={2}
      value={config_1}
      readOnly={true}
    />
    <p>This will insert Users data and actions for loading, editing, creating and deleting User records.</p>
    <p>There multiple ways to initialize data container:</p>
    <AceEditor
      mode={'jsx'}
      theme='tomorrow'
      width='100%'
      height='100px'
      enableBasicAutocompletion
      enableLiveAutocompletion
      editorProps={{ $blockScrolling: Infinity }}
      highlightActiveLine={false}
      maxLines={Infinity}
      showGutter={true}
      showPrintMargin={false}
      tabSize={2}
      value={config_2}
      readOnly={true}
    />
  </Container>
);

export default Usage;
