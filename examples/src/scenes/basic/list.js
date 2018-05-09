import React from 'react';
import { dataContainer } from 'redux-records';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const listScreen = (props) => {
  const { USERS: { data = [] } = {}, USERS_Actions: { deleteAction } = {} } = props;
  return (
    <Table attached>
      <Table.Header>
        <Table.HeaderCell>First Name</Table.HeaderCell>
        <Table.HeaderCell>Last Name</Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Header>
      <Table.Body>
        {data.map(({ firstName, lastName, ...entity }) => (
          <Table.Row>
            <Table.Cell><Link to={`/edit/${entity.id}`}>{firstName}</Link> </Table.Cell>
            <Table.Cell><Link to={`/edit/${entity.id}`}>{lastName}</Link></Table.Cell>
            <Table.Cell><Button size="small" onClick={() => deleteAction(entity)}>Delete</Button></Table.Cell>
          </Table.Row>))}
      </Table.Body>
    </Table>
  );
};

export default dataContainer(['USERS', 'COMMENTS'])(listScreen);
