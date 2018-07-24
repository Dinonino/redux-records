import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Divider, Label, Icon } from 'semantic-ui-react'

import 'brace/ext/language_tools';
import 'brace/mode/jsx';
import 'brace/mode/html';
import 'brace/theme/tomorrow';

class codeDoc extends Component {
  constructor() {
    super();
    this.state = { visible: false };
  }

  toggleVisibility = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }
  render() {
    const { code } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <Divider horizontal><Label onClick={this.toggleVisibility}>  <Icon name='code' />Code</Label></Divider>
        {visible && <AceEditor
          mode={'jsx'}
          theme='tomorrow'
          width='100%'
          height='100px'
          enableBasicAutocompletion
          enableLiveAutocompletion
          editorProps={{ $blockScrolling: Infinity }}
          highlightActiveLine={false}
          maxLines={Infinity}
          showGutter={false}
          showPrintMargin={false}
          tabSize={2}
          value={code}
          readOnly={true}
        />}
      </div>);
  }
}
export default codeDoc;
