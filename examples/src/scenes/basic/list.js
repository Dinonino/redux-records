import React from 'react';
import { dataContainer } from 'redux-records';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const listScreen = (props) => {
  const { USERS: { data = [], actions: { deleteAction } } = {} } = props;
  return (
    <Table attached>
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
              <Table.Cell><Button size="small" onClick={() => deleteAction({ id })}>Delete</Button></Table.Cell>
            </Table.Row>))}
      </Table.Body>
    </Table>
  );
};

export default dataContainer(['USERS', 'COMMENTS'])(listScreen);
