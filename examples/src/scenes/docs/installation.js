import React from 'react';
import { Header, Divider, Segment, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/ext/language_tools';
import 'brace/mode/jsx';
import 'brace/mode/html';
import 'brace/theme/tomorrow';

const code = `import { createStore, combineReducers } from 'redux';
import { reducerFactory, REDUX_PATHS } from 'redux-records';

const store = createStore(
  combineReducers({
    [REDUX_PATHS.STORE_KEY]: reducerFactory(),
  }),
  enhancer,
);
export default store;`;
const Installation = () => (
  <Container>
    <Header as='h1' dividing>Installation</Header>
    <Header as='h3'>NPM package</Header>
    <p>Install npm package:</p>
    <pre>$ npm install redux-records</pre>
    <p>
      Library has redux as peer dependency, so make sure you have it installed.
     </p>
    <p>
      All you need to do next is inject records reducer:
      </p>
      <Header as='h3'>Setting up the store</Header>
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
      value={code}
      readOnly={true}
    />
  </Container>
);

export default Installation;
