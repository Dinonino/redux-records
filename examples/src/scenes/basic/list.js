import React from 'react';
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
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Header>
        <Table.Body>
          {data.map(({
            firstName, lastName, id,
          }) => (
              <Table.Row key={id}>
                <Table.Cell><Link to={`/edit/${id}`}>{firstName}</Link> </Table.Cell>
                <Table.Cell><Link to={`/edit/${id}`}>{lastName}</Link></Table.Cell>
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
