import React from 'react';
import { compose } from 'redux';
import { Table, Button, Loader, Container, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import dataContainer from '../../components/datacontainer';
import CodeDoc from '../../components/codeDoc';

const code = `import React from 'react';
import { compose } from 'redux';
import { Table, Button, Loader } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import dataContainer from '../../components/datacontainer';

const listScreen = (props) => {
  const {
    rr_data: {
      USERS: {
        data = [],
        dataState: {
          STATUS,
          ENTITIES_STATE = {}
        } = {}
      } = {},
    } = {},
    rr_actions: {
      USERS: {
        deleteAction,
        loadAction
      } = {},
    } = {},
  } = props;
  return (
    <div>
      <Loader size='large' active={STATUS === 'SYNCING'} inline='centered'>Loading</Loader>
      <Table>
        <Table.Header>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Username</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Header>
        <Table.Body>
          {data.map(({
            name, username, id,
          }) => (
              <Table.Row key={id}>
                <Table.Cell><Link to={\`/redux-records/edit/\${id}\`}>{name}</Link> </Table.Cell>
                <Table.Cell><Link to={\`/redux-records/edit/\${id}\`}>{username}</Link></Table.Cell>
                <Table.Cell>
                  <Loader size='mini' active={ENTITIES_STATE[id].STATUS === 'SYNCING'} inline>Deleting</Loader>
                  <Button size="small" onClick={() => deleteAction({ id })}>Delete</Button>
                </Table.Cell>
              </Table.Row>))}
        </Table.Body>
      </Table>
      <Button primary onClick={() => loadAction()}>Load Users</Button>
    </div>
  );
};

export default compose(
  withRouter,
  dataContainer([{
    dataKey: 'USERS',
    loadOnMount: true,
  }, 'COMMENTS']))(listScreen);
`;
const listScreen = (props) => {
  const {
    rr_data: {
      USERS: {
        data = [],
        dataState: {
          STATUS,
          ENTITIES_STATE = {}
        } = {}
      } = {},
    } = {},
    rr_actions: {
      USERS: {
        deleteAction,
        loadAction
      } = {},
    } = {},
  } = props;
  return (
    <Container>
      <Table striped stackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>&nbsp;</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(({
            name, username, id,
          }) => (
              <Table.Row key={id}>
                <Table.Cell><Link to={`/redux-records/edit/${id}`}>{name}</Link> </Table.Cell>
                <Table.Cell><Link to={`/redux-records/edit/${id}`}>{username}</Link></Table.Cell>
                <Table.Cell>
                  <Loader size='mini' active={ENTITIES_STATE[id].STATUS === 'SYNCING'} inline>Deleting</Loader>
                  <Icon name="user delete" size="large" onClick={() => deleteAction({ id })}></Icon>
                </Table.Cell>
              </Table.Row>))}
        </Table.Body>
      </Table>
      {STATUS === 'SYNCING' ? (<Loader size='large' active={true} inline='centered'>Loading</Loader>) : (<Button primary onClick={() => loadAction()}>Load Users</Button>)}
      <CodeDoc code={code} />
    </Container>
  );
};

export default compose(
  withRouter,
  dataContainer([{
    dataKey: 'USERS',
    loadOnMount: true,
  }, 'COMMENTS']))(listScreen);
