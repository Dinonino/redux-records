import React from 'react';
import { dataContainer } from 'redux-records';
import { Table } from 'semantic-ui-react';

const listScreen = (props) => {
  const { data } = props;
  return (
    <Table attached>
      <Table.Header>
        <Table.HeaderCell>First Name</Table.HeaderCell>
        <Table.HeaderCell>Last Name</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {data.map(({ firstName, lastName }) => (<Table.Row> <Table.Cell>{firstName} </Table.Cell><Table.Cell>{lastName}</Table.Cell></Table.Row>))}
      </Table.Body>
    </Table>
  );
};

export default dataContainer({ dataKey: 'USERS', dataID: 'id' })(listScreen);
