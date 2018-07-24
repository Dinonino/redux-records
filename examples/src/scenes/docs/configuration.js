import React from 'react';
import { Header, Divider, Segment, Container, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const Configuration = () => (
  <Container>
    <Header as='h1' dividing>Configuration</Header>
    <p>There are few important configuration keys used in configuration of library and in library code, so for easier understanding of library usage and how it works under the hood it's important to understand what they mean:</p>
    <List bulleted>
    <List.Item><b>storeKey:</b> Store location of root redux-records reducer/state. Default value is 'RRECORDS' and in most cases you don't need to change this value.</List.Item>
    <List.Item><b>dataKey:</b> Unique Record type identifier, used as part of the store path and action constants</List.Item>
    <List.Item><b>dataID:</b> Record type identifier property, default value is 'id'</List.Item>
    </List>
  </Container>
);

export default Configuration;
